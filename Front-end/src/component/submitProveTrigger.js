import React, { useEffect } from 'react';
import Web3 from 'web3';
import storageABI from "../asset/storage.json";

function ContractEventTrigger(contractAddress) {
    useEffect(() => {
        const web3 = new Web3('http://localhost:7545'); // Connect to your Ethereum network
        const contract = new web3.eth.Contract(storageABI, contractAddress); // Create contract instance

        // Function to trigger the submitProve function
        const triggerSubmitProve = async () => {
            try {
                // Get current time
                const currentTime = Math.floor(Date.now() / 1000); // Convert milliseconds to seconds

                // Iterate through storeKeys array
                for (let i = 0; i < contract.storeKeys.length; i++) {
                    const client = contract.storeKeys[i];
                    const clientStore = await contract.methods.stores(client).call(); // Get store data
                    const timeElapsed = currentTime - clientStore.time;

                    // Check if one minute has elapsed since the last submission
                    if (timeElapsed >= 60) {
                        await contract.methods.submitProve(client).send({ from: 'YOUR_SENDER_ADDRESS' });
                        console.log(`Proof submitted for client ${client}`);
                    }
                }
            } catch (error) {
                console.error('Error triggering submitProve:', error);
            }
        };

        // Trigger submitProve initially and then every minute
        triggerSubmitProve(); // Trigger initially
        const intervalId = setInterval(triggerSubmitProve, 60000); // Trigger every minute (60000 milliseconds)

        // Clean up interval when component unmounts
        return () => {
            clearInterval(intervalId);
        };
    }, []); // Only run this effect once on component mount

    return <div>Periodically triggering submitProve function...</div>;
}

export default ContractEventTrigger;