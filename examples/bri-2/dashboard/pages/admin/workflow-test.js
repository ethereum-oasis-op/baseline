import React from "react";

import CardWorkflowTest from "components/Cards/CardWorkflowTest.js";
import Admin from "layouts/Admin.js";

export default function WorkflowTest() {
  return (
    <>
      <div className="flex flex-wrap">
        <div className="w-full lg:w-12/12 px-4">
          <CardWorkflowTest />
        </div>
      </div>
    </>
  );
}

WorkflowTest.layout = Admin;
