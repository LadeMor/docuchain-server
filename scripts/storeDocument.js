const { ethers } = require("ethers");

const CONTRACT_ADDRESS = "0xYourContractAddress";

const CONTRACT_ABI = [
    "event DocumentStored(string hash, uint256 timestamp, uint256 userId)",
    "function storeDocumentMeta(string hash, uint256 timestamp, uint256 userId) public"
];

const provider = new ethers.providers.JsonRpcProvider("https://your-rpc-endpoint");

const PRIVATE_KEY = "your-private-key";

const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);

/**
 * Function for writing document hash into blockchain
 * @param {string} documentHash - Unique document hash
 * @param {number} timestamp - Timestamp in seconds
 * @param {number} userId - User id
 * @returns {Promise<void>}
 */
async function storeDocument(documentHash, timestamp, userId) {
    try {
        console.log("Sending transaction...");

       
        const tx = await contract.storeDocumentMeta(documentHash, timestamp, userId);
        console.log("Transaction sent. Transaction hash:", tx.hash);

        
        const receipt = await tx.wait();
        console.log("Transaction successfull. Receipt:", receipt);
    } catch (error) {
        console.error("Error while writing the document:", error);
    }
}


module.exports = { storeDocument };
