import { Drawer, List, ListItem, ListItemIcon, ListItemText, SvgIcon } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink, matchPath, useLocation } from 'react-router-dom';
import { LogoutUserT } from 'src/redux/actions/user';
import { items } from './config';

const SIDE_NAV_WIDTH = 73;
const TOP_NAV_HEIGHT = 64;

export const SideNav = () => {
  const location = useLocation();
  const { user } = useSelector((state) => state.user);
const dispatch = useDispatch();
 
const handleLogout=async()=>{
  try{
await dispatch(LogoutUserT())
  }catch(e){
console.log(e)
  }
}

  return (
    <Drawer
      open
      variant="permanent"
      PaperProps={{
        sx: {
          backgroundColor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
          height: `calc(100% - ${TOP_NAV_HEIGHT}px)`,
          p: 1,
          top: TOP_NAV_HEIGHT,
          width: SIDE_NAV_WIDTH,
          zIndex: (theme) => theme.zIndex.appBar - 100
        }
      }}
    >
      <List sx={{ width: '100%', flexGrow: 1 }}>
        {items.map((item) => {
          const active = matchPath({ path: item.href, end: true }, location.pathname);

          if (item?.role === 'all' || item?.role === user?.role) {
            return (
              <ListItem
                disablePadding
                component={RouterLink}
                key={item.href}
                to={item.href}
                sx={{
                  flexDirection: 'column',
                  px: 2,
                  py: 1.5
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 'auto',
                    color: active ? 'primary.main' : 'neutral.400'
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    variant: 'caption',
                    sx: {
                      color: active ? 'primary.main' : 'text.secondary'
                    }
                  }}
                />
              </ListItem>
            );
          }
          
          return null; // If the condition is not met, return null
        })}
      </List>
      <ListItem
        disablePadding
        sx={{
          flexDirection: 'column',
          px: 2,
          py: 1.5,
          cursor: 'pointer'
        }}
        onClick={handleLogout}
      >
        <ListItemIcon
          sx={{
            minWidth: 'auto',
            color: 'neutral.400'
          }}
        >
          <SvgIcon>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
            </svg>
          </SvgIcon>
        </ListItemIcon>
        <ListItemText
          primary={"Logout"}
          primaryTypographyProps={{
            variant: 'caption'
          }}
        />
      </ListItem>
    </Drawer>
  );
};
