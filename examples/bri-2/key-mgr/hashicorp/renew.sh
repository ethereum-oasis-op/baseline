ROLE_ID=$(cat /vault/token/role)
SECRET_ID=$(cat /vault/token/secret)
echo "ROLE_ID: $ROLE_ID"
echo "SECRET_ID: $SECRET_ID"

curl --request POST \
--data "{\"role_id\": \"$ROLE_ID\", \"secret_id\": \"${SECRET_ID}\"}" \
${VAULT_ADDR}/v1/auth/approle/login > login.json
SIGNER_TOKEN=$(cat login.json | jq .auth.client_token | tr -d '"')

echo "Tx-signer client token: $SIGNER_TOKEN"
echo $SIGNER_TOKEN > /vault/token/.vault-token
