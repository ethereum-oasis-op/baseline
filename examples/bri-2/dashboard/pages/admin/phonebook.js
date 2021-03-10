import React from "react";

import CardPhonebook from "components/Cards/CardPhonebook.js";
import Admin from "layouts/Admin.js";

export default function Phonebook() {
  return (
    <>
      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 px-4">
          <CardPhonebook />
        </div>
      </div>
    </>
  );
}

Phonebook.layout = Admin;
