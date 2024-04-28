/* eslint-disable no-undef */
import Web3 from 'web3';
import storageABI from "../asset/storage.json";

// Function to make payment to the contract
export async function contractToOwner(contractAddress, amountInWei) {
    // Connect to Ganache
    const web3 = new Web3('http://localhost:7545');
    const abi = storageABI.abi;

    // Get the contract instance
    const contract = new web3.eth.Contract(abi, contractAddress);
    try {
        // Send transaction to the contract's payment function
        const contractBalance = await contract.methods.getContractBalance().call();
        const amountInWeiBigInt = BigInt(amountInWei);
        const owner = await contract.methods.owner().call();
        console.log(owner);
        if (contractBalance - amountInWeiBigInt < BigInt(2 * Math.pow(10, 18))) {
            return "Fail";
        }
        await contract.methods.payToOwner(amountInWei).send({ from:owner, gasLimit: 5000000 });
        console.log('Payment successful');
        return "Success";
    } catch (error) {
        throw new Error('Error making payment: ' + error.message);
    }
}
