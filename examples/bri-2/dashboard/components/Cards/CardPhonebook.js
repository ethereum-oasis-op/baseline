import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Alert } from "../Utils/Alert";
import useSwr from 'swr';
import { addPhonebook } from '../Utils/Phonebook';
import { commitMgrServerUrl } from "../../configs/commit_mgr.env";
// components

import PhonebookDropdown from "components/Dropdowns/PhonebookDropdown.js";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function CardPhonebook({ color }) {

  const { data, error } = useSwr(`${commitMgrServerUrl}/get-phonebook`, { refreshInterval: 3000, fetcher: fetcher });

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
                      ? "bg-gray-100 text-gray-600 border-gray-200"
                      : "bg-gray-700 text-gray-300 border-gray-600")
                  }
                >
                  Domain
                </th>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-gray-100 text-gray-600 border-gray-200"
                      : "bg-gray-700 text-gray-300 border-gray-600")
                  }
                >
                  DID Identity
                </th>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-gray-100 text-gray-600 border-gray-200"
                      : "bg-gray-700 text-gray-300 border-gray-600")
                  }
                >
                  Network
                </th>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-gray-100 text-gray-600 border-gray-200"
                      : "bg-gray-700 text-gray-300 border-gray-600")
                  }
                >
                  Status
                </th>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-gray-100 text-gray-600 border-gray-200"
                      : "bg-gray-700 text-gray-300 border-gray-600")
                  }
                ></th>
              </tr>
            </thead>
            <tbody>
            {data && data.length ?
              data.map((entry) => 
              <tr key={entry._id}>
                <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4 text-left flex items-center">
                  <img
                    src={require("assets/img/identity.svg")}
                    className="h-12 w-12 p-2 bg-white rounded-full border"
                    alt="..."
                  ></img>{" "}
                  <span
                    className={
                      "ml-3 font-bold " +
                      +(color === "light" ? "text-gray-700" : "text-white")
                    }
                  >
                    <a href={`https://${entry.domain}`} target="_blank">{entry.domain}</a>
                  </span>
                </th>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                  <a href={`https://${entry.domain}`} target="_blank">{entry.dididentity}</a>
                </td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                    {entry.network}
                </td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                  <i className={entry.status === 'verified' ? "fas fa-circle text-green-500 mr-2" : "fas fa-circle text-orange-500 mr-2"}></i> {entry.status}
                </td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4 text-right">
                  <PhonebookDropdown entryId={entry._id} />
                </td>
              </tr> )
              :               
              <tr>
              <td colSpan="4" className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-center text-xs whitespace-no-wrap p-4">
                <h3>No entries available</h3>
            </td>
            </tr>}
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
