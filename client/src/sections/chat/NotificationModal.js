import React, { useEffect } from 'react';
import { Modal, Box, Typography, Button, Stack } from '@mui/material';

const NotificationModal = ({ open, handleClose,handleReject,conversationId, userId,message }) => {
  const audio = new Audio('/assets/message-notification.mp3');

  useEffect(() => {
    if (open) {
      audio.play();
    }
  }, [open]);

  return (
    <Modal
      open={open}
    //   onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={{ 
        position: 'absolute', 
        top: '50%', 
        left: '50%', 
        transform: 'translate(-50%, -50%)', 
        width: 400, 
        bgcolor: 'background.paper', 
        border: '2px solid #000', 
        boxShadow: 24, 
        p: 4 
      }}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
         Notification
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
         {message} {userId}.
        </Typography>
     {conversationId?   
     <Stack gap="10px" sx={{flexDirection: 'row'}}>
     <Button 
          variant="contained" 
          color="primary" 
          onClick={() => {
            handleClose();
          }}
          sx={{ mt: 2 }}
        >
          Accept
        </Button>     
        <Button 
          variant="contained" 
          color="error" 
          onClick={() => {
            handleReject();
          }}
          sx={{ mt: 2 }}
        >
          Reject
        </Button>
        </Stack>

        
        
        
    :
    <Button 
    variant="contained" 
    color="primary" 
    onClick={() => {
      handleClose();
    }}
    sx={{ mt: 2 }}
  >
    Close
  </Button>
    }
      </Box>
    </Modal>
  );
};

export default NotificationModal;
