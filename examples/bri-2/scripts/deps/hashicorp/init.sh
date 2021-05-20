# Store root token in a file so it can be shared with other services through volume
mkdir -p $TOKEN_PATH

echo "Initializing Vault: ${VAULT_ADDR}"
# Init Vault
curl --request POST --data '{"secret_shares": 1, "secret_threshold": 1}' ${VAULT_ADDR}/v1/sys/init > init.json

# Retrieve root token and unseal key
VAULT_TOKEN=$(cat init.json | jq .root_token | tr -d '"')
UNSEAL_KEY=$(cat init.json | jq .keys | jq .[0])
SHA256SUM=$(cat $PLUGIN_PATH/SHA256SUM)
rm init.json

echo $VAULT_TOKEN > $TOKEN_PATH/.root
echo "ROOT_TOKEN: $VAULT_TOKEN"
echo "SHA256SUM: ${SHA256SUM}"

# Unseal Vault
curl --request POST --data '{"key": '${UNSEAL_KEY}'}' ${VAULT_ADDR}/v1/sys/unseal

# Enable kv-v2 secret engine (DEPRECATED)
curl --header "X-Vault-Token: ${VAULT_TOKEN}" --request POST \
        --data '{"type": "kv-v2", "config": {"force_no_cache": true} }' \
    ${VAULT_ADDR}/v1/sys/mounts/secret

# Register orchestrate plugin
curl --header "X-Vault-Token: ${VAULT_TOKEN}" --request POST \
  --data "{\"sha256\": \"${SHA256SUM}\", \"command\": \"orchestrate\" }" \
  ${VAULT_ADDR}/v1/sys/plugins/catalog/secret/orchestrate

# Enable orchestrate secret engine
curl --header "X-Vault-Token: ${VAULT_TOKEN}" --request POST \
  --data '{"type": "plugin", "plugin_name": "orchestrate", "config": {"force_no_cache": true, "passthrough_request_headers": ["X-Vault-Namespace"]} }' \
  ${VAULT_ADDR}/v1/sys/mounts/orchestrate

# Enable role policies
# Instructions taken from https://learn.hashicorp.com/tutorials/vault/getting-started-apis
curl --header "X-Vault-Token: ${VAULT_TOKEN}" --request POST \
  --data '{"type": "approle"}' \
  ${VAULT_ADDR}/v1/sys/auth/approle

curl --header "X-Vault-Token: $VAULT_TOKEN" \
  --request PUT \
  --data '{ "policy":"path \"orchestrate/*\" { capabilities = [\"create\", \"read\", \"update\", \"delete\", \"list\"] }" }' \
  ${VAULT_ADDR}/v1/sys/policies/acl/allow_secrets

curl --header "X-Vault-Token: $VAULT_TOKEN" \
  --request POST \
  --data '{"policies": ["allow_secrets"]}' \
  ${VAULT_ADDR}/v1/auth/approle/role/key-manager

curl --header "X-Vault-Token: $VAULT_TOKEN" \
  ${VAULT_ADDR}/v1/auth/approle/role/key-manager/role-id >role.json
ROLE_ID=$(cat role.json | jq .data.role_id | tr -d '"')
echo $ROLE_ID > $TOKEN_PATH/role

curl --header "X-Vault-Token: $VAULT_TOKEN" \
  --request POST \
  ${VAULT_ADDR}/v1/auth/approle/role/key-manager/secret-id >secret.json
SECRET_ID=$(cat secret.json | jq .data.secret_id | tr -d '"')
echo $SECRET_ID > $TOKEN_PATH/secret
