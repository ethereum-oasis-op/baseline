import Swal from 'sweetalert2';
import axios from "axios";
import { commitMgrUrl } from "../Forms/FormSettings.js";

export function SendCommitment(walletAddress, shieldContractAddress, network) {
//icon, title, message, buttonText
    Swal.fire({
        title: 'New Commitment',
        input: 'text',
        inputAttributes: {
          autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Commit Value',
        showLoaderOnConfirm: true,
        preConfirm: async (newCommitment) => {
            return await axios.post(`${commitMgrUrl}/jsonrpc`, {
                                jsonrpc: "2.0",
                                method: "baseline_verifyAndPush",
                                params: [
                                  walletAddress ? walletAddress : "0xf17f52151EbEF6C7334FAD080c5704D77216b732", // sender
                                  shieldContractAddress,
                                  5, // proof
                                  [ "0x8222222222222222222222222222222222222222222222222222222222222222" ], // public inputs
                                  newCommitment
                                ],
                                id: 1,
                              })
                              .then((response) => {
                                  //access the resp here....
                                  console.log(`Status New Commitment : ${response.data.txHash}`);
                                  //Alert('success', 'Contracts Deployed...', `Contracts deployed with success into ${network} network..`);
                                  return response.data;
                              })
                              .catch((error) => {
                                  console.log(error);
                                  Swal.showValidationMessage(
                                    `Request failed: ${error}`
                                  )
                              });
        },
        allowOutsideClick: () => !Swal.isLoading()
      }).then((result) => {
        if (result.txHash) {
          Swal.fire({
            icon: 'success',
            title: `New commitment sent with success...`,
            message: `Tx Hash: ${result.txHash}`
            //imageUrl: result.value.avatar_url
          })
        }
      })

}