import json
import urllib.request
import os

base = os.path.dirname(__file__)
payload_path = os.path.join(base, 'test_payload.json')
with open(payload_path, 'r', encoding='utf-8-sig') as f:
    data = json.load(f)

b = json.dumps(data).encode('utf-8')
req = urllib.request.Request('http://localhost:8000/api/chat/message', data=b, headers={'Content-Type':'application/json'})

import urllib.error

try:
    with urllib.request.urlopen(req, timeout=10) as resp:
        print(resp.status)
        print(resp.read().decode())
except urllib.error.HTTPError as e:
    body = e.read().decode(errors='replace')
    print('HTTP ERROR', e.code)
    print(body)
except Exception as e:
    print('ERROR', e)
