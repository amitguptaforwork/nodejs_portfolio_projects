
/*
node .\1.listenToTransfer.js 
*/
const ethers = require("ethers");
const { default: axios } = require("axios");

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

const etherscanKey = "IS2Y7JGKJ76YTIGW9I39QZGM2YMTAKU5Y3";
const baseURL = "https://api-goerli.etherscan.io"

/**
 {
    "status": "1",
    "message": "OK",
    "result": [
        {
            "blockNumber": "8269445",
            "timeStamp": "1673061936",
            "from": "0x00000000006c3852cbef3e08e8df289169ede581",
            "to": "0x0000a26b00c1f0df003000390027140000faa719",
            "value": "25",
            "contractAddress": "",
            "input": "",
            "type": "call",
            "gas": "62339",
            "gasUsed": "85",
            "isError": "0",
            "errCode": ""
        },
        {
            "blockNumber": "8269445",
            "timeStamp": "1673061936",
            "from": "0x00000000006c3852cbef3e08e8df289169ede581",
            "to": "0x37de292ab332f0b20356fd7cebef643c40590138",
            "value": "150",
            "contractAddress": "",
            "input": "",
            "type": "call",
            "gas": "52747",
            "gasUsed": "0",
            "isError": "0",
            "errCode": ""
        },
        {
            "blockNumber": "8269445",
            "timeStamp": "1673061936",
            "from": "0x00000000006c3852cbef3e08e8df289169ede581",
            "to": "0x37de292ab332f0b20356fd7cebef643c40590138",
            "value": "825",
            "contractAddress": "",
            "input": "",
            "type": "call",
            "gas": "45863",
            "gasUsed": "0",
            "isError": "0",
            "errCode": ""
        }
    ]
}
 */
async function getIntenalTxn(txnHash, seller) {

    let url = `${baseURL}/api?module=account&action=txlistinternal&txhash=${txnHash}&apikey=${etherscanKey}`
    const response = await axios.get(url);
    if (response.data.status == 0) {
        //       console.log(response.data.status)//0
        //     console.log(response.data.message)//NOTOK, No transactions found
        return {
            internalTxn_length: 0,
            totalSaleAmount: 0,
            sellerShare: 0
        }
    }
    const internalTxn = response.data.result;
    let totalSaleAmount = 0, royaltyShare = 0, sellerShare = 0;

    const value = [];
    let j = 0;
    const openSeaAddress = "0x0000a26b00c1f0df003000390027140000faa719"
    for (let i = 0; i < internalTxn.length; i++) {
        totalSaleAmount += Number(internalTxn[i].value);
        //filter out open sea payment.
        if (openSeaAddress != internalTxn[i].to.toLowerCase()) {
            value[j++] = Number(internalTxn[i].value)
        }
    }
    //We have now two values in value[] array.  Whichever is bigger woudl be sale amout, other woudl be royalty amount
    if (value[0] > value[1]) {
        sellerShare = value[0];
        royaltyShare = value[1];
    }
    else {
        sellerShare = value[1];
        royaltyShare = value[0];
    }
    //  console.log(`${txnHash} internalTxn.length ${internalTxn.length} saleAmt=${totalSaleAmount}`)
    //console.log(internalTxn)
    return {
        internalTxn_length: internalTxn.length,
        totalSaleAmount: totalSaleAmount,
        sellerShare: sellerShare,
        royaltyShare: royaltyShare
    }
}

async function main() {
    getCurrentBlock();//8274821,  my first event came in 8267381

    //Return Events that match the event "Transfer"
    let events = await contract.queryFilter('Transfer', currentBlock - 1000, currentBlock);
    //console.log(events);
    /* Sample event for reference
      {
        blockNumber: 8269445,
        blockHash: '0x0553ecdd50b59845a043862a7dfc2c43201a0e251163624fd990676670c5dcca',
        transactionIndex: 15,
        removed: false,
        address: '0xA01C8cC05d427eC6744353B12F0A634E55dB8a06',
        data: '0x',
        topics: [
          '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
          '0x00000000000000000000000037de292ab332f0b20356fd7cebef643c40590138',
          '0x000000000000000000000000deb5ed5f38da89a88318d2df7e81f8600e1598a1',
          '0x0000000000000000000000000000000000000000000000000000000000000005'
        ],
        transactionHash: '0xefdba2e143636b9e639d9237bc80035ba8fb42413436736110750d3bc4e5a021',
        logIndex: 46,
        removeListener: [Function (anonymous)],
        getBlock: [Function (anonymous)],
        getTransaction: [Function (anonymous)],
        getTransactionReceipt: [Function (anonymous)],
        event: 'Transfer',
        eventSignature: 'Transfer(address,address,uint256)',
        decode: [Function (anonymous)],
        args: [
          '0x37de292aB332F0b20356Fd7ceBEF643C40590138',
          '0xDEB5ed5f38Da89a88318D2df7e81F8600e1598A1',
          [BigNumber],
          from: '0x37de292aB332F0b20356Fd7ceBEF643C40590138',
          to: '0xDEB5ed5f38Da89a88318D2df7e81F8600e1598A1',
          tokenId: [BigNumber]
        ]
      }
    */
    events.map(print);

    async function print(event) {
        const txnHash = event.transactionHash;

        const internalTxn = await getIntenalTxn(txnHash, event.args[0]);

        //Print only txn that had a open sea sale.
        if (internalTxn.totalSaleAmount > 0)
            console.log({
                blockNumber: blockNumber,
                transactionHash: txnHash,
                from: event.args[0],
                to: event.args[1],
                tokenID: event.args[2].toString(),
                totalSaleAmount: internalTxn.totalSaleAmount,
                sellerShare: internalTxn.sellerShare,
                royaltyShare: internalTxn.royaltyShare
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