import React from "react";
import axios from "axios";
import { Alert } from "../Utils/Alert";
import { createPopper } from "@popperjs/core";
import { workflowMgrUrl } from "../Forms/FormSettings.js";

const removeEntry = async (orgId) => {
  return await axios.delete(`${workflowMgrUrl}/organizations/${orgId}`)
    .then((response) => {
        //access the resp here....
        Alert('success', 'Phonebook removed...', `Phonebook entry removed with success...`);
        return response.data;
    })
    .catch((error) => {
        console.log(error);
        Alert('error', 'ERROR...', error);
    });
}

const PhonebookDropdown = ({orgId}) => {
  // dropdown props
  const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);
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
        href="#menu"
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
        <a
          href="#delete"
          className={
            "text-sm py-2 px-4 font-normal block w-full whitespace-no-wrap bg-transparent text-gray-800"
          }
          onClick={() => removeEntry(orgId)}
        >
          Delete Entry
        </a>
      </div>
    </>
  );
};

export default PhonebookDropdown;
