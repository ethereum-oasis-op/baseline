import React, { useEffect, useState }  from "react";
import { useRouter } from 'next/router';
import dotenv from "dotenv";
import useSwr from 'swr';
import { commitMgrServerUrl } from "../configs/commit_mgr.env";
import { useUser } from '../components/Utils/useUser';
import { isWalletConnected } from '../components/Utils/isWalletConnected';
import Iframe from '../components/Utils/Iframe';

// components
import CardContracts from "../components/Cards/CardContracts.js";
import CardTree from "../components/Cards/CardTree.js";

// layout for page
import Admin from "../layouts/Admin.js";
//const useUser = () => ({ user: false, status: 'disconnected', loading: false })

dotenv.config();

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Index() {
  // Here you would fetch and return the user
  const { data: network, error: netError } = useSwr(`${commitMgrServerUrl}/network-mode`);

  const { user, status, loading } = useUser();
  const router = useRouter();
  const [contractShieldLocal, setContractShieldLocal] = useState('');
  const [contractShield, setContractShield] = useState('');

  let isConnectedWallet;

  useEffect(() => {
    
    isConnectedWallet = isWalletConnected();

    if ( !(user || loading) || status === 'disconnected' || !isConnectedWallet ) {
      router.push('/auth/login');
    }
    
  }, [user, status, loading, isConnectedWallet]);

  return (
    <>
      { network && network.chainName === 'LOCAL' ? <div className="flex flex-wrap" style={{minHeight: (network && network.chainId === "101010") ? '389px' : '150px'}}>
        <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
          <CardContracts title="Contracts [ Besu / Ganache Local ]" network="local" contractShield={contractShieldLocal} setContractShield={setContractShieldLocal}/>
        </div>
        <div className="w-full xl:w-4/12 px-4">
          <CardTree title="[DB] Local" contractShield={contractShieldLocal} network="local" />
        </div>        
      </div> : '' }

      { network && network.chainId !== "101010" ? <div className="flex flex-wrap" style={{minHeight: (network && network.chainId !== "101010" && !contractShieldLocal) ? '389px' : '150px' }}>
        <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
          <CardContracts title={`Contracts Infura [ ${network.chainName} ]`} network={network ? network.chainName.toLowerCase() : 'goerli'} walletAddress={network ? network.walletAddress : ''} setContractShield={setContractShield} />
        </div>
        <div className="w-full xl:w-4/12 px-4">
          <CardTree title="[DB] Infura" contractShield={contractShield} walletAddress={network ? network.walletAddress : ''} network={network ? network.chainName.toLowerCase() : 'goerli'} />
        </div>
      </div> : '' }
      
      <div className="flex flex-wrap">
        <div className="w-full mb-12 xl:mb-24 px-3">
          {process.env.NODE_ENV === 'development' ? <Iframe source={'./baseline-commit-mgr-tests-report.html'} /> : ''}
        </div>
        <div className="w-full mb-12 xl:mb-12 px-3">
          {process.env.NODE_ENV === 'development' ? <Iframe source={'./baseline-dashboard-tests-report.html'} /> : ''}
        </div>        
      </div>
    </>
  );
}

Index.layout = Admin;
