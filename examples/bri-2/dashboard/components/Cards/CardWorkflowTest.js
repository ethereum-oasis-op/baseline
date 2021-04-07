import React from "react";
import axios from "axios";
import { workflowMgrUrl } from "../Forms/FormSettings.js";
import { Alert } from "../Utils/Alert";

export default function CardWorkflowTest() {
  
  const testWorkflow = async () => {
    console.log('Creating workflow')
    const workflowResp = await axios.post(`${workflowMgrUrl}/workflows?type=test`);
    Alert('success', 'New Workflow created...', `${workflowResp.data._id}`);
  }

  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-gray-200 border-0">
        <div className="rounded-t bg-white mb-0 px-6 py-6">
          <div className="text-center flex justify-between">
            <h6 className="text-gray-800 text-xl font-bold">Run Internal Test</h6>
          </div>
        </div>
        <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
          <form>
            <h6 className="text-gray-500 text-sm mt-3 mb-6 font-bold uppercase">
              Steps
            </h6>
            <div>
              Clicking the button below initiates the following sequence.
              <br/><br/>
              [1] Create a new empty Workflow.<br/>
              [2] Deploy a test Verifier smart contract.<br/>
              [3] Deploy a test Shield smart contract.<br/>
              [4] Setup tracking of events emitted by the Shield smart contract.<br/><br/>
              A new workflow is created from this process. Check the progress of this sequence and troubleshoot any errors by inspecting the workflow.
            </div>
            <hr className="mt-6 border-b-1 border-gray-400" />
            <br/>
            <div className="flex flex-wrap relative mt-2 w-full lg:w-12/12 px-4">
              <button
                className="bg-orange-500 active:bg-green-700 mt-2 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                type="button"
                onClick={testWorkflow}
              >
                Create Test Workflow
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
