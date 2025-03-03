// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Chat {
    struct Message {
        address sender;
        string text;
        uint timestamp;
    }

    mapping(address => string) public usernames; // 🔥 Ganti bytes32 jadi string
    Message[] private messages; // 🔥 Private array biar gas murah

    event NewMessage(address indexed sender, string text, uint timestamp);
    event NewUser(address indexed user, string nickname); // 🔥 Emit langsung string nickname

    function registerUsername(string memory _nickname) public {
        require(bytes(_nickname).length <= 20, "Nickname too long");
        require(bytes(usernames[msg.sender]).length == 0, "Nickname already registered"); // 🔥 Prevent double register
        usernames[msg.sender] = _nickname;
        emit NewUser(msg.sender, _nickname);
    }

    function sendMessage(string memory _text) public {
        require(bytes(_text).length <= 200, "Message too long");
        require(bytes(usernames[msg.sender]).length > 0, "Register nickname first");
        messages.push(Message(msg.sender, _text, block.timestamp));
        emit NewMessage(msg.sender, _text, block.timestamp);
    }

    function getAllMessages() public view returns (Message[] memory) {
        return messages;
    }

    function getMessage(uint index) public view returns (Message memory) { // 🔥 Fetch by index biar gas lebih murah
        require(index < messages.length, "Message index out of range");
        return messages[index];
    }

    function getTotalMessages() public view returns (uint) { // 🔥 Buat pagination nanti
        return messages.length;
    }
}