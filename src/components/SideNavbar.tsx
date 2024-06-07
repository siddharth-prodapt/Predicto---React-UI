import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { styled } from '@mui/system';
import { Home as HomeIcon, Settings as SettingsIcon } from '@mui/icons-material';

const drawerWidth = 240;

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
  },
}));

const StyledMiniDrawer = styled(Drawer)(({ theme }) => ({
  width: 56,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: 56,
  },
}));

interface Props {
  open: boolean;
  onClose: () => void;
  variant: 'permanent' | 'persistent' | 'temporary' | undefined;
}

const SideNavbar: React.FC<Props> = ({ open, onClose, variant }) => {
  const DrawerComponent = variant === 'permanent' || variant === 'persistent' ? StyledDrawer : StyledMiniDrawer;

  return (
    <DrawerComponent
      open={open}
      onClose={onClose}
      variant={variant}
    >
      <List>
        <ListItem button key="Home">
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem button key="Settings">
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
      </List>
    </DrawerComponent>
  );
};

export default SideNavbar;