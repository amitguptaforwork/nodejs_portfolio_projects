/*
npx hardhat run .\src\backend\scripts\6.ListenToSeaportOrderFulfilledEvent.js --network ETH_goerli
*/
const hre = require("hardhat");
require("dotenv").config();
const contractName = "NFT002";
let nftContractAddressToListenTo = require(`../../frontend/contractsData/${contractName}-address.json`);

const SeaportContractAbi = require("../../frontend/contractsData/seaportAbi.json");

//seaport1.1 address of the contract whose events we want to listen to
//https://github.com/ProjectOpenSea/seaport
const SeaportContractAddress = '0x00000000006c3852cbEf3e08E8dF289169EdE581';
const seaportContractInstance = new ethers.Contract(SeaportContractAddress, SeaportContractAbi, hre.ethers.provider);

//from https://docs.opensea.io/v2.0/reference/seaport-events-and-errors
//we know the structure of this event
//event OrderFulfilled(bytes32 orderHash, address offerer, address zone, address recipient, struct SpentItem[] offer, struct ReceivedItem[] consideration)
seaportContractInstance.on("OrderFulfilled", (orderHash, offerer, zone, recipient, offer, consideration) => {
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
    if (nftContractAddressToListenTo.address === offer[0].token) {
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
    console.log(`++++++++++++++++++++++waiting for OrderFulfilled for contract ${nftContractAddressToListenTo.address} ++++++++++++++++++++++++++++++++++++++`)

});






