import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import client from './utils/apolloClient';
import OpportunityListPage from './pages/OpportunityListPage';

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Routes>
          <Route path="/:page?/:committee?/:programme?" element={<OpportunityListPage />} />
        </Routes>
      </Router>
    </ApolloProvider>
  );
}

export default App;