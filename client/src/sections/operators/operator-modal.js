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
  InputLabel
} from '@mui/material';
import api from 'src/api';
import { useNavigate } from 'react-router-dom';
import { useSocket } from 'src/utils/SocketContext';

const OperatorModal = ({ open, handleClose, operator, user }) => {
  const [topUpAmount, setTopUpAmount] = useState(0);
  const availableMinutes = Math.floor(user.userData?.wallet / (operator?.operatorData?.pricingPerMinute || 0));
  const navigate = useNavigate();
  const socketId = useSocket();

  const handleChange = (event) => {
    setTopUpAmount(event.target.value);
  };

  const handleAddMoney = async () => {
    const userId = user._id;
    const operatorId = operator._id;
    const amount = topUpAmount;
    let res = await api.post('/payment', { userId, operatorId, amount });

    console.log(res);
    if (res && res.data) {
      let link = res.data.links[1].href;
      window.location.href = link;
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
        console.log(res,"NEW CONVErsaation")
        socketId.emit("newConversation", {
          operatorId,
          conversationId: res.data.conversation._id,
          userId,
        });
        navigate(`/chat?${res.data.conversation._id}`);
        sessionStorage.setItem('timeStart',Date.now())
      })
      .catch((error) => {
        console.error(error.response.data.message);
      });
  };
 
  const topUpMinutes = Math.floor(topUpAmount / (operator?.operatorData?.pricingPerMinute || 1));
console.log(topUpMinutes,topUpAmount,operator?.operatorData?.pricingPerMinute)
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{operator.name}</DialogTitle>
      <DialogContent>
        <Typography>
          You can talk for <strong>{availableMinutes}</strong> minutes with your current wallet balance.
        </Typography>
        <FormControl fullWidth margin="dense">
          <InputLabel>Top-Up Amount</InputLabel>
          <Select
            value={topUpAmount}
            onChange={handleChange}
            label="Top-Up Amount"
          >
            {[10, 20, 30, 40, 50, 100].map((amount) => (
              <MenuItem key={amount} value={amount}>
                ${amount}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {topUpAmount > 0 && (
          <Typography>
            With a ${topUpAmount} top-up, you will get approximately <strong>{Math.floor(topUpMinutes)}</strong> more minutes.
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        {availableMinutes === 0 ? (
          <Button onClick={handleAddMoney} color="primary">
            Add Money
          </Button>
        ) : (
          <>
            <Button onClick={handleCreateChat} color="primary">
              Create Chat
            </Button>
            <Button onClick={handleAddMoney} color="primary">
              Add Money
            </Button>
          </>
        )}
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OperatorModal;
