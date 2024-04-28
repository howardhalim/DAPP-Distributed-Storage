async function fetchContracts() {

    // Retrieve accounts from Ganache
    const contractAddresses = [
        "0x05FB60E6B9B14D88B033fB3dBC48b413a216Bb75",
        "0x309C55B8509AA719E71ef5C4B6D602b977F68387",
        "0xc20f1758D4fbCcF64297ea64810f9C5E32c9AEe1",
        "0x9C3e0E2D5ef13D4d9db564814A758af470f9d769",
        "0xCCd910F6b984aa22FdE05474903FFf92002FEeE2"
    ];

    return { contractAddresses };
}

export default fetchContracts;
