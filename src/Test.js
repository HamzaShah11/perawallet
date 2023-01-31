import MyAlgoConnect from '@randlabs/myalgo-connect';
import { useEffect, useState } from "react"
import './App.css';
const algosdk = require('algosdk');
const myAlgoWallet = new MyAlgoConnect();


function Test() {

    async function connectAlgoWallet() {
        try {
            const accounts = await myAlgoWallet.connect();
            console.log("accounts", accounts);
            const addresses = accounts.map(account => account.address);
            setWallet(addresses)
            console.log("address1:", addresses.toString());
            console.log("address3:", AccountC);

        } catch (err) {
            console.error(err);
        }
    }
    let note = undefined;
    let addr = Wallet[0];
    let defaultFrozen = false;
    let decimals = 0;
    let totalIssuance = 1;
    let unitName = "testing123";
    let assetName = "Dragon123";
    let assetURL = "https://randlabs.mypinata.cloud/ipfs/QmY5VWBokbeBzxQtZwBGPqjDJZEvWyEVJgu2Ybwg8eRbNL";
    let assetMetadataHash = "16efaa3924a6fd9d3a4824799a4ac65d";
    let manager = Wallet[0];
    let reserve = undefined;
    let freeze = undefined;
    let clawback = undefined;
    var assetID = 0;
    let rawSignedTxn = 0;
    let confirmedTxn = 0;
    var amount = 0;
    let sender = 0;
    let recipient = 0;
    let revocationTarget = 0;
    let closeRemainderTo = 0;


    const CreateNFT = async function () {
        try {
            console.log("--------------------------------------------Create Asset FUNCTION--------------------------------------------------");
            // params = await algodClient.getTransactionParams().do();
            let txn = algosdk.makeAssetCreateTxnWithSuggestedParams(
                addr,
                note,
                totalIssuance,
                decimals,
                defaultFrozen,
                manager,
                reserve,
                freeze,
                clawback,
                unitName,
                assetName,
                assetURL,
                assetMetadataHash,
                params);

            rawSignedTxn = await myAlgoWallet.signTransaction(txn.toByte());
            const ftx = await algodClient.sendRawTransaction(rawSignedTxn.blob).do();
            console.log("Trasaction id: ", ftx.txId)
            // Get the new asset's information from the creator account
            assetID = ftx["asset-index"];
            console.log("assetID: ", assetID);
            setAsets1(assetID)
            //Get the completed Transaction
            console.log("Transaction " + ftx.txId + " confirmed in round " + ftx["confirmed-round"]);
            console.log("assetid", temp);
        } catch (er) {
            console.log(er);
        }

        return (
            <div className='Test'>
                <button onClick={connectAlgoWallet}> connect wallet</button>
                <button onClick={CreateNFT}> CreateNFT</button>
            </div>
        );
    }
}
export default Test;