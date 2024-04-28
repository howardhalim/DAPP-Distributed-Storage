import { Link } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

function LandingPage() {
    return (
        <Box>
            <Typography variant="h2">Welcome to the Landing Page</Typography>
            <ul>
                <li><Link to="/store">Go to Store</Link></li>
                <li><Link to="/contract">Access Contract</Link></li>
                <li><Link to="/payment">Make a Payment</Link></li>
                <li><Link to="/view">View Events</Link></li>
                <li><Link to="/account">Account Details</Link></li>
                <li><Link to="/contract_balance">Contract Payback</Link></li>
            </ul>
        </Box>
    );
}

export default LandingPage;