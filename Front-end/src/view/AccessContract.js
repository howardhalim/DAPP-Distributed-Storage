import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import fetchBalance from '../component/fetchBalance';
import { fetchContractOwner } from '../component/fetchContractOwner';
import fetchContracts from '../component/fetchContract';

function AccessContract() {
    const [contracts, setContracts] = useState([]);
    const [selectedContract, setSelectedContract] = useState('');
    const [balance, setBalance] = useState({});
    const [contractAddress, setContractAddress] = useState('');
    const [contractOwners, setContractOwners] = useState({});



    useEffect(() => {
        async function contract() {
            const { contractAddresses } = await fetchContracts();
            setContracts(contractAddresses);
            const owners = {};
            const bal = {};
            for (const contractAddress of contractAddresses) {
                const owner = await fetchContractOwner(contractAddress);
                const bals = await fetchBalance(contractAddress);
                owners[contractAddress] = owner;
                bal[contractAddress] = bals

            }
            setContractOwners(owners);
            setBalance(bal);
        }
        contract();
    }, []);

    

    const handleContractChange = (event) => {
        setSelectedContract(event.target.value);
        setContractAddress(event.target.value);
    };


    return (
        <div className="contract-page">
            <h1>Contract Information</h1>
                <Box>
                    <div className="dropdown">
                        <label htmlFor="contractDropdown">Select Contract:</label>
                        <select id="contractDropdown" value={selectedContract} onChange={handleContractChange}>
                            <option value="">-- Select Contract --</option>
                            {contracts.map(contract => (
                                <option key={contract} value={contract}>{contract}</option>
                            ))}
                        </select>
                        {selectedContract && contractAddress && contractOwners[selectedContract] && (
                            <div>
                                <p>Contract Address: {selectedContract}</p>
                                <p>Owner Address: {contractOwners[selectedContract]}</p>
                                <p>Contract Value = {String(balance[selectedContract])} Ether</p>
                            </div>
                        )}
                    </div>
                                    
                </Box>
          

        </div>
    );
}

export default AccessContract;