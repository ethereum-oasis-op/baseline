const Web3 = require('web3');
const UI = require('./ui');
const fs = require('fs');

// Useful constants
const DEFAULT_CHANNEL = "default";
const DEFAULT_TOPIC = "0x11223344";
const PRIVATE_MESSAGE_REGEX = /^\/priv (0x[A-Za-z0-9]{130}) (.*)$/;

const POW_TIME = 100;
const TTL = 20;
const POW_TARGET = 2;

(async () => {
    // Establish Web3 connection
    const web3 = new Web3();
    try {
        web3.setProvider(new Web3.providers.WebsocketProvider("ws://localhost:8548", { headers: { Origin: "mychat2" } }));
        await web3.eth.net.isListening();
    } catch (err) {
        process.exit();
    }

    const ui = new UI();

    // Generate keypair
    const keyPair = await web3.shh.newKeyPair();

    // Obtain public key
    const pubKey = await web3.shh.getPublicKey(keyPair);
    fs.writeFile('pubKey2.txt', pubKey, (err) => {
        if (err) console.log(err);
    })

    ui.setUserPublicKey(pubKey);

    // Generate a symmetric key
    const channelSymKey = await web3.shh.generateSymKeyFromPassword(DEFAULT_CHANNEL);

    const channelTopic = DEFAULT_TOPIC;

    ui.events.on('cmd', async (message) => {
        try {
            if (message.startsWith('/priv')) {
                if (PRIVATE_MESSAGE_REGEX.test(message)) {
                    const msgParts = message.match(PRIVATE_MESSAGE_REGEX);
                    const contactCode = msgParts[1];
                    const messageContent = msgParts[2];

                    // Send private message
                    web3.shh.post({
                        pubKey: contactCode,
                        sig: keyPair,
                        ttl: TTL,
                        topic: channelTopic,
                        payload: web3.utils.fromAscii(messageContent),
                        powTime: POW_TIME,
                        powTarget: POW_TARGET
                    });

                    // Since it is a private message, we need to display it in the UI
                    ui.addMessage(pubKey, messageContent, true);
                }
            } else {
                // Send a public message
                web3.shh.post({
                    symKeyID: channelSymKey,
                    sig: keyPair,
                    ttl: TTL,
                    topic: channelTopic,
                    payload: web3.utils.fromAscii(message),
                    powTime: POW_TIME,
                    powTarget: POW_TARGET
                });

            }
        } catch (err) {
            console.log(err);
            ui.addError("Couldn't send message: " + err.message);
        }
    });

    // Subscribe to public chat messages
    web3.shh.subscribe("messages", {
        minPow: POW_TARGET,
        symKeyID: channelSymKey,
        topics: [channelTopic]
    }).on('data', (data) => {
        // Display message in the UI
        ui.addMessage(data.sig, web3.utils.toAscii(data.payload));
    }).on('error', (err) => {
        ui.addError("Couldn't decode message: " + err.message);
    });

    // Subscribe to private messages
    web3.shh.subscribe("messages", {
        minPow: POW_TARGET,
        privateKeyID: keyPair,
        topics: [channelTopic]
    }).on('data', (data) => {
        ui.addMessage(data.sig, web3.utils.toAscii(data.payload), true);
    }).on('error', (err) => {
        ui.addError("Couldn't decode message: " + err.message);
    });

})();