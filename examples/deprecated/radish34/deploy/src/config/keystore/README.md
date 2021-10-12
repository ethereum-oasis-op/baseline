To generate new keystores quickly:

`$ node`
`> ethers = require('ethers');`
`> let mnemonic = 'tonight that cargo whale help credit essence hold actress raven liberty puppy'`
`> let mnemonicWallet = ethers.Wallet.fromMnemonic(mnemonic, 'm/2');` (change the 'path' from 'm/2' to some other path and you'll get a different wallet)
`JSON.stringify(mnemonicWallet);`
