import os
from stellar_sdk import Keypair

def main():
    secret_path = os.path.join(os.path.dirname(__file__), ".oracle_secret")
    
    if os.path.exists(secret_path):
        with open(secret_path, "r") as f:
            secret = f.read().strip()
        kp = Keypair.from_secret(secret)
        print("Loaded existing Oracle keypair.")
    else:
        kp = Keypair.random()
        with open(secret_path, "w") as f:
            f.write(kp.secret)
        print("Generated new persistent Oracle keypair.")
        
    print(f"Base32 Public Key: {kp.public_key}")
    print(f"Hex Public Key: {kp.raw_public_key().hex()}")

if __name__ == "__main__":
    main()
