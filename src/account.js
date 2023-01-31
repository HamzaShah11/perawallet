




async function connectAlgoWallet() {
    try {
        const accounts = await myAlgoWallet.connect();
        const addresses = accounts.map(account => account.address);
        console.log("wallet Address", addresses);
    } catch (err) {
        console.error(err);
    }
}
const algodClien = new algosdk.Algodv2('', 'https://node.algoexplorerapi.io/', 443);

/*Warning: Browser will block pop-up if user doesn't trigger myAlgoWallet.connect() with a button interation */
async function signTransaction(from, to, amount, suggestedParams) {
    try {
        const txn = algosdk.makePaymentTxnWithSuggestedParams({ suggestedParams, from, to, amount });
        const signedTxn = await myAlgoWallet.signTransaction(txn.toByte());
        const response = await algodClien.sendRawTransaction(signedTxn.blob).do();
        console.log(response)
    } catch (err) {
        console.error(err);
    }
};