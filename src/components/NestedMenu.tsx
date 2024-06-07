import React, { useState } from 'react';
import { Button, Menu, MenuItem, MenuList, Paper, Typography } from '@mui/material';

interface Option {
  id: number;
  name: string;
  subOption?: Option[];
}

interface Props {
  data: Option[];
}

const NestedMenu: React.FC<Props> = ({ data }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        id="nested-menu-button"
        aria-controls="nested-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        Open Menu
      </Button>
      <Menu
        id="nested-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'nested-menu-button',
        }}
      >
        <MenuList>
          {data.map(option => (
            <NestedMenuItem key={option.id} option={option} />
          ))}
        </MenuList>
      </Menu>
    </>
  );
};

interface NestedMenuItemProps {
  option: Option;
}

const NestedMenuItem: React.FC<NestedMenuItemProps> = ({ option }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMouseEnter = (event: React.MouseEvent<HTMLLIElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMouseLeave = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <MenuItem
        onMouseEnter={option.subOption ? handleMouseEnter : undefined}
        onMouseLeave={option.subOption ? handleMouseLeave : undefined}
        onClick={handleLeaveMenu}
      >
        {option.name}
      </MenuItem>
      {option.subOption && anchorEl && (
        <Menu
          id={`sub-menu-${option.id}`}
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMouseLeave}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        >
          <MenuList>
            {option.subOption.map(subOption => (
              <MenuItem key={subOption.id}>{subOption.name}</MenuItem>
            ))}
          </MenuList>
        </Menu>
      )}
    </>
  );
};

const handleLeaveMenu = () => {
  // Placeholder function to handle leaving the menu
};

const App: React.FC = () => {
  const data: Option[] = [
    {
      id: 1,
      name: 'Drop NULL Values',
      subOption: [
        { id: 1, name: 'Drop All NULL Values' },
        { id: 2, name: 'Drop NULL Values from a column' }
      ]
    },
    { id: 2, name: 'Duplicate Rows' },
    { id: 3, name: 'Identify Date and Time' }
  ];

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Select an option:
      </Typography>
      <NestedMenu data={data} />
    </div>
  );
};

export default App;
