import React, { useState } from "react";
import axios from "axios";
import { Alert, ConfirmAlert } from "../Utils/Alert";
import useSwr from 'swr';
import { commitMgrUrl } from "../Forms/FormSettings.js";

const deployContracts = async (network, senderAddress) => {
  await axios.post(`${commitMgrUrl}/deploy-contracts`, {
      network: network,
      sender: senderAddress
    })
    .then((response) => {
        //access the resp here....
        const statusDeploy = response;
        console.log(`Status Contracts Deployment: ${response}`);
        Alert('success', 'Contracts Deployed...', `Contracts deployed with success into ${network} network..`);
        return response;
    })
    .catch((error) => {
        console.log(error);
        Alert('error', 'ERROR...', error);
    });
}

const resetContracts = async () => {
  await axios.post(`${commitMgrUrl}/delete/contracts`)
    .then((response) => {
        //access the resp here....
        console.log(`Status Contracts Reset: ${response.data}`);
        return response.data;
    })
    .catch((error) => {
        console.log(error);
        Alert('error', 'ERROR...', error);
    });
}

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function CardContracts({ title, network, walletAddress, setContractShield }) {

  const [deploying, setDeploying] = useState(0);

  const contractsTitle = title ? title : "Contracts";
  const contractsNetwork = network ? network : "local";
  const { data, error } = useSwr(`${commitMgrUrl}/contracts/?network=${contractsNetwork}`, { refreshInterval: 3000, fetcher: fetcher });


  if (data && data.length > 1)
    setContractShield(data[1].address);

  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
        <div className="rounded-t mb-0 px-4 py-3 border-0">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full px-4 max-w-full flex-grow flex-1">
              <h3 className="font-semibold text-base text-gray-800">
                {contractsTitle}
              </h3>
            </div>
            <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
              <button
                className={deploying 
                  ? "bg-gray-200 text-gray-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  : (data && data.length) ? "bg-gray-300 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" 
                  : "bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" }
                type="button"
                disabled={deploying || (data && data.length) ? 'disabled' : ''}
                onClick={() => { 
                    setDeploying(1);
                    deployContracts(network, walletAddress).then((result) => {
                    setDeploying(0);
                  }); 
                }}
              >
                {deploying ? '[ Deploying ] please wait...' : 'Deploy Contracts'}
              </button>
            </div>
            <div className="relative px-1 text-right">
              <button
                disabled={!data || !data.length ? 'disabled' : ''}
                className={(data && data.length) ? "bg-red-500 text-white active:bg-red-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                : "bg-gray-300 text-white active:bg-red-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"}
                type="button"
                onClick={() => ConfirmAlert('warning', 'Are you sure?', "You won't be able to revert this!", 'Yes, do it!', resetContracts)}
              >
                Reset Contracts
              </button>
            </div>
          </div>
        </div>
        <div className="block w-full overflow-x-auto" style={{ height: "296px"}}>
          {/* Contracts table */}
          <table className="items-center w-full bg-transparent border-collapse">
            <thead>
              <tr>
                <th className="px-6 bg-gray-100 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left">
                  Contract name
                </th>
                <th className="px-6 bg-gray-100 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left">
                  Address
                </th>
                <th className="px-6 bg-gray-100 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left">
                  Created At
                </th>
                <th className="px-6 bg-gray-100 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left">
                  Block Number
                </th>
              </tr>
            </thead>
            <tbody>
              {data && data.length ?
              data.map((contract) => 
              <tr key={contract._id}>
                <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm whitespace-no-wrap p-4 text-left text-blue-500">
                  {contract.name}
                </th>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                  <a href={network !== 'local' ? `https://${contract.network}.etherscan.io/address/${contract.address}` : `#${contract.address}`} target="_blank" className="text-black hover:text-green-500 font-semibold">
                      {contract.address}
                  </a>
                </td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                  {new Date(contract.createdAt).toISOString().split('T')[0]}
                </td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                  <i className="fa fa-cubes text-green-500 mr-4"></i>
                  {contract.blockNumber}
                </td>
              </tr> )
              :
              <tr>
              <td colSpan="4" className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-center text-xs whitespace-no-wrap p-4">
                <h3>No contracts available</h3>
            </td>
            </tr>}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
