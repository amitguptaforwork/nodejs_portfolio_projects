//Event we want to listen to
//Emitted when `tokenId` token is transferred from `from` to `to`.
//event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);

/*
 node .\4.lookupPastEvent.js 
*/
const ethers = require("ethers");
//const contractAbi = require("./erc20abi.json");

//We can just give the event from ABI, no need to give full ABI

contractAbi = [
    "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)"
];


//Node provider address
//const nodeProvider = "https://eth-mainnet.g.alchemy.com/v2/dS56U5AM1G-B8D6fOP8nAcM8i84PBjwe";
const nodeProvider = "https://eth-goerli.g.alchemy.com/v2/3Tism8xCn908u_Tddm5vCcWP-Yz3h36K";
//const nodeProvider = "http://127.0.0.1:8545";

//const customHTTPProvider = new ethers.providers.JsonRpcProvider(nodeProvider);
const customHTTPProvider = new ethers.providers.WebSocketProvider(nodeProvider);

//ERC20 address of hte contract whose events we want to listen to
const contractAddress = '0xa01c8cc05d427ec6744353b12f0a634e55db8a06';//NFT002 on goerli
//const contractAddress = '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512';//NFT002 on my local hardhat
const contract = new ethers.Contract(contractAddress, contractAbi, customHTTPProvider);

let currentBlock;

async function getCurrentBlock() {
    console.log(`Getting latest block number...`);

    currentBlock = await customHTTPProvider.getBlockNumber();
    console.log(`Latest block number: ${currentBlock}`);
}



async function main() {
    const etherscanKey = "IS2Y7JGKJ76YTIGW9I39QZGM2YMTAKU5Y3";
    getCurrentBlock();//8274821,  my first event came in 8267381
    let events = await contract.queryFilter('Transfer', currentBlock - 1000, currentBlock);
    //console.log(events);

    events.map(print);
    function print(event) {
        const txnHash = event.transactionHash;


        console.log({
            transactionHash: txnHash,
            from: event.args[0],
            to: event.args[1],
            tokenID: event.args[2].toString()
        }
        );
    }

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});





/*Sample output
*/