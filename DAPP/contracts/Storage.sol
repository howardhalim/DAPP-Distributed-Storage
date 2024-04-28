// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
import "hardhat/console.sol";

contract Storage{
    address payable public owner;
    uint public pricePerByte; // price per bytes in wei
    address public contractAddress;
    uint private minimum_balance = 2 ether;

    event payment_receive(address _from, address _to, uint _value, bytes32 proofKey);
    event penalty_receive(address _from, address _to, uint _value, bytes32 proofKey);

    /**
     * @dev Allows the current owner to transfer control of the contract to a newOwner.
     * @param client client address
     * @param time total time of storage that has not been paid
     * @param payment total price that need to be paid until the time of event
     */
    event submit_proof(address client, uint time, uint payment, uint status, bytes32 key, bytes32 proofKey);
    event user_store(address client);
    event pay_to_owner(address _from, address _to, uint _value); // need to think about this
    struct Store{
        address client;
        bytes32 key;
        uint size; //in bytes
        uint total_price; //perSecond
        uint time;
        uint duration; //in minutes
        uint expiry_time;
        bool done; //soft delete
    }
    mapping(bytes32 => Store) public stores;
    mapping(address => bytes32[]) public clientKeys;
    bytes32[] public storeKeys;
    address[] public clientList;

    constructor (uint price) payable {
        owner = payable(msg.sender);
        contractAddress = address(this);
        pricePerByte = price;
    }

    function payment(bytes32 key, bytes32 proofKey) external payable{
        require(msg.value > 0, "Payment amount must be greater than zero");
        if(stores[key].expiry_time == stores[key].time){
            stores[key].done = true;
        }
        emit payment_receive(msg.sender, address(this), msg.value, proofKey);
    }
    
    function penalty(address _to, uint value, bytes32 proofKey) external{
        require(value < contractAddress.balance, "Penalty Amount must be less than contract balance");
        address payable to = payable(_to);
        to.transfer(value);
        emit penalty_receive(address(this), _to, value, proofKey);
    }

    function payToOwner(uint value) external{ //transfer will guarantee that at least approximately 2 ethers left in the contract //need update with variable value
        require(contractAddress.balance - value > minimum_balance,"Contract Does Not Have Balance" );
        owner.transfer(value);
        emit pay_to_owner(contractAddress, owner, value);
    }

    function userStore(uint _size, uint _duration) public returns(bytes32){
        uint total = _size * pricePerByte;
        require(total / _size == pricePerByte, "Multiplication overflow");
        require(msg.sender != owner, "Owner cannot store in its own");
        uint time_expiry = block.timestamp + (_duration * 60);
        emit user_store(msg.sender);

        bytes32 key = generateRandomKey();
        storeKeys.push(key);
        clientKeys[msg.sender].push(key);
        clientList.push(msg.sender);
        stores[key]= (Store(msg.sender,key,_size, total, block.timestamp, _duration *60, time_expiry,false));

        return key;
    }

    function submitProof(address _client, bytes32 key) public {
        
        require(!stores[key].done, "Transaction is Done!");
        require(stores[key].time < stores[key].expiry_time, "Transaction is Done! Payment need to be completed");

        uint expiry_time = stores[key].expiry_time;
        uint time_now;
        if(expiry_time < block.timestamp){
            time_now = expiry_time - stores[key].time;
            stores[key].time = expiry_time;
        }
        else{
            time_now = block.timestamp - stores[key].time;
            stores[key].time = block.timestamp;
        }
       
        uint payPrice = stores[key].total_price * time_now;
        require(payPrice / stores[key].total_price == time_now, "Multiplication overflow");
    
        bytes32 submit_key = generateRandomSubmissionKey(stores[key]);
        if(randomChance(key) < 10){
            //10% chance of fail
             emit submit_proof(_client, time_now, payPrice, 2, key, submit_key);
        }
        else{
            //success proof
            emit submit_proof(_client, time_now, payPrice, 1, key, submit_key);
        }
        
    }

    function forceFail(address _client, bytes32 key) public {
        
        require(!stores[key].done, "Transaction is Done!");
        require(stores[key].time < stores[key].expiry_time, "Transaction is Done! Payment need to be completed");

        uint expiry_time = stores[key].expiry_time;
        uint time_now;
        if(expiry_time < block.timestamp){
            time_now = expiry_time - stores[key].time;
            stores[key].time = expiry_time;
        }
        else{
            time_now = block.timestamp - stores[key].time;
            stores[key].time = block.timestamp;
        }
       
        uint payPrice = stores[key].total_price * time_now;
        require(payPrice / stores[key].total_price == time_now, "Multiplication overflow");
    
        bytes32 submit_key = generateRandomSubmissionKey(stores[key]);
        //force fail
        emit submit_proof(_client, time_now, payPrice, 2, key, submit_key);

        
    }

    function getClientList() public view returns(address[] memory){
        address[] memory list = clientList;
        return list;
    }
    function getKeyList() public view returns(bytes32[] memory){
        bytes32[] memory list = storeKeys;
        return list;
    }
    // Function to get client keys
    function getMyKeys() public view returns (bytes32[] memory) {
        return clientKeys[msg.sender];
    }

    // Function to get keys for a specific client
    function getClientKeys(address client) public view returns (bytes32[] memory) {
        return clientKeys[client];
    }
    
    function getContractBalance() public view returns (uint){
        return contractAddress.balance;
    }

    function getStore(bytes32 key) public view returns(Store memory){
        Store memory res = stores[key];
        return res;
    }
    function getAllStore() public view returns (Store[] memory){
        
        Store[] memory storeView = new Store[](storeKeys.length);
        // uint storeIndex;

        for(uint i=0; i<storeKeys.length;i++){
            Store memory clientStore = stores[storeKeys[i]];
            storeView[i] = Store(
                clientStore.client,
                clientStore.key,
                clientStore.size,
                clientStore.total_price,
                clientStore.time,
                clientStore.duration,
                clientStore.expiry_time,
                clientStore.done
            );
        }
        return storeView;
    }
    
    function getPricePerBytes() public view returns (uint){
        return pricePerByte;
    }

    function randomChance(bytes32 key) private view returns (uint) {
        return uint(keccak256(abi.encodePacked(block.timestamp, msg.sender, key)))%100;
    }

    function generateRandomKey() internal view returns (bytes32) {
        // Generate a random unique identifier using some randomness
        bytes32 key = keccak256(abi.encodePacked(block.timestamp, msg.sender, blockhash(block.number - 1)));

        // Ensure the generated key is unique
        if (stores[key].client != address(0)) {
            // Regenerate the key if it already exists
            return generateRandomKey();
        }
        return key;
    }

    function generateRandomSubmissionKey(Store memory store) internal view returns(bytes32){
        bytes32 key = keccak256(abi.encodePacked(block.timestamp, store.key, store.client, store.time, store.total_price));

        return key;
    }
}

