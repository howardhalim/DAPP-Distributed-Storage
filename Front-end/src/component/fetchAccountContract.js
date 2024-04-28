// contractService.js
import Web3 from 'web3';

async function fetchAccountContract(targetAccount) {
    console.log(targetAccount)
    // Connect to Ganache
    const web3 = new Web3('http://localhost:7545');
    // Retrieve contracts from Ganache
    const latestBlockNumber = await web3.eth.getBlockNumber();
    const latestContracts = [];
    const ownersMap = {}; // Object to store contract owners
    const receiptPromises = [];
    for (let i = 0; i <= latestBlockNumber; i++) {
        const block = await web3.eth.getBlock(i, true);
        if (block.transactions) {
            block.transactions.forEach(transaction => {
                if (transaction.to === null && transaction.from.toLowerCase() === targetAccount.toLowerCase()) {
                    receiptPromises.push(
                        web3.eth.getTransactionReceipt(transaction.hash)
                            .then(receipt => {
                                const contractAddress = receipt.contractAddress; // Get contract address from receipt
                                const ownerAddress = transaction.from;
                                latestContracts.push(contractAddress);
                                ownersMap[contractAddress] = ownerAddress; // Save contract owner in the object
                            })
                    );
                }
            });
        }
    }
    await Promise.all(receiptPromises);

    return { contracts: latestContracts, owners: ownersMap };
}

export default fetchAccountContract;
