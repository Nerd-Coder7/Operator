import { styled,useTheme  } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { Footer } from './footer';
import { SideNav } from './side-nav';
import { TopNav } from './top-nav';
import { useEffect, useState } from 'react';
import { useMediaQuery } from '@mui/material';


const SIDE_NAV_WIDTH = 73;
const TOP_NAV_HEIGHT = 64;

const LayoutRoot = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  display: 'flex',
  flex: '1 1 auto',
  maxWidth: '100%',
  paddingTop: TOP_NAV_HEIGHT,
  [theme.breakpoints.up('lg')]: {
    paddingLeft: SIDE_NAV_WIDTH
  }
}));

const LayoutContainer = styled('div')({
  display: 'flex',
  flex: '1 1 auto',
  flexDirection: 'column',
  width: '100%'
});

export const Layout = (props) => {
  const { children } = props;
  const theme = useTheme();
  const check = useMediaQuery(theme.breakpoints.down('lg'))
  const [isMobile,setIsMobile] = useState(check);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const toggleDrawer = () => {
    setIsDrawerOpen((prev) => !prev);
  }

  useEffect(()=>{
    setIsMobile(check)
  },[check]);
  return (
    <>
      <TopNav 
      isDrawerOpen={isDrawerOpen}
      setIsDrawerOpen={setIsDrawerOpen}
      toggleDrawer={toggleDrawer}
      isMobile={isMobile}
      />
      <SideNav 
      isDrawerOpen={isDrawerOpen}
      toggleDrawer={toggleDrawer}
      isMobile={isMobile}
      />
      <LayoutRoot>
        <LayoutContainer>
          {children}
          {/* <Footer /> */}
        </LayoutContainer>
      </LayoutRoot>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node
};