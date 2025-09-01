import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { useLogoutMutation } from '../slices/userApiSlice';
import { logout } from '../slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { useGetCategoryQuery } from '../slices/productsApiSlice';
import Loader from './Loader';
import CartIcon from './CartIcon';
import { deepPurple } from '@mui/material/colors';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import { setCredentials } from '../slices/authSlice';
import { useTheme } from '@mui/material/styles';
import logo from '../../../uploads/logo.webp';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

const Header = () => {
  const theme = useTheme();

  const appBarStyle = {
    background: 'black',
    height: theme.spacing(8), // Adjust height using theme spacing for consistency
    width: '100%',
    [theme.breakpoints.down('sm')]: { // Adjust style for small devices
      height: theme.spacing(7),
    },
    [theme.breakpoints.up('md')]: { // Adjust style for medium and larger devices
      height: theme.spacing(8),
    }
  };
  const [search, setSearch] = useState('');
  const { userInfo } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();
  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/');
    } catch (err) {
      toast.error(err?.data?.message || err?.error);
    }
  };
  const { data: categories, isLoading, isError, error } = useGetCategoryQuery();

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

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    {
      setCartCount(cartItems.length);
    }
  }, [cartItems]);


  const handleSearch = (e) => {
    e.preventDefault();
    if (!search) return toast.error('Please enter a search term')
    navigate(`/search/${search}`);
    setSearch('');
  };

  useEffect(() => {
    setSearch('');
  }, []);


  const desktopStyle = {
    color: 'white',
    height: '55px',
    marginRight: '20px',
    marginLeft: '-20px',
    marginTop: '5px',
    width: '100px',
    fontSize: 'smaller',
    padding: '5px 10px',
  };

  // Media query for mobile devices
  const mobileStyle = {
    ...desktopStyle,
    fontSize: 'medium', // larger font size for mobile
    padding: '5px 15px', // increased padding for a larger touch target
    width: 'auto', // adjust width based on content
    marginRight: '10px', // adjust margin for smaller screens
  };
  return (
    <div style={{ marginBottom: '30px' }}>

      <AppBar position="fixed" style={appBarStyle}>

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
                {isLoading ? (
                  <Loader />
                ) : error ? (
                  <Loader />
                ) : (

                  <div>
                    <LinkContainer to={`/`}>
                      <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        sx={{
                          mr: 2,
                          // display: { xs: 'none', md: 'flex' },
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
                          style={{ marginLeft: "10px", marginBottom: "-30px" }}
                        />
                      </Typography>
                    </LinkContainer>
                    {categories.map((category) => (
                      <LinkContainer to={`/${category}`}>
                        <MenuItem key={category} onClick={handleCloseNavMenu}>
                          <Typography textAlign="center">{category.toUpperCase()}</Typography>
                        </MenuItem>
                      </LinkContainer>
                    ))}
                  </div>
                )}
              </Menu>
            </Box>
            <LinkContainer to="/">
              <Typography
                variant="h5"
                noWrap
                component="a"
                href=""
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
              </Typography>
            </LinkContainer>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {isLoading ? (
                <Loader />
              ) : error ? (
                <Loader />
              ) : (
                <>
                  {Array.isArray(categories) &&
                    categories.map((category) => (
                      <LinkContainer key={category} to={`/${category}`}>
                        <Button
                          style={{ color: 'white' }}
                          key={category}
                          onClick={handleCloseNavMenu}
                          sx={{ my: 2, color: 'white', display: 'block' }}
                        >
                          {category.toUpperCase()}
                        </Button>
                      </LinkContainer>
                    ))}
                </>
              )}
            </Box>
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'flex' } }}>
              <div style={{ marginRight: '10px' }}>
              </div>
            </Box>

            {userInfo && userInfo.admin && (
              <LinkContainer to="/admin/userslist" style={window.innerWidth < 768 ? mobileStyle : desktopStyle}>
                <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold border-b-4 border-blue-700 hover:border-blue-500 rounded">
                  {/* <AdminPanelSettingsIcon />  */}
                  <small>Admin Panel</small>
                </button>
              </LinkContainer>
            )}


            <div style={{ marginRight: '10px' }}>
              <form onSubmit={handleSearch}>
                <Search>
                  <SearchIconWrapper>
                    <SearchIcon style={{ color: 'white' }} />
                  </SearchIconWrapper>
                  <StyledInputBase
                    placeholder="Search…"
                    inputProps={{ 'aria-label': 'search' }}
                    style={{ color: 'white' }}
                    value={search ? search : ''}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </Search>
              </form>
            </div>
            <div style={{ marginRight: '10px' }}>
              <Link to="/cart" style={{ color: 'white' }}>
                <CartIcon itemCount={cartCount} />
              </Link>
            </div>
            {userInfo ? (
              <>
                <Box sx={{ flexGrow: 0 }}>
                  <Tooltip title="Open settings">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <Avatar
                        alt={userInfo.name.toUpperCase()}
                        sx={{ bgcolor: deepPurple[500] }}
                        src="/static/images/avatar/2.jpg"
                      />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    <LinkContainer to={`/favorites/${userInfo._id}`}>
                      <MenuItem key='fav'>
                        <Typography textAlign="center">My Favorites</Typography>
                      </MenuItem>
                    </LinkContainer>

                    <LinkContainer to={`/myorder/${userInfo._id}`}>
                      <MenuItem key='fav'>
                        <Typography textAlign="center">My Orders</Typography>
                      </MenuItem>
                    </LinkContainer>

                    <LinkContainer to="/profile">
                      <MenuItem key={userInfo.name}>
                        <Typography textAlign="center">Update Profile</Typography>
                      </MenuItem>
                    </LinkContainer>

                    <MenuItem onClick={logoutHandler}>
                      <Typography textAlign="center">Logout</Typography>
                    </MenuItem>
                  </Menu>
                </Box>
              </>
            ) : (
              <>
                <LinkContainer to="/register" className="mx-3">
                  <Button variant="contained"><small style={{ fontSize: "11px" }}>Register</small></Button>
                </LinkContainer>
                <LinkContainer to="/login">
                  <Button color="success" variant="contained"><small style={{ fontSize: "11px" }}>
                    Login
                  </small>
                  </Button>
                </LinkContainer>
              </>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      <Toolbar />
    </div >
  );
};

export default Header;
