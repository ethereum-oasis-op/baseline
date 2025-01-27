import React, { useState }  from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import axios from "axios";
import { commitMgrUrl } from "../Forms/FormSettings.js";
import CommitDropdown from "components/Dropdowns/CommitDropdown.js";

const statusIcon = (status) => {
  switch (status) {
    case 'created':
      return <><i className="fas fa-circle text-orange-500 mr-2"></i>{" "}{status}</>;
    case 'signed':
      return <><i className="fas fa-circle text-black mr-2"></i>{" "}{status}</>;
    case 'l2':
      return <><i className="fas fa-circle text-blue-500 mr-2"></i>{" "}{status}</>;
    case 'sent-mainnet':
      return <><i className="fas fa-circle text-yellow-500 mr-2"></i>{" "}{status}</>;
    case 'mainnet':
      return <><i className="fas fa-circle text-green-500 mr-2"></i>{" "}{status}</>;
    default: return <>{status}</>
  }
}

const createNewCommit = (workflow, testMessage) => {
    console.log('Creating commit using auto message');
    axios.post(`${commitMgrUrl}/commits`, {
      workflowId: workflow._id,
      merkleId: workflow.merkleId,
      rawData: { testMessage },
    });
}

export default function CardWorkflow({ color, workflow, commits }) {
  const [testMessage, setTestMessage] = useState("");
  const handleMessageChange = (e) => {
    setTestMessage(e.target.value);
  }

  return (
    <>
      <div
        className={
          "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded " +
          (color === "light" ? "bg-white" : "bg-gray-800 text-white")
        }
      >
        <div className="rounded-t mt-2 mb-2 px-6 py-1 border-0">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full px-4 max-w-full flex-grow flex-1">
              <h3
                className={
                  "font-semibold text-lg " +
                  (color === "light" ? "text-gray-800" : "text-white")
                }
              >
                Workflow: {workflow.description}
              </h3>
            </div>
            { (workflow.clientType == "dashboard-test") ?
              <div className="relative">
                <input 
                  className="px-6 py-2 mr-2 rounded shadow text-gray-700"
                  type="text"
                  name="testMessage"
                  placeholder="Write message here..."
                  value={testMessage}
                  onChange={handleMessageChange}
                />
                <button
                  className="bg-orange-500 active:bg-green-700 text-white text-xs font-bold uppercase px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => createNewCommit(workflow, testMessage)}
                >
                  Commit Message
                </button>
              </div> : <></>
            }
          </div>
        </div>
        <div className="block w-full overflow-x-auto">
          {/* Projects table */}
          <table className="items-center w-full bg-transparent border-collapse">
            <thead>
              <tr>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-gray-700 text-gray-300 border-gray-600"
                      : "bg-gray-700 text-gray-300 border-gray-600")
                  }
                >
                  Commitment ID
                </th>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-gray-700 text-gray-300 border-gray-600"
                      : "bg-gray-700 text-gray-300 border-gray-600")
                  }
                >
                  Status
                </th>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-gray-700 text-gray-300 border-gray-600"
                      : "bg-gray-700 text-gray-300 border-gray-600")
                  }
                >
                  Date Created
                </th>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-gray-700 text-gray-300 border-gray-600"
                      : "bg-gray-700 text-gray-300 border-gray-600")
                  }
                >
                  Raw Data
                </th>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-gray-700 text-gray-300 border-gray-600"
                      : "bg-gray-700 text-gray-300 border-gray-600")
                  }
                >
                  Workflow Step
                </th>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-gray-700 text-gray-300 border-gray-600"
                      : "bg-gray-700 text-gray-300 border-gray-600")
                  }
                ></th>
              </tr>
            </thead>
            <tbody>
              { (commits && commits.length > 0)
                ? commits.map(( commit, index ) => {
                  return (
                    <tr key={commit._id} style={{
                      "borderTop":"solid 1px rgba(105, 105, 105)"
                    }}>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                        <a
                          href={`/admin/commits/${commit._id}`}
                          className="mr-0 inline-block whitespace-no-wrap font-bold"
                          style={{color:"#4169E1"}}
                        >
                        {commit._id}
                        </a>
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                        {statusIcon(commit.status)}
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                        {commit.createdAt}
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                        <Link href={`/admin/commits/${commit._id}`} >
                          <a
                            className={
                              "px-4 text-sm font-normal block w-full whitespace-no-wrap bg-transparent text-blue-600 hover:text-blue-600"
                            }
                          >
                            View
                          </a>
                        </Link>
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                        {commit.workflowStep}
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4 text-right">
                        <CommitDropdown commit={commit}/>
                      </td>
                    </tr>
                  );
                })
                : <tr>
                    <td colSpan="5">
                    <img
                      src={require("assets/img/no-workflows.png")}
                      alt="no workflows image"
                      style={{
                        display: "block",
                        "marginLeft": "auto",
                        "marginRight": "auto",
                        "marginTop": "3rem",
                        "marginBottom": "3rem",
                        width: "50%"
                      }}
                    />
                    <div style={{"textAlign": "center"}}>
                      <strong>
                        <a>No commits found for this workflow.</a>
                      </strong>
                    </div>
                    <div style={{height:"50px"}}></div>
                    </td>
                  </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

CardWorkflow.defaultProps = {
  color: "light",
};

CardWorkflow.propTypes = {
  color: PropTypes.oneOf(["light", "dark"]),
};
