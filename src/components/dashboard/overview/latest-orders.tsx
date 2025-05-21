/* eslint-disable -- Allowing console logs for debugging purposes*/
import * as React from 'react';
import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import type { SxProps } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import dayjs from 'dayjs';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { useState } from 'react';
import { CircularProgress } from '@mui/material';
import axios from 'axios';
import { UPDATE_VENDOR } from '@/constants';
import { ToastContainer, toast } from 'react-toastify';

const statusMap = {
  pending: { label: 'Pending', color: 'warning' },
  approved: { label: 'Approved', color: 'success' },
  cancelled: { label: 'Cancelled', color: 'error' },
} as const;

export interface Order {
  id: string;
  customer: { name: string };
  status: 'pending' | 'approved' | 'cancelled';
  createdAt: Date;
  firstName: string;
  lastName: string;
  payment_Status: string;

}

export interface LatestOrdersProps {
  orders?: Order[];
  sx?: SxProps;
onVendorUpdated?: () => void; // Add this line
customUserlist: Order[];
page: number;

}

export function LatestOrders({ orders = [], sx, onVendorUpdated, customUserlist, page}: LatestOrdersProps): React.JSX.Element {
  const [open, setOpen] = React.useState(false);
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
  const [orders1, setOrders] = React.useState<Order[]|undefined>([]);
  const [loading, setLoading] = React.useState<boolean>(false); // State to manage loading status
  const [selectedStatus, setSelectedStatus] = React.useState<'pending' | 'approved' | 'cancelled'>('pending');
 
  // authtoken
  const authToken = localStorage.getItem('auth-token');

  // fetching the data from the API

 useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`https://api.w7.flexsin.org/v1/admin/user/getAll?limit=10&page=${page}`,{
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        }
)
         setOrders(Array.isArray(response.data.data.results) ? response.data.data.results : []);
         console.log( 'response.data',response.data.data.results);
          // console.log( 'response.data',response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Failed to fetch user data.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [page]);
  React.useEffect(() => {
    setOrders(customUserlist ?? []);
  }, [customUserlist]);


  console.log("the orders are in the orders",orders1)

  const handleEditClick = (order: Order) => {
    setSelectedOrder(order);
    setSelectedStatus(order.status);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedOrder(null);
  };

  const handleStatusChange = (event: any) => {
    setSelectedStatus(event.target.value as 'pending' | 'approved' | 'cancelled');
  };

  const handleDone = async() => {
    // Handle the status update logic here
    console.log('Updated Status:', selectedStatus);
    if (!selectedStatus.trim()) {
      alert("Please select a status")
      return;
    }
    setLoading(true); // Start loading

    try {
      // Retrieve the auth token from localStorage
     
      if (!authToken) {
        throw new Error('No authentication token found. Please log in.');
      }
      const response = await axios.patch(`${UPDATE_VENDOR}/${selectedOrder?.id}`, { profileStatus: selectedStatus }, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });
      if(response.status != 200){
        alert(response.data.message)
      }else{
        if (onVendorUpdated) {
          onVendorUpdated(); // Call the callback to refresh the list
        }
        handleClose();
      }
      console.log({ orders , sx, onVendorUpdated }, "onVendorUpdated")
      const data = await response.data;
      handleClose()
      console.log(response, 'response');
      
      const notify = () => toast(response.data.message);
      notify();
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };
  
  function capitalizeFirstLetter(str:string):string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

  return (
    <Card sx={sx}>
      <CardHeader title="User List" />
      <Divider />
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell sortDirection="desc">Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Active Jobs</TableCell>
              <TableCell>Earnings</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(orders1) && orders1.map((order) => {
              const { label, color } = statusMap[order.status] ?? { label: 'Unknown', color: 'default' };

              return (
                <TableRow hover key={order.id}>
                  <TableCell>{order.id.slice(-8)}</TableCell>
                  <TableCell>{order.firstName?order.firstName:'' +" "+order.lastName?order.lastName:''}</TableCell>
                  <TableCell>{dayjs(order.createdAt).format('MMM D, YYYY')}</TableCell>
                  <TableCell>{capitalizeFirstLetter(order.payment_Status)}</TableCell>
                  
                  <TableCell>
                    <IconButton color="primary" aria-label="view" >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton color="secondary" aria-label="edit" onClick={() => handleEditClick(order)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" aria-label="delete">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <CardActions sx={{ justifyContent: 'flex-end' }}></CardActions>

      <Modal open={open} onClose={handleClose}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
          <FormControl fullWidth>
            <InputLabel id="status-select-label">Status</InputLabel>
            <Select
              labelId="status-select-label"
              value={selectedStatus}
              label="Status"
              onChange={handleStatusChange}
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleClose} sx={{ mr: 1 }}>Cancel</Button>
            <Button variant="contained" onClick={handleDone} disabled={loading} // Disable button when loading
            >
              {loading ? <CircularProgress size={24} /> : 'Done'}</Button>
          </Box>
        </Box>
      </Modal>
      <ToastContainer/>
    </Card>
  );
}