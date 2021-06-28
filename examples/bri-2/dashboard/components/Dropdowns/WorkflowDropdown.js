import React, { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { createPopper } from "@popperjs/core";
import { Alert } from "../Utils/Alert";
import { workflowMgrUrl } from "../Forms/FormSettings.js";
import {useOnClickOutside} from '../Utils/useOnClickOutside.js'

const removeWorkflow = async (workflowId) => {
  return await axios.delete(`${workflowMgrUrl}/workflows/${workflowId}`)
    .then((response) => {
        //access the resp here....
        Alert('success', 'Workflow removed...', `${workflowId}`);
        return response.data;
    })
    .catch((error) => {
        console.log(error);
        Alert('error', 'ERROR...', error);
    });
}

const acceptInvitation = async (workflowId) => {
  return await axios.post(`${workflowMgrUrl}/workflows/${workflowId}/accept-invite`)
    .then((response) => {
        //access the resp here....
        Alert('success', 'Workflow removed...', `${workflowId}`);
        return response.data;
    })
    .catch((error) => {
        console.log(error);
        Alert('error', 'ERROR...', error);
    });
}

const WorkflowDropdown = ({ workflowId }) => {
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

  useOnClickOutside(popoverDropdownRef, () => setDropdownPopoverShow(false));

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
          <Link href={`/admin/workflows/${workflowId}`}>
            <a
              href="#phonebook"
              className={
                "text-sm py-2 px-4 font-normal block w-full whitespace-no-wrap bg-transparent text-gray-800" +
                "text-blue-500 hover:text-blue-600"
              }
            >
              Inspect
            </a>
          </Link>
        </li>

        <a
          href="#pablo"
          className={
            "text-sm py-2 px-4 font-normal block w-full whitespace-no-wrap bg-transparent text-gray-800" +
            "text-blue-500 hover:text-blue-600"
          }
          onClick={() => {
            removeWorkflow(workflowId);
            closeDropdownPopover();
          }}
        >
          Delete
        </a>
        <a
          href="#pablo"
          className={
            "text-sm py-2 px-4 font-normal block w-full whitespace-no-wrap bg-transparent text-gray-800" +
            "text-blue-500 hover:text-blue-600"
          }
          onClick={() => {
            acceptInvitation(workflowId);;;;
            closeDropdownPopover();
          }}
        >
          Accept Invitation
        </a>
      </div>
    </>
  );
};

export default WorkflowDropdown;
