async function getLogs() {
    const ethers = require("ethers");

    console.log(`Getting the PunkTransfer events...`);

    const cryptopunkContractAddress: string = '0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB';

    const eventSignature: string = 'PunkTransfer(address,address,uint256)';
    const eventTopic: string = ethers.utils.id(eventSignature); // Get the data hex string

    const rawLogs = await provider.getLogs({
        address: cryptopunkContractAddress,
        topics: [eventTopic],
        fromBlock: currentBlock - 10000,
        toBlock: currentBlock
    });
}