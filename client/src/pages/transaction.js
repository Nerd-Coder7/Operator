import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  List,
  Box,Stack,
  ListItem,
  ListItemText,
  Divider,
  Paper,
  Button
} from '@mui/material';
import { Helmet } from 'react-helmet-async';

const Page = () => {
  const [transactions, setTransactions] = useState([
    { type: 'credit', amount: 50, timestamp: new Date().toLocaleString() },
    { type: 'debit', amount: 20, timestamp: new Date().toLocaleString() },
  ]);

  // Fetch transaction data from API (useEffect example)
  useEffect(() => {
    // Fetch transaction data from your API and set it to state
    // setTransactions(response.data);
  }, []);

  return (
    <>
    <Helmet>
    <title>
    Ordini 
    </title>
  </Helmet>
  <Box
    sx={{
      flexGrow: 1,
      py: 8
    }}
  >
    <Container maxWidth="xl">
        <Stack
          alignItems="flex-start"
          direction="row"
          justifyContent="space-between"
          spacing={3}
        >
          <Typography variant="h4">
          Transazioni:-
          </Typography>
         
        </Stack>
    <Container component={Paper} sx={{ p: 3, mt: 5 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Cronologia delle transazioni</Typography>
      <List>
        {transactions.map((transaction, index) => (
          <React.Fragment key={index}>
            <ListItem>
              <ListItemText
                primary={`${transaction.type === 'credit' ? 'Credited' : 'Debited'}: ${transaction.amount} dollars`}
                secondary={transaction.timestamp}
              />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Container>
    </Container>
    </Box></>
  );
};

export default Page;
