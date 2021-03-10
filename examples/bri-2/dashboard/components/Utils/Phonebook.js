import Swal from 'sweetalert2';
import axios from "axios";
import { workflowMgrUrl } from "../Forms/FormSettings.js";

export function addPhonebook() {
//icon, title, message, buttonText
    Swal.fire({
        title: 'New Phonebook Entry',
        input: 'text',
        inputAttributes: {
          autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Verify and Save',
        showLoaderOnConfirm: true,
        preConfirm: async (newEntry) => {
          
            try {
             
              if (!newEntry) {
                throw new Error("No domain to validate...");
              }
    
              return await axios.post(`${workflowMgrUrl}/organizations`, {
                  domain: newEntry
                })
                .then(response => {
  
                    //access the resp here....
                    console.log(`Status New Phonebook : ${response.data.domain}`);
                    Swal.fire({
                      icon: 'success',
                      title: `New phonebook entry saved with success...`,
                      text: `Domain: ${response.data.domain}`
                    });
                    //return response.data;
                })
                .catch(error => {
                    //console.log(error);
                    Swal.showValidationMessage(
                      `${error}`
                    )
                });


            } catch (error) {
              Swal.showValidationMessage(
                `${error}`
              )
            }            

        },
        allowOutsideClick: () => !Swal.isLoading()
      }).then( result => {
        if (result.domain) {
          Swal.fire({
            icon: 'success',
            title: `New  phonebook entry saved with success...`,
            message: `Domain: ${result.domain}`
          })
        }
      })

}