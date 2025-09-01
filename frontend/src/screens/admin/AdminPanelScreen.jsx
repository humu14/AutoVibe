import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { LinkContainer } from 'react-router-bootstrap';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import ListAltIcon from '@mui/icons-material/ListAlt';
import InventoryIcon from '@mui/icons-material/Inventory';
import ReviewsIcon from '@mui/icons-material/Reviews';
import HomeIcon from '@mui/icons-material/Home';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import logo from '../../../../uploads/logo.webp';

const navigationItems = [
  { to: '/', icon: <HomeIcon />, text: 'Home' },
  { to: '/admin/userslist', icon: <SupervisedUserCircleIcon />, text: 'Manage Customers' },
  { to: '/admin/orders', icon: <ListAltIcon />, text: 'Manage Orders' },
  { to: '/admin/productslist', icon: <InventoryIcon />, text: 'Manage Products' },
  { to: '/admin/reviewslist', icon: <ReviewsIcon />, text: 'Manage Reviews' },
  { to: '/admin/sales', icon: <MonetizationOnIcon />, text: 'Sales and Analytics' }
];

const AdminPanelScreen = () => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <div style={{ marginBottom: '30px' }}>
      <AppBar position="fixed" style={{ background: 'black' }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <LinkContainer to="/">
              <Typography
                variant="h6"
                noWrap
                component="a"
                sx={{
                  mr: 2,
                  display: { xs: 'none', md: 'flex' },
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  letterSpacing: '.3rem',
                  color: 'white',
                  textDecoration: 'none',
                }}
              >
                <img
                  src={logo}
                  alt="logo"
                  width="50px"
                  height="50px"
                />
              </Typography>
            </LinkContainer>

            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
                style={{ color: "white" }}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                {navigationItems.map((item, index) => (
                  <LinkContainer key={index} to={item.to}>
                    <MenuItem key={item} onClick={handleCloseNavMenu}>
                      <Typography textAlign="center">{item.text}</Typography>
                    </MenuItem>
                  </LinkContainer>
                ))}
              </Menu>
            </Box>
            
            <LinkContainer to="/">
              <Typography
                variant="h5"
                noWrap
                component="a"
                sx={{
                  mr: 2,
                  display: { xs: 'flex', md: 'none' },
                  flexGrow: 1,
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  letterSpacing: '.3rem',
                  color: 'white',
                  textDecoration: 'none',
                }}
              >
                <img
                  src={logo}
                  alt="logo"
                  width="50px"
                  height="50px"
                />
              </Typography>
            </LinkContainer>
            
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {navigationItems.map((item, index) => (
                <LinkContainer key={index} to={item.to}>
                  <Button
                    style={{ color: 'white' }}
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: 'white', display: 'block' }}
                  >
                    {item.text}
                  </Button>
                </LinkContainer>
              ))}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Toolbar />
    </div>
  );
};

export default AdminPanelScreen;
