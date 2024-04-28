import React from 'react';
import { BrowserRouter , Route, Routes } from 'react-router-dom';
import './App.css';
import LandingPage from './view/LandingPage';
import AccessContract from './view/AccessContract'; // Import the OtherPage component
import Payment from './view/Payment';
import ViewEvent from './view/ViewEvent';
import AccountDetails from './view/AccountDetails';
import ContractBalance from './view/ContractBalance';
import ClientStore from './view/ClientStore';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header">
          <Routes>
            <Route exact path="/" element={<LandingPage />} /> {/*change name*/}
            <Route exact path="/store" element={<ClientStore />} /> 
            <Route exact path="/contract" element={<AccessContract />} /> {/* useless */}
            <Route exact path="/payment" element={<Payment />} />
            <Route exact path="/view" element={<ViewEvent />} />
            <Route exact path="/account" element={<AccountDetails />} />
            <Route exact path="/contract_balance" element = {<ContractBalance/>} />
          </Routes>
        </header>
      </div>
    </BrowserRouter>
  );
}

export default App;