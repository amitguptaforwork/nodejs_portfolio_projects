/*
node .\1.listenToSeaport.js 
*/
const ethers = require("ethers");
//import { ethers } from "ethers";
const contractAbi = require("./seaportAbi.json");
//import * as contractAbi from './seaportAbi.json' assert {type: "json"};

//Node provider address
//for mainnet
const nodeProvider = "https://eth-mainnet.g.alchemy.com/v2/dS56U5AM1G-B8D6fOP8nAcM8i84PBjwe";

//for goerli
//const nodeProvider = "https://eth-goerli.g.alchemy.com/v2/3Tism8xCn908u_Tddm5vCcWP-Yz3h36K";
const customHTTPProvider = new ethers.providers.WebSocketProvider(nodeProvider);

//seaport1.1 address of hte contract whose events we want to listen to
//https://github.com/ProjectOpenSea/seaport
const contractAddress = '0x00000000006c3852cbEf3e08E8dF289169EdE581';
const contract = new ethers.Contract(contractAddress, contractAbi, customHTTPProvider);

const contractToListenTo = "0xa01c8cc05d427ec6744353b12f0a634e55db8a06" //nft002 on goerli

//from https://docs.opensea.io/v2.0/reference/seaport-events-and-errors
//we know the structure of this event
//event OrderFulfilled(bytes32 orderHash, address offerer, address zone, address recipient, struct SpentItem[] offer, struct ReceivedItem[] consideration)
contract.on("OrderFulfilled", (orderHash, offerer, zone, recipient, offer, consideration) => {
    // nftContract: offer[0].token, console.log({
    //     nftContract: offer[0].token,
    //     nftTokenId: offer[0].identifier,
    //     orderHash: orderHash,
    //     offerer: offerer,
    //     zone: zone,
    //     recipient: recipient,
    //     offer: offer,
    //     consideration: consideration
    // });

    //notes: the event does not have details of fulfiller (buyer of NFT)
    // offerer is same as consideration[0].recipient
    //it is possible that some events dont have royalty, therefore some considerations have length 2, while others have length 3.
    //  if (contractToListenTo === offer[0].token) 
    {
        if (consideration.length == 2)
            console.log('\x1b[36m%s\x1b[0m', {
                nftContract: offer[0].token,
                nftTokenId: ethers.BigNumber.from(offer[0].identifier).toString(),
                seller: offerer,
                amountSeller: ethers.BigNumber.from(consideration[0].amount).toString(),
                addressOpenSea: consideration[1].recipient,
                amountOpenSea: ethers.BigNumber.from(consideration[1].amount).toString()
            });

        if (consideration.length == 3)
            console.log({
                nftContract: offer[0].token,
                nftTokenId: ethers.BigNumber.from(offer[0].identifier).toString(),
                seller: offerer,
                amountSeller: ethers.BigNumber.from(consideration[0].amount).toString(),
                amountOpenSea: ethers.BigNumber.from(consideration[1].amount).toString(),
                addressOpenSea: consideration[1].recipient,
                amountRoyalty: ethers.BigNumber.from(consideration[2].amount).toString(),
                addressRoyaltyReceiver: consideration[2].recipient
            });
    }
    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")

});






