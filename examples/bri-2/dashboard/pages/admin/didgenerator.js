import React from "react";

import CardDidCreateIdentity from "components/Cards/CardDidCreateIdentity.js";
import CardDidGenerator from "components/Cards/CardDidGenerator.js";
import CardDidVerifyIdentity from "components/Cards/CardDidVerifyIdentity.js";
import Admin from "layouts/Admin.js";

export default function Didgenerator() {
  return (
    <>
      <div className="flex flex-wrap">
      <div className="w-full lg:w-12/12 px-4">
        <CardDidVerifyIdentity />
      </div>
      <div className="w-full lg:w-12/12 px-4">
          <CardDidCreateIdentity />
        </div>
      <div className="w-full lg:w-12/12 px-4">
        <CardDidGenerator />
      </div>
      </div>
    </>
  );
}

Didgenerator.layout = Admin;
