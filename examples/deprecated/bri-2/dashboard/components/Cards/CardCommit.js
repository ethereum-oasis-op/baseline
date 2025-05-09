import React from "react";

export default function CardCommit({commit, commitError}) {
  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-gray-200 border-0">
        <div className="rounded-t bg-white mb-0 px-6 py-6">
          <div className="text-center flex justify-between">
            <h6 className="text-gray-800 text-xl font-bold">Commit Details</h6>
          </div>
        </div>
        <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
            <h6 className="text-gray-500 text-sm mt-3 mb-6 font-bold uppercase">
              Commit Hash Value
            </h6>
            <div className="flex flex-wrap w-full lg:w-6/12 px-4 relative w-full mb-6">
              {commit.value}
            </div>
            <h6 className="text-gray-500 text-sm mt-3 mb-6 font-bold uppercase">
              Salt
            </h6>
            <div className="flex flex-wrap w-full lg:w-6/12 px-4 relative w-full mb-6">
              <pre>{commit.salt}</pre>
            </div>
            <h6 className="text-gray-500 text-sm mt-3 mb-6 font-bold uppercase">
              Transaction Hash
            </h6>
            <div className="flex flex-wrap w-full lg:w-6/12 px-4 relative w-full mb-6">
              <pre>{commit.txHash}</pre>
            </div>
            <h6 className="text-gray-500 text-sm mt-3 mb-6 font-bold uppercase">
              Raw Data Object
            </h6>
            <div className="flex flex-wrap w-full lg:w-6/12 px-4 relative w-full mb-3">
              <pre>{JSON.stringify(commit.rawData, null, 2) }</pre>
            </div>
        </div>
      </div>
    </>
  );
}
