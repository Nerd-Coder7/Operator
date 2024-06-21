import PropTypes from 'prop-types';
import { format } from 'date-fns';
import numeral from 'numeral';
import {
  Button,
  Card,
  CardHeader,
  Chip,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import { useState } from 'react';

export const OverviewLatestCustomers = (props) => {
  const { customers = [] } = props;
  const [length,setLength]=useState(5)
  return (
    <Card>
    <CardHeader
      action={(
        <Button
          color="inherit"
          onClick={() => length > 5 ? setLength(5) : setLength(customers?.length)}
        >
          {length > 5 ? "Mostra meno" : customers?.length > 5 && "Mostra tutto"}
        </Button>
      )}
      title="Ultimi Movimenti"
    />
    <Divider />
    <Scrollbar>
      <Table sx={{ minWidth: 500 }}>
        <TableBody>
          {customers.slice(0, length).map((customer) => {
            const createdDate = new Date(customer?.createdAt).toLocaleDateString("it-IT", { timeZone: 'UTC' });
            const amountSpent = numeral(customer?.amount).format('$0,0.00');

            return (
              <TableRow key={customer?._id}>
                <TableCell>
                  <Stack alignItems="center">
                    <Typography variant="subtitle2">
                      {createdDate}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Typography
                    noWrap
                    variant="body2"
                  >
                    {customer?.sender}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    color="text.secondary"
                    noWrap
                    variant="body2"
                  >
                    <Typography
                      color="text.primary"
                      component="span"
                      variant="subtitle2"
                    >
                      {customer?.orders}
                    </Typography>
                    {' '}
                    ordini effettuati
                  </Typography>
                  <Typography
                    color="text.secondary"
                    noWrap
                    variant="body2"
                  >
                    <Typography
                      color="text.primary"
                      component="span"
                      variant="subtitle2"
                    >
                      {amountSpent}
                    </Typography>
                    {' '}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  {customer?.status?.toLowerCase() === "completed" ? (
                    <Chip
                      color="success"
                      label="Completato"
                      size="small"
                    />
                  ) : customer?.status?.toLowerCase() === "created" ? (
                    <Chip
                      color="info"
                      label={customer?.status}
                      size="small"
                    />
                  ) : (
                    <Chip
                      color="warning"
                      label={customer?.status}
                      size="small"
                    />
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Scrollbar>
  </Card>
  );
};

OverviewLatestCustomers.propTypes = {
  customers: PropTypes.array
};
