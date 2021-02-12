import React, { useState }  from "react";
import { useWallet } from 'use-wallet';

export function useUser() {
    const wallet = useWallet();
    const [user, setUser] = useState(wallet.account);
    const [status, setStatus] = useState(wallet.status);
    const [loading, setLoading] = useState(false);

    return {user: user, status: status, loading: loading};
  }
