import Web3 from 'web3';
import storageABI from "../asset/storage.json";

// Function to get contract balance
export async function fetchPricePerByte(contractAddress) {
    // Connect to Ganache
    const web3 = new Web3('http://localhost:7545');
    const abi = storageABI.abi;

    // Get the contract instance
    const contract = new web3.eth.Contract(abi, contractAddress);

    try {
        // Call the getContractBalance method
        const pricePerByte = await contract.methods.getPricePerBytes().call();
        return pricePerByte;
    } catch (error) {
        throw new Error('Error calling getContractBalance: ' + error.message);
    }
}
