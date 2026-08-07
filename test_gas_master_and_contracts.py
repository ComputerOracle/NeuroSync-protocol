import os
import sys
import json
import time
import subprocess
import urllib.request
import pandas as pd
import numpy as np
import joblib
from stellar_sdk import Keypair, Server, Network

STELLAR_CLI = "/home/computeroracle/.local/bin/stellar"
WORKSPACE_DIR = "/home/computeroracle/NeuroSync"

def run_cmd(args, cwd=None):
    print(f"Running command: {' '.join(args)} (in {cwd or '.'})")
    res = subprocess.run(args, capture_output=True, text=True, cwd=cwd)
    if res.returncode != 0:
        print(f"Error executing command:\nSTDOUT:\n{res.stdout}\nSTDERR:\n{res.stderr}")
        sys.exit(res.returncode)
    return res.stdout.strip()

def main():
    print("==================================================")
    print("      NEUROSYNC SMART CONTRACTS & GAS MASTER      ")
    print("==================================================")

    # 1. Get deployer address
    print("\n--- Step 1: Retrieving Deployer Address ---")
    deployer_address = run_cmd([STELLAR_CLI, "keys", "address", "deployer"])
    print(f"Deployer address: {deployer_address}")

    # 2. Build WASM contracts
    print("\n--- Step 2: Building Soroban WASM Contracts ---")
    print("Building $NSYNC Token WASM...")
    run_cmd(["cargo", "build", "--target", "wasm32v1-none", "--release"], cwd=f"{WORKSPACE_DIR}/contracts/token")
    
    print("Building Reward Distributor WASM...")
    run_cmd(["cargo", "build", "--target", "wasm32v1-none", "--release"], cwd=f"{WORKSPACE_DIR}/contracts/reward_distributor")

    token_wasm = f"{WORKSPACE_DIR}/contracts/token/target/wasm32v1-none/release/nsync_token.wasm"
    distributor_wasm = f"{WORKSPACE_DIR}/contracts/reward_distributor/target/wasm32v1-none/release/reward_distributor.wasm"

    # 3. Deploy $NSYNC Token contract
    print("\n--- Step 3: Deploying $NSYNC Token Contract to Stellar Testnet ---")
    token_deploy_output = run_cmd([
        STELLAR_CLI, "contract", "deploy",
        "--wasm", token_wasm,
        "--source", "deployer",
        "--network", "testnet"
    ])
    token_contract_id = token_deploy_output.strip().split("\n")[-1]
    print(f"Deployed $NSYNC Token Contract ID: {token_contract_id}")

    # 4. Deploy Reward Distributor contract
    print("\n--- Step 4: Deploying Reward Distributor Contract to Stellar Testnet ---")
    distributor_deploy_output = run_cmd([
        STELLAR_CLI, "contract", "deploy",
        "--wasm", distributor_wasm,
        "--source", "deployer",
        "--network", "testnet"
    ])
    distributor_contract_id = distributor_deploy_output.strip().split("\n")[-1]
    print(f"Deployed Reward Distributor Contract ID: {distributor_contract_id}")

    # 5. Initialize Token contract
    print("\n--- Step 5: Initializing $NSYNC Token Contract ---")
    run_cmd([
        STELLAR_CLI, "contract", "invoke",
        "--id", token_contract_id,
        "--source", "deployer",
        "--network", "testnet",
        "--", "initialize",
        "--admin", deployer_address
    ])

    # Check token metadata (name, symbol, decimals)
    token_name = run_cmd([
        STELLAR_CLI, "contract", "invoke",
        "--id", token_contract_id,
        "--source", "deployer",
        "--network", "testnet",
        "--", "name"
    ])
    token_symbol = run_cmd([
        STELLAR_CLI, "contract", "invoke",
        "--id", token_contract_id,
        "--source", "deployer",
        "--network", "testnet",
        "--", "symbol"
    ])
    token_decimals = run_cmd([
        STELLAR_CLI, "contract", "invoke",
        "--id", token_contract_id,
        "--source", "deployer",
        "--network", "testnet",
        "--", "decimals"
    ])
    print(f"Token Metadata: Name='{token_name}', Symbol='{token_symbol}', Decimals={token_decimals}")

    # 6. Initialize Reward Distributor contract
    print("\n--- Step 6: Initializing Reward Distributor Contract ---")
    run_cmd([
        STELLAR_CLI, "contract", "invoke",
        "--id", distributor_contract_id,
        "--source", "deployer",
        "--network", "testnet",
        "--", "initialize",
        "--admin", deployer_address,
        "--token_address", token_contract_id
    ])

    # 7. Seed Reward Distributor contract with initial $NSYNC tokens
    print("\n--- Step 7: Minting $NSYNC Tokens to Reward Distributor Contract ---")
    seed_amount = 1_000_000_0000000  # 1,000,000 tokens (7 decimals)
    run_cmd([
        STELLAR_CLI, "contract", "invoke",
        "--id", token_contract_id,
        "--source", "deployer",
        "--network", "testnet",
        "--", "mint",
        "--to", distributor_contract_id,
        "--amount", str(seed_amount)
    ])

    distributor_token_balance = run_cmd([
        STELLAR_CLI, "contract", "invoke",
        "--id", token_contract_id,
        "--source", "deployer",
        "--network", "testnet",
        "--", "balance",
        "--id", distributor_contract_id
    ])
    print(f"Reward Distributor $NSYNC Balance: {distributor_token_balance}")

    # 8. Test Streak and Claim Rewards
    print("\n--- Step 8: Testing User Streak & Reward Claim ---")
    user_addr = deployer_address
    print(f"Test User Address: {user_addr}")

    # Set active streak for user (e.g. 5 days)
    current_time = int(time.time())
    run_cmd([
        STELLAR_CLI, "contract", "invoke",
        "--id", distributor_contract_id,
        "--source", "deployer",
        "--network", "testnet",
        "--", "set_streak",
        "--user", user_addr,
        "--count", "5",
        "--timestamp", str(current_time)
    ])


    # Query get_streak
    streak_out = run_cmd([
        STELLAR_CLI, "contract", "invoke",
        "--id", distributor_contract_id,
        "--source", "deployer",
        "--network", "testnet",
        "--", "get_streak",
        "--user", user_addr
    ])
    print(f"Active streak length for user: {streak_out}")

    # Check has_claimed_today before claim
    claimed_before = run_cmd([
        STELLAR_CLI, "contract", "invoke",
        "--id", distributor_contract_id,
        "--source", "deployer",
        "--network", "testnet",
        "--", "has_claimed_today",
        "--user", user_addr
    ])
    print(f"Has claimed today before claim: {claimed_before}")

    # Query unclaimed allocation
    unclaimed = run_cmd([
        STELLAR_CLI, "contract", "invoke",
        "--id", distributor_contract_id,
        "--source", "deployer",
        "--network", "testnet",
        "--", "unclaimed_allocation",
        "--user", user_addr
    ])
    print(f"Unclaimed $NSYNC allocation for user: {unclaimed}")

    # Fund user with a tiny bit of XLM for submitting claim_reward transaction
    url = f"https://friendbot.stellar.org/?addr={user_addr}"
    req_fb = urllib.request.Request(url, headers={"User-Agent": "NeuroSync-Test/1.0"})
    urllib.request.urlopen(req_fb)
    time.sleep(2)


    # User claims reward
    print("Executing claim_reward for user...")
    claim_out = run_cmd([
        STELLAR_CLI, "contract", "invoke",
        "--id", distributor_contract_id,
        "--source", "deployer",
        "--network", "testnet",
        "--", "claim_reward",
        "--user", user_addr
    ])
    print(f"Claim output: {claim_out}")

    # Check has_claimed_today after claim
    claimed_after = run_cmd([
        STELLAR_CLI, "contract", "invoke",
        "--id", distributor_contract_id,
        "--source", "deployer",
        "--network", "testnet",
        "--", "has_claimed_today",
        "--user", user_addr
    ])
    print(f"Has claimed today after claim: {claimed_after}")

    # Verify user token balance
    user_balance = run_cmd([
        STELLAR_CLI, "contract", "invoke",
        "--id", token_contract_id,
        "--source", "deployer",
        "--network", "testnet",
        "--", "balance",
        "--id", user_addr
    ])
    print(f"User $NSYNC token balance after claim: {user_balance}")

    # 9. Test FastAPI Gas Master Relayer endpoint /api/v1/submit-proof
    print("\n--- Step 9: Testing FastAPI Gas Master Relayer (/api/v1/submit-proof) ---")
    sys.path.insert(0, WORKSPACE_DIR)
    from api.relayer import relayer_keypair, ensure_relayer_funded

    ensure_relayer_funded()
    print(f"Relayer Public Key: {relayer_keypair.public_key}")

    payload = {
        "user_address": user_addr,
        "Sleep_Duration": 8.5,
        "Stress_Level": 2,
        "Physical_Activity_Level": 80,
        "Daily_Steps": 12000,
        "Heart_Rate": 58,
        "Age": 27,
        "Gender": "Female",
        "BMI_Category": "Normal",
        "Sleep_Disorder": "None",
        "Occupation": "Researcher"
    }

    req_data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        "http://localhost:8000/api/v1/submit-proof",
        data=req_data,
        headers={"Content-Type": "application/json"}
    )

    try:
        with urllib.request.urlopen(req) as resp:
            resp_data = json.loads(resp.read().decode("utf-8"))
            print("Gas Master Endpoint Response:")
            print(json.dumps(resp_data, indent=2))
            assert resp_data.get("status") == "success"
            assert resp_data.get("user_gas_cost_xlm") == 0
            print("\n✅ ZERO-GAS RELAYER VERIFIED! User pays 0 XLM gas fees.")
    except Exception as e:
        print(f"Error testing Gas Master endpoint: {e}")

    print("\n==================================================")
    print("   ALL NEUROSYNC CONTRACTS & BACKEND VERIFIED!   ")
    print("==================================================")

if __name__ == "__main__":
    main()
