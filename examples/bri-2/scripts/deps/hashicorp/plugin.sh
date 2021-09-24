# Download vault plugin assets

VERSION="${PLUGIN_VERSION}"
FILE_PATH="${PLUGIN_PATH}"

FILES="quorum-hashicorp-vault-plugin SHA256SUM"
GITHUB_URL="https://github.com/ConsenSys/quorum-hashicorp-vault-plugin"

echo "Installing Quorum Hashicorp Vault plugin version '$VERSION'"
for FILE in ${FILES}; do
  echo "Downloading $FILE..."
  /usr/bin/wget --header='Accept:application/octet-stream' \
    $GITHUB_URL/releases/download/$VERSION/$FILE \
    -O "${FILE_PATH}/${FILE}"

  
  echo "File at ${FILE_PATH}/${FILE}..."
done

echo "Renaming plugin"
mv ${FILE_PATH}/quorum-hashicorp-vault-plugin ${FILE_PATH}/quorum
echo "Changing plugin permissions"
chmod 777 ${FILE_PATH}/quorum
