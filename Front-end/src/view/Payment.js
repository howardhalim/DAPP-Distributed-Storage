import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import fetchBalance from '../component/fetchBalance';
import fetchData from '../component/fetchData';
import fetchAccountContract from '../component/fetchAccountContract';
import fetchAccount from '../component/fetchAccount';
import { getContractBalance } from '../component/getContractBalance';
import { contractPayment } from '../component/contractPayment';
import fetchContracts from '../component/fetchContract';
import { fetchEvent } from '../component/fetchEvent';
import EventTable from '../component/eventTable';


function Payment() {
    const [accounts, setAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState('');
    const [contracts, setContracts] = useState([]);
    const [selectedContract, setSelectedContract] = useState('');
    const [balance, setBalance] = useState('');
    const [contractAddress, setContractAddress] = useState('');
    const [contractOwners, setContractOwners] = useState({});
    const [contractBalance, setContractBalance] = useState('');
    const [events, setEvents] = useState(null);

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

    
    const handleListClick = async () => {
        try {
            // Check if both selectedAccount and selectedContract are selected
            if (selectedAccount && selectedContract) {
                // Fetch events using selectedContract and selectedAccount
                const fetchedEvents = await fetchEvent(selectedContract, selectedAccount);
                // Update the state with fetched events
                const eventValues = fetchedEvents.map(event => event.returnValues);
                setEvents(eventValues);
                console.log(events);
            }
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    return (
        <div className="payment-page">
            <h1>Payment Page</h1>
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

            {selectedAccount && ( // Render the contract dropdown only if an account is selected
                <Box>
                    <div className="dropdown">
                        <label htmlFor="contractDropdown">Select Contract:</label>
                        <select id="contractDropdown" value={selectedContract} onChange={handleContractChange}>
                            <option value="">-- Select Contract --</option>
                            {contracts.map(contract => (
                                <option key={contract} value={contract}>{contract}</option>
                            ))}
                        </select>
                        
                    </div>
                    <button onClick={handleListClick} disabled={!selectedAccount || !selectedContract}>List Submission</button>

                </Box>
            )}
            {events && (
                <EventTable selectedAccount={selectedAccount} selectedContract={selectedContract} events={events} />
            )}
        </div>
    );
}

export default Payment;