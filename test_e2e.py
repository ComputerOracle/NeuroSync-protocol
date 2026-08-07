import os
import sys
import json
import time
import subprocess
import pandas as pd
import numpy as np
import joblib
from stellar_sdk import Keypair

STELLAR_CLI = "/home/computeroracle/.local/bin/stellar"

def run_cmd(args):
    print(f"Running command: {' '.join(args)}")
    res = subprocess.run(args, capture_output=True, text=True)
    if res.returncode != 0:
        print(f"Error executing command: {res.stderr}")
        sys.exit(res.returncode)
    return res.stdout.strip()

def main():
    # 1. Get deployer address
    print("--- 1. Getting deployer address ---")
    deployer_address = run_cmd([STELLAR_CLI, "keys", "address", "deployer"])
    print(f"Deployer address: {deployer_address}")

    # 2. Generate a new test Oracle keypair
    print("\n--- 2. Generating test Oracle keypair ---")
    oracle_kp = Keypair.random()
    oracle_pub_b32 = oracle_kp.public_key
    oracle_pub_hex = oracle_kp.raw_public_key().hex()
    print(f"Oracle Base32 Public Key: {oracle_pub_b32}")
    print(f"Oracle Hex Public Key: {oracle_pub_hex}")

    # 3. Deploy a new contract instance
    print("\n--- 3. Deploying contract instance to Testnet ---")
    os.chdir("/home/computeroracle/NeuroSync/neurosync-core")
    deploy_output = run_cmd([
        STELLAR_CLI, "contract", "deploy",
        "--wasm", "target/wasm32v1-none/release/neurosync_core.wasm",
        "--source", "deployer",
        "--network", "testnet"
    ])
    contract_id = deploy_output.strip().split("\n")[-1]
    print(f"Deployed Contract ID: {contract_id}")

    # 4. Initialize contract with the new Oracle key
    print("\n--- 4. Initializing contract ---")
    init_output = run_cmd([
        STELLAR_CLI, "contract", "invoke",
        "--id", contract_id,
        "--source", "deployer",
        "--network", "testnet",
        "--",
        "init",
        "--oracle_pub_key", oracle_pub_hex
    ])
    print(f"Init Output: {init_output}")

    # 5. Run model prediction on mock sleep metrics
    print("\n--- 5. Evaluating mock sleep data using ML model ---")
    model_path = "/home/computeroracle/NeuroSync/api/sleep_quality_model.pkl"
    model = joblib.load(model_path)
    
    mock_metrics = {
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
    df = pd.DataFrame([mock_metrics])
    raw_prediction = model.predict(df)[0]
    
    if isinstance(raw_prediction, np.ndarray):
        raw_prediction = raw_prediction.item()
    else:
        raw_prediction = float(raw_prediction)
        
    sleep_score = float(np.clip(raw_prediction, 1.0, 10.0))
    sleep_score = round(sleep_score, 2)
    
    if sleep_score >= 8.0:
        interpretation = "High Sleep Quality / High Performance Readiness"
    elif sleep_score >= 6.0:
        interpretation = "Moderate Sleep Quality / Moderate Performance Readiness"
    else:
        interpretation = "Low Sleep Quality / Higher Fatigue Risk"
        
    print(f"ML Sleep Score Prediction: {sleep_score}")
    print(f"Interpretation: {interpretation}")

    # 6. Construct deterministic payload and sign it
    print("\n--- 6. Constructing deterministic payload and signing it ---")
    current_time = int(time.time())
    payload = {
        "user_address": deployer_address,
        "sleep_score": sleep_score,
        "interpretation": interpretation,
        "timestamp": current_time
    }
    payload_str = json.dumps(payload, sort_keys=True, separators=(',', ':'))
    payload_hex = payload_str.encode('utf-8').hex()
    
    signature = oracle_kp.sign(payload_str.encode('utf-8'))
    signature_hex = signature.hex()
    
    print(f"Payload JSON string: {payload_str}")
    print(f"Payload Hex: {payload_hex}")
    print(f"Signature Hex: {signature_hex}")

    # 7. Submit payload and signature to the smart contract
    print("\n--- 7. Submitting payload to smart contract ---")
    submit_output = run_cmd([
        STELLAR_CLI, "contract", "invoke",
        "--id", contract_id,
        "--source", "deployer",
        "--network", "testnet",
        "--",
        "submit_shard",
        "--user", deployer_address,
        "--payload", payload_hex,
        "--signature", signature_hex,
        "--current_timestamp", str(current_time)
    ])
    print(f"Submit Shard Output: {submit_output}")

    # 8. Query on-chain streak storage
    print("\n--- 8. Querying contract storage for active streak ---")
    get_streak_output = run_cmd([
        STELLAR_CLI, "contract", "invoke",
        "--id", contract_id,
        "--source", "deployer",
        "--network", "testnet",
        "--",
        "get_streak",
        "--user", deployer_address
    ])
    print(f"Get Streak Output: {get_streak_output}")

if __name__ == "__main__":
    main()
