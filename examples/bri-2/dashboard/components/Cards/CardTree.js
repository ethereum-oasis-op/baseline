import React, { useState, Suspense } from "react";
import TreeMerkle from '../Utils/TreeData';
import { SendCommitment } from '../Utils/Commitment';
import useSwr from 'swr';
import { commitMgrUrl } from "../Forms/FormSettings.js";

//const fetcher = (url) => fetch(url, 
                              //{ method: 'POST', body: { }})
                              //.then((res) => res.json());
const fetcher = (url) => fetch(url).then((res) => res.json());

// components
export default function CardTree({ title, contractShield, walletAddress, network }) {

  const treeTitle = title ? title : "[DB] Merkle Tree";

  //const { data, error } = contractShield ? 
                          //useSwr(
                            //`${commitMgrUrl}/json/baseline_getTracked/${contractShield}_0`,
                            //{ refreshInterval: 3000, fetcher: fetcher }
                          //) :
                          //{data:{}};

  const { data, error } = contractShield ? useSwr(`${commitMgrUrl}/getmerkletree/${contractShield}_0`, { refreshInterval: 3000, fetcher: fetcher }) : {data:{}};

  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
        <div className="rounded-t mb-0 px-4 py-4 border-0">
          <div className="flex flex-wrap items-justify">
            <div className="relative w-full px-1 max-w-full flex-grow flex-1">
              <h3 className="font-semibold text-base text-gray-800">
                {treeTitle}
              </h3>
            </div>
            <div className="relative px-1 max-w-full flex-grow flex-1 text-right">
              <button
                disabled={!data || !data.nodes ? 'disabled' : ''}
                className={(data && data.nodes) ? "bg-green-500 text-white active:bg-green-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                : "bg-gray-300 text-white active:bg-green-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"}
                type="button"
                onClick={() => (walletAddress && network !== 'local') ? SendCommitment( walletAddress, contractShield, network) : SendCommitment(null, contractShield, 'local') }
              >
                New Commitment
              </button>
            </div>
            {/*<div className="relative px-1 text-right">
              <button
                disabled={!data || !data.nodes ? 'disabled' : ''}
                className={(data && data.nodes) ? "bg-red-500 text-white active:bg-red-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                :"bg-gray-300 text-white active:bg-red-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"}
                type="button"
              >
                Reset
              </button>
  </div>*/}
          </div>
        </div>
        <div className="block w-full overflow-x-auto">
          {/* Projects table */}
          <div className="items-center w-full bg-transparent" style={{ height: "287px"}}>
          <hr className="mb-1 border-b-1 border-gray-400" />
              <TreeMerkle  data={data} />
          </div>
        </div>
      </div>
    </>
  );
}
