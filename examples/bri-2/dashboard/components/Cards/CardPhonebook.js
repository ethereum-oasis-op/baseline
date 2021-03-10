import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Alert } from "../Utils/Alert";
import useSwr from 'swr';
import { addPhonebook } from '../Utils/Phonebook';
import { workflowMgrUrl } from "../Forms/FormSettings.js";
// components

import PhonebookDropdown from "components/Dropdowns/PhonebookDropdown.js";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function CardPhonebook({ color }) {

  const { data: orgs, error } = useSwr(`${workflowMgrUrl}/organizations`, { refreshInterval: 3000, fetcher: fetcher });

  return (
    <>
      <div
        className={
          "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded " +
          (color === "light" ? "bg-white" : "bg-gray-800 text-white")
        }
      >     
        <div className="rounded-t mb-0 px-4 py-3 border-0">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full px-4 max-w-full flex-grow flex-1">
            <h3
                className={
                  "font-semibold text-base " +
                  (color === "light" ? "text-gray-800" : "text-white")
                }
              >
              Baseline Phonebook
              </h3>
            </div>
            <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
              <button
                className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => addPhonebook()}
              >
                New Entry
              </button>
            </div>
          </div>
        </div>   

        <div className="block w-full overflow-x-auto" style={{ minHeight: "449px"}}>
          {/* Phonebook table */}
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
                  Domain
                </th>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-gray-700 text-gray-300 border-gray-600"
                      : "bg-gray-700 text-gray-300 border-gray-600")
                  }
                >
                  DID Identity
                </th>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-gray-700 text-gray-300 border-gray-600"
                      : "bg-gray-700 text-gray-300 border-gray-600")
                  }
                >
                  Network
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
                ></th>
              </tr>
            </thead>

            <tbody>
              { (orgs && orgs.length > 0)
                ? orgs.map(( org, index ) => {
                  return (
                    <tr key={org._id} style={{
                      "borderTop":"solid 1px rgba(105, 105, 105)"
                    }}>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                        {org._id}
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                        {org.description}
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                        {org.createdAt}
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                        {org.clientType}
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                        {org.status}
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4 text-right">
                        <WorkflowDropdown orgId={org._id}/>
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
                        <a>You don't have any contacts yet. </a>
                      </strong>
                      <a
                        href="/admin/workflow-test"
                        className="md:pb-2 text-gray-700 mr-0 inline-block whitespace-no-wrap font-bold"
                        style={{color:"#FF0000"}}
                      ><u>Let's create one!</u></a>
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

CardPhonebook.defaultProps = {
  color: "light",
};

CardPhonebook.propTypes = {
  color: PropTypes.oneOf(["light", "dark"]),
};
