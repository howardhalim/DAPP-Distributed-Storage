import React, { useState, useEffect } from 'react';
import fetchAccount from '../component/fetchAccount';
import fetchBalance from '../component/fetchBalance';
import fetchContracts from '../component/fetchContract';
import { fetchKeys } from '../component/fetchKeys';


function KeysList({ keys }) {
    if (keys.length === 0) {
        return (
            <div>
                <h2>No keys found.</h2>
            </div>
        );
    }
    return (
        <div>
            <h2>Keys:</h2>
            <ul>
                {keys.map((key, index) => (
                    <li key={index}>{index+1} : {key}</li>
                ))}
            </ul>
        </div>
    );
}
function AccountDetails() {
    const [accounts, setAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState('');
    const [contracts, setContracts] = useState([]);
    const [selectedContract, setSelectedContract] = useState('');
    const [balance, setBalance] = useState('');
    const [contractAddress, setContractAddress] = useState('');
    const [keys, setKeys] = useState([]);

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

    async function handleKeys() {
        const account = selectedAccount;
        const contract = selectedContract;
        try {
            const keys = await fetchKeys(contract, account);
            setKeys(keys);
        } catch (error) {
            console.error('Error fetching keys:', error.message);
        }
    }



    return (
        <div className="account-page">
            <h1>Account Page</h1>
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
            <button onClick={handleKeys} disabled={!selectedAccount || !selectedContract}>Select</button>
            {<KeysList keys={keys} />}
        </div>
    );
}

export default AccountDetails;

