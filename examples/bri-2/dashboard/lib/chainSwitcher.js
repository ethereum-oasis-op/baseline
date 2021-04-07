import axios from "axios"
import { Alert } from "../components/Utils/Alert.js"
import { AlertSwitcher } from "../components/Utils/Switcher.js"
import { commitMgrUrl } from "../components/Forms/FormSettings.js";

export const switchChain = async (network) => {

  await axios.post(`${commitMgrUrl}/switch-chain`, {
      network: network,
    })
    .then((response) => {
        //access the resp here....
        const currentChain = response.data;
        //console.log(`Current Chain: ${currentChain}`);
        AlertSwitcher(process.env.NODE_ENV === 'development' ? 69000 : 9000, 'warning', 'Switching Network Mode...', `Commitment manager reconnecting to a network..`, 'Close now');
        return currentChain;
    })
    .catch((error) => {
        console.log(error);
        Alert('error', 'ERROR...', error);
    });

}