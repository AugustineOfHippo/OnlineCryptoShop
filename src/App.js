import NavbarComponent from "./components/NavbarComponent";
import { useState, useEffect } from "react";
import NordSudContract from "./eth/NordSudContract";
import NordSudTokenContract from "./eth/NordSudToken";
import { ethers, BigNumber } from "ethers";
import NewPartComponent from "./components/NewPartComponent";
import PartsComponent from "./components/PartsComponent";
import NewUserComponent from "./components/NewUserComponent";

function App() {

  const [tknContract,setTknContract] = useState(undefined);
  const [smtContract,setSmtContract] = useState(undefined);
  const [provider,setProvider] = useState(undefined);
  const [signer,setSigner] = useState(undefined);
  const [walletAddress,setWalletAddress] = useState('');
  const [loggedUser,setLoggedUser] = useState('');
  const [owner,setOwner] = useState(undefined);


  useEffect(() => {
    getCurrentWalletConnected();
    addWalletListener();
  },[walletAddress])

  const connectWallet = async() => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      try {
        // Get provider
        const pro = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(pro);

        // Get accounts
        const accounts = await pro.send("eth_requestAccounts",[])
        setWalletAddress(accounts[0]);

        // Get Signer
        setSigner(pro.getSigner());

        // Local Contract Instance
        const sc = NordSudContract(pro);
        setSmtContract(sc)
        const tc = NordSudTokenContract(pro);
        setTknContract(tc)

        // Get User Info
        await getUserInfo(sc,accounts[0])

        // Set the owner
        await getOwner(sc);

      } catch (err) {
        console.error(err.message);
      }
    } else {
      /* MetaMask is not installed */
      console.log("Please install MetaMask");
    }
  }

  const getCurrentWalletConnected = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      try {
          // Get provider
        const pro = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(pro);

         // Get accounts
         const accounts = await pro.send("eth_accounts",[])
         
        if (accounts.length > 0) {
          // Get Signer
        setSigner(pro.getSigner());

           // Local Contract Instance
        const sc = NordSudContract(pro);
        setSmtContract(sc)
        const tc = NordSudTokenContract(pro);
        setTknContract(tc)

         setWalletAddress(accounts[0]);

          // Get User Info
        await getUserInfo(sc,accounts[0])

        // Get Owner
        await getOwner(sc);

    
        } else {
          console.log("Connect to MetaMask using the Connect button");
        }
      } catch (err) {
        console.error(err.message);
      }
    } else {
      /* MetaMask is not installed */
      console.log("Please install MetaMask");
    }
  };

  const addWalletListener = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      window.ethereum.on("accountsChanged", (accounts) => {
        setWalletAddress(accounts[0]);
      });
      // await getUserInfo();
    } else {
      /* MetaMask is not installed */
      setWalletAddress("");
      console.log("Please install MetaMask");
    }
  };

  const getUserInfo = async(smc,acc) => {
      try {
        const resp = await smc.allUsers(acc);
        if(resp.email !== ''){
          setLoggedUser({email:resp.email, fullName:resp.fullName, phoneNumber:resp.phoneNumber});
        } else {
          setLoggedUser({fullName:"Please Register"})
        }
      } catch (error) {
        console.log("Error in GetUserInfo: "+error)
      }
    
}


const getOwner = async(smc) => {
    try {
      const resp = await smc.owner();
        setOwner(resp.toLowerCase());
    } catch (error) {
      console.log("Error: "+error);
    }

}


  return (
    <div className="bg-gradient-to-b h-screen  overflow-auto">
      <NavbarComponent connectWallet={connectWallet} walletAddress={walletAddress} loggedUser={loggedUser} getUserInfo={getUserInfo} />
      {/* <button
      onClick={getOwner}
       className="bg-white">Log Contract</button> */}
      {loggedUser.fullName === 'Please Register' ?
        <NewUserComponent smtContract={smtContract} signer={signer} walletAddress={walletAddress} setLoggedUser={setLoggedUser} />  
       : ''}
      {walletAddress !== ''? 
      <>
        <NewPartComponent signer={signer} smtContract={smtContract} owner={owner} walletAddress={walletAddress} /> 
        <PartsComponent smtContract={smtContract} signer={signer} tknContract={tknContract} />
      </>
       : ''}
      
      

    </div>
  );
}

export default App;
