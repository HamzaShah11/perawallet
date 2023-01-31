
import MyAlgoConnect from '@randlabs/myalgo-connect';
import { useEffect, useState } from "react"
import './App.css';
import { PeraWalletConnect } from "@perawallet/connect";
const algosdk = require('algosdk');

const myAlgoWallet = new MyAlgoConnect();
const peraWallet = new PeraWalletConnect();

function App() {

  const algodToken = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
  const algodServer = 'http://localhost';
  const algodPort = 4001;
  let algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);


  const [account_1, setSecret] = useState([]);
  const [account_2, setSecret2] = useState([]);
  const [account_3, setSecret3] = useState([]);
  const [FungTokenAccount, setFta] = useState();

  const [Wallet, setWallet] = useState("");
  const [Asets, setAsets] = useState("");
  const [disp, setdisp] = useState("");
  const [params, setParam] = useState("");
  const [temp, setAsets1] = useState([]);
  const [tempaset0, setAsets0] = useState([]);

  const AccountB = "VRWVGZLXZRFIE5FEPM36G26VKCPGFCX25BRVCNWAEVUBB752VCAB6Q3OQM"  //user account
  const AccountC = "6WTMXCIIGH3E2N5QM67KFJ2B4AXKU64KGV57O7BPVTZUJHKLPSPYUHIZPU" //global account

  // const peraadr = "";

  const [accountAddressPera, setAccountAddress] = useState([]);
  const isConnectedToPeraWallet = !!accountAddressPera;
  const [peraaddress, setPeraddr] = useState("")
  useEffect(() => {
    // Reconnect to the session when the component is mounted
    peraWallet.reconnectSession().then((accounts) => {
      // Setup the disconnect event listener
      peraWallet.connector?.on("disconnect", handleDisconnectWalletClick);

      if (accounts.length) {
        console.log("accounts2", accounts[0]);
        // peraadr = accounts[0]
        setPeraddr(accounts[0])
        // setAccountAddress(accounts[0]);
      }
    });
  }, []);


  function handleConnectWalletClick() {
    peraWallet
      .connect()
      .then((newAccounts) => {
        // Setup the disconnect event listener
        peraWallet.connector?.on("disconnect", handleDisconnectWalletClick);
        setAccountAddress(newAccounts[0]);
        window.location.reload()

      })
      .catch((error) => {
        // You MUST handle the reject because once the user closes the modal, peraWallet.connect() promise will be rejected.
        // For the async/await syntax you MUST use try/catch
        if (error?.data?.type !== "CONNECT_MODAL_CLOSED") {
          // log the necessary errors
        }
      });
  }

  function handleDisconnectWalletClick() {
    peraWallet.disconnect();

    setAccountAddress(null);
  }




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

  //Reward
  // async function reward() {
  //   try {

  //     let rwd = await algodClient.accountInformation(Wallet[0]).do();
  //     console.log("Account 1 balance: %d microAlgos", rwd.amount);
  //     console.log("Wallet Address: ", Wallet[0]);
  //     if (rwd.amount <= "1") {
  //       console.log("Insufiecet funds ! ");
  //     }
  //     else {
  //       console.log("Enoguh balance");
  //       let params = await algodClient.getTransactionParams().do();
  //       params.fee = algosdk.ALGORAND_MIN_TX_FEE;
  //       params.flatFee = true;

  //       let txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
  //         from: Wallet[0],
  //         to: "YAPDHMQ4TM5AMH463WG4VNNFYICRKFFZMCAEWDE2XMOAZJ6YAZ4MSN2ZFU",
  //         amount: 1000000,
  //         suggestedParams: params
  //       });
  //       const signedTxn = await myAlgoWallet.signTransaction(txn.toByte());
  //       const response = await algodClient.sendRawTransaction(signedTxn.blob).do();
  //       console.log("Trasaction id: ", response.txId)

  //     }
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };
  useEffect(() => {
    console.log(peraaddress);
  }, [peraaddress])

  const forParams = async () => {
    let params = await algodClient.getTransactionParams().do();
    setParam(params)
  }
  let note = undefined;
  let addr = Wallet[0];
  let defaultFrozen = false;
  let decimals = 0;
  let totalIssuance = 1;
  let unitName = "TLH#0014";
  let assetName = "The Lighthouse #0014";
  let assetURL = "https://ipfs.algonft.tools/ipfs/bafybeie6m5rrv33tl6rnqwe75rymvj7unkv4nf3scxgufhzylpphk3z5qe";
  let assetMetadataHash = "16efaa3924a6fd9d3a4824799a4ac65d";
  let manager = Wallet[0];
  let reserve = undefined;
  let freeze = undefined;
  let clawback = undefined;
  var assetID;
  let rawSignedTxn = 0;
  let confirmedTxn = 0;
  var amount = 0;
  let sender = 0;
  let recipient = 0;
  let revocationTarget = 0;
  let closeRemainderTo = 0;

  const ftToken = async () => {
    console.log("wallet 0", Wallet);
    try {
      let fttxn = algosdk.makeAssetCreateTxnWithSuggestedParams(
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
      console.log("address", addr);
      rawSignedTxn = await myAlgoWallet.signTransaction(fttxn.toByte());
      const ftx = await algodClient.sendRawTransaction(rawSignedTxn.blob).do();
      console.log("Trasaction id: ", ftx.txId)
      const ptx = await algosdk.waitForConfirmation(algodClient, ftx.txId, 4);
      // // Get the new asset's information from the creator account
      assetID = ptx["asset-index"];
      console.log("assetID: ", assetID);
      setAsets0(assetID)


      //Get the completed Transaction
      console.log("Transaction " + ftx.txId + " confirmed in round " + ptx["confirmed-round"]);
    } catch (er) {
      console.log(er);
    }
  }
  const globle = async () => {

    console.log("-----------------------------opting in global account---------------------------");

    // let temp1 = 156005554
    // setAsets1(temp1)
    console.log("assetID temp", tempaset0);
    sender = AccountC;//claimer account
    recipient = sender;
    revocationTarget = undefined;
    closeRemainderTo = undefined;
    amount = 0;
    let claimtxn = algosdk.makeAssetTransferTxnWithSuggestedParams(
      sender,
      recipient,
      closeRemainderTo,
      revocationTarget,
      amount,
      note,
      tempaset0,
      params);
    let rawSignedTxn = claimtxn.signTxn(FungTokenAccount.sk)
    let txa = await algodClient.sendRawTransaction(rawSignedTxn).do()
    console.log("Asset Creation Txn : " + txa.txId);

    console.log("-----------------------------Transfering FT to Global account---------------------------");
    sender = Wallet[0]; //Global Account
    recipient = AccountC; //claimer Account
    revocationTarget = undefined;
    closeRemainderTo = undefined;
    let aamount = 1;
    // signing and sending "txn" will send "amount" assets from "sender" to "recipient"
    let xtxn = algosdk.makeAssetTransferTxnWithSuggestedParams(
      sender,
      recipient,
      closeRemainderTo,
      revocationTarget,
      aamount,
      note,
      tempaset0,
      params);
    rawSignedTxn = await myAlgoWallet.signTransaction(xtxn.toByte());
    let xtxea = await algodClient.sendRawTransaction(rawSignedTxn.blob).do();
    console.log("Asset Creation Txn : " + xtxea.txId);
  }
  const ClaimNFT = async () => {
    try {

      console.log("-----------------------------opting in user account---------------------------");
      let Asetidd = 155890732
      let sendeR = "VRWVGZLXZRFIE5FEPM36G26VKCPGFCX25BRVCNWAEVUBB752VCAB6Q3OQM";//claimer account
      let recipienT = sendeR;
      revocationTarget = undefined;
      closeRemainderTo = undefined;
      const Aamount = 0;
      let note1 = undefined
      let claimtxnn = algosdk.makeAssetTransferTxnWithSuggestedParams(
        sendeR,
        recipienT,
        closeRemainderTo,
        revocationTarget,
        Aamount,
        note1,
        Asetidd,
        params);
      let rawSignedTxnnn = await myAlgoWallet.signTransaction(claimtxnn.toByte());
      let xtxeaa = await algodClient.sendRawTransaction(rawSignedTxnnn.blob).do();
      console.log("Asset Creation Txn : " + xtxeaa.txId);

      // console.log("-----------------------------Tranfering FT from Global account to user---------------------------");
      // let Asetid = 145238564
      // let sender = AccountC;//global account
      // let recipient = AccountB; //user account
      // let note = undefined;
      // let amount = 1000;
      // revocationTarget = undefined;
      // closeRemainderTo = undefined;
      // console.log(sender, recipient);
      // console.log("AssetID", Asetid);

      // let rtxn = algosdk.makeAssetTransferTxnWithSuggestedParams(
      //   sender,
      //   recipient,
      //   closeRemainderTo,
      //   revocationTarget,
      //   amount,
      //   note,
      //   Asetid,
      //   params);
      // let rawSignedTxn = rtxn.signTxn(FungTokenAccount.sk)
      // let tx = await algodClient.sendRawTransaction(rawSignedTxn).do()
      // console.log("Asset Creation Txn : " + tx.txId);


    } catch (er) {
      console.log(er);
    }
  }
  ////////////////////////////////////////////// functions not in use///////////////////////////////////////////////////////////
  const sendtkn = async function () {
    try {

      console.log("//////////////////////////////////////////////////sending token //////////////////////////////////////////");
      sender = AccountC;
      recipient = AccountB;
      console.log(recipient, sender);
      revocationTarget = undefined;
      closeRemainderTo = undefined;
      amount = 1;
      let Txtxn = algosdk.makeAssetTransferTxnWithSuggestedParams(
        sender,
        recipient,
        closeRemainderTo,
        revocationTarget,
        amount,
        note,
        temp,
        params);
      rawSignedTxn = await myAlgoWallet.signTransaction(Txtxn.toByte());
      const txx = await algodClient.sendRawTransaction(rawSignedTxn.blob).do();
      console.log("Trasaction id: ", txx.txId)
    } catch (error) {
      console.log("err", error);
    }
  }
  const createAccount = async function () {
    try {

      // const account1 = algosdk.mnemonicToSecretKey("arctic similar one present bonus return egg nurse boy deny just correct absent feel police brief between into same company churn need good able position");
      // console.log(account1.addr) // L5XELS4JDPOPNGVYBSBIT533ZF6I3TKDHXCZH5AWFWEGY6RQ7BE654R2UM

      //Create account 1
      const account1 = algosdk.generateAccount();
      setSecret(account1)
      // console.log("account1 Address=" + account1.addr)
      // let account_mnemonic1 = algosdk.secretKeyToMnemonic(account1.sk);
      // console.log("account Mnemonic= " + account_mnemonic1);
      // console.log("Account creted. Save of nmemonic and address");
      // console.log("Add funds to account using the TestNet Dispenser: ");
      console.log("https://dispenser.testnet.aws.algodev.network/?account=" + account1.addr);
      let dispence1 = "https://dispenser.testnet.aws.algodev.network/?account=" + account1.addr
      setdisp(dispence1)


      // const account2 = algosdk.mnemonicToSecretKey("around erupt story wrap special energy soul tail dinosaur inhale sketch opera filter core news cement humble again fence unusual answer depart still absorb hello");
      // console.log(account2.addr) // SH722776IEBD7DFQTR7IDD63NGMWNBKF553YWJBZZR5SU5XIFM23H76KZE

      //Create Account 2
      const account2 = algosdk.generateAccount();
      setSecret2(account2)
      console.log("account2 Address=" + account2.addr)
      // let account_mnemonic2 = algosdk.secretKeyToMnemonic(account2.sk);
      // console.log("account Mnemonic= " + account_mnemonic2);
      // console.log("Account creted. Save of nmemonic and address");
      // console.log("Add funds to account using the TestNet Dispenser: ");
      console.log("https://dispenser.testnet.aws.algodev.network/?account=" + account2.addr);
      let dispence2 = "https://dispenser.testnet.aws.algodev.network/?account=" + account2.addr
      setdisp(dispence2)

      // const account3 = algosdk.mnemonicToSecretKey("ivory oyster elite release route churn result crack fashion similar update wonder anchor bean entry flush tunnel catch fence rain fork jeans nuclear absent situate");
      // console.log(account3.addr) // SUK64DMYFFZPWQ4A2J64PT4ZYCKKQBBTQAQZTTCKXIUPZSX5OMX7NPY5LM

      //Create Account 3
      const account3 = algosdk.generateAccount();
      setSecret3(account3)
      console.log("account3 Address=" + account3.addr)
      // let account_mnemonic3 = algosdk.secretKeyToMnemonic(account3.sk);
      // console.log("account Mnemonic= " + account_mnemonic3);
      // console.log("Account creted. Save of nmemonic and address");
      // console.log("Add funds to account using the TestNet Dispenser: ");
      console.log("https://dispenser.testnet.aws.algodev.network/?account=" + account3.addr);
      let dispence3 = "https://dispenser.testnet.aws.algodev.network/?account=" + account3.addr
      setdisp(dispence3)




      const FtAccount = await algosdk.mnemonicToSecretKey("pool estate obscure endless just system pair lunch floor master trash balcony nest tumble bundle lift finish sweet degree edit express mountain enter ability bring");
      setFta(FtAccount)
      console.log("FungTokenAccount", FungTokenAccount.addr);

    } catch (e) {
      console.log(e);
    }
  }
  async function checkBalance() {
    let accountInfo1 = await algodClient.accountInformation(account_1.addr).do();
    console.log("Account 1 balance: %d microAlgos", accountInfo1.amount);

    let accountInfo2 = await algodClient.accountInformation(account_2.addr).do();
    console.log("Account B balance: %d microAlgos", accountInfo2.amount);

    let accountInfo3 = await algodClient.accountInformation(account_3.addr).do();
    console.log("Account C balance: %d microAlgos", accountInfo3.amount);
  }

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

      // console.log("--------------------------------------------MODIFYING FUNCTION--------------------------------------------------");
      // console.log("assetID", assetID);
      // manager = account_1.addr;
      // let ctxn = algosdk.makeAssetConfigTxnWithSuggestedParams(
      //   account_2.addr,
      //   note,
      //   assetID,
      //   manager,
      //   reserve,
      //   freeze,
      //   clawback,
      //   params);

      // // This transaction must be signed by the current manager
      // rawSignedTxn = ctxn.signTxn(account_2.sk)
      // let ctx = (await algodClient.sendRawTransaction(rawSignedTxn).do());
      // // Wait for confirmation
      // confirmedTxn = await algosdk.waitForConfirmation(algodClient, ctx.txId, 4);
      // // //Get the completed Transaction
      // console.log("Transaction " + ctx.txId + " confirmed in round " + confirmedTxn["confirmed-round"]);
      // // Get the asset information for the newly changed asset
      // // use indexer or utiltiy function for Account info
      // // The manager should now be the same as the creator

      console.log("-------------------------------------------RECIEVING ASSET FUNCTION----------------------------------------");
      // Opting in to transact with the new asset
      // Allow accounts that want recieve the new asset
      // Have to opt in. To do this they send an asset transfer
      // of the new asset to themseleves 
      // In this example we are setting up the 3rd recovered account to 
      // receive the new asset

      // First update changing transaction parameters
      // We will account for changing transaction parameters
      // before every transaction in this example

      //comment out the next two lines to use suggested fee
      // params.fee = 1000;
      // params.flatFee = true;

      console.log("assetID", assetID);
      sender = account_3.addr;
      recipient = sender;
      // We set revocationTarget to undefined as 
      // This is not a clawback operation
      revocationTarget = undefined;
      // CloseReaminerTo is set to undefined as
      // we are not closing out an asset
      closeRemainderTo = undefined;
      // We are sending 0 assets

      amount = 0;
      // signing and sending "txn" allows sender to begin accepting asset specified by creator and index
      let opttxn = algosdk.makeAssetTransferTxnWithSuggestedParams(
        sender,
        recipient,
        closeRemainderTo,
        revocationTarget,
        amount,
        note,
        assetID,
        params);

      // Must be signed by the account wishing to opt in to the asset    
      rawSignedTxn = opttxn.signTxn(account_3.sk);
      let opttx = (await algodClient.sendRawTransaction(rawSignedTxn).do());
      // Wait for confirmation
      confirmedTxn = await algosdk.waitForConfirmation(algodClient, opttx.txId, 4);
      //Get the completed Transaction
      console.log("Transaction " + opttx.txId + " confirmed in round " + confirmedTxn["confirmed-round"]);

      //You should now see the new asset listed in the account information
      console.log("Account 3 = " + account_3.addr);

    } catch (er) {
      console.log(er);
    }
  }
  const StakeNFT = async function () {
    try {
      console.log("---------------------------------------------Transfering Asset Function----------------------------------------");
      // Transfer New Asset:
      // Now that account3 can recieve the new tokens 
      // we can tranfer tokens in from the creator
      // to account3
      // First update changing transaction parameters
      // We will account for changing transaction parameters
      // before every transaction in this example

      //params = await algodClient.getTransactionParams().do();
      //comment out the next two lines to use suggested fee
      // params.fee = 1000;
      // params.flatFee = true;

      sender = account_1.addr;
      recipient = account_3.addr;
      revocationTarget = undefined;
      closeRemainderTo = undefined;
      //Amount of the asset to transfer
      amount = 1;
      console.log("sender", sender);
      console.log("recipent", recipient);
      console.log("closeRemainderTo", closeRemainderTo);
      console.log("revocationTarget", revocationTarget);
      console.log("amount", amount);
      console.log("note", note);
      console.log("assedID", temp);
      console.log("params", params);
      // signing and sending "txn" will send "amount" assets from "sender" to "recipient"
      let xtxn = algosdk.makeAssetTransferTxnWithSuggestedParams(
        sender,
        recipient,
        closeRemainderTo,
        revocationTarget,
        amount,
        note,
        temp,
        params);
      // Must be signed by the account sending the asset  
      rawSignedTxn = xtxn.signTxn(account_1.sk)
      let xtx = (await algodClient.sendRawTransaction(rawSignedTxn).do());

      //Wait for confirmation
      confirmedTxn = await algosdk.waitForConfirmation(algodClient, xtx.txId, 4);
      //Get the completed Transaction
      console.log("Transaction " + xtx.txId + " confirmed in round " + confirmedTxn["confirmed-round"]);

      // You should now see the 10 assets listed in the account information
      console.log("Account 3 = " + account_3.addr);

    } catch (er) {
      console.log(er);
    }
  }

  const UnStake = async function () {
    try {
      console.log("//////////////////////////////////////////////////Taking Token back//////////////////////////////////////////");
      sender = account_3.addr;
      recipient = account_1.addr;
      revocationTarget = undefined;
      closeRemainderTo = undefined;
      amount = 1;
      let Txtxnn = algosdk.makeAssetTransferTxnWithSuggestedParams(
        sender,
        recipient,
        closeRemainderTo,
        revocationTarget,
        amount,
        note,
        temp,
        params);
      // Must be signed by the account sending the asset  
      rawSignedTxn = Txtxnn.signTxn(account_3.sk)
      let txtxs = (await algodClient.sendRawTransaction(rawSignedTxn).do());

      // Wait for confirmation
      confirmedTxn = await algosdk.waitForConfirmation(algodClient, txtxs.txId, 4);
      //Get the completed Transaction
      console.log("Transaction " + txtxs.txId + " confirmed in round " + confirmedTxn["confirmed-round"]);

      // You should now see the 10 assets listed in the account information
      console.log("Account 3 sent the token to account 1 = " + account_3.addr);

    } catch (error) {
      console.log("err", error);
    }
  }

  const tranferAsset = async function () {
    try {
      let params = await algodClient.getTransactionParams().do();

      // comment out the next two lines to use suggested fee;

      let amount = 1000000;
      let sender = peraaddress.toString();
      let asetid = 120364319
      console.log("pera acccount address", sender);

      const txGroups = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: sender,
        to: "546OUA7OIN3H66YEM7DQ4UM7HTMKVC4HFQ26ND3EWUBZHZRZW3J6UULA3M",
        assetIndex: asetid,
        amount,
        params
      });

      try {
        const signedTxn = await peraWallet.signTransaction([txGroups]);
      } catch (error) {
        console.log("Couldn't sign Opt-in txns", error);
      }
    }
    // let txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    //   from: sender,
    //   to: receiver,
    //   amount: amount,
    //   note: note,
    //   asetid: asetid,
    //   suggestedParams: params
    // });
    // // Sign the transaction
    // let rawSignedTxn = txn.signTxn(account_1.sk)
    // let tx = await algodClient.sendRawTransaction(rawSignedTxn).do()
    // console.log("Asset Creation Txn : " + tx.txId);

    catch (er) {
      console.log("er", er);
    }


  }
  const PeraWallet1 = () => {
    const [transactionSignature, setTransactionSignature] = useState(null);

    const signTransaction = async () => {
      try {
        // The transaction data that you want to sign
        const transactionData = {
          from: '0x1234567890123456789012345678901234567890',
          to: '0x09876543210987654321098765432109876543210',
          value: '1000000000000000000',
          gas: 21000,
          gasPrice: '20000000000',
          nonce: 0,
          chainId: 1,
        };

        // Connect to the Pera API to sign the transaction
        const response = await fetch('https://api.pera.com/sign-transaction', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer YOUR_API_KEY',
          },
          body: JSON.stringify(transactionData),
        });

        const data = await response.json();

        // Update the transactionSignature state with the signed transaction
        setTransactionSignature(data.signedTransaction);
      } catch (error) {
        console.error(error);
      }
    };
  }


  useEffect(() => {
    forParams()
  })

  return (

    < div className="App" >
      {Wallet}
      <button
        onClick={
          isConnectedToPeraWallet ? handleDisconnectWalletClick : handleConnectWalletClick
        }>
        {isConnectedToPeraWallet ? "Disconnect" : "Connect to Pera Wallet"}
      </button> *
      <button className="mybtn" onClick={connectAlgoWallet}> 1 connect wallet</button>
      <button className="mybtn" onClick={tranferAsset}> PeraWallet1 algo</button>
      <button className="mybtn" onClick={ftToken}> 2 create ft Token</button>

      {/* <button className="mybtn" onClick={ClaimNFT}>5claim</button> */}
      <button className="mybtn" onClick={createAccount}>3 createAccount</button>
      <button className="mybtn" onClick={globle}>optn in global account</button>

      {/* <button className="mybtn" onClick={sendtkn}> send token</button>
      <button className="mybtn" onClick={checkBalance}> check Balance</button> */}
      {/* <button className="mybtn" onClick={CreateNFT}> Create NFT</button> */}
      {/* <button className="mybtn" onClick={StakeNFT}>Stake NFT</button>
      <button className="mybtn" onClick={UnStake}>UnStake NFT</button> */}



      {disp.length > 0 ? <><p>Click link to Dispence the account</p>
        <a href={disp} target="_blank">{disp}</a></> : <> </>
      }
      <p>Transaction ID :</p>
      {Asets}
    </div >
  );
}


export default App;
