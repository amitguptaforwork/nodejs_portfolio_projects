//Event we want to listen to
//Emitted when `tokenId` token is transferred from `from` to `to`.
//event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);

/*
node .\1.listenToTransfer.js 
*/
const ethers = require("ethers");
//const contractAbi = require("./erc20abi.json");

//We can just give the event from ABI, no need to give full ABI

contractAbi = [
    "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)"
];


//Node provider address
//const nodeProvider = "https://eth-mainnet.g.alchemy.com/v2/dS56U5AM1G-B8D6fOP8nAcM8i84PBjwe";
//const nodeProvider = "https://eth-goerli.g.alchemy.com/v2/3Tism8xCn908u_Tddm5vCcWP-Yz3h36K";
const nodeProvider = "http://127.0.0.1:8545";

//const customHTTPProvider = new ethers.providers.JsonRpcProvider(nodeProvider);
const customHTTPProvider = new ethers.providers.WebSocketProvider(nodeProvider);

//ERC20 address of hte contract whose events we want to listen to
//const contractAddress = '0xa01c8cc05d427ec6744353b12f0a634e55db8a06';//NFT002 on goerli
const contractAddress = '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512';//NFT002 on my local hardhat
const contract = new ethers.Contract(contractAddress, contractAbi, customHTTPProvider);

contract.on("Transfer", (from, to, tokenId, event) => {
    console.log({
        from: from,
        to: to,
        tokenId: tokenId.toString(),
        data: event
    });
});



/*Sample output
blockchain_listener> node .\3.listenToERC721Transfer.js
{
  from: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
  to: '0xBcd4042DE499D14e55001CcbB24a551F3b954096',
  tokenId: '2',
  data: {
    blockNumber: 20,
    blockHash: '0x86219ab6ad305a673a0b2575a33b182742ad52508f01d7e92f41581317b7dd1e',
    transactionIndex: 0,
    removed: false,
    address: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
    data: '0x',
    topics: [
      '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
      '0x00000000000000000000000070997970c51812dc3a010c7d01b50e0d17dc79c8',
      '0x000000000000000000000000bcd4042de499d14e55001ccbb24a551f3b954096',
      '0x0000000000000000000000000000000000000000000000000000000000000002'
    ],
    transactionHash: '0xffb2297721db4514dee8961f2ca41fd7d1e4934c95d88cc5cd6e337e47482be0',
    logIndex: 1,
    removeListener: [Function (anonymous)],
    getBlock: [Function (anonymous)],
    getTransaction: [Function (anonymous)],
    getTransactionReceipt: [Function (anonymous)],
    event: 'Transfer',
    eventSignature: 'Transfer(address,address,uint256)',
    decode: [Function (anonymous)],
    args: [
      '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
      '0xBcd4042DE499D14e55001CcbB24a551F3b954096',
      [BigNumber],
      from: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
      to: '0xBcd4042DE499D14e55001CcbB24a551F3b954096',
      tokenId: [BigNumber]
    ]
  }
}
*/