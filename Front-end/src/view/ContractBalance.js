import React, { useState, useEffect } from 'react';
import fetchContracts from '../component/fetchContract';
import { getContractBalance } from '../component/getContractBalance';
import { fetchContractOwner } from '../component/fetchContractOwner';
import { Button, Box, Typography, Modal } from '@mui/material';
import { contractToOwner } from '../component/contractToOwner';


function ContractBalance() {
    const [contracts, setContracts] = useState([]);
    const [selectedContract, setSelectedContract] = useState('');
    const [contractAddress, setContractAddress] = useState('');
    const [contractBalance, setContractBalance] = useState('');
    const [contractOwners, setContractOwners] = useState('');
    const [value, setValue] = useState();
    const [isFailModalOpen, setIsFailModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

    useEffect(() => {
        async function contract() {
            const { contractAddresses } = await fetchContracts();
            console.log(contractAddresses);
            setContracts(contractAddresses);
            const owners = {};
            for (const contractAddress of contractAddresses) {
                const owner = await fetchContractOwner(contractAddress);
                owners[contractAddress] = owner;
            }
            setContractOwners(owners);
        }
        contract();
    }, []);


    useEffect(() => {
        async function fetchContractBalance() {
            const bal = await getContractBalance(contractAddress);
            await setContractBalance(bal);
        }
        if (contractAddress) {
            fetchContractBalance();
        }
    },[contractAddress]);


    const handleContractChange = (event) => {
        const selectedContract = event.target.value;
        setSelectedContract(selectedContract);
        if (!selectedContract) {
            // If the selected contract is empty, clear the contract address and balance
            setContractAddress('');
            setContractBalance('');
        } else {
            setContractAddress(selectedContract);
        }
    };

    const handleClaimMoney = async() => {
        const res = await contractToOwner(selectedContract, value);
        if (res === "Fail") {
            setIsFailModalOpen(true);
        } else {
            setIsSuccessModalOpen(true);
        }

        setValue('');

    }



    return (
        <div className="contract-page">
            <h1>Contract Payback</h1>
            <div className="dropdown">
                <label htmlFor="contractDropdown">Select Contract:</label>
                <select id="contractDropdown" value={selectedContract} onChange={handleContractChange}>
                    <option value="">-- Select Contract --</option>
                    {contracts.map(contract => (
                        <option key={contract} value={contract}>{contract}</option>
                    ))}
                </select>
                {contractBalance &&
                    
                    <div>
                        <p>Current Balance: {contractBalance} ETH</p>
                        <p>Contract Owner: {contractOwners[selectedContract]}</p>
                        <p>(1 wei = 10^-18 ETH)</p>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 3 }}>
                            <p style={{ mr: 2, minWidth: '130px' }}>Value (in Wei): </p>
                            <input
                                type="number"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                style={{ width: '20%', fontSize: '1rem' }}
                            />
                        </Box>
                        <Button onClick={handleClaimMoney} variant="contained" color="primary">Claim Money</Button>
                    </div>
                    
                    
                
                }
            </div>
            <Modal
                open={isFailModalOpen}
                onClose={() => setIsFailModalOpen(false)}
            >
                <Box sx = {style_key}>
                    <Typography>Claiming money failed. Please try again.</Typography>
                </Box>
            </Modal>
            <Modal
                open={isSuccessModalOpen}
                onClose={() => setIsSuccessModalOpen(false)}
            >
                <Box sx={style_key}>
                    <Typography>Money claimed successfully.</Typography>
                </Box>
            </Modal>
        </div>
    );
}

export default ContractBalance;

const style_key = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%', // Change width to cover 80% of the screen
    height: '8vh',
    maxWidth: 1200, // Optional: set a maximum width if needed
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};