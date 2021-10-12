exit_after_auth = false

vault {
  address = "http://hashicorp:8200"
}

auto_auth {
  method "approle" {
    config = {
      role_id_file_path = "/vault/token/role"
      secret_id_file_path = "/vault/token/secret"
      remove_secret_id_file_after_reading = false
    }
  }

  sink "file" {
    config = {
      path = "/vault/token/.vault-token"
      mode = 0666
    }
  }
}
