import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../assets/css/styles.css';
import { AuthGuard, loginStateChange } from '../AuthGuard';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import BackupIcon from '@mui/icons-material/Backup';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import ModelTrainingIcon from '@mui/icons-material/ModelTraining';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuItem from '@mui/material/MenuItem';
import PersonIcon from '@mui/icons-material/Person';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import SideNavbar from './SideNavbar';
import logoImg from '../assets/images/PREDICTO-LOGO.png';
import logoImgbG from '../assets/images/PREDICTO-LOGO-BG.png';
import { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { logoutUser } from '../AllAssets';

const Navbar = () => {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };


    const handleDrawerClose = () => {
        setOpen(false);
    };


    const drawerWidth = 240;

    const openedMixin = (theme: Theme): CSSObject => ({
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        overflowX: 'hidden',
    });

    const closedMixin = (theme: Theme): CSSObject => ({
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: `calc(${theme.spacing(7)} + 1px)`,
        [theme.breakpoints.up('sm')]: {
            width: `calc(${theme.spacing(8)} + 1px)`,
        },
    });

    const DrawerHeader = styled('div')(({ theme }) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    }));

    interface AppBarProps extends MuiAppBarProps {
        open?: boolean;
    }

    const AppBar = styled(MuiAppBar, {
        shouldForwardProp: (prop) => prop !== 'open',
    })<AppBarProps>(({ theme, open }) => ({
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        ...(open && {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
        }),
    }));

    const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
        ({ theme, open }) => ({
            width: drawerWidth,
            flexShrink: 0,
            whiteSpace: 'nowrap',
            boxSizing: 'border-box',
            ...(open && {
                ...openedMixin(theme),
                '& .MuiDrawer-paper': openedMixin(theme),
            }),
            ...(!open && {
                ...closedMixin(theme),
                '& .MuiDrawer-paper': closedMixin(theme),
            }),
        }),
    );



    let currentURL = useLocation().pathname;
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const handleClickUserIcon = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const openUserMenu = Boolean(anchorEl);
    const handleCloseUserMenu = () => {
        setAnchorEl(null);
    };

    const [drawerOpen, setDrawerOpen] = React.useState(false);

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    const toastMessage = (value: string, message: string) => {
        // success
        // error
        // warning
        // info
        if (value == "success") {
            toast.success(message);
        }
        else if (value == "error") {
            toast.error(message);
        }
        else if (value == "warning") {
            toast.warning(message);
        }
        else if (value == "info") {
            toast.info(message);
        }
    };

    const responseChecker = (response: AxiosResponse<any, any>) => {
        if (response.status == 400) {
            toastMessage('error', 'Invalid Request!');
            return false;
        }
        else if (response.status == 500) {
            toastMessage('error', "Server Issue");
            return false;
        }
        else if (response.status == 200 || response.status == 201) {
            if (response.data['status'] == "success") {
                return true;
            }
            else if (response.data['status'] == "failure") {
                toastMessage('error', response.data['message']);
                return false;
            }
        }
    }

    const onLogoutBtnClicked = async () => {
        try {
            const response = await logoutUser();
            console.log(response);
            if (responseChecker(response)) {
                toastMessage('success', response.data.message);
                loginStateChange(false, {});
                navigate('/login');
            }
            else {
                toastMessage('error', 'Error logging out!');
            }
        } catch (error) {
            toastMessage('error', 'Error logging out!');
            console.error(error);
        }
    }


    // NAVBAR IF USER IS LOGGED
    if (AuthGuard()) {
        return (
            // <div>
            //     <Box sx={{ display: 'flex' }}>
            //         <CssBaseline />
            //         <AppBar position="fixed" open={open}>
            //             <header className="ps-4 header-auth header">
            //                 <DrawerHeader>
            //                     <IconButton
            //                         aria-label="open drawer"
            //                         onClick={handleDrawerOpen}
            //                         edge="start"
            //                         sx={{
            //                             marginRight: 5,
            //                             ...(open && { display: 'none' }),
            //                         }}
            //                     >
            //                         <MenuIcon />
            //                     </IconButton>
            //                 </DrawerHeader>
            //                 <h1 className="logo" style={{ color: 'black' }}><a onClick={() => navigate('/home')}>LOGO</a></h1>
            //                 <ul className="main-nav main-nav-auth">
            //                     <li className={`my-component ${currentURL === '/home' ? 'headbar-active' : 'headbar-inactive'}`}>
            //                         <Link to="/home">
            //                             <i className="fas fa-home"></i>&nbsp;Home
            //                         </Link>
            //                     </li>
            //                     <li className={`my-component ${currentURL === '/history' ? 'headbar-active' : 'headbar-inactive'}`}>
            //                         <Link to="/history"><i className="fas fa-history"></i>&nbsp;History</Link></li>
            //                     <li style={{ cursor: 'pointer', color: 'black' }}><a onClick={() => { loginStateChange(false); navigate('/login'); }}><i className="fas fa-sign-out-alt"></i>&nbsp;Logout</a></li>
            //                 </ul>
            //             </header>
            //         </AppBar>
            //         <Drawer variant="permanent" open={open}>
            //             <DrawerHeader>
            //                 <IconButton style={{ color: 'white' }} onClick={handleDrawerClose}>
            //                     {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            //                 </IconButton>
            //             </DrawerHeader>
            //             <Divider />
            //             <List>
            //                 <ListItem disablePadding sx={{ display: 'block' }}>
            //                     <ListItemButton
            //                         sx={{
            //                             minHeight: 48,
            //                             justifyContent: open ? 'initial' : 'center',
            //                             px: 2.5,
            //                             color: 'white',
            //                             marginBottom: '2rem',
            //                             marginTop: '1rem'
            //                         }}>
            //                         <ListItemIcon
            //                             sx={{
            //                                 minWidth: 0,
            //                                 mr: open ? 3 : 'auto',
            //                                 justifyContent: 'center',
            //                                 color: 'white'
            //                             }}>
            //                             <BackupIcon />
            //                         </ListItemIcon>
            //                         <ListItemText primary={"Upload your file"} sx={{ opacity: open ? 1 : 0 }} />
            //                     </ListItemButton>
            //                 </ListItem>
            //                 <Divider />
            //                 <ListItem disablePadding sx={{ display: 'block' }}>
            //                     <ListItemButton
            //                         sx={{
            //                             minHeight: 48,
            //                             justifyContent: open ? 'initial' : 'center',
            //                             px: 2.5,
            //                             color: 'white',
            //                             marginBottom: '1rem',
            //                             marginTop: '1rem'
            //                         }}>
            //                         <ListItemIcon
            //                             sx={{
            //                                 minWidth: 0,
            //                                 mr: open ? 3 : 'auto',
            //                                 justifyContent: 'center',
            //                                 color: 'white'
            //                             }}>
            //                             <AccountTreeIcon />
            //                         </ListItemIcon>
            //                         <ListItemText primary={"Data pre-processing"} sx={{ opacity: open ? 1 : 0 }} />
            //                     </ListItemButton>
            //                 </ListItem>
            //                 <Divider />
            //                 <ListItem disablePadding sx={{ display: 'block' }}>
            //                     <ListItemButton
            //                         sx={{
            //                             minHeight: 48,
            //                             justifyContent: open ? 'initial' : 'center',
            //                             px: 2.5,
            //                             color: 'white',
            //                             marginBottom: '1rem',
            //                             marginTop: '1rem'
            //                         }}>
            //                         <ListItemIcon
            //                             sx={{
            //                                 minWidth: 0,
            //                                 mr: open ? 3 : 'auto',
            //                                 justifyContent: 'center',
            //                                 color: 'white'
            //                             }}>
            //                             <ModelTrainingIcon />
            //                         </ListItemIcon>
            //                         <ListItemText primary={"Train your model"} sx={{ opacity: open ? 1 : 0 }} />
            //                     </ListItemButton>
            //                 </ListItem>
            //             </List>
            //         </Drawer>
            //         <div className='mt-5'></div>
            //         {/* ab<br />
            //         ab<br />
            //         ab<br />
            //         ab<br />
            //         ab<br />
            //         ab<br /> */}
            //     </Box>
            // </div>
            <div>
                <header className="header-auth header">
                    <h1 className="logo p-1 ps-4" style={{ color: 'black' }}><a onClick={() => navigate('/home')}>
                        <img style={{ height: '2.6em' }} src={logoImg} />
                    </a>
                    </h1>
                    <ul className="main-nav main-nav-auth pe-4">
                        <li className={`my-component ${currentURL === '/home' || currentURL === '/activity' ? 'headbar-active' : 'headbar-inactive'}`}>
                            <Link to="/home">
                                <i className="fas fa-home"></i>&nbsp;Home
                            </Link>
                        </li>
                        <li className={`my-component ${currentURL === '/history' ? 'headbar-active' : 'headbar-inactive'}`}>
                            <Link to="/history"><i className="fas fa-history"></i>&nbsp;History</Link></li>
                        <li className='text-center'>
                            <IconButton
                                onClick={handleClickUserIcon}
                                size="small"
                                sx={{ ml: 2 }}
                                aria-controls={openUserMenu ? 'account-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={openUserMenu ? 'true' : undefined}
                            >
                                <Avatar sx={{ width: 32, height: 32, backgroundColor: '#0c7bb3b1' }}>
                                    <PersonIcon />
                                </Avatar>
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                id="account-menu"
                                open={openUserMenu}
                                onClose={handleCloseUserMenu}
                                onClick={handleCloseUserMenu}
                                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                            >
                                <Link to="/my-account">
                                    <MenuItem onClick={() => { }}>
                                        <ListItemIcon><ManageAccountsIcon /></ListItemIcon>
                                        My Account
                                    </MenuItem>
                                </Link>
                                <MenuItem onClick={() => {
                                    onLogoutBtnClicked()
                                }}>
                                    <ListItemIcon><LogoutIcon /></ListItemIcon>Logout
                                </MenuItem>
                            </Menu>
                        </li>
                    </ul>
                </header>
                {/* <SideNavbar open={drawerOpen} onClose={toggleDrawer} variant="permanent" /> */}
            </div >
        )
    }
    // NAVBAR IF USER IS NOT LOGGED
    else {
        return (
            <div>
                <header className="header-unauth header">
                    <h1 className="logo text-white ps-4"><a onClick={() => navigate('/home')}>
                        <img style={{ height: '2.6em' }} src={logoImgbG} />
                    </a>
                    </h1>
                </header>
            </div>
        )
    }
}

export default Navbar
