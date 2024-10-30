//https://docs.etherscan.io/getting-started/endpoint-urls
//https://api.etherscan.io/api
//https://api-goerli.etherscan.io/

const { default: axios } = require("axios");



//Test#1: 
//https://api-goerli.etherscan.io/api?module=account&action=balance&address=0x37de292aB332F0b20356Fd7ceBEF643C40590138&tag=latest&apikey=IS2Y7JGKJ76YTIGW9I39QZGM2YMTAKU5Y3

//Test#2: find all txn of address 0xDEB5ed5f38Da89a88318D2df7e81F8600e1598A1
//https://api-goerli.etherscan.io/api?module=account&action=txlist&address=0xDEB5ed5f38Da89a88318D2df7e81F8600e1598A1&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=IS2Y7JGKJ76YTIGW9I39QZGM2YMTAKU5Y3

//Test#2: find all internla txn for txn hash 0x15131abab82ce18bfbd9accf6c03c2a4a674f9af44cb641f14c6db897759268b
//https://api-goerli.etherscan.io/api?module=account&action=txlistinternal&txhash=0x15131abab82ce18bfbd9accf6c03c2a4a674f9af44cb641f14c6db897759268b&apikey=IS2Y7JGKJ76YTIGW9I39QZGM2YMTAKU5Y3
//https://api-goerli.etherscan.io/api?module=account&action=txlistinternal&txhash=0xdd0292d383dfa88f443d64e5df2091d13ad9663e629cf7c8de37e3b5aa973b72&apikey=IS2Y7JGKJ76YTIGW9I39QZGM2YMTAKU5Y3
//https://api-goerli.etherscan.io/api?module=account&action=txlistinternal&txhash=0xefdba2e143636b9e639d9237bc80035ba8fb42413436736110750d3bc4e5a021&apikey=IS2Y7JGKJ76YTIGW9I39QZGM2YMTAKU5Y3
//


async function main() {
    const etherscanKey = "IS2Y7JGKJ76YTIGW9I39QZGM2YMTAKU5Y3";
    const baseURL = "https://api-goerli.etherscan.io"
    const txnHash = "0xefdba2e143636b9e639d9237bc80035ba8fb42413436736110750d3bc4e5a021";
    let url = `${baseURL}/api?module=account&action=txlistinternal&txhash=${txnHash}&apikey=${etherscanKey}`
    console.log(url);
    const response = await axios.get(url);
    internalTxn = response.data.result;
    console.log(`We found ${internalTxn.length} internal txns`)
    console.log(internalTxn);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});





/*Sample output
*/