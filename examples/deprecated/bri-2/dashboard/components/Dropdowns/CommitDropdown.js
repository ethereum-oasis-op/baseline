import React, { useState } from "react";
import { createPopper } from "@popperjs/core";
import { commitMgrUrl } from "../Forms/FormSettings.js";
import { Alert, ConfirmAlert } from "../Utils/Alert";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const sendMainnet = async (commitId) => {
  await axios.post(`${commitMgrUrl}/commits/${commitId}/send-mainnet`, {
      proof: [ 5 ],
      publicInputs: [ "0x123" ]
    })
    .then((response) => {
        //access the resp here....
        console.log('send-mainnet response:', response)
        Alert('success', 'Commit sent to mainnet...', `Transaction ID: ${response.data.txHash}`);
        return response.data;
    })
    .catch((error) => {
        console.log(error);
        Alert('error', 'ERROR...', error);
    });
}

const sendToPartners = async (commitId) => {
  await axios.post(`${commitMgrUrl}/commits/${commitId}/send-to-partners`, {
      proof: [ 5 ],
      publicInputs: [ "test" ],
      senderAddress: process.env.WALLET_PUBLIC_KEY
    })
    .then((response) => {
        //access the resp here....
        Alert('success', 'Commit sent to partners...', `Transaction ID: ${response.data.txHash}`);
        return response.data;
    })
    .catch((error) => {
        console.log(error);
        Alert('error', 'ERROR...', error);
    });
}

const CommitDropdown = ({ commit }) => {
  // dropdown props
  const [dropdownPopoverShow, setDropdownPopoverShow] = useState(false);
  const btnDropdownRef = React.createRef();
  const popoverDropdownRef = React.createRef();
  const openDropdownPopover = () => {
    createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
      placement: "left-start",
    });
    setDropdownPopoverShow(true);
  };
  const closeDropdownPopover = () => {
    setDropdownPopoverShow(false);
  };

  return (
    <>
      <a
        className="text-gray-600 py-1 px-3"
        href="#pablo"
        ref={btnDropdownRef}
        onClick={(e) => {
          e.preventDefault();
          dropdownPopoverShow ? closeDropdownPopover() : openDropdownPopover();
        }}
      >
        <i className="fas fa-ellipsis-v"></i>
      </a>

      <div
        ref={popoverDropdownRef}
        className={
          (dropdownPopoverShow ? "block " : "hidden ") +
          "bg-white text-base z-50 float-left py-2 list-none text-left rounded shadow-lg min-w-48"
        }
      >
      <li className="items-center">
        <a
          className={
            "text-sm py-2 px-4 font-normal block w-full whitespace-no-wrap bg-transparent text-gray-800" +
            "text-blue-500 hover:text-blue-600"
          }
          onClick={() => {
            sendToPartners(commit._id)
            closeDropdownPopover()
          }}
        >
          Send to Partners
        </a>
      </li>
      <li className="items-center">
        <a
          className={
            "text-sm py-2 px-4 font-normal block w-full whitespace-no-wrap bg-transparent text-gray-800" +
            "text-blue-500 hover:text-blue-600"
          }
          onClick={() => {
            sendMainnet(commit._id)
            closeDropdownPopover()
          }}
        >
          Send to Mainnet
        </a>
      </li>
        <a
          className={
            "text-sm py-2 px-4 font-normal block w-full whitespace-no-wrap bg-transparent text-gray-800" +
            "text-blue-500 hover:text-blue-600"
          }
          onClick={(e) => e.preventDefault()}
        >
          Delete
        </a>
      </div>
    </>
  );
};

export default CommitDropdown;
