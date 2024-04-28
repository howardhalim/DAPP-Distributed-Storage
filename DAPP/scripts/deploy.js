const hre = require("hardhat");

async function main() {
    const accounts = await hre.ethers.getSigners();
    //deploying 5 contracts
    for (let i = 0; i < 5; i++) {
        const contracts = await hre.ethers.getContractFactory('Storage');
        const signer = accounts[i];
        // const pricePerByte = (Math.floor(Math.random() * 9) + 1) * 10000 + 10000; //10000 - 90000 (multiple of 10000)

        const pricePerByte = (Math.floor(Math.random() * 9) + 1) * 100000000 + 100000000; //100000000 - 900000000 (multiple of 100000000) demo purpose only for higher impact

        const _contract = await contracts.connect(signer).deploy(pricePerByte, { value: "2000000000000000000", gasLimit: 5000000 });
        await _contract.waitForDeployment();
        console.log(`Storage deployed to ${i}:`, await _contract.getAddress());
    }
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });