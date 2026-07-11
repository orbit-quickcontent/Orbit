import urllib.request
import urllib.error
import json

api_key = "AIzaSyA4QOCd8Ppfs8MVrmge7XDcrEEYok-jw4E"
project_id = "orbit-fs"
url = f"https://firestore.googleapis.com/v1/projects/{project_id}/databases/(default)/documents:runQuery?key={api_key}"

query = {
    "structuredQuery": {
        "from": [{"collectionId": "client_users"}],
        "limit": 5
    }
}

data_bytes = json.dumps(query).encode('utf-8')
req = urllib.request.Request(
    url,
    data=data_bytes,
    headers={'Content-Type': 'application/json'},
    method='POST'
)

try:
    with urllib.request.urlopen(req) as response:
        status = response.getcode()
        body = response.read().decode('utf-8')
        print("Status Code:", status)
        print("Data:")
        print(json.dumps(json.loads(body), indent=2))
except urllib.error.HTTPError as e:
    print("HTTP Error:", e.code)
    print("Response:", e.read().decode('utf-8'))
except Exception as e:
    print("Exception occurred:", e)
