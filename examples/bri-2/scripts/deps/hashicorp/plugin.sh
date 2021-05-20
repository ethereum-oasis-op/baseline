# Download vault pluging assets

VERSION="${PLUGIN_VERSION}"
FILE_PATH="${PLUGIN_PATH}"

FILES="orchestrate-hashicorp-vault-plugin SHA256SUM"
GITHUB_URL="https://github.com/ConsenSys/orchestrate-hashicorp-vault-plugin"

echo "Installing orchestrate-hashicorp-vault-plugin version '$VERSION'"
for FILE in ${FILES}; do
  echo "Downloading $FILE..."
  /usr/bin/wget --header='Accept:application/octet-stream' \
    $GITHUB_URL/releases/download/$VERSION/$FILE \
    -O "${FILE_PATH}/${FILE}"

  
  echo "File at ${FILE_PATH}/${FILE}..."
done

echo "Renaming plugin"
mv ${FILE_PATH}/orchestrate-hashicorp-vault-plugin ${FILE_PATH}/orchestrate
echo "Changing plugin permissions"
chmod 777 ${FILE_PATH}/orchestrate
