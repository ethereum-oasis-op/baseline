import React from "react";
import axios from "axios";
import { Alert } from "../Utils/Alert";
import { commitMgrUrl } from "../Forms/FormSettings.js";

function CheckIsValidDomain(domain) { 
  var re = new RegExp(/^((?:(?:(?:\w[\.\-\+]?)*)\w)+)((?:(?:(?:\w[\.\-\+]?){0,62})\w)+)\.(\w{2,6})$/); 
  return domain.match(re);
} 

export default class CardCreateIdentity extends React.Component {

  constructor(props) {
    super(props);
  

  this.state = {
    useActive: false,
    domainname: '',
    hasError: false,
    errorMessage: '',
    canSubmit: false,
    resultJson: false,
    isGenerating: false,
    didIdentity: false
  }

  }

 onChange = (e) => {
      //console.log(`${e.target.name} = ${e.target.value}`);
      this.setState({[e.target.name]: e.target.value});
      if (e.target.value.length >= 3) {
        this.setState({useActive: true});
      } else {
        this.setState({hasError: false, errorMessage: '', useActive: false, canSubmit: false, resultJson: false});
      }

  }

  onSubmit = async (e) => {
    e.preventDefault();
    // get our form data out of state
    if (CheckIsValidDomain(this.state.domainname)){
      this.setState({canSubmit: true, hasError: false, errorMessage: '', isGenerating: true});

      return await axios.post(`${commitMgrUrl}/did-create-identity`, { domain: this.state.domainname } )
        .then((response) => {
            //access the resp here....
            var payload = response.data;
            console.log(`DID identity: ${JSON.stringify(payload, undefined, 2)}`);
            this.setState({
                canSubmit: false,
                resultJson: JSON.stringify(payload, undefined, 2),
                domain: "",
                didIdentity: payload.did,
                hasError: false,
                isGenerating: false
            });

            Alert('success', 'DID Identity Generated...', 'DID identity created with success...');
        })
        .catch((error) => {
            console.log(error);
            this.setState({
                hasError: true,
                resultJson: false,
                isGenerating: false,
                errorMessage: "OOPS that didn't work :(",
            });
            Alert('error', 'ERROR...', "OOPS that didn't work :(");
        });

    } else {
      this.setState({hasError: true, errorMessage: 'Domain is not valid!', resultJson: false});
      return false;
    }

  }

  render() {

    const { domainname, useActive, hasError, errorMessage, isGenerating, resultJson, didIdentity } = this.state;
    return (
      <>
      <form onSubmit={this.onSubmit}>
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-gray-200 border-0">
          <div className="rounded-t bg-white mb-0 px-6 py-6">
            <div className="text-center flex justify-between">
              <h6 className="text-gray-800 text-xl font-bold">Create DID Identity</h6>
              <button
                className={ useActive
                  ? "bg-gray-800 active:bg-gray-700 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                  : "bg-gray-200 text-white font-bold uppercase text-xs px-4 py-2 rounded mr-1"
                }
                disabled={ useActive ? '' : 'disabled'}
                type="submit"
              >
                Create DID Identity
              </button>
            </div>
          </div>
          <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
              <h6 className="text-gray-500 text-sm mt-3 mb-6 font-bold uppercase">
                Create a DID Identity for a domain
              </h6>
              <div className="flex flex-wrap">

              <div className="w-full lg:w-12/12 px-4">
                  <div className="relative w-full mb-3">
                  <label
                      className="block uppercase text-gray-700 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                  >
                      Domain Name (ex. domain.com)
                  </label>
                  <input
                      name="domainname"
                      value={domainname}
                      onChange={this.onChange}
                      type="text"
                      className="px-3 py-3 placeholder-gray-400 text-gray-700 mb-2 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150"
                  />
                  <span className="px-3 py-3 text-red-500 text-md mt-2 font-bold">{hasError ? errorMessage : ''}</span>
                  </div>
              </div>
              {isGenerating ? <h3>Generating DID Identity...please wait</h3>: ''}
              {resultJson ? <div className="w-full lg:w-12/12 px-4">
                  <div className="relative w-full mb-3">
                  <label
                      className="block uppercase text-gray-700 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                  >
                      DID Identity for {domainname} 
                  </label>
                  <input
                      name="dididentity"
                      value={didIdentity}
                      disabled="disabled"
                      type="text"
                      className="px-3 py-3 placeholder-gray-400 text-green-500 mb-2 bg-white rounded text-sm shadow outline-none shadow-outline w-full ease-linear transition-all duration-150"
                  />
                  <textarea
                      type="text"
                      className="px-3 py-3 placeholder-gray-400 text-green-500 bg-white rounded text-sm shadow outline-none shadow-outline w-full ease-linear transition-all duration-150"
                      rows="9"
                      defaultValue={resultJson}
                  ></textarea>
                  </div>
              </div> : ''}

              </div>
          </div>
        </div>
        </form>
      </>
    );
  }
}
