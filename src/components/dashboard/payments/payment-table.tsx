/* eslint-disable -- Allowing console logs for debugging purposes*/
import * as React from 'react';
import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
// import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import type { SxProps } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
// import IconButton from '@mui/material/IconButton';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
// import VisibilityIcon from '@mui/icons-material/Visibility';
import dayjs from 'dayjs';
// import Modal from '@mui/material/Modal';
// import Button from '@mui/material/Button';
// import Select from '@mui/material/Select';
// import MenuItem from '@mui/material/MenuItem';
// import FormControl from '@mui/material/FormControl';
// import InputLabel from '@mui/material/InputLabel';
// import { useState } from 'react';
// import { CircularProgress } from '@mui/material';
import axios from 'axios';
// import { UPDATE_VENDOR } from '@/constants';
// import { ToastContainer, toast } from 'react-toastify';

const statusMap = {
  pending: { label: 'Pending', color: 'warning' },
  approved: { label: 'Approved', color: 'success' },
  cancelled: { label: 'Cancelled', color: 'error' },
} as const;

export interface userPayment {
  id: string;
  customer: { name: string };
  firstName: string;
  lastName: string;
  transaction: string;
  currency: string;
  status: 'pending' | 'approved' | 'cancelled';
  createdAt: Date;
}

export interface LatestuserPaymentsProps {
  userPayments?: userPayment[];
  sx?: SxProps;
  onVendorUpdated?: () => void; // Add this line

}

export function Payment_table(): React.JSX.Element {


  const [payment, setPaymentlist] = React.useState<userPayment[] >([]);
   const authToken = localStorage.getItem('auth-token');

 
 useEffect(() => {
    const fetchuserPayments = async () => {
      try {
        const response = await axios.get('https://api.w7.flexsin.org/v1/admin/payment/getAll',{
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        });
        console.log(response.data, 'response.data');
       setPaymentlist(response.data.data);
      } catch (error) {
        console.error('Error fetching userPayments:', error);
        // toast.error('Failed to fetch user data.');
      } 
    };

    fetchuserPayments();
  }, []);
  

  console.log("the payment list is",payment)




  
  function capitalizeFirstLetter(str:string):string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

  return (
    <Card sx={{height:'100%'}}>
      <CardHeader title="User List" />
      <Divider />
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell sortDirection="desc">Payment Date</TableCell>
              <TableCell>Payment Status</TableCell>
              <TableCell>Currency</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payment.map((userPayment) => {
              const { label, color } = statusMap[userPayment.status] ?? { label: 'Unknown', color: 'default' };

              return (
                <TableRow hover key={userPayment.id}>
                  <TableCell>{userPayment.transaction.slice(-9)}</TableCell>
                  <TableCell>{userPayment.firstName +" "+ userPayment.lastName}</TableCell>
                  <TableCell>{dayjs(userPayment.createdAt).format('MMM D, YYYY')}</TableCell>
                  <TableCell>{capitalizeFirstLetter(userPayment.status)}</TableCell>
                    <TableCell>{userPayment.currency}</TableCell>
                 
                  
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <CardActions sx={{ justifyContent: 'flex-end' }}></CardActions>

    
    </Card>
  );
}