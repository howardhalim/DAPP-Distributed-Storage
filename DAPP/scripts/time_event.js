const { ethers } = require("hardhat");

// Queue for submitProof function calls
const proofQueue = [];
let isProcessingProofQueue = false;

async function send_proof() {
    // Your script logic goes here
    const contractAddresses = [
        "0x05FB60E6B9B14D88B033fB3dBC48b413a216Bb75",
        "0x309C55B8509AA719E71ef5C4B6D602b977F68387",
        "0xc20f1758D4fbCcF64297ea64810f9C5E32c9AEe1",
        "0x9C3e0E2D5ef13D4d9db564814A758af470f9d769",
        "0xCCd910F6b984aa22FdE05474903FFf92002FEeE2"
    ];
    const accounts = await ethers.getSigners();
    const signers = {};
    accounts.forEach(account => {
        signers[account.address] = account;
    });
    console.log("Starting..."); //indicates event running (every 1 mins)

    for (let i = 0; i < contractAddresses.length; i++) {
        const contract = await ethers.getContractAt("Storage", contractAddresses[i]);
        await run_time_event(contract, signers);
    }
}

async function run_time_event(contract, signers) {
    const stores = await contract.getAllStore();
    for (let i = 0; i < stores.length; i++) {
        const store = stores[i];
        if (store.done == false) {
            // Add the submitProof function call to the queue
            proofQueue.push(async () => {
                
                try {
                    await contract.submitProof(store.client, store.key, { gasLimit: 5000000});
                    // await contract.forceFail(store.client, store.key, { gasLimit: 5000000 });
                    console.log("Proof Submitted to Transaction: ", store.key);
                } catch (error) {
                    console.error("Failed to submit proof for Transaction:", store.key, error.message);
                }
                
            });
        }
    }

    // Process the proof queue if it's not already being processed
    if (!isProcessingProofQueue) {
        isProcessingProofQueue = true;
        while (proofQueue.length > 0) {
            const nextProofFunction = proofQueue.shift();
            await nextProofFunction();
        }
        isProcessingProofQueue = false;
    }
}

// Call the function immediately
send_proof();
// Call the function every 1 minute (60,000 milliseconds)
setInterval(send_proof, 60000);
