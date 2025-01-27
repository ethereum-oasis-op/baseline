import React, { useState }  from "react";
import { useWallet } from 'use-wallet';

export function setWalletConnected(value) {
  localStorage.setItem('__WALLET_CONNECTED', JSON.stringify(value));
}

export function isWalletConnected() {
  const val = localStorage.getItem('__WALLET_CONNECTED');

  return val ? JSON.parse(val) : null;
}