/*
node .\1.listenToTransfer.js 
*/
const ethers = require("ethers");
//const contractAbi = require("./erc20abi.json");

//We can just give the event from ABI, no need to give full ABI
contractAbi = [
    "event Transfer(address indexed src, address indexed dst, uint val)"
];


//Node provider address
const nodeProvider = "https://eth-mainnet.g.alchemy.com/v2/dS56U5AM1G-B8D6fOP8nAcM8i84PBjwe";
//const customHTTPProvider = new ethers.providers.JsonRpcProvider(nodeProvider);
const customHTTPProvider = new ethers.providers.WebSocketProvider(nodeProvider);

//ERC20 address of hte contract whose events we want to listen to
const contractAddress = '0xa01c8cc05d427ec6744353b12f0a634e55db8a06';

const contract = new ethers.Contract(contractAddress, contractAbi, customHTTPProvider);

contract.on("Transfer", (from, to, value, event) => {
    console.log({
        from: from,
        to: to,
        value: value.toString(),
        data: event
    });
});



