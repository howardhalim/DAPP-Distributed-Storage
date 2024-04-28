import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
import { contractPayment } from './contractPayment';
import { fetchEvent } from './fetchEvent';
import React, { useState , useEffect} from 'react';
import { contractPenalty } from './contractPenalty';







function EventTable({ selectedAccount, selectedContract, events }) {
    const [event, setEvent] = useState([]);

    useEffect(() => {
        // Update the event state when the events prop changes
        setEvent(events);
    }, [events]);


    const handleListClick = async (selectedAccount, selectedContract) => {
        try {
            // Check if both selectedAccount and selectedContract are selected
            if (selectedAccount && selectedContract) {
                // Fetch events using selectedContract and selectedAccount
                const fetchedEvents = await fetchEvent(selectedContract, selectedAccount);
                // Update the state with fetched events
                const eventValues = fetchedEvents.map(event => event.returnValues);
                setEvent(eventValues);
            }
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };
    const handleButtonClick = async (selectedAccount, selectedContract, event) => {
        // Add your logic to handle the button click here
        console.log('Payment button clicked:', event.payment.toString());
        // You can access event.client, event.key, event.payment, etc. here
        try {

            // Call the method to get contract balance
            await contractPayment(selectedContract, selectedAccount, event.payment.toString(), event.key, event.proofKey)
                .then(() => {
                    console.log('Payment successful');
                })
                .catch(error => {
                    console.error('Error making payment:', error.message);
                });

        } catch (error) {
            console.error('Error:', error.message);
        }
        await handleListClick(selectedAccount, selectedContract);
    };

    const handleConfirmClick = async (selectedAccount, selectedContract, event) =>{
        console.log('Penalty button clicked:', event.payment.toString());
        // You can access event.client, event.key, event.payment, etc. here
        try {

            // Call the method to get contract balance
            await contractPenalty(selectedContract, selectedAccount, event.payment.toString(), event.key, event.proofKey)
                .then(() => {
                    console.log('Payment successful');
                })
                .catch(error => {
                    console.error('Error making payment:', error.message);
                });

        } catch (error) {
            console.error('Error:', error.message);
        }
        await handleListClick(selectedAccount, selectedContract);
    }
    
    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Client</TableCell>
                        <TableCell>Key</TableCell>
                        <TableCell>Payment</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Time</TableCell>
                        <TableCell>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {event.map((event, index) => (
                        <TableRow key={index}>
                            <TableCell>{event.client}</TableCell>
                            <TableCell>{event.key}</TableCell>
                            <TableCell>{event.payment.toString()} wei</TableCell>
                            <TableCell>
                                {Number(event.status) === 1 ? 'Proof Submitted' : Number(event.status) === 2 ? 'Proof Failed' : ''}
                            </TableCell>

                            <TableCell>{event.time.toString()}</TableCell>
                            <TableCell>
                                {Number(event.status) === 1 ? (
                                    <Button onClick={() => handleButtonClick(selectedAccount, selectedContract, event)} variant="contained" color="primary">
                                        Pay
                                    </Button>
                                ) : Number(event.status) === 2 ? (
                                        <Button onClick={() => handleConfirmClick(selectedAccount, selectedContract, event)} variant="contained" color="secondary">
                                        Confirm
                                    </Button>
                                ) : null}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default EventTable;