import { useEffect, useState } from "react";
import Link from "next/link";
import { useWallet } from 'use-wallet';
import { useRouter } from "next/router";

import NotificationDropdown from "components/Dropdowns/NotificationDropdown.js";
import UserDropdown from "components/Dropdowns/UserDropdown.js";
import { setWalletConnected } from '../Utils/isWalletConnected';

export default function Sidebar() {
  const [collapseShow, setCollapseShow] = useState("hidden");
  const router = useRouter();
  const wallet = useWallet();

  return (
    <>
      <nav className="md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-no-wrap md:overflow-hidden shadow-xl flex flex-wrap items-center justify-between relative md:w-64 z-10 py-4 px-6"
        style= {{backgroundColor: "black"}}
      >
          <div style={{
            display: "flex",
            "alignItems": "left",
            "flexDirection": "row",
          }}>
            <img
              src={require("assets/img/brand/baselineHorizontal-Logo-DarkBackground.png")}
              alt="baseline logo"
              height="120"
              width="120"
            />
            <div style={{"position": "relative", "top": "3px", "color": "orange"}}>
            | dashboard
            </div>
          </div>
          <div
            className={
              "md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-2 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded " +
              collapseShow
            }
          >
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
                      (router.pathname === "/"
                        ? "text-blue-500 hover:text-blue-600"
                        : "text-gray-600 hover:text-gray-400")
                    }
                  >
                    <i
                      className={
                        "fas fa-tv mr-2 text-sm " +
                      (router.pathname === "/"
                          ? "opacity-75"
                          : "text-gray-400")
                      }
                    ></i>{" "}
                    Overview
                  </a>
                </Link>
              </li>

              <li className="items-center">
                <Link href="/admin/workflows">
                  <a
                    href="#workflows"
                    className={
                      "text-xs uppercase py-3 font-bold block " +
                      (router.pathname.indexOf("/admin/workflows") !== -1
                        ? "text-blue-500 hover:text-blue-600"
                        : "text-gray-600 hover:text-gray-400")
                    }
                  >
                    <i
                      className={
                        "fas fa-sync mr-2 text-sm " +
                        (router.pathname.indexOf("/admin/workflows") !== -1
                          ? "opacity-75"
                          : "text-gray-400")
                      }
                    ></i>{" "}
                    Workflows
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
                        : "text-gray-600 hover:text-gray-400")
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
                    Phonebook
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
                        : "text-gray-600 hover:text-gray-400")
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
                        : "text-gray-600 hover:text-gray-400")
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
              className="bg-orange-500 active:bg-gray-100 text-gray-800 font-normal px-4 py-2 mt-6 rounded outline-none focus:outline-none mr-2 mb-1 uppercase shadow hover:shadow-md inline-flex items-center font-bold text-xs ease-linear transition-all duration-150"
              type="button"
              onClick={() => {
                router.push('/admin/workflow-test');
              }}
            >
              <i className="fas fa-chevron-circle-right w-5 mr-1"></i>
              Run Internal Test
            </button>
            <button
              className="bg-orange-500 active:bg-gray-100 text-gray-800 font-normal px-4 py-2 mt-6 rounded outline-none focus:outline-none mr-2 mb-1 uppercase shadow hover:shadow-md inline-flex items-center font-bold text-xs ease-linear transition-all duration-150"
              type="button"
              onClick={() => {
                router.push('/admin/workflow-test');
              }}
            >
              <i className="fas fa-chevron-circle-right w-5 mr-1"></i>
              Start Hello World
            </button>
            <button
              className="bg-white active:bg-gray-100 text-gray-800 font-normal px-4 py-2 mt-6 rounded outline-none focus:outline-none mr-2 mb-1 uppercase shadow hover:shadow-md inline-flex items-center font-bold text-xs ease-linear transition-all duration-150"
              type="button"
              onClick={() => {
                wallet.reset();
                setWalletConnected(null);
                router.push('/auth/login');
              }}
            >
              <img
                alt="..."
                className="w-5 mr-1"
                src={require("assets/img/logoff.svg")}
              />
              Disconnect
            </button>
          </div>
      </nav>
    </>
  );
}
