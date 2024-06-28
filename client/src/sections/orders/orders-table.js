import EllipsisVerticalIcon from "@heroicons/react/24/solid/EllipsisVerticalIcon";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Avatar,
  Box,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  Link,
  Menu,
  ListItemIcon,
  Select,
  Stack,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";
import { format, parseISO } from "date-fns";
import PropTypes from "prop-types";
import { useState } from "react";
import { useDispatch } from "react-redux";
import api from "src/api";
import { Scrollbar } from "src/components/scrollbar";
import { loadOperators } from "src/redux/actions/admin";

const statusMap = {
  Online: {
    color: "success.main",
    label: "Online",
  },
  Break: {
    color: "neutral.500",
    label: "Break",
  },
  Busy: {
    color: "neutral.500",
    label: "Busy",
  },
  Delivered: {
    color: "warning.main",
    label: "Delivered",
  },
  Placed: {
    color: "info.main",
    label: "Placed",
  },
  Offline: {
    color: "error.main",
    label: "Offline",
  },
};

export const OrdersTable = (props) => {
  const {
    count = 0,
    items = [],
    onPageChange = () => {},
    page = 0,
    rowsPerPage = 0,
    onRowsPerPageChange,
  } = props;

  const dispatch = useDispatch();
  const [editableOrderId, setEditableOrderId] = useState(null);
  const [editedOrder, setEditedOrder] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

 


  const handleEditClick = (order) => {
    setEditableOrderId(order._id);
    // setEditedOrder(order);
setEditedOrder({
      ...order,
      operatorData: {
        ...order.operatorData,
        website: Array.isArray(order?.operatorData?.website)
          ? order.operatorData.website
          : [], 
      },
    });
    setAnchorEl(null);

  };

  const handleDeleteClick = (orderId) => {
    setSelectedOrderId(orderId);
    setOpen(true);
  };

  const handleFinalDelete = async () => {
    // Call your delete function here
    try {
      await api.delete(`/user/admin/delete-operator/${selectedOrderId}`);
      setEditableOrderId(null);
      dispatch(loadOperators());
      setAnchorEl(null);
    } catch (error) {
      console.error("Failed to save order", error);
    }
    console.log("Deleting order with id:", selectedOrderId);
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSaveClick = async () => {
    try {
      await api.put(`/user/admin/update-operator/${editableOrderId}`, editedOrder);
      setEditableOrderId(null);
      dispatch(loadOperators());
      // Optionally, refresh data here or update the state with new data
    } catch (error) {
      console.error("Failed to save order", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
  setEditedOrder((prev) => {
    if (name === "pricingPerMinute" || name === "website") {
      return {
        ...prev,
        [name]:value,
        operatorData: {
          ...prev.operatorData,
          [name]: value,
        },
      };
    }
    return {
      ...prev,
      [name]: value,
    };
  });
  };


  
  const handleWebsiteChange = (event) => {
    const { value } = event.target;
    setEditedOrder((prev) => ({
      ...prev,
      operatorData: {
        ...prev.operatorData,
        website: typeof value === 'string' ? value.split(',') : value,
      },
    }));
  };
// console.log(editedOrder)


  const handleMenuClick = (event, order) => {
    setAnchorEl(event.currentTarget);
    setSelectedOrder(order);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

console.log(items,"items")
  
  return (
    <div>
      <Scrollbar>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell>IMMAGINE</TableCell>
              <TableCell>DATA</TableCell>
              <TableCell>Operatore</TableCell>
              <TableCell>Stato</TableCell>
              <TableCell>Sito web</TableCell>
              <TableCell>Prezzo/minuto</TableCell>
              <TableCell>Guadagnare

              </TableCell>
              <TableCell>Breve descrizione</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((order,i) => {
              const isEditable = order._id === editableOrderId;
              const status = statusMap[order.loggedIn];

              const createdDate = format(parseISO(order.createdAt), "dd-MM-yyyy");
              const createdTime = format(parseISO(order.createdAt), "hh:mm a");

              return (
                <TableRow key={i}>
                  <TableCell>
                    <Link color="inherit" href="#" underline="none" variant="subtitle2">
                      <Avatar
                        alt={order.name}
                        src={`${process.env.REACT_APP_API_URI}/${order.image}`}
                      />
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Typography color="inherit" variant="inherit">
                      {createdDate}
                    </Typography>
                    <Typography color="text.secondary" variant="inherit">
                      {createdTime}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {isEditable && order ? (
                      <TextField name="name" value={editedOrder.name} onChange={handleChange} />
                    ) : (
                      <Typography color="inherit" variant="inherit">
                        {order.name}
                      </Typography>
                    )}
                    <Typography color="text.secondary" variant="inherit">
                      {order.email}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {isEditable && order ? (
                      <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                        <InputLabel id="demo-select-small-label">Status</InputLabel>
                        <Select
                          labelId="demo-select-small-label"
                          id="demo-select-small"
                          value={editedOrder.loggedIn}
                          label="Status"
                          name="loggedIn"
                          onChange={handleChange}
                        >
                          <MenuItem value={"Online"}>Online</MenuItem>
                          <MenuItem value={"Offline"}>Offline</MenuItem>
                          <MenuItem value={"Break"}>Break</MenuItem>
                          <MenuItem value={"Busy"}>Busy</MenuItem>
                        </Select>
                      </FormControl>
                    ) : (
                      <Stack alignItems="center" direction="row" spacing={1}>
                        <Box
                          sx={{
                            backgroundColor: status?.color,
                            borderRadius: "50%",
                            height: 8,
                            width: 8,
                          }}
                        />
                        <Typography variant="body2">{status?.label}</Typography>
                      </Stack>
                    )}
                  </TableCell>
                  <TableCell>
                    {isEditable && order ? (
                       <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                       <InputLabel id="demo-select-small-label">Website</InputLabel>
                       <Select
                         labelId="demo-select-small-label"
                         id="demo-select-small"
                         multiple
                         value={editedOrder?.operatorData?.website || []}
                         label="Website"
                         name="website"
                         onChange={handleWebsiteChange}
                         renderValue={(selected) => Array.isArray(selected) ? selected.join(', ') : ''}
                       >
                         <MenuItem value={"A_Website"}>A Website</MenuItem>
                         <MenuItem value={"B_Website"}>B Website</MenuItem>
                         <MenuItem value={"C_Website"}>C Website</MenuItem>
                       </Select>
                     </FormControl>
                   ) : (
                     <Stack alignItems="center" direction="row" spacing={1}>
                      <Typography variant="body2">
                          {Array.isArray(order?.operatorData?.website) ? order.operatorData.website.join(', ') : "NA"}
                        </Typography>
                     </Stack>
                   )}
                      {/* <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                        <InputLabel id="demo-select-small-label">Website</InputLabel>
                        <Select
                          labelId="demo-select-small-label"
                          
                          id="demo-select-small"
                          value={editedOrder?.operatorData?.website}
                          label="Website"
                          name="website"
                          onChange={handleChange}
                        >
                          <MenuItem value={"A_Website"}>A Website</MenuItem>
                          <MenuItem value={"B_Website"}>B Website</MenuItem>
                          <MenuItem value={"C_Website"}>C Website</MenuItem>
                        </Select>
                      </FormControl>
                    ) : (
                      <Stack alignItems="center" direction="row" spacing={1}>
                      
                        <Typography variant="body2">{order?.operatorData?.website || "NA"}</Typography>
                      </Stack>
                    )}  */}
                  </TableCell>
                  <TableCell>
                  {isEditable && order ? (
                      <TextField name="pricingPerMinute" value={editedOrder?.operatorData?.pricingPerMinute} onChange={handleChange} />
                    ) : (
                      <Typography color="inherit" variant="inherit">
                        €{order?.operatorData?.pricingPerMinute || 0}
                      </Typography>
                    )}
                    </TableCell>
                  <TableCell style={{display:"flex",flexDirection:"column"}}>
                  <Typography color="inherit" variant="inherit">
            <strong>Settimanalmente:</strong> €{order?.weeklyTransaction}  <strong>Day:</strong>:{order?.dailyMinutes}min
          </Typography>
          <Typography color="inherit" variant="inherit">
            <strong>Mensile:</strong> €{order?.monthlyTransaction}  <strong>Settimanalmente:</strong>{order?.weeklyMinutes}min
          </Typography>
          <Typography color="inherit" variant="inherit">
            <strong>Annuale:</strong> €{order?.yearlyTransaction} <strong>Mensile:</strong>:{order?.monthlyMinutes}min
          </Typography>
          <Typography color="inherit" variant="inherit">
            <strong>Totale:</strong> €{order?.transaction}  <strong>Totale:</strong>:{order?.totalMinutes}min
          </Typography>
               
              
            
       
                 </TableCell>

                     <TableCell>
                  {isEditable && order ? (
                      <TextField  
                      multiline 
                      name="shortDiscription" 
                      value={editedOrder?.shortDiscription}
                       onChange={handleChange} />
                    ) : (
                      <Typography color="inherit" variant="inherit">
                        {order?.shortDiscription}
                      </Typography>
                    )}
                    </TableCell>
                  <TableCell align="right">
                    {isEditable ? (
                      <>
                        <Button onClick={handleSaveClick}>Save</Button>
                        <Button
                          color="error"
                          onClick={() => {
                            setEditableOrderId(null);
                            setEditedOrder({});
                          }}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <IconButton onClick={(event) => handleMenuClick(event, order)}>
                          <SvgIcon fontSize="small">
                            <EllipsisVerticalIcon />
                          </SvgIcon>
                        </IconButton>
                        <Menu
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl)}
                          onClose={handleMenuClose}
                          PaperProps={{
                            elevation: 1,
                            sx: {
                              overflow: "visible",
                              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                              mt: 1.5,
                              "& .MuiAvatar-root": {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                              },
                              "&:before": {
                                content: '""',
                                display: "block",
                                position: "absolute",
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: "background.paper",
                                transform: "translateY(-50%) rotate(45deg)",
                                zIndex: 0,
                              },
                            },
                          }}
                          transformOrigin={{ horizontal: "right", vertical: "top" }}
                          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                        >
                          <MenuItem onClick={() => handleEditClick(selectedOrder)}>
                            <ListItemIcon>
                              <EditIcon fontSize="small" />
                            </ListItemIcon>
                            Edit
                          </MenuItem>
                          <MenuItem onClick={() => handleDeleteClick(selectedOrder._id)}>
                            <ListItemIcon>
                              <DeleteIcon fontSize="small" />
                            </ListItemIcon>
                            Delete
                          </MenuItem>
                        </Menu>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Conferma Eliminazione</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Sei sicuro di voler eliminare definitivamente l'operatore? Questa azione non può essere annullata.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Annulla
        </Button>
        <Button onClick={handleFinalDelete} color="primary" autoFocus>
          Conferma
        </Button>
      </DialogActions>
    </Dialog>
      </Scrollbar>
      <Divider />
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={count}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
      />
    </div>
  );
};

OrdersTable.propTypes = {
  items: PropTypes.array,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
};
