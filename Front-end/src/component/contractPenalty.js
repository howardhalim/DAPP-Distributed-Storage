import Web3 from 'web3';
import storageABI from "../asset/storage.json";

// Function to make payment to the contract
export async function contractPenalty(contractAddress, senderAddress, amountInWei, key, proofKey) {
    // Connect to Ganache
    const web3 = new Web3('http://localhost:7545');
    const abi = storageABI.abi;

    // Get the contract instance
    const contract = new web3.eth.Contract(abi, contractAddress);
    try {
        // Send transaction to the contract's payment function
        const owner = await contract.methods.owner().call();
        await contract.methods.penalty(senderAddress, amountInWei, proofKey).send({ from: owner, gasLimit: 5000000 });
        console.log('Payment successful');
    } catch (error) {
        throw new Error('Error making payment: ' + error.message);
    }
}
