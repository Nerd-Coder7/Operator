import { Avatar, Box, IconButton, Stack, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import MenuIcon from '@mui/icons-material/Menu';
import { Logo } from "src/components/logo";

const TOP_NAV_HEIGHT = 64;

export const TopNav = ({toggleDrawer,isMobile}) => {
  const { user, users: onlineUsers } = useSelector((state) => state.user);

  const onlineCheck = (chat) => {
    const online = onlineUsers.find((user) => user.userId === chat._id);
    return online ? true : false;
  };

  return (
    <Box
      component="header"
      sx={{
        backgroundColor: "neutral.900",
        color: "common.white",
        position: "fixed",
        width: "100%",
        zIndex: (theme) => theme.zIndex.appBar,
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        sx={{
          minHeight: TOP_NAV_HEIGHT,
          px: 3,
        }}
      >
        <Stack alignItems="center" direction="row" spacing={2}>
          {isMobile && <IconButton sx={{padding: '0'}} onClick={toggleDrawer}>
          <MenuIcon />
        </IconButton> 
        }
        
          <Box
            sx={{
              display: "inline-flex",
              height: 24,
              width: 24,
            }}
          >
            <Logo />
          </Box>
        </Stack>

        <Stack alignItems="center" direction="row" spacing={2}>
          {user?.role === "user" && (
            <Typography variant="h5" component="h3" mr={3}>
              Portafoglio : €{user?.userData?.wallet?.toFixed(2) || 0}
            </Typography>
          )}
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <Avatar
              src={
                process.env.REACT_APP_API_URI + "/" + user?.image ||
                "/assets/avatars/avatar-chen-simmons.jpg"
              }
              variant="rounded"
            />
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: 13,
                height: 13,
                borderRadius: '50%',
                backgroundColor: onlineCheck(user) ? 'green' : 'red',
                border: '2px solid white', // Add border to create space between avatar and status indicator
              }}
            />
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
};