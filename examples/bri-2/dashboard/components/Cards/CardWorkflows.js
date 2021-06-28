import React, { useState } from "react";
import PropTypes from "prop-types";
import WorkflowDropdown from "components/Dropdowns/WorkflowDropdown.js";

const statusIcon = (status) => {
  switch (status) {
    case "active":
      return (
        <>
          <i className="fas fa-circle text-green-500 mr-2"></i> {status}
        </>
      );
    case "invited":
      return (
        <>
          <i className="fas fa-circle text-orange-500 mr-2"></i> {status}
        </>
      );
    case "sent":
      return (
        <>
          <i className="fas fa-circle text-yellow-500 mr-2"></i> {status}
        </>
      );
    case "completed":
      return (
        <>
          <i className="fas fa-circle text-black mr-2"></i> {status}
        </>
      );
    case "closed":
      return (
        <>
          <i className="fas fa-circle text-red-500 mr-2"></i> {status}
        </>
      );
    default:
      return <>{status}</>;
  }
};

const clientLogo = (clientType) => {
  switch (clientType) {
    case "dashboard-test":
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <img
            src={require("assets/img/brand/baselineLogoMark-FullColor.png")}
            alt="baseline icon"
            style={{
              paddingRight: "9px",
              width: "30px",
            }}
          />
          {clientType}
        </div>
      );
    default:
      return <>{clientType}</>;
  }
};

export default function CardWorkflows({
  workflows,
  isLoading,
  isError,
  color,
}) {
  const [rowExpand, setRowExpand] = useState({});

  const openCollapse = (id) => {
    setRowExpand((prevState) => ({ ...prevState, [id]: !prevState[id] }));
    return;
  };

  return (
    <>
      <div
        className={
          "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded " +
          (color === "light" ? "bg-white" : "bg-gray-800 text-white")
        }
      >
        <div className="block w-full overflow-x-auto">
          {/* Projects table */}
          <table className="items-center w-full bg-transparent border-collapse">
            <thead>
              <tr>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-gray-700 text-gray-300 border-gray-600"
                      : "bg-gray-700 text-gray-300 border-gray-600")
                  }
                ></th>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-gray-700 text-gray-300 border-gray-600"
                      : "bg-gray-700 text-gray-300 border-gray-600")
                  }
                >
                  Workflow ID
                </th>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-gray-700 text-gray-300 border-gray-600"
                      : "bg-gray-700 text-gray-300 border-gray-600")
                  }
                >
                  Description
                </th>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-gray-700 text-gray-300 border-gray-600"
                      : "bg-gray-700 text-gray-300 border-gray-600")
                  }
                >
                  Date Created
                </th>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-gray-700 text-gray-300 border-gray-600"
                      : "bg-gray-700 text-gray-300 border-gray-600")
                  }
                >
                  Data Origin
                </th>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-gray-700 text-gray-300 border-gray-600"
                      : "bg-gray-700 text-gray-300 border-gray-600")
                  }
                >
                  Status
                </th>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-gray-700 text-gray-300 border-gray-600"
                      : "bg-gray-700 text-gray-300 border-gray-600")
                  }
                ></th>
              </tr>
            </thead>
            {workflows && workflows.length > 0 ? (
              workflows.map((workflow, index) => {
                return (
                  <tbody>
                    <tr
                      key={workflow._id}
                      style={{ borderTop: "solid 1px rgba(105, 105, 105)" }}
                    >
                      <td>
                        <button onClick={() => openCollapse(index)}>
                          {rowExpand[index] ? (
                            <i class="fas fa-chevron-down px-4 text-gray-700"></i>
                          ) : (
                            <i class="fas fa-chevron-up px-4 text-gray-700"></i>
                          )}
                        </button>
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                        <a
                          href={`/admin/workflows/${workflow._id}`}
                          className="mr-0 inline-block whitespace-no-wrap font-bold"
                          style={{ color: "#4169E1" }}
                        >
                          {workflow._id}
                        </a>
                        <p>{workflow.description}</p>
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                        {workflow.description}
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                        {workflow.createdAt}
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                        {clientLogo(workflow.clientType)}
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                        {statusIcon(workflow.status)}
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4 text-right">
                        <WorkflowDropdown workflowId={workflow._id} />
                      </td>
                    </tr>
                    <tr
                      className={` ${rowExpand[index]
                          ? "visible border-t-2 border-gray-700"
                          : "hidden"
                        } `}
                    >
                      <th></th>
                      <th className="px-6  w-1/2 align-middle py-2 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left text-gray-800">
                        <div className="w-3">Chain Id</div>
                      </th>
                      <td className="border-t-0 px-6 w-1/2 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                        {workflow.chainId}
                      </td>
                      <th className="px-6 align-middle py-2 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left text-gray-800">
                        ZK Circuit Id
                      </th>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                        {workflow.zkCircuitId}
                      </td>
                    </tr>
                    <tr
                      className={`${rowExpand[index] ? "visible" : "hidden"}`}
                    >
                      <th></th>
                      <th className="px-6 align-middle py-2 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left text-gray-800">
                        verifier address
                      </th>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                        {workflow.verifierAddress}
                      </td>
                      <th className="px-6 align-middle py-2 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left text-gray-800">
                        shield Address
                      </th>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                        {workflow.shieldAddress}
                      </td>
                    </tr>
                  </tbody>
                );
              })
            ) : (
              <tbody>
                <tr>
                  <td colSpan="5">
                    <img
                      src={require("assets/img/no-workflows.png")}
                      alt="no workflows image"
                      style={{
                        display: "block",
                        marginLeft: "auto",
                        marginRight: "auto",
                        marginTop: "3rem",
                        marginBottom: "3rem",
                        width: "50%",
                      }}
                    />
                    <div style={{ textAlign: "center" }}>
                      <strong>
                        <a>The are currently no workflows. </a>
                      </strong>
                      <a
                        href="/admin/workflow-test"
                        className="md:pb-2 text-gray-700 mr-0 inline-block whitespace-no-wrap font-bold"
                        style={{ color: "#FF0000" }}
                      >
                        <u>Let's run a test!</u>
                      </a>
                    </div>
                    <div style={{ height: "50px" }}></div>
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        </div>
      </div>
    </>
  );
}

CardWorkflows.defaultProps = {
  color: "light",
};

CardWorkflows.propTypes = {
  color: PropTypes.oneOf(["light", "dark"]),
};
