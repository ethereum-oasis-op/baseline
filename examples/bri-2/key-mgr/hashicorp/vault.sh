# Retrieve token for authentication on vault
token=$(docker run --rm -v deps_vault-token:/token alpine:3.13 more /token/.root)

echo "Vault token: ${token}"

# Run command
docker-compose -f scripts/deps/docker-compose.yml exec -e VAULT_TOKEN="${token}" -e VAULT_ADDR="http://vault:8200" vault vault "$@" 
