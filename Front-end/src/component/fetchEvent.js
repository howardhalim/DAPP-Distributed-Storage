import Web3 from 'web3';
import storageABI from "../asset/storage.json";


// Function to get contract balance
export async function fetchEvent(contractAddress, account) {
    // Connect to Ganache
    const web3 = new Web3('http://localhost:7545');
    const abi = storageABI.abi;


    const filteredEvents = [];
    // Iterate over each contract address
   
        
    // Get the contract instance
    const contract = new web3.eth.Contract(abi, contractAddress);

    try {
        const proofKeys = [];
        // Get past events from the contract
        const pastEvents = await contract.getPastEvents('submit_proof', {
            fromBlock: '0', // Start from the first
            toBlock: 'latest' // Query events up to the latest block
        });
        const pastPayments = await contract.getPastEvents('payment_receive', {
            fromBlock: '0', // Start from the first
            toBlock: 'latest' // Query events up to the latest block
        }); 
        const pastPenalty = await contract.getPastEvents('penalty_receive', {
            fromBlock: '0', // Start from the first
            toBlock: 'latest' // Query events up to the latest block
        });
        for (const payment of pastPayments) {
            proofKeys.push(payment.returnValues[3]);
        }
        console.log(pastPenalty);
        for (const penalty of pastPenalty) {
            proofKeys.push(penalty.returnValues[3]);
        }
        for (const event of pastEvents) {
            // Check if event.returnValues[0] is equal to the given account
            if (event.returnValues[0] === account) {
                // If the condition is true, add the event to the filteredEvents list
                const proofKey = event.returnValues[5];;
                if (!proofKeys.includes(proofKey)) {
                    filteredEvents.push(event);
                }
                // const status = await contract.methods.getStore(key).call();
                // console.log(status);
                // if (!status.done) {
                //     filteredEvents.push(event);
                // }
                
            }
        }
    } catch (error) {
        console.error('Error fetching events:', error);
    }
    

    // Return all fetched events
    console.log(filteredEvents);
    return filteredEvents;
}
