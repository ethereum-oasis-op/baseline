import React from "react";
import { ethers } from "ethers";
import { useWallet } from 'use-wallet';
import { createPopper } from "@popperjs/core";

const UserDropdown = (props) => {  
  // dropdown props
  const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);
  const btnDropdownRef = React.createRef();
  const popoverDropdownRef = React.createRef();
  const openDropdownPopover = () => {
    createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
      placement: "bottom-start",
    });
    setDropdownPopoverShow(true);
  };
  const closeDropdownPopover = () => {
    setDropdownPopoverShow(false);
  };
  const wallet = useWallet();
  //const addressAvatar = walletAvatar(wallet.account, "https://goerli.infura.io/v3/655f1ad19d494a9fbbac8944c60c5ef8")
  return (
    <>
      <a
        className="text-gray-600 block"
        href="#baseline-dashboard"
        ref={btnDropdownRef}
        onClick={(e) => {
          e.preventDefault();
          dropdownPopoverShow ? closeDropdownPopover() : openDropdownPopover();
        }}
      >
        <div className="items-center flex">
          <span className="w-10 h-10 text-sm text-black bg-gray-300 inline-flex items-center justify-center rounded-full">
            <div className="w-full rounded-full align-middle border-none shadow-lg" style={{borderRadius: "50px", overflow: "hidden",  padding: "0px", margin: "0px", width: "32px", height: "32px", display: "inline-block", background: "rgb(242, 198, 2)"}}>
              <svg x="0" y="0" width="32" height="32">
                <rect x="0" y="0" width="32" height="32" transform="translate(-6.060310053001326 -1.944835482516961) rotate(219.6 16 16)" fill="#F96801"></rect>
                <rect x="0" y="0" width="32" height="32" transform="translate(-10.43371731733871 8.280926432633652) rotate(295.6 16 16)" fill="#FB183A"></rect>
                <rect x="0" y="0" width="32" height="32" transform="translate(14.452460985758162 -27.749335599609196) rotate(328.6 16 16)" fill="#1876F2"></rect>
              </svg>
            </div>
          </span>
          <span className="text-sm text-black px-4">
            <strong>Account:</strong> {wallet.account}<br />
            <strong>Balance:</strong> {ethers.utils.formatEther(wallet.balance)}<br />
            <strong>Network:</strong> {wallet.networkName}
          </span>
        </div>
      </a>
      <div
        ref={popoverDropdownRef}
        className={
          (dropdownPopoverShow ? "block " : "hidden ") +
          "bg-white text-base z-50 float-left py-2 list-none text-left rounded shadow-lg min-w-48"
        }
      >
        <a
          href="#pablo"
          className={
            "text-sm py-2 px-4 font-normal block w-full whitespace-no-wrap bg-transparent text-gray-800"
          }
          onClick={(e) => e.preventDefault()}
        >
          Action
        </a>
        <a
          href="#pablo"
          className={
            "text-sm py-2 px-4 font-normal block w-full whitespace-no-wrap bg-transparent text-gray-800"
          }
          onClick={(e) => e.preventDefault()}
        >
          Another action
        </a>
        <a
          href="#pablo"
          className={
            "text-sm py-2 px-4 font-normal block w-full whitespace-no-wrap bg-transparent text-gray-800"
          }
          onClick={(e) => e.preventDefault()}
        >
          Something else here
        </a>
        <div className="h-0 my-2 border border-solid border-gray-200" />
        <a
          href="#pablo"
          className={
            "text-sm py-2 px-4 font-normal block w-full whitespace-no-wrap bg-transparent text-gray-800"
          }
          onClick={(e) => e.preventDefault()}
        >
          Seprated link
        </a>
      </div>
    </>
  );
};

export default UserDropdown;
