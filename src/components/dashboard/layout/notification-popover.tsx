// src/components/dashboard/layout/notification-popover.tsx

import * as React from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { X } from "@phosphor-icons/react/dist/ssr/X"

export interface Notification {
  id: string;
  message: string;
  time: string;
  read:boolean
}

export interface NotificationPopoverProps {
  anchorEl: Element | null;
  onClose: () => void;
  open: boolean;
  notifications: Notification[];
}

export function NotificationPopover({
  anchorEl,
  onClose,
  open,
  notifications,
}: NotificationPopoverProps): React.JSX.Element {
  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      onClose={onClose}
      open={open}
      slotProps={{ paper: { sx: { width: '300px', maxHeight:'400px', overflowY:'auto' } } }}
    >
      <Box sx={{ p: '16px 20px ',display:'flex',justifyContent:'space-between', alignItems:'center' }}>
        <Typography variant="subtitle1">Notifications</Typography>
        <IconButton onClick={onClose}><X/></IconButton>
      </Box>
      <Divider />
        <List>
          {notifications.length === 0 ? (
              <Box sx={{ p: '16px 20px ' }}>
                <Typography color='text.secondary'>No New Notifications</Typography>
              </Box>
            ) :
            notifications.map((notification) => (
            <ListItem key={notification.id} sx={notification.read ?{backgroundColor:'#f5f5f5'}:{}}>
              <ListItemText
                primary={notification.message}
                secondary={notification.time}
              />
            </ListItem>
          ))}
        </List>
        
    </Popover>
  );
}
