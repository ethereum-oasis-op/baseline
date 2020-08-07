printf '{
    "jsonrpc": "2.0",
    "method": "eth_sendRawTransaction",
    "params": [],
    "id": 1
}'| http  --follow --timeout 3600 POST 127.0.0.1:8545/ \
 Content-Type:'application/json'