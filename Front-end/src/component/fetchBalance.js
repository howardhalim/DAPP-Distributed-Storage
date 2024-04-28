// balanceService.js
import Web3 from 'web3';

async function fetchBalance(selectedAccount) {
    if (!selectedAccount) {
        throw new Error('No account selected');
    }

    // Connect to Ganache
    const web3 = new Web3('http://localhost:7545');

    // Retrieve balance for selected account
    const balance = await web3.eth.getBalance(selectedAccount);
    return web3.utils.fromWei(balance, 'ether');
}

export default fetchBalance;
