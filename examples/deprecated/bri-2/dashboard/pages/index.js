import React, { useEffect, useState }  from "react";
import dotenv from "dotenv";
import { commitMgrUrl } from "../components/Forms/FormSettings.js";
import { useWallet } from 'use-wallet';
import { useUser } from '../components/Utils/useUser';
import { isWalletConnected } from '../components/Utils/isWalletConnected';
import Iframe from '../components/Utils/Iframe';
import CardContracts from "../components/Cards/CardContracts.js";
import CardTree from "../components/Cards/CardTree.js";
import CardStats from "../components/Cards/CardStats.js";
import Admin from "../layouts/Admin.js";
import { switchChain } from "../lib/chainSwitcher.js";

dotenv.config();

export default function Index({statusDetails, statusError}) {
  const { user, status: userStatus, loading } = useUser();

  const wallet = useWallet();
  const [contractShieldLocal, setContractShieldLocal] = useState('');
  const [contractShield, setContractShield] = useState('');

  let connectedId;

  useEffect(() => {
    connectedId = isWalletConnected();
    if (wallet.status == 'disconnected' && connectedId != null) {
      wallet.connect(connectedId);
    }
    if (wallet.status === 'connected' && connectedId === null){
      setWalletConnected(wallet.connector);
    }
  }, [connectedId, wallet]);
  
  return (
    <>
        <div className="px-4 md:px-10 mx-auto w-full">
          <div>
            {/* Card stats */}
            <div className="flex flex-wrap">
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="DATABASE"
                  statTitle={statusDetails ? statusDetails.db.dbHost : 'Loading...'}
                  statArrow="up"
                  statPercent=" "
                  statPercentdaColor="text-red-500"
                  statDescription={statusDetails ? `${statusDetails.db.dbUrl}` : 'Loading...'}
                  statIconName="fas fa-database"
                  statIconColor={statusDetails ? (statusDetails.blockchain.chainId === "101010" ? "bg-orange-500" : "bg-green-500") : 'bg-gray-300'}
                />
              </div>
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="BLOCKCHAIN NETWORK"
                  statTitle={statusDetails ? statusDetails.blockchain.chainName : 'Loading...'}
                  statArrow="up"
                  statPercent={statusDetails ? `[ ${statusDetails.blockchain.chainId} ]`: 'Loading...'}
                  statPercentColor="text-green-500"
                  statDescription={statusDetails ? (statusDetails.blockchain.chainId !== "101010" ? "Connected to PUBLIC" : "Connected to LOCAL") : 'Loading...'}
                  statIconName="fa fa-th"
                  statIconColor={statusDetails ? (statusDetails.blockchain.chainId === "101010" ? "bg-red-500" : "bg-green-500") : 'bg-gray-300'}
                />
              <button
                className={ statusDetails ? (statusDetails.blockchain.chainId !== "101010"
                  ? "w-full bg-red-500 text-white active:bg-red-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-4 ease-linear transition-all duration-150"
                  : "w-full bg-green-500 text-white active:bg-green-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-4 ease-linear transition-all duration-150"
                ) : ''}
                type="button"
                onClick={() => statusDetails.blockchain.chainId !== "101010" ? switchChain('local') : switchChain(statusDetails.blockchain.chainId)}
              >
                { statusDetails ? (statusDetails.blockchain.chainId === "101010" ? 'SWITCH NETWORK [MAIN/TESTNET]' : 'SWITCH NETWORK [LOCAL]') : 'Loading...'}
              </button>
              </div>              
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="COMMIT-MGR STATUS"
                  statTitle={!statusDetails ? "Loading..." : "Ok"}
                  statArrow="up"
                  statPercent={statusDetails ? `[${statusDetails.blockchain.commitServerPort}]` : '...'}
                  statPercentColor="text-green-500"
                  statDescription={statusError ? "Failed to load status" : "Commitment-mgr status"}
                  statIconName={statusError ? "fas fa-times" : "fas fa-check"}
                  statIconColor={statusError ? "bg-red-500" : "bg-green-500"}
                />
              </div>
            </div>
          </div>
        </div>


      <div className="flex flex-wrap" style={{minHeight: (statusDetails && statusDetails.blockchain.chainId === "101010") ? '589px' : '150px'}}>
        <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
          <CardContracts title="Contracts [ Besu / Ganache Local ]" network="local" contractShield={contractShieldLocal} setContractShield={setContractShieldLocal}/>
        </div>
        <div className="w-full xl:w-4/12 px-4">
          <CardTree title="[DB] Local" contractShield={contractShieldLocal} network="local" />
        </div>        
      </div>

      { statusDetails && statusDetails.blockchain.chainId !== "101010" ? <div className="flex flex-wrap" style={{minHeight: (statusDetails.blockchain && statusDetails.blockchain.chainId !== "101010" && !contractShieldLocal) ? '589px' : '150px'}}>
        <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
          <CardContracts title={`Contracts Infura [ ${statusDetails.blockchain.chainName} ]`} network={statusDetails ? statusDetails.blockchain.chainName.toLowerCase() : 'goerli'} walletAddress={statusDetails.blockchain ? statusDetails.blockchain.walletAddress : ''} setContractShield={setContractShield} />
        </div>
        <div className="w-full xl:w-4/12 px-4">
          <CardTree title="[DB] Infura" contractShield={contractShield} walletAddress={statusDetails ? statusDetails.blockchain.walletAddress : ''} network={statusDetails ? statusDetails.blockchain.chainName.toLowerCase() : 'goerli'} />
        </div>

      <div className="w-full mb-3 px-4">
        {process.env.NODE_ENV === 'production' ? <Iframe source={'./baseline-commit-mgr-tests-report.html'} /> : ''}
      </div>

      </div> : '' }
    </>
  );
}

// This gets called on every request
export async function getServerSideProps() {
  // Fetch data from external API
  let statusDetails, statusError = null;
  try {
    const res = await fetch(`${commitMgrUrl}/status`)
    statusDetails = await res.json()
  } catch (err) {
    statusError = 'failed';
    statusDetails = null;
  }

  // Pass data to the page via props
  return { props: { statusDetails, statusError } }
}

Index.layout = Admin;
