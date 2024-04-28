import Web3 from 'web3';
import storageABI from "../asset/storage.json";

export async function userStore(account, contractAddress, sizeValue, duration) {
    // Connect to Ganache
    const web3 = new Web3('http://localhost:7545');
    const abi = storageABI.abi;

    // Get the contract instance
    const contract = new web3.eth.Contract(abi, contractAddress);

    try {
        // Call the userStore function on the contract
        await contract.methods.userStore(sizeValue*1000, duration).send({ from: account, gasLimit: 5000000 });

        const key= await contract.methods.getClientKeys(account).call();
        console.log(key[key.length - 1]);
        return key[key.length - 1];
    } catch (error) {
        throw new Error('Error calling userStore: ' + error.message);
    }
}
