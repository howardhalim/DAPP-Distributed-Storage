import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';

function PaymentTable({ events }) {


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
                    </TableRow>
                </TableHead>
                <TableBody>
                    {events.map((event, index) => (
                        <TableRow key={index}>
                            <TableCell>{event.client}</TableCell>
                            <TableCell>{event.key}</TableCell>
                            <TableCell>{event.payment.toString()} wei</TableCell>
                            <TableCell>
                                {Number(event.status) === 1 ? 'Paid' : Number(event.status) === 2 ? 'Refunded' : ''}
                            </TableCell>

                            <TableCell>{event.time.toString()}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default PaymentTable;