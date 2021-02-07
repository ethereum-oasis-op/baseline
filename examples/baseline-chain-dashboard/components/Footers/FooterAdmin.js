import React from "react";

export default function FooterAdmin() {
  return (
    <>
      <footer className="block py-4 justify-bottom">
        <div className="container mx-auto px-4">
          <hr className="mb-4 border-b-1 border-gray-300" />
          <div className="flex flex-wrap items-center md:justify-between justify-center">
            <div className="w-full md:w-4/12 px-4">
              <div className="text-sm text-gray-600 font-semibold py-1 text-center md:text-left">
                Copyright © {new Date().getFullYear()}{" "}
                <a
                  href="https://www.open4g.com"
                  className="text-black hover:text-gray-400 text-sm font-semibold py-1"
                >
                  Open4G Labs
                </a>
              </div>
            </div>
            <div className="w-full md:w-8/12 px-4">
              <ul className="flex flex-wrap list-none md:justify-end  justify-center">
                <li>
                  <a
                    href="https://www.open4g.com"
                    className="text-black hover:text-gray-400 text-sm font-semibold block py-1 px-3"
                  >
                    Open4G Labs
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/sekmet/Baseline-Chain-Dashboard/blob/main/LICENSE.md"
                    className="text-black hover:text-gray-400 text-sm font-semibold block py-1 px-3"
                  >
                    MIT License
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
