import { Box, Button, Card, Container, Divider, Stack, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { format, isSameWeek, isSameMonth, isSameYear } from "date-fns";
import api from "src/api";
import { loadOperators } from "src/redux/actions/admin";
import { OrdersSearch } from "src/sections/orders/orders-search";
import { OrdersTable } from "src/sections/orders/orders-table";

const Page = () => {
  const [mode, setMode] = useState("table");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const state = useSelector((state) => state.admin);
  const [orders, setOrders] = useState(state.operators);
  const [transactions, setTransactions] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadOperators());
    const fetchData = async () => {
      try {
        const data = await api.get("/payment/transactions");
        setTransactions(data?.data?.data);
      } catch (err) {
        console.log(err, "ERROR");
      }
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    const operatorTransactionMap = state.operators.reduce((acc, operator) => {
      acc[operator._id] = {
        ...operator,
        transaction: 0,
        weeklyTransaction: 0,
        monthlyTransaction: 0,
        yearlyTransaction: 0
      };
      return acc;
    }, {});

    transactions.forEach(transaction => {
      if (operatorTransactionMap[transaction.recepient] && transaction.status === "completed") {
        const transactionDate = new Date(transaction.createdAt);
        operatorTransactionMap[transaction.recepient].transaction += transaction.amount;

        if (isSameWeek(transactionDate, new Date())) {
          operatorTransactionMap[transaction.recepient].weeklyTransaction += transaction.amount;
        }
        if (isSameMonth(transactionDate, new Date())) {
          operatorTransactionMap[transaction.recepient].monthlyTransaction += transaction.amount;
        }
        if (isSameYear(transactionDate, new Date())) {
          operatorTransactionMap[transaction.recepient].yearlyTransaction += transaction.amount;
        }
      }
    });

    const updatedOperators = Object.values(operatorTransactionMap);

    setOrders(updatedOperators.slice(page * rowsPerPage, (page + 1) * rowsPerPage));
  }, [state.operators, page, rowsPerPage, transactions]);

  const handleModeChange = useCallback((event, value) => {
    if (value) {
      setMode(value);
    }
  }, []);

  const handleQueryChange = useCallback(
    (value) => {
      setQuery(value);
      setOrders(
        state.operators.filter((order) => order.name.toLowerCase().includes(value.toLowerCase()))
      );
    },
    [state.operators]
  );

  const handleChangePage = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page whenever rows per page changes
  }, []);

  return (
    <>
      <Helmet>
        <title>Operators</title>
      </Helmet>
      <Box sx={{ flexGrow: 1, py: 8 }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack
              alignItems="flex-start"
              direction="row"
              justifyContent="space-between"
              spacing={3}
            >
              <Typography variant="h4">OPERATORI</Typography>
              <Link to={"/operators-create"}>
                <Button color="primary" size="large" variant="contained">
                  Add
                </Button>
              </Link>
            </Stack>
            <div>
              <Card>
                <OrdersSearch
                  mode={mode}
                  onModeChange={handleModeChange}
                  onQueryChange={handleQueryChange}
                  query={query}
                />
                <Divider />
                <OrdersTable
                  count={state.operators.length}
                  items={orders}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Card>
            </div>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Page;
