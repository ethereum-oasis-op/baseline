import React from "react";

export default function FooterAdmin() {
  return (
    <>
      <footer 
        style={{
          position: "absolute",
          bottom: "0",
          left: "0",
          width: "100%",
          height: "4rem",
          paddingTop: "10px"
        }}
      >
        <hr style={{
          position: "relative",
          color: "gray",
          paddingBottom: "10px",
          width: "100%"
        }}/>
        <div className="flex flex-wrap items-center md:justify-between justify-center">
          <div className="w-full md:w-4/12 px-4">
            <div className="text-sm text-black font-semibold py-1 text-center md:text-left">
              Est. 2021 {" "}
            </div>
          </div>
          <div className="w-full md:w-8/12 px-4">
            <ul className="flex flex-wrap list-none md:justify-end  justify-center">
              <li>
                <a
                  href="https://github.com/ethereum-oasis/baseline/blob/master/LICENSE"
                  className="text-black hover:text-gray-400 text-sm font-semibold block py-1 px-3"
                >
                  CC0 License
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
}
