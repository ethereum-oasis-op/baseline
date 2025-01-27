import React, { useState } from "react";
import Modal from "react-modal";
import PropTypes from "prop-types";
import useSwr from 'swr';
import axios from "axios";
import { workflowMgrUrl } from "../Forms/FormSettings.js";
import PhonebookDropdown from "../Dropdowns/PhonebookDropdown.js";
// components


const fetcher = (url) => fetch(url).then((res) => res.json());

const modalStyle = {
  overlay: {
    backgroundColor       : 'rgba(191, 191, 191, 0.75)'
  },
  content : {
    top                   : '40%',
    left                  : '55%',
    right                 : 'auto',
    bottom                : 'auto',
    transform             : 'translate(-50%, -50%)',
    border                : '3px solid #000',
  }
};

export default function CardPhonebook({ color }) {

  const { data: orgs, error } = useSwr(`${workflowMgrUrl}/organizations`, { refreshInterval: 3000, fetcher: fetcher });

  const [modalIsOpen,setIsOpen] = useState(false);
  function openModal() { setIsOpen(true); }
  function closeModal() { setIsOpen(false); }
  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    //subtitle.style.color = '#f00';
  }

  const [contactName, setContactName] = useState("");
  const handleNameChange = (e) => {
    setContactName(e.target.value);
  }

  const [messengerUrl, setMessengerUrl] = useState("");
  const handleMessengerChange = (e) => {
    setMessengerUrl(e.target.value);
  }

  const [signingKey, setSigningKey] = useState("");
  const handleSigningKeyChange = (e) => {
    setSigningKey(e.target.value);
  }

  const createContact = (e) => {
    //e.preventDefault();
    console.log('Creating commit using auto message');
    axios.post(`${workflowMgrUrl}/organizations`, {
      name: contactName,
      messengerUrl,
      signingKey
    });
  }

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
                  "font-semibold text-base " +
                  (color === "light" ? "text-gray-800" : "text-white")
                }
              >
              Baseline Phonebook
              </h3>
            </div>
            <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
              <button
                className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={openModal}
              >
                + Add Contact
              </button>
              <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={modalStyle}
                contentLabel="New Contact"
                ariaHideApp={false}
              >
                <div className="rounded-t bg-white mb-2 px-6 py-1">
                  <div className="text-center flex justify-between">
                    <h6 className="text-gray-800 text-xl font-bold">Add New Contact</h6>
                    <button
                    className="bg-gray-800 active:bg-green-700 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                    type="submit"
                    >
                    Import Via DID
                    </button>
                  </div>
                </div>
                <hr style={{
                  position: "relative",
                  color: "gray",
                  paddingBottom: "10px",
                  width: "100%"
                }}/>
                  <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                    <h6 className="text-gray-500 text-sm mt-3 mb-3 font-bold uppercase">
                      New Contact Info.
                    </h6>
                    <div className="flex flex-wrap">
                      <div className="w-full lg:w-6/12 px-6">
                        <div className="relative w-full mb-3">
                          <label className="uppercase text-gray-700 text-xs font-bold mb-2" >
                            Contact Name
                          </label>
                          <input 
                            className="px-6 py-2 rounded shadow text-gray-700"
                            type="text"
                            name="contactName"
                            placeholder="Enter contact name..."
                            value={contactName}
                            onChange={handleNameChange}
                          />
                        </div>
                        <div>
                          <label className="uppercase text-gray-700 text-xs font-bold mb-2" >
                            Messenger Url
                          </label>
                          <input
                            className="px-6 py-2 mr-2 rounded shadow text-gray-700"
                            type="text"
                            name="messengerUrl"
                            placeholder="Enter messenger URL..."
                            value={messengerUrl} 
                            onChange={handleMessengerChange}
                          />
                        <div>
                          <label className="uppercase text-gray-700 text-xs font-bold" >
                            ZKP Signing Key
                          </label>
                          <input
                            className="px-6 py-2 mr-2 rounded shadow text-gray-700"
                            type="text"
                            name="signingKey"
                            placeholder="Enter signing key..."
                            value={signingKey} 
                            onChange={handleSigningKeyChange}
                          />
                        </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => { 
                      createContact(); 
                      closeModal() }}
                    type="button"
                    className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  >Submit</button>
                  <button 
                    onClick={closeModal}
                    className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  >Close</button>
              </Modal>
            </div>
          </div>
        </div>   

        <div className="block w-full overflow-x-auto" style={{ minHeight: "449px"}}>
          {/* Phonebook table */}
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
                >
                  Name
                </th>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-gray-700 text-gray-300 border-gray-600"
                      : "bg-gray-700 text-gray-300 border-gray-600")
                  }
                >
                  Messenger URL
                </th>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-gray-700 text-gray-300 border-gray-600"
                      : "bg-gray-700 text-gray-300 border-gray-600")
                  }
                >
                  Signing Key
                </th>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-gray-700 text-gray-300 border-gray-600"
                      : "bg-gray-700 text-gray-300 border-gray-600")
                  }
                >
                  DID Verified
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

            <tbody>
              { (orgs && orgs.length > 0)
                ? orgs.map(( org, index ) => {
                  return (
                    <tr key={org._id} style={{
                      "borderTop":"solid 1px rgba(105, 105, 105)"
                    }}>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                        {org.name}
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                        {org.messengerUrl}
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                        {org.signingKey}
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                        {org.did ? "true" : "false"}
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4 text-right">
                        <PhonebookDropdown orgId={org._id}/>
                      </td>
                    </tr>
                  );
                })
                : <tr>
                    <td colSpan="5">
                    <img
                      src={require("assets/img/no-workflows.png")}
                      alt="no workflows image"
                      style={{
                        display: "block",
                        "marginLeft": "auto",
                        "marginRight": "auto",
                        "marginTop": "3rem",
                        "marginBottom": "3rem",
                        width: "50%"
                      }}
                    />
                    <div style={{"textAlign": "center"}}>
                      <strong>
                        <a>You don't have any contacts yet. </a>
                      </strong>
                      <a
                        href="/admin/workflow-test"
                        className="md:pb-2 text-gray-700 mr-0 inline-block whitespace-no-wrap font-bold"
                        style={{color:"#FF0000"}}
                      ><u>Let's create one!</u></a>
                    </div>
                    <div style={{height:"50px"}}></div>
                    </td>
                  </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

CardPhonebook.defaultProps = {
  color: "light",
};

CardPhonebook.propTypes = {
  color: PropTypes.oneOf(["light", "dark"]),
};
