import Web3 from 'web3';
import storageABI from "../asset/storage.json";

// Function to make payment to the contract
export async function contractPayment(contractAddress, senderAddress, amountInWei, key, proofKey) {
    // Connect to Ganache
    const web3 = new Web3('http://localhost:7545');
    const abi = storageABI.abi;

    // Get the contract instance
    const contract = new web3.eth.Contract(abi, contractAddress);
    try {
        // Send transaction to the contract's payment function
        await contract.methods.payment(key,proofKey).send( { from: senderAddress, value: amountInWei, gasLimit: 5000000 });
        console.log('Payment successful');
    } catch (error) {
        throw new Error('Error making payment: ' + error.message);
    }
}
