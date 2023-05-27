import { useState, useEffect } from "react";
import { ethers } from "ethers";
import contractABI from "./contract/abi.json";
import { contractAddress } from "./contract/index.js";

function App() {
  const [count, setCount] = useState(0);
  const [userAccount, setuUserAccount] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        console.log(`metamask is available`);
      } else {
        console.log(`please install metamask`);
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("found account with address", account);
        setuUserAccount(account);
      } else {
        console.log(`no authorized account found`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected().then(() => {
      getCounts();
    });
  });

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert(`please install metamask`);
        return;
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });
      console.log(accounts[0]);
      setuUserAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const sayHi = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        // 要想执行合约内的函数，先经由 ethereum 物件，获取 Provider，再通过 Provider 获取 Signer
        // Signer 就是执行合约的签名方
        // 再建立合约的实例，需要三个参数：合约地址、合约abi、Signer
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const counterContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        setLoading(true);
        // add 后
        // tx 是个Transaction动作
        const tx = await counterContract.add();
        await tx.wait(); //wait是tx的方法，等待完成链上的动作
        await getCounts();
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // getCounts可以在下面
  const getCounts = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log(`ethereum object is not available`);
        return;
      }
      // 要想执行合约内的函数，先经由 ethereum 物件，获取 Provider，再通过 Provider 获取 Signer
      // Signer 就是执行合约的签名方
      // 再建立合约的实例，需要三个参数：合约地址、合约abi、Signer
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const counterContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      const resCounts = await counterContract.getCounts();
      setCount(resCounts.toNumber());
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className=" w-full min-h-screen bg-blue-900 flex flex-col justify-center items-center">
      <h1 className=" text-8xl font-bold text-white text-shadow text-center">
        Hello, Web3!
      </h1>

      {!userAccount ? (
        <button
          className=" rounded-full py-6 px-12 text-3xl mt-24 text-white bg-purple-700 hover:scale-105 hover:bg-purple-600 translate"
          onClick={connectWallet}
        >
          Connet Wallet
        </button>
      ) : (
        <>
          <h2 className=" text-6xl text-center mt-24 text-yellow-300 font-bold">
            👋 {count}
          </h2>

          <h3 className=" text-3xl text-center text-white text-bold mt-12">
            Logged in as{" "}
            {`${userAccount.substring(0, 4)}...${userAccount.substring(
              userAccount.length - 4
            )}`}
          </h3>

          <button
            className=" rounded-full py-6 px-12 text-3xl mt-16 text-white bg-purple-700 hover:scale-105 hover:bg-purple-600 translate"
            onClick={sayHi}
            disabled={loading}
          >
            {loading ? `is loading...` : "Say Hi"}
          </button>
        </>
      )}
    </div>
  );
}

export default App;
