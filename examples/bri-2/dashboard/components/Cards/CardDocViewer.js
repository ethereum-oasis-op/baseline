import React from "react";
import PropTypes from "prop-types";
import DocViewer from "react-doc-viewer";

// components

export default function CardDocViewer({ color, docs }) {
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
                  "font-semibold text-lg " +
                  (color === "light" ? "text-gray-800" : "text-white")
                }
              >
                Baseline Commit-mgr Tests Report
              </h3>
            </div>
          </div>
        </div>
        <div className="block w-full bg-transparent overflow-x-auto">
            <DocViewer documents={docs} />
        </div>
      </div>
    </>
  );
}

CardDocViewer.defaultProps = {
  color: "light",
};

CardDocViewer.propTypes = {
  color: PropTypes.oneOf(["light", "dark"]),
};