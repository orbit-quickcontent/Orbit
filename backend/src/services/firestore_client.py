import urllib.request
import urllib.parse
import json
import uuid
from datetime import datetime

API_KEY = "AIzaSyA4QOCd8Ppfs8MVrmge7XDcrEEYok-jw4E"
PROJECT_ID = "orbit-fs"
BASE_URL = f"https://firestore.googleapis.com/v1/projects/{PROJECT_ID}/databases/(default)/documents"

# --- Serialization Helpers ---

def to_firestore_value(val):
    if val is None:
        return {"nullValue": None}
    if isinstance(val, bool):
        return {"booleanValue": val}
    if isinstance(val, int):
        return {"integerValue": str(val)}
    if isinstance(val, float):
        return {"doubleValue": val}
    if isinstance(val, str):
        return {"stringValue": val}
    if isinstance(val, list):
        return {"arrayValue": {"values": [to_firestore_value(x) for x in val]}}
    if isinstance(val, dict):
        return {"mapValue": {"fields": {k: to_firestore_value(v) for k, v in val.items()}}}
    if isinstance(val, datetime):
        return {"timestampValue": val.isoformat() + "Z"}
    return {"stringValue": str(val)}

def from_firestore_value(val_dict):
    if not val_dict or not isinstance(val_dict, dict):
        return val_dict
    if "nullValue" in val_dict:
        return None
    if "booleanValue" in val_dict:
        return val_dict["booleanValue"]
    if "integerValue" in val_dict:
        return int(val_dict["integerValue"])
    if "doubleValue" in val_dict:
        return float(val_dict["doubleValue"])
    if "stringValue" in val_dict:
        return val_dict["stringValue"]
    if "timestampValue" in val_dict:
        return val_dict["timestampValue"]
    if "arrayValue" in val_dict:
        values = val_dict["arrayValue"].get("values", [])
        return [from_firestore_value(v) for v in values]
    if "mapValue" in val_dict:
        fields = val_dict["mapValue"].get("fields", {})
        return {k: from_firestore_value(v) for k, v in fields.items()}
    # Fallback: if it's already a native value or has multiple keys
    return val_dict

def to_native_dict(fields):
    if not fields:
        return {}
    return {k: from_firestore_value(v) for k, v in fields.items()}

# --- REST HTTP Request Wrapper ---

def firestore_request(path, method="GET", body=None, params=None):
    url = f"{BASE_URL}{path}"
    query_params = {"key": API_KEY}
    if params:
        query_params.update(params)
    
    url_parts = urllib.parse.urlparse(url)
    current_qs = urllib.parse.parse_qsl(url_parts.query)
    current_qs.extend(query_params.items())
    
    # Rebuild query string with multiple params if list is passed in params
    query_string_parts = []
    for k, v in query_params.items():
        if isinstance(v, list):
            for item in v:
                query_string_parts.append(f"{urllib.parse.quote(k)}={urllib.parse.quote(str(item))}")
        else:
            query_string_parts.append(f"{urllib.parse.quote(k)}={urllib.parse.quote(str(v))}")
            
    url = f"{url_parts.scheme}://{url_parts.netloc}{url_parts.path}?{'&'.join(query_string_parts)}"

    data_bytes = None
    if body is not None:
        data_bytes = json.dumps(body).encode('utf-8')

    req = urllib.request.Request(
        url,
        data=data_bytes,
        headers={'Content-Type': 'application/json'},
        method=method
    )

    try:
        with urllib.request.urlopen(req) as response:
            res_body = response.read().decode('utf-8')
            return json.loads(res_body) if res_body else {}
    except urllib.error.HTTPError as e:
        if e.code == 404:
            return None
        err_msg = e.read().decode('utf-8')
        print(f"[Firestore REST Error] {method} {path} returned status {e.code}: {err_msg}")
        raise e

# --- Collection Query Engine ---

class FirestoreCollection:
    def __init__(self, collection_name):
        self.collection_name = collection_name

    def find_unique(self, where):
        # If query has ID directly
        if "id" in where:
            doc = firestore_request(f"/{self.collection_name}/{where['id']}")
            if not doc:
                return None
            data = to_native_dict(doc.get("fields", {}))
            data["id"] = doc["name"].split("/")[-1]
            return data
        
        # Otherwise run query
        results = self.find_many(where=where, limit=1)
        return results[0] if results else None

    def find_first(self, where):
        return self.find_unique(where)

    def find_many(self, where=None, order_by=None, limit=None):
        query_body = {
            "structuredQuery": {
                "from": [{"collectionId": self.collection_name}]
            }
        }
        sq = query_body["structuredQuery"]

        # Build Filters
        if where:
            filters = []
            for k, v in where.items():
                if v is None:
                    continue
                
                # Check for operator (dict filter)
                if isinstance(v, dict):
                    if "in" in v:
                        arr_val = v["in"]
                        if not isinstance(arr_val, list):
                            arr_val = [arr_val]
                        filters.append({
                            "fieldFilter": {
                                "field": {"fieldPath": k},
                                "op": "IN",
                                "value": to_firestore_value(arr_val)
                            }
                        })
                    elif "notIn" in v:
                        arr_val = v["notIn"]
                        if not isinstance(arr_val, list):
                            arr_val = [arr_val]
                        filters.append({
                            "fieldFilter": {
                                "field": {"fieldPath": k},
                                "op": "NOT_IN",
                                "value": to_firestore_value(arr_val)
                            }
                        })
                    elif "not" in v:
                        filters.append({
                            "fieldFilter": {
                                "field": {"fieldPath": k},
                                "op": "NOT_EQUAL",
                                "value": to_firestore_value(v["not"])
                            }
                        })
                else:
                    filters.append({
                        "fieldFilter": {
                            "field": {"fieldPath": k},
                            "op": "EQUAL",
                            "value": to_firestore_value(v)
                        }
                    })
            
            if len(filters) == 1:
                sq["where"] = filters[0]
            elif len(filters) > 1:
                sq["where"] = {
                    "compositeFilter": {
                        "op": "AND",
                        "filters": filters
                    }
                }

        # Build OrderBy
        if order_by:
            order_list = []
            for k, dir_val in order_by.items():
                direction = "DESCENDING" if str(dir_val).upper() == "DESC" else "ASCENDING"
                order_list.append({
                    "field": {"fieldPath": k},
                    "direction": direction
                })
            sq["orderBy"] = order_list

        # Build Limit
        if limit is not None:
            sq["limit"] = limit

        res = firestore_request(":runQuery", method="POST", body=query_body)
        if not res:
            return []

        results = []
        for item in res:
            doc = item.get("document")
            if not doc:
                continue
            data = to_native_dict(doc.get("fields", {}))
            data["id"] = doc["name"].split("/")[-1]
            results.append(data)
        
        return results

    def create(self, data):
        # Generate ID if not provided
        doc_id = data.get("id") or str(uuid.uuid4())
        data_to_save = {**data, "id": doc_id}
        
        # Ensure createdAt/updatedAt are filled
        now_str = datetime.utcnow().isoformat() + "Z"
        if "createdAt" not in data_to_save:
            data_to_save["createdAt"] = now_str
        if "updatedAt" not in data_to_save:
            data_to_save["updatedAt"] = now_str

        body = {
            "fields": {k: to_firestore_value(v) for k, v in data_to_save.items()}
        }

        res = firestore_request(
            f"/{self.collection_name}",
            method="POST",
            body=body,
            params={"documentId": doc_id}
        )
        
        if not res:
            return None
        
        saved_data = to_native_dict(res.get("fields", {}))
        saved_data["id"] = res["name"].split("/")[-1]
        return saved_data

    def update(self, where, data):
        doc_id = where.get("id")
        if not doc_id:
            # Resolve id first
            resolved = self.find_unique(where)
            if not resolved:
                raise Exception(f"Document not found to update for query: {where}")
            doc_id = resolved["id"]

        data_to_update = {**data, "updatedAt": datetime.utcnow().isoformat() + "Z"}
        
        # Exclude ID from payload fields during update
        if "id" in data_to_update:
            del data_to_update["id"]

        body = {
            "fields": {k: to_firestore_value(v) for k, v in data_to_update.items()}
        }

        # Build query parameters updateMask
        field_paths = list(data_to_update.keys())
        params = {"updateMask.fieldPaths": field_paths}

        res = firestore_request(
            f"/{self.collection_name}/{doc_id}",
            method="PATCH",
            body=body,
            params=params
        )

        if not res:
            return None

        updated_data = to_native_dict(res.get("fields", {}))
        updated_data["id"] = res["name"].split("/")[-1]
        return updated_data

    def upsert(self, where, update, create):
        existing = self.find_unique(where)
        if existing:
            return self.update(where={"id": existing["id"]}, data=update)
        return self.create(create)

    def update_many(self, where, data):
        docs = self.find_many(where=where)
        count = 0
        for doc in docs:
            self.update(where={"id": doc["id"]}, data=data)
            count += 1
        return {"count": count}


# --- Unified database client wrapper ---

class FirestoreDB:
    def __init__(self):
        self.clientUsers = FirestoreCollection("client_users")
        self.partnerUsers = FirestoreCollection("partner_users")
        self.partners = FirestoreCollection("partner_profiles")
        self.editors = FirestoreCollection("editor_profiles")
        self.payoutRetries = FirestoreCollection("payout_retries")
        self.bookings = FirestoreCollection("bookings")
        self.packages = FirestoreCollection("packages")
        self.workDispatches = FirestoreCollection("work_dispatches")
        self.transactions = FirestoreCollection("partner_transactions")
        self.clientAuditLogs = FirestoreCollection("client_audit_logs")
        self.partnerAuditLogs = FirestoreCollection("partner_audit_logs")
        self.emailOtps = FirestoreCollection("email_otps")

# Global singleton client
firestoreDb = FirestoreDB()
