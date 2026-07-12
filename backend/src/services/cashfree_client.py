import os
import time
import requests
from typing import Dict, Any, Optional

CASHFREE_CLIENT_ID = os.getenv("CASHFREE_CLIENT_ID", "")
CASHFREE_API_KEY = os.getenv("CASHFREE_API_KEY", "")
CASHFREE_ENV = os.getenv("CASHFREE_ENV", "sandbox")  # sandbox | production

BASE_URL = (
    "https://payout-api.cashfree.com"
    if CASHFREE_ENV.lower() == "production"
    else "https://payout-gamma.cashfree.com"
)

# Token cache to prevent repeated authorize requests
_token_cache: Dict[str, Any] = {"token": None, "expires_at": 0}

def get_auth_token() -> str:
    now = time.time()
    if _token_cache["token"] and _token_cache["expires_at"] > now + 60:
        return _token_cache["token"]

    url = f"{BASE_URL}/payout/v1/authorize"
    headers = {
        "X-Client-Id": CASHFREE_CLIENT_ID,
        "X-Client-Secret": CASHFREE_API_KEY,
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.post(url, headers=headers, json={}, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        if data.get("status") == "SUCCESS":
            token_data = data.get("data", {})
            token = token_data.get("token")
            # Cache it (typically expires in 30 mins)
            _token_cache["token"] = token
            _token_cache["expires_at"] = now + 1800  # expire cache in 30 mins
            return token
        else:
            raise Exception(f"Cashfree auth status failed: {data.get('message')}")
    except Exception as e:
        print(f"[Cashfree-Auth-Error] Failed to authorize: {e}")
        raise e

def validate_bank_account(
    account_number: str,
    ifsc: str,
    name: str,
    phone: str
) -> Dict[str, Any]:
    """
    Verifies bank account details via Cashfree Bank Account Validation (BAV/Penny Drop) API.
    """
    token = get_auth_token()
    url = f"{BASE_URL}/payout/v1.2/validation/bankDetails"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    params = {
        "name": name,
        "phone": phone,
        "bankAccount": account_number,
        "ifsc": ifsc
    }

    try:
        response = requests.get(url, headers=headers, params=params, timeout=10)
        response.raise_for_status()
        res_data = response.json()
        
        # Format response into a uniform dict
        # Successful validation response has accountStatus == 'VALID'
        if res_data.get("status") == "SUCCESS":
            data = res_data.get("data", {})
            return {
                "success": True,
                "accountStatus": data.get("accountStatus"),
                "nameAtBank": data.get("nameAtBank"),
                "bvRefId": data.get("bvRefId"),
                "message": res_data.get("message")
            }
        else:
            return {
                "success": False,
                "message": res_data.get("message") or "Validation status check failed"
            }
    except Exception as e:
        print(f"[Cashfree-BAV-Error] Failed to validate bank account: {e}")
        return {
            "success": False,
            "message": str(e)
        }

def execute_payout(
    transfer_id: str,
    amount: float,
    account_number: str,
    ifsc: str,
    name: str,
    phone: str,
    email: str
) -> Dict[str, Any]:
    """
    Executes a standard direct bank transfer payout using Cashfree DirectTransfer API.
    Uses idempotency/transferId to prevent double spending.
    """
    token = get_auth_token()
    url = f"{BASE_URL}/payout/v1/directTransfer"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "transferId": transfer_id,
        "amount": f"{amount:.2f}",
        "transferMode": "banktransfer",
        "beneficiaryDetails": {
            "beneficiaryId": f"ben-{phone}",
            "beneficiaryName": name,
            "beneficiaryEmail": email,
            "beneficiaryPhone": phone,
            "beneficiaryCountry": "IND"
        },
        "beneficiaryBankAccount": {
            "bankAccount": account_number,
            "ifsc": ifsc
        }
    }

    try:
        response = requests.post(url, headers=headers, json=payload, timeout=15)
        response.raise_for_status()
        res_data = response.json()
        
        if res_data.get("status") == "SUCCESS":
            return {
                "success": True,
                "transferId": transfer_id,
                "referenceId": res_data.get("data", {}).get("referenceId"),
                "message": res_data.get("message")
            }
        else:
            return {
                "success": False,
                "message": res_data.get("message") or "Transfer returned non-success status"
            }
    except Exception as e:
        print(f"[Cashfree-Payout-Error] Failed direct transfer {transfer_id}: {e}")
        return {
            "success": False,
            "message": str(e)
        }
