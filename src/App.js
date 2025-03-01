import { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./App.css";

const contractAddress = "0x4c1821aF28a7509865458f85CDD5C20e03beE9Aa"; // Ganti sama contract address lu
const ChatABI = [
  "function sendMessage(string _text) public",
  "function getAllMessages() public view returns (tuple(address sender, string text)[] memory)"
];

function App() {
  const [account, setAccount] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // Connect Wallet
  const connectWallet = async () => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
      console.log("Wallet connected:", accounts[0]);
    } else {
      alert("MetaMask belum terinstall bro!");
    }
  };

  // Fetch Messages
  const fetchMessages = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(contractAddress, ChatABI, provider);

    const msgs = await contract.getAllMessages();
    console.log("Pesan dari blockchain:", msgs);

    setMessages(msgs.map((msg) => msg.text));
  };

  // Send Message
  const sendMessage = async () => {
    if (!message) return alert("Pesan gak boleh kosong bro!");

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, ChatABI, signer);

    const tx = await contract.sendMessage(message);
    await tx.wait();
    alert("Pesan berhasil terkirim 🔥");

    setMessage("");
    fetchMessages(); // Refresh pesan setelah kirim
  };

  useEffect(() => {
    connectWallet();
    fetchMessages(); // Auto fetch pas web kebuka
  }, []);

  return (
    <div className="App">
      <h1 onClick={connectWallet} style={{ cursor: "pointer" }}>
        🔗 Web3 Chat (Click to Connect Wallet)
      </h1>

      {account ? (
        <>
          <p>Wallet Terkoneksi: {account}</p>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tulis pesanmu disini..."
          ></textarea>
          <button onClick={sendMessage}>Kirim Pesan</button>

          <h2>💬 Pesan Terkirim:</h2>
          {messages.map((msg, index) => (
            <p key={index}>🔥 {msg}</p>
          ))}
        </>
      ) : (
        <p>Klik di atas buat konek wallet 🔗</p>
      )}
    </div>
  );
}

export default App;