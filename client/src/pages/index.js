import { Helmet } from 'react-helmet-async';
import { subDays, subHours, subMinutes } from 'date-fns';
import ShoppingBagIcon from '@heroicons/react/24/solid/ShoppingBagIcon';
import ShoppingCartIcon from '@heroicons/react/24/solid/ShoppingCartIcon';
import CurrencyDollarIcon from '@heroicons/react/24/solid/CurrencyDollarIcon';
import {
  Avatar,
  Box,
  Container,
  Stack,
  SvgIcon,
  Typography,
  Unstable_Grid2 as Grid
} from '@mui/material';
import { OverviewKpi } from 'src/sections/overview/overview-kpi';
import { OverviewLatestCustomers } from 'src/sections/overview/overview-latest-customers';
import { OverviewSummary } from 'src/sections/overview/overview-summary';
import { useEffect, useState } from 'react';
import axios from 'axios';
import api from 'src/api';

const now = new Date();

const Page = () => {
const [transaction,setTransation]=useState([])
const [completedTransaction,setCompletedTransaction]=useState(0)
const [operator,setOperator]=useState([])
const [conversation,setConversation]=useState([])
useEffect(()=>{
  const fetchData=async()=>{
    try{
      const allStats = await api.get("/user/admin/get-stats");
      setOperator(allStats?.data.operators)
      setConversation(allStats?.data.conversations)
      const data = await api.get('/payment/transactions');
      setTransation(data?.data?.data)
    const gotResult=  data?.data?.data.filter((el)=>el.status==="completed");
    const totalAmount = gotResult.reduce((sum, el) => sum + el.amount, 0);
      setCompletedTransaction(totalAmount);
    }catch(err){
      console.log(err,"ERROR")
    }
  }
  fetchData()
},[])

  return(
  <>
    <Helmet>
      <title>
        Overview 
      </title>
    </Helmet>
    <Box
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      <Container maxWidth="xl">
        <Stack spacing={3}>
          <div>
            <Typography variant="h4">
              Reports
            </Typography>
          </div>
          <div>
            <Grid
              container
              spacing={3}
            >
              <Grid
                xs={12}
                md={4}
              >
                <OverviewSummary
                  icon={
                    <Avatar
                      sx={{
                        backgroundColor: 'primary.main',
                        color: 'primary.contrastText',
                        height: 56,
                        width: 56
                      }}
                    >
                      <SvgIcon>
                        <ShoppingBagIcon />
                      </SvgIcon>
                    </Avatar>
                  }
                  label='Operators'
                  value={operator.length}
                />
              </Grid>
              <Grid
                xs={12}
                md={4}
              >
                <OverviewSummary
                  icon={
                    <Avatar
                      sx={{
                        backgroundColor: 'primary.main',
                        color: 'primary.contrastText',
                        height: 56,
                        width: 56
                      }}
                    >
                      <SvgIcon>
                        <ShoppingCartIcon />
                      </SvgIcon>
                    </Avatar>
                  }
                  label='Transactions'
             
                  value={transaction.length}
                />
              </Grid>
              <Grid
                xs={12}
                md={4}
              >
                <OverviewSummary
                  icon={
                    <Avatar
                      sx={{
                        backgroundColor: 'primary.main',
                        color: 'primary.contrastText',
                        height: 56,
                        width: 56
                      }}
                    >
                      <SvgIcon>
                        <CurrencyDollarIcon />
                      </SvgIcon>
                    </Avatar>
                  }
                  label='Revenue'
                  value={completedTransaction}
                />
              </Grid>
           
              <Grid xs={12}>
                <OverviewLatestCustomers
                  customers={transaction}
                />
              </Grid>
            </Grid>
          </div>
        </Stack>
      </Container>
    </Box>
  </>
);
}
export default Page;
