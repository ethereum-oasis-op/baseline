import React, { useState }  from "react";
import axios from "axios";
import { workflowMgrUrl, commitMgrUrl } from "../Forms/FormSettings.js";
import { Alert } from "../Utils/Alert";

export default function CardWorkflowTest() {
  
  const [testMessage, setTestMessage] = useState("");

  const handleMessageChange = (e) => {
    setTestMessage(e.target.value);
  }

  const testWorkflow = async () => {
    console.log('Creating workflow')
    const workflowResp = await axios.post(`${workflowMgrUrl}/workflows?type=test`);
  
    console.log('Creating commit using test message:', testMessage);
    const commitResp = await axios.post(`${commitMgrUrl}/commits`, {
      workflowId: workflowResp.data._id,
      merkleId: workflowResp.data.merkleId,
      rawData: { testMessage },
    });
    
    console.log('Sending commit to mainnet:', testMessage);
    const commitOnChainResp = await axios.post(`${commitMgrUrl}/commits/${commitResp.data._id}/send-mainnet`, {
      proof: [5],
      publicInputs: ["0x02d449a31fbb267c8f352e9968a79e3e5fc95c1bbeaa502fd6454ebde5a4bedc"],
    });
  
    Alert('success', 'New Workflow created...', `${workflowResp.data._id}`);
  }

  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-gray-200 border-0">
        <div className="rounded-t bg-white mb-0 px-6 py-6">
          <div className="text-center flex justify-between">
            <h6 className="text-gray-800 text-xl font-bold">Run Baseline Test</h6>
          </div>
        </div>
        <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
          <form>
            <h6 className="text-gray-500 text-sm mt-3 mb-6 font-bold uppercase">
              Steps
            </h6>
            <div>
              This test baselines your custom text string by automatically executing the following sequence.
              <br/><br/>
              [1] hash the string<br/>
              [2] sign the hash with your EDDSA key<br/>
              [3] send the preimage+signed hash to the baseline test server<br/>
              [4] test server signs the hash<br/>
              [5] test server pushes the commitment to mainnet<br/><br/>
              A new workflow is created from this process. Check the progress of the sequence and troubleshoot any errors by inspecting the workflow.
            </div>
            <hr className="mt-6 border-b-1 border-gray-400" />
            <h6 className="text-gray-500 text-sm mt-3 mb-6 font-bold uppercase">
              MESSAGE TO BASELINE
            </h6>
            <div className="flex flex-wrap">
              <div className="w-full lg:w-12/12 px-4">
                <div className="relative w-full mb-3">
                  <input 
                    className="px-3 py-3 rounded shadow w-full text-gray-700"
                    type="text"
                    name="testMessage"
                    placeholder="Write your message..."
                    value={testMessage}
                    onChange={handleMessageChange}
                  />
                  <br/>
                  <br/>
                  <button
                    className="bg-orange-500 active:bg-green-700 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={testWorkflow}
                  >
                    Baseline Message
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
