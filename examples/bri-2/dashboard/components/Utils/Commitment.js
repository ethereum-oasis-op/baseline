import Swal from 'sweetalert2';
import axios from "axios";
import { commitMgrServerUrl } from "../../configs/commit_mgr.env";

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
          /*return fetch(`http://api.baseline.test/send-commit`)
            .then(response => {
              if (!response.ok) {
                throw new Error(response.statusText)
              }
              return response.json()
            })
            .catch(error => {
              Swal.showValidationMessage(
                `Request failed: ${error}`
              )
            })*/
  
            return await axios.post(`${commitMgrServerUrl}/send-commit`, {
                network: network,
                shieldAddress: shieldContractAddress,
                newCommitment: newCommitment,
                sender: walletAddress ? walletAddress : "0xf17f52151EbEF6C7334FAD080c5704D77216b732"
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