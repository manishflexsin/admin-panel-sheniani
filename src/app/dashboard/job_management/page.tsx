"use client"
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
import { TextField, Badge, Autocomplete } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { ToastContainer, toast } from 'react-toastify';
import { SelectChangeEvent } from '@mui/material';

const statusMap = {
  pending: { label: 'Pending', color: 'warning' },
  approved: { label: 'Approved', color: 'success' },
  cancelled: { label: 'Cancelled', color: 'error' },
} as const;

export interface Order {
  location: string;
  role: string;
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

export default function Page(): React.JSX.Element {
  const [open, setOpen] = React.useState(false);
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
  const [orders1, setOrders] = React.useState<Order[] | undefined>([]);
  const [loading, setLoading] = React.useState<boolean>(false); // State to manage loading status
  const [selectedStatus, setSelectedStatus] = React.useState<'pending' | 'approved' | 'cancelled'>('pending');

  // authtoken
  const authToken = localStorage.getItem('auth-token');

  // fetching the data from the API

  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [multiFilter, setMultiFilter] = useState<string[]>([]);

  const [allOrders, setAllOrders] = useState<Order[]>([]);   // Unfiltered full data
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);  // Filtered data


  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/v1/user/getAllUsers`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        }
        )
        console.log("response is", response.data.users);
        setOrders(Array.isArray(response.data.users) ? response.data.users : []);

        setAllOrders(response.data.users);       // Store full unfiltered data
        setFilteredOrders(response.data.users);  // Also show full data by default
        // console.log('response.data', response.data.data.results);
        // console.log( 'response.data',response.data);
        console.log("the orders are in the orders", orders1)
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Failed to fetch user data.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      const filtered = allOrders.filter(order => {
        const fullName = `${order.firstName ?? ''} ${order.lastName ?? ''}`.toLowerCase();
        const matchesName = fullName.includes(searchQuery.toLowerCase());
        const matchesLocation = !locationFilter || order.location === locationFilter;
        const matchesStatus = multiFilter.length === 0 || multiFilter.includes(order.status);
        return matchesName && matchesLocation && matchesStatus;
      });

      setFilteredOrders(filtered);
    };

    applyFilters();
  }, [searchQuery, locationFilter, multiFilter, allOrders]);


  const handleClose = () => {
    setOpen(false);
    setSelectedOrder(null);
  };

  const handleStatusChange = (event: any) => {
    setSelectedStatus(event.target.value as 'pending' | 'approved' | 'cancelled');
  };

  const handleDone = async () => {
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

  const [openAddModal, setOpenAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: '',
    earnings: '',
    status: '',
    jobsCompleted: '',
  });
  const [isRegistering, setIsRegistering] = useState(false);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name as string]: value }));
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
  };

  // Open/Close modal
  const handleOpenAddModal = () => setOpenAddModal(true);
  const handleCloseAddModal = () => setOpenAddModal(false);


  function capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  return (
    <>
      <h1>User Management</h1>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
        {/* Search Input */}
        <TextField
          label="Search by name"
          variant="outlined"
          size="small"
          onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
        />

        {/* Location Filter */}
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel id="location-label">Location</InputLabel>
          <Select
            labelId="location-label"
            value={locationFilter}
            label="Location"
            onChange={(e) => setLocationFilter(e.target.value)}
          >
            <MenuItem value=""><em>All</em></MenuItem>
            {Array.from(new Set(orders1?.map(order => order.location || 'Unknown'))).map((loc, idx) => (
              <MenuItem key={idx} value={loc}>{loc}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Multi-select Filter */}
        <Autocomplete
          multiple
          size="small"
          options={['pending', 'approved', 'cancelled']}
          getOptionLabel={(option) => capitalizeFirstLetter(option)}
          value={multiFilter}
          onChange={(_, newValue) => setMultiFilter(newValue)}
          renderInput={(params) => (
            <Badge badgeContent={multiFilter.length} color="primary">
              <TextField {...params} label="Filter by Status" />
            </Badge>
          )}
          sx={{ minWidth: 200 }}
        />

        {/* Add Users Button */}
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAddModal}>
          Add Users
        </Button>
      </Box>
      <Card sx={{ height: '100%' }}>
        {/* <CardHeader title="User List" />
      <Divider /> */}
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
              {Array.isArray(filteredOrders) && filteredOrders.map((order, idx) => {
                const { label, color } = statusMap[order.status] ?? { label: 'Unknown', color: 'default' };

                return (
                  <TableRow hover key={idx}>
                    <TableCell>{(order.firstName ? order.firstName : '') + " " + (order.lastName ? order.lastName : '')}</TableCell>
                    <TableCell>{order.role}</TableCell>
                    <TableCell>{order.status}</TableCell>
                    <TableCell>{ }</TableCell>

                    <TableCell>
                      <IconButton color="primary" aria-label="view" >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton color="secondary" aria-label="edit" >
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

        <Modal open={openAddModal} onClose={handleCloseAddModal}>
          <Box sx={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)', width: 600,
            bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2
          }}>
            <h2 style={{ marginBottom: 20 }}>Add New User</h2>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Row 1: First Name & Last Name */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField label="First Name" name="firstName" value={newUser.firstName} onChange={handleInputChange} fullWidth />
                <TextField label="Last Name" name="lastName" value={newUser.lastName} onChange={handleInputChange} fullWidth />
              </Box>

              {/* Row 2: Email & Password */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField label="Email" name="email" value={newUser.email} onChange={handleInputChange} fullWidth />
                <TextField label="Password" name="password" value={newUser.password} onChange={handleInputChange} fullWidth type="password" />
              </Box>

              {/* Row 3: Role & Earnings */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField label="Role" name="role" value={newUser.role} onChange={handleInputChange} fullWidth />
                <TextField label="Earnings" name="earnings" value={newUser.earnings} onChange={handleInputChange} fullWidth />
              </Box>

              {/* Row 4: Status & Jobs Completed */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={newUser.status}
                    onChange={handleSelectChange}
                    label="Status"
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                    <MenuItem value="premium">Premium</MenuItem>
                    <MenuItem value="restricted">Restricted</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  label="Jobs Completed"
                  name="jobsCompleted"
                  value={newUser.jobsCompleted}
                  onChange={handleInputChange}
                  fullWidth
                  type="number"
                />
              </Box>

              {/* Buttons */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
                <Button onClick={handleCloseAddModal}>Cancel</Button>
                <Button
                  variant="contained"
                  onClick={async () => {
                    setIsRegistering(true);
                    try {
                      const authToken = localStorage.getItem('auth-token');
                      const response = await axios.post('http://localhost:4000/api/v1/auth/register', newUser, {
                        headers: {
                          'Authorization': `Bearer ${authToken}`,
                        },
                      });
                      toast.success(response.data.message || 'User registered successfully');
                      handleCloseAddModal();
                      setNewUser({
                        firstName: '',
                        lastName: '',
                        email: '',
                        password: '',
                        role: '',
                        earnings: '',
                        status: '',
                        jobsCompleted: '',
                      });
                      // Refresh logic here
                    } catch (error: any) {
                      console.error('Registration error:', error);
                      toast.error(error?.response?.data?.message || 'Failed to register user');
                    } finally {
                      setIsRegistering(false);
                    }
                  }}
                  disabled={isRegistering}
                >
                  {isRegistering ? <CircularProgress size={24} /> : 'Add User'}
                </Button>
              </Box>
            </Box>
          </Box>
        </Modal>


        <ToastContainer />
      </Card>
    </>
  );
}