import { ethers } from "ethers";

const CONTRACT_ADDRESS = "0x4c1821aF28a7509865458f85CDD5C20e03beE9Aa";
const ABI = [
  {
    "inputs": [{ "internalType": "string", "name": "_text", "type": "string" }],
    "name": "sendMessage",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function",
  },
  {
    "inputs": [],
    "name": "getAllMessages",
    "outputs": [
      {
        "components": [
          { "internalType": "address", "name": "sender", "type": "address" },
          { "internalType": "string", "name": "text", "type": "string" },
        ],
        "internalType": "struct Chat.Message[]",
        "name": "",
        "type": "tuple[]",
      },
    ],
    "stateMutability": "view",
    "type": "function",
  },
];

export { CONTRACT_ADDRESS, ABI };
