// contractService.js
import Web3 from 'web3';

async function fetchAccount() {
    // Connect to Ganache
    const web3 = new Web3('http://localhost:7545');

    // Retrieve accounts from Ganache
    const ganacheAccounts = await web3.eth.getAccounts();

    return { accounts: ganacheAccounts };
}

export default fetchAccount;
