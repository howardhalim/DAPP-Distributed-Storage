require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ethers");
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.13",
  defaultNetwork:'ganache',
  networks: {
    ganache: {
      url: "http://localhost:7545/", // Ganache default RPC server URL
      chainId: 1337, // Ganache chain ID
      accounts: [
        "0x3b6a23dbc9a7fa04a76ee76beffdd77a5ba9276f235a51d4c7281ffc373ecb57",
        "0x36e9c459821aa98178714f7b7b9de927169a3f3f7d3c07d3b7dd8c3ccbaa70e8",
        "0x95de92465774985a7329bf07b825cca7f44e4195661ed153e3205adfc678124f",
        "0x0ac0f49e95cad6a18515b43bb2a0c2f4fa2ef2b7dba2d347a47e2f095ed037ae",
        "0x44fe94f8337229104dbf766ba02864c45148975ad1689ff640ca1855a3c99cc8",
        "0x91174cdff69cc57b7d52a15364a538fd970a9457a65f99fe261faa746b727903",
        "0x0ea500995e2a4070d7a525451baffe710d3522c9a9931594401bb7c07b1d2246",
        "0x89f9f5219b6d74afd8a45122e96d3ddec2035ce87b9df425a1e2f78d51b3d2c3",
        "0x53114e7038c86bde2a3e3dc10c70aa94478d4add13760ac7f190f0e570d4fd91",
        "0xbf0ad3d5231b873c7983a74c46af11570129daeb8505e96bdfc37010c74abe76"
      ],
      gas: 100000000000000
    }
  },
};