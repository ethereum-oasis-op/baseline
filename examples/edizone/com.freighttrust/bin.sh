#!/bin/bash
# MIT License
#
# Copyright (c) 2020 FreightTrust and Clearing Corporation
#version 0.2.2-a
cli_version=${1:-$(curl https://raw.githubusercontent.com/freight-trust/cli/master/latest)}
installed_flag=0
installed_version=""
 
check_if_installed() {
  if [ -x "$(command -v cli)" ] >/dev/null 2>&1; then
    printf 'Freight Trust Network Command Line Interface already exists on your system.\n'
    installed_flag=1
  fi
}
 
setup_color() {
  # Only use colors if connected to a terminal
  if [ -t 1 ]; then
    RED=$(printf '\033[31m')
    GREEN=$(printf '\033[32m')
    YELLOW=$(printf '\033[33m')
    BLUE=$(printf '\033[34m')
    BOLD=$(printf '\033[1m')
    RESET=$(printf '\033[m')
  else
    RED=""
    GREEN=""
    YELLOW=""
    BLUE=""
    BOLD=""
    RESET=""
  fi
}
 
# TODO : Integrate GPG Keycheck https://github.com/freight-trust/cli/releases/download/v0.2.2/freight-trust-cli_v0.2.2.tar
 
install_cli() {
  echo "Downloading Freight Trust Command Line Interface ..."
  mkdir -p "$HOME/.ftcli"
  if [ "$(curl --write-out "%{http_code}" --silent --output /dev/null "https://github.com/freight-trust/cli/releases/download/${cli_version}/freight-trust-cli_${cli_version}.tar")" -eq 302 ]; then
    curl -# -L -o "$HOME/.ftcli/freight-trust-cli_${cli_version}.tar" "https://github.com/freight-trust/cli/releases/download/${cli_version}/freight-trust-cli_${cli_version}.tar"
    echo "Installing cli..."
    tar -xf "$HOME/.ftcli/freight-trust-cli_${cli_version}.tar" -C "$HOME/.ftcli"
    echo "export PATH=\$PATH:$HOME/.ftcli" >"$HOME/.ftcli/source.sh"
    chmod +x "$HOME/.ftcli/source.sh"
    echo "Removing downloaded archive..."
    rm "$HOME/.ftcli/freight-trust-cli_${cli_version}.tar"
  else
    echo "WARNING - Build Error, Aborting..."
    exit 0
  fi
}
get_user_input() {
  while echo "Would you like to update cli [Y/n]" && read -r user_input </dev/tty ; do
    case $user_input in
    n)
      echo "Ejecting instalation ..."
      exit 0
      ;;
    *)
       echo "Updating @freight-trust/cli ..."
       break
       ;;
    esac
  done
}
 
check_version() {
  installed_version=$(cli version | grep Version | awk -F" " '{print $NF}')
  if [ "$installed_version" = "$cli_version" ]; then
      echo "You have the latest version of @freight-trust/cli (${installed_version}). Exiting."
      exit 0
    else
      echo "Notification: @freight-trust/cli version is NOT up to date. (latest stable)"
      get_user_input
  fi
}
 
source_cli() {
  SOURCE_cli="\n[ -s \"$HOME/.ftcli/source.sh\" ] && source \"$HOME/.ftcli/source.sh\""
  if [ -f "$HOME/.bashrc" ]; then
    bash_rc="$HOME/.bashrc"
    touch "${bash_rc}"
    if ! grep -qc '.ftcli/source.sh' "${bash_rc}"; then
      echo "Adding source string to ${bash_rc}"
      printf "${SOURCE_cli}\n" >>"${bash_rc}"
    else
      echo "Skipped update of ${bash_rc} (source string already present)"
    fi
  fi
  if [ -f "$HOME/.bash_profile" ]; then
    bash_profile="${HOME}/.bash_profile"
    touch "${bash_profile}"
    if ! grep -qc '.ftcli/source.sh' "${bash_profile}"; then
      echo "Adding source string to ${bash_profile}"
      printf "${SOURCE_cli}\n" >>"${bash_profile}"
    else
      echo "Skipped update of ${bash_profile} (source string already present)"
    fi
  fi
  if [ -f "$HOME/.bash_login" ]; then
    bash_login="$HOME/.bash_login"
    touch "${bash_login}"
    if ! grep -qc '.ftcli/source.sh' "${bash_login}"; then
      echo "Adding source string to ${bash_login}"
      printf "${SOURCE_cli}\n" >>"${bash_login}"
    else
      echo "Skipped update of ${bash_login} (source string already present)"
    fi
  fi
  if [ -f "$HOME/.profile" ]; then
    profile="$HOME/.profile"
    touch "${profile}"
    if ! grep -qc '.ftcli/source.sh' "${profile}"; then
      echo "Adding source string to ${profile}"
      printf "$SOURCE_cli\n" >>"${profile}"
    else
      echo "Skipped update of ${profile} (source string already present)"
    fi
  fi
 
  if [ -f "$(command -v zsh 2>/dev/null)" ]; then
    file="$HOME/.zshrc"
    touch "${file}"
    if ! grep -qc '.ftcli/source.sh' "${file}"; then
      echo "Adding source string to ${file}"
      printf "$SOURCE_cli\n" >>"${file}"
    else
      echo "Skipped update of ${file} (source string already present)"
    fi
  fi
}
 
# TODO: Inteegrate Key Management System HERE
 
clean_up() {
  if [ -d "$HOME/.ftcli" ]; then
    rm -f "$HOME/.ftcli/source.sh"
    rm -rf "$HOME/.ftcli/freight-trust-cli_$installed_version" >/dev/null 2>&1
    echo "WARNING Deleting older installation ..."
  fi
}
 
completed() {
  ln -sf "$HOME/.ftcli/freight-trust-cli_$cli_version/bin/cli" $HOME/.ftcli/cli
  printf '\n'
  printf "$GREEN" 
  echo "Freight Trust Command Line Interface has been succesfully installed."
  echo "To use cli in your current shell run:"
  echo "source \$HOME/.ftcli/source.sh"
  echo "When you open a new shell this will be performed automatically."
  echo "To see what cli's CLI can do you can check the documentation bellow."
  echo "https://ft-docs.netlify.app/command-line/ "
  echo "Connecting to the network... .... ...  " # TODO integration with choice to abort!
  printf "$RESET" 
  exit 0
}
 
main() {
  setup_color
  check_if_installed
  if [ $installed_flag -eq 1 ]; then
    check_if_cli_homebrew
    check_version
    clean_up
    install_cli
    source_cli
    completed
  else
    install_cli
    source_cli
    completed    
  fi
}
 
main