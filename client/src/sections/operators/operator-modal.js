import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Box,
} from '@mui/material';
import api from 'src/api';
import { useNavigate } from 'react-router-dom';
import { useSocket } from 'src/utils/SocketContext';

const OperatorModal = ({ open, handleClose, operator, user }) => {
  const [topUpAmount, setTopUpAmount] = useState(0);
  const availableMinutes = Math.floor(user.userData?.wallet / (operator?.operatorData?.pricingPerMinute) || 0);
  const navigate = useNavigate();
  const socketId = useSocket();
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setTopUpAmount(event.target.value);
  };

  const handleAddMoney = async () => {
    if (!topUpAmount) return alert("Seleziona l'importo della ricarica");
    try {
      setLoading(true);
      const userId = user._id;
      const operatorId = operator._id;
      const amount = topUpAmount;
      let res = await api.post('/payment', { userId, operatorId, amount });
      handleClose()
      setLoading(false);
      if (res && res.data) {
        let link = res.data.links[1].href;
        window.location.href = link;
      }
    } catch (err) {
      setLoading(false);
    }
  };

  const handleCreateChat = async () => {
    const groupTitle = `${operator._id} ${user._id}`;
    const userId = user._id;
    const operatorId = operator._id;
    await api
      .post(`/chat/create-new-conversation`, {
        groupTitle,
        userId,
        operatorId,
      })
      .then((res) => {
        socketId.emit("newConversation", {
          operatorId,
          conversationId: res.data.conversation._id,
          userId,
        });
        navigate(`/chat?${res.data.conversation._id}`);
        sessionStorage.setItem('timeStart', Date.now());
      })
      .catch((error) => {
        console.error(error.response.data.message);
      });
  };

  const topUpMinutes = Math.floor(topUpAmount / (operator?.operatorData?.pricingPerMinute || 1));

  return (
    <>
    {loading ?(
      <Box display="flex" justifyContent="center" alignItems="center" height="200px">
        <CircularProgress />
      </Box>
    ) : (<Dialog open={open} onClose={handleClose}>
     
          <DialogTitle>{operator.name}</DialogTitle>
          <DialogContent>
            <Typography>
              Puoi parlare per <strong>{availableMinutes}</strong> minuti con il saldo attuale del tuo portafoglio.
            </Typography>
            <FormControl fullWidth margin="dense">
              <InputLabel>Importo della ricarica</InputLabel>
              <Select
                value={topUpAmount}
                onChange={handleChange}
                label="Top-Up Amount"
              >
                {[10, 20, 30, 40, 50, 100].map((amount) => (
                  <MenuItem key={amount} value={amount}>
                    €{amount}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {topUpAmount > 0 && (
              <Typography>
                Con una ricarica di {topUpAmount}€ avrai circa <strong>{Math.floor(topUpMinutes)}</strong> minuti in più.
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            {availableMinutes === 0 || !availableMinutes ? (
              <Button onClick={handleAddMoney} color="primary">
                Aggiungi denaro
              </Button>
            ) : (
              <>
                <Button onClick={handleCreateChat} color="primary">
                  Crea chat
                </Button>
                <Button onClick={handleAddMoney} color="primary">
                  Aggiungi denaro
                </Button>
              </>
            )}
            <Button onClick={handleClose} color="secondary">
              Annulla
            </Button>
          </DialogActions>
      

    </Dialog>      )}
    </>
  );
};

export default OperatorModal;
