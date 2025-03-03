import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import ChatAbi from "./ChatABI.json";

const contractAddress = "0x120C5a061b7653EAFa866f5f1e1c743d29a20330";

function App() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [nickname, setNickname] = useState("");
  const [wallet, setWallet] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      if (wallet) {
        fetchMessages();
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [wallet]);

  async function connectWallet() {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setWallet(address);
      fetchMessages();
      alert(`Wallet berhasil terkoneksi: ${address}`);
    } catch (error) {
      console.error(error);
      alert("Gagal konek wallet!");
    }
  }

  // async function registerUsername() {
  //   if (!nickname) return alert("Nickname tidak boleh kosong!");
  //   const provider = new ethers.providers.Web3Provider(window.ethereum);
  //   const signer = await provider.getSigner();
  //   const contract = new ethers.Contract(contractAddress, ChatAbi, signer);
  //   await contract.registerUsername(nickname);
  //   alert(`Nickname "${nickname}" berhasil didaftarkan!`);
  // }

  async function registerUsername() {
    if (!nickname) return alert("Nickname tidak boleh kosong!");
    
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, ChatAbi, signer);
  
    const currentNickname = await contract.usernames(await signer.getAddress());
  
    if (currentNickname) {
      return alert(`Kamu sudah terdaftar dengan nickname: "${currentNickname}"`);
    }
  
    try {
      const tx = await contract.registerUsername(nickname);
      await tx.wait();
      alert(`Nickname "${nickname}" berhasil didaftarkan!`);
    } catch (error) {
      console.error(error);
      alert("Gagal daftar nickname!");
    }
  }
  

  async function sendMessage() {
    if (!message) return alert("Pesan tidak boleh kosong!");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, ChatAbi, signer);
    const tx = await contract.sendMessage(message);
    await tx.wait();
    setMessage("");
    fetchMessages();
  }

  async function fetchMessages() {
    if (!window.ethereum || !wallet) return;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = await provider.getSigner();
    if (!signer) return;
    const contract = new ethers.Contract(contractAddress, ChatAbi, signer);
    const allMessages = await contract.getAllMessages();

    const messagesWithNicknames = await Promise.all(
      allMessages.map(async (msg) => {
        const nickname = await contract.usernames(msg.sender);
        return { ...msg, nickname };
      })
    );

    setMessages(messagesWithNicknames);
  }

  return (
    <div>
      <h1>Web3 Chat App 🚀</h1>

      <button onClick={connectWallet}>
        {wallet ? `Connected: ${wallet.slice(0, 6)}...${wallet.slice(-4)}` : "Connect Wallet"}
      </button>

      <input
        placeholder="Enter Nickname"
        onChange={(e) => setNickname(e.target.value)}
      />
      <button onClick={registerUsername}>Register</button>

      <input
        placeholder="Enter Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>

      <h2>Messages</h2>
      {messages.map((msg, index) => (
        <div key={index}>
          <p>
            {msg.sender} [{msg.nickname ? msg.nickname : "Unknown"}] : {msg.text}
          </p>
        </div>
      ))}
    </div>
  );
}

export default App;