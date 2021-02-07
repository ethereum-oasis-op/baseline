import React, { useEffect } from "react";
import Link from "next/link";
import { useWallet } from 'use-wallet';
import { useRouter } from "next/router";

import UserDropdown from "components/Dropdowns/UserDropdown.js";
import { setWalletConnected } from '../Utils/isWalletConnected';

export default function Sidebar() {
  const [collapseShow, setCollapseShow] = React.useState("hidden");
  const router = useRouter();
  const wallet = useWallet();

  return (
    <>
      <nav className="md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-no-wrap md:overflow-hidden shadow-xl bg-gray-200 flex flex-wrap items-center justify-between relative md:w-64 z-10 py-4 px-6">
        <div className="md:flex-col md:items-stretch md:min-h-full md:flex-no-wrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">
          {/* Toggler */}
          <button
            className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
            type="button"
            onClick={() => setCollapseShow("bg-white m-2 py-3 px-6")}
          >
            <i className="fas fa-bars"></i>
          </button>
          {/* Brand */}
          <Link href="/">
            <a
              href="#baseline"
              className="md:block text-left md:pb-2 text-gray-700 mr-0 inline-block whitespace-no-wrap text-sm uppercase font-bold p-4 px-0 text-center"
            >
              <><img src="/baselineHorizontal-Logo-Full-Color.svg" /><small>Dashboard</small></>
            </a>
          </Link>
          {/* User */}
          <ul className="md:hidden items-center flex flex-wrap list-none">
            <li className="inline-block relative">
              <UserDropdown />
            </li>
          </ul>
          {/* Collapse */}
          <div
            className={
              "md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded " +
              collapseShow
            }
          >
            {/* Collapse header */}
            <div className="md:min-w-full md:hidden block pb-4 mb-4 border-b border-solid border-gray-300">
              <div className="flex flex-wrap">
                <div className="w-6/12">
                  <Link href="/">
                    <a
                      href="#dashboard"
                      className="md:block text-left md:pb-2 text-gray-700 mr-0 inline-block whitespace-no-wrap text-sm uppercase font-bold p-4 px-0"
                    >
                      Baseline Dashboard
                    </a>
                  </Link>
                </div>
                <div className="w-6/12 flex justify-end">
                  <button
                    type="button"
                    className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
                    onClick={() => setCollapseShow("hidden")}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </div>


            {/* Divider */}
            <hr className="my-4 md:min-w-full" />

            {/* Navigation */}

            <ul className="md:flex-col md:min-w-full flex flex-col list-none">
              <li className="items-center">
                <Link href="/">
                  <a
                    href="#dashboard"
                    className={
                      "text-xs uppercase py-3 font-bold block " +
                      (router.pathname.indexOf("/") !== -1
                        ? "text-blue-500 hover:text-blue-600"
                        : "text-gray-800 hover:text-gray-600")
                    }
                  >
                    <i
                      className={
                        "fas fa-tv mr-2 text-sm " +
                        (router.pathname.indexOf("/") !== -1
                          ? "opacity-75"
                          : "text-gray-400")
                      }
                    ></i>{" "}
                    Dashboard
                  </a>
                </Link>
              </li>

              <li className="items-center">
                <Link href="/admin/phonebook">
                  <a
                    href="#phonebook"
                    className={
                      "text-xs uppercase py-3 font-bold block " +
                      (router.pathname.indexOf("/admin/phonebook") !== -1
                        ? "text-blue-500 hover:text-blue-600"
                        : "text-gray-800 hover:text-gray-600")
                    }
                  >
                    <i
                      className={
                        "fas fa-phone mr-2 text-sm " +
                        (router.pathname.indexOf("/admin/phonebook") !== -1
                          ? "opacity-75"
                          : "text-gray-400")
                      }
                    ></i>{" "}
                    Baseline Phonebook
                  </a>
                </Link>
              </li>


              <li className="items-center">
                <Link href="/admin/didgenerator">
                  <a
                    href="#didgenerator"
                    className={
                      "text-xs uppercase py-3 font-bold block " +
                      (router.pathname.indexOf("/admin/didgenerator") !== -1
                        ? "text-blue-500 hover:text-blue-600"
                        : "text-gray-800 hover:text-gray-600")
                    }
                  >
                    <i
                      className={
                        "fas fa-id-card mr-2 text-sm " +
                        (router.pathname.indexOf("/admin/didgenerator") !== -1
                          ? "opacity-75"
                          : "text-gray-400")
                      }
                    ></i>{" "}
                    DID Generator
                  </a>
                </Link>
              </li>

              <li className="items-center">
                <Link href="/admin/settings">
                  <a
                    href="#settings"
                    className={
                      "text-xs uppercase py-3 font-bold block " +
                      (router.pathname.indexOf("/admin/settings") !== -1
                        ? "text-blue-500 hover:text-blue-600"
                        : "text-gray-800 hover:text-gray-600")
                    }
                  >
                    <i
                      className={
                        "fas fa-tools mr-2 text-sm " +
                        (router.pathname.indexOf("/admin/settings") !== -1
                          ? "opacity-75"
                          : "text-gray-400")
                      }
                    ></i>{" "}
                    Settings
                  </a>
                </Link>
              </li>

            </ul>
            {/* Divider */}
            <hr className="my-4 md:min-w-full" />
            <button
                      className="bg-white active:bg-gray-100 text-gray-800 font-normal px-4 py-2 mt-6 rounded outline-none focus:outline-none mr-2 mb-1 uppercase shadow hover:shadow-md inline-flex items-center font-bold text-xs ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => {wallet.reset(); setWalletConnected(null); router.push('/auth/login');}}
                    >
                      <img
                        alt="..."
                        className="w-5 mr-1"
                        src={require("assets/img/logoff.svg")}
                      />
                      Disconnect
                    </button>

          </div>
        </div>
      </nav>
    </>
  );
}
