import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import fetchAccount from '../component/fetchAccount';
import fetchBalance from '../component/fetchBalance';
import fetchContracts from '../component/fetchContract';
import { userStore } from '../component/userStore';
import { fetchContractOwner } from '../component/fetchContractOwner';
import { fetchPricePerByte } from '../component/fetchPricePerByte';

function ClientStore() {
    const [accounts, setAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState('');
    const [contracts, setContracts] = useState([]);
    const [selectedContract, setSelectedContract] = useState('');
    const [balance, setBalance] = useState('');
    const [contractAddress, setContractAddress] = useState('');
    const [contractOwners, setContractOwners] = useState({});

    const [keyValue, setKeyValue] = useState('');
    const [showModal, setShowModal] = useState(false);

    const [sizeValue, setSizeValue] = useState('');
    const [duration, setDuration] = useState('');

    const [pricePerByte, setPricePerByte] = useState({});

    useEffect(() => {
        async function account() {
            const { accounts } = await fetchAccount();
            setAccounts(accounts);
        }
        account();
    }, []);

    useEffect(() => {
        async function contract() {
            const { contractAddresses } = await fetchContracts();
            console.log(contractAddresses);
            setContracts(contractAddresses);
            const owners = {};
            const price = {};
            for (const contractAddress of contractAddresses) {
                const owner = await fetchContractOwner(contractAddress);
                const pricePerByte = await fetchPricePerByte(contractAddress);
                owners[contractAddress] = owner;
                price[contractAddress] = pricePerByte

            }
            setContractOwners(owners);
            setPricePerByte(price);
        }
        contract();
    }, []);

    useEffect(() => {
        async function balance() {
            try {
                const balance = await fetchBalance(selectedAccount);
                setBalance(balance);
            } catch (error) {
                console.error('Error fetching balance:', error.message);
            }
        }

        balance();
    }, [selectedAccount]);

    const handleAccountChange = (event) => {
        setSelectedAccount(event.target.value);
    };

    const handleContractChange = (event) => {
        setSelectedContract(event.target.value);
        setContractAddress(event.target.value);
    };

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);


    async function handleStore() {
        const account = selectedAccount;
        const contract = selectedContract;
        console.log(account, contract, sizeValue, duration)
        const key = await userStore(account, contract, sizeValue, duration);
        setKeyValue(key);
        setShowModal(true);
        handleClose();
        setSizeValue('');
        setDuration('');
    }
    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <div className="client-store">
            <h1>Client Store</h1>
            <div className="dropdown">
                <label htmlFor="accountDropdown">Select Account:</label>
                <select id="accountDropdown" value={selectedAccount} onChange={handleAccountChange}>
                    <option value="">-- Select Account --</option>
                    {accounts.map(account => (
                        <option key={account} value={account}>{account}</option>
                    ))}
                </select>
                {selectedAccount && <p>Current Balance: {balance} ETH</p>}
            </div>
            <div className="dropdown">
                <label htmlFor="contractDropdown">Select Contract:</label>
                <select id="contractDropdown" value={selectedContract} onChange={handleContractChange}>
                    <option value="">-- Select Contract --</option>
                    {contracts.map(contract => (
                        <option key={contract} value={contract}>{contract}</option>
                    ))}
                </select>
            </div>
            <div>
                {selectedAccount !== contractOwners[selectedContract] ? (
                    <button onClick={handleOpen} disabled={!selectedAccount || !selectedContract}>Store</button>
                ) : (
                    <div>
                        <p style={{ color: 'red' }}>Error: You are the owner of the selected contract.</p>
                        <button disabled>Store</button>
                    </div>
                )}
            </div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', mt: 1 }}>
                        <IconButton
                            aria-label="close"
                            onClick={handleClose}
                            sx={{
                                position: 'absolute',
                                right: 0,
                                top: 0,
                                color: 'inherit',
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, mb: 2 }}>
                            <Typography variant="h6" sx={{ mr: 1, minWidth: '250px', fontSize: '1.5rem' }}>Client Address:</Typography>
                            <input
                                type="text"
                                value={selectedAccount}
                                readOnly
                                disabled
                                style={{ width: '100%', fontSize: '1.5rem' }}
                            />
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, mb: 2 }}>
                            <Typography variant="h6" sx={{ mr: 1, minWidth: '250px', fontSize: '1.5rem' }}>Contract Address:</Typography>
                            <input
                                type="text"
                                value={selectedContract}
                                readOnly
                                disabled
                                style={{ width: '100%', fontSize: '1.5rem' }}
                            />
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, mb: 2 }}>
                            <Typography variant="h6" sx={{ mr: 1, minWidth: '250px', fontSize: '1.5rem' }}>Price Per Byte (s):</Typography>
                            <input
                                type="text"
                                value={`${pricePerByte[selectedContract]} wei`}
                                readOnly
                                disabled
                                style={{ width: '100%', fontSize: '1.5rem' }}
                            />
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, mb: 2 }}>
                            <Typography variant="h6" sx={{ mr: 1, minWidth: '250px', fontSize: '1.5rem' }}>Size (in MB):</Typography>
                            <input
                                type="number"
                                value={sizeValue}
                                onChange={(e) => setSizeValue(e.target.value)}
                                style={{ width: '100%', fontSize: '1.5rem' }}
                            />
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, mb: 2 }}>
                            <Typography variant="h6" sx={{ mr: 1, minWidth: '250px', fontSize: '1.5rem' }}>Duration (in Minutes):</Typography>
                            <input
                                type="number"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                style={{ width: '100%', fontSize: '1.5rem' }}
                            />
                        </Box>


                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}> {/* Align button to the right */}
                        <button style={{ fontSize: '1.5rem' }} onClick={handleStore} >Store</button>
                    </Box>
                </Box>

            </Modal>
            <Modal open={showModal} onClose={handleCloseModal}>
                <Box sx={style_key}>
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseModal}
                        sx={{
                            position: 'absolute',
                            right: 0,
                            top: 0,
                            color: 'inherit',
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography variant='h6'>key : {keyValue}</Typography>
                </Box>
            </Modal>
        </div>
    );
}

export default ClientStore;

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%', // Change width to cover 80% of the screen
    height: '60vh',
    maxWidth: 1200, // Optional: set a maximum width if needed
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};
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