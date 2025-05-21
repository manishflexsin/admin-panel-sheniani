"use client"
/* eslint-disable -- Allowing console logs for debugging purposes*/
// import * as React from 'react';
import type { Metadata } from 'next';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import dayjs from 'dayjs';

import { config } from '@/config';
import { CustomersFilters } from '@/components/dashboard/customer/customers-filters';
import { CustomersTable } from '@/components/dashboard/customer/customers-table';
import type { Customer } from '@/components/dashboard/customer/customers-table';
import { LatestOrders } from '@/components/dashboard/overview/latest-orders';

import Pagination from '@mui/material/Pagination';
import { useState } from 'react';
import axios from 'axios';
import { GET_VENDOR } from '@/constants';
// export const metadata = { title: `Vendors | Dashboard | ${config.site.name}` } satisfies Metadata;
import { useEffect } from 'react';
const customers = [] satisfies Customer[];

export default function Page(): React.JSX.Element {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [userList, setUserList] = useState<any[]>([]); // State to manage user list

  const [page, setPage] = useState(1); // Current page state
  const rowsPerPage = 5; // Rows per page

  const fetchCustomers = async () => {
    try {
      // Retrieve the authentication token (e.g., from localStorage or a context)
      const authToken = localStorage.getItem('auth-token'); // Replace with your token retrieval logic

      if (!authToken) {
        console.error('No authentication token found');
        return;
      }
      const response = await axios.get(`${GET_VENDOR}`, {
        headers: {
          Authorization: `Bearer ${authToken}`, // Add the auth token to the header
        },
      });
      const data: any = response.data;
      if (Array.isArray(data)) {
        console.log(data, 'data');
        setCustomers(data);
      } else if (data.data && Array.isArray(data.data)) {
        setCustomers(data.data);
      } else {
        console.error('Unexpected API response format:', data);
      }
    }
    catch (error) {
      console.error('Error fetching vendors:', error);
    }
  };

  const handleVendorUpdate = () => {
    fetchCustomers(); // Re-fetch the vendor list
  };

  useEffect(() => {
    fetchCustomers(); // Fetch vendors on component mount
  }, []);

  // Apply pagination to the customers list
  const paginatedCustomers = applyPagination(customers, page, rowsPerPage);

  const StoreUserdataList = (order: any): void => {
    setUserList(order);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value); 
// Update the page state when the user changes the page
  };
  
  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">User</Typography>
        </Stack>
        <div>
          <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained">
            Add user
          </Button>
        </div>
      </Stack>

      <CustomersFilters storeUserdataList1={StoreUserdataList} page ={page} />

      <LatestOrders
        orders={paginatedCustomers.map((vendor: any) => ({
          id: vendor.id,
          customer: { name: `${vendor.firstName ?? ''} ${vendor.lastName ?? ''}`.trim() },
          firstName: vendor.firstName,
          lastName: vendor.lastName,
          payment_Status: vendor.payment_Status || 'unknown',
          status: vendor.profileStatus ? vendor.profileStatus.toLowerCase() : 'unknown',
          createdAt: dayjs(vendor.createdAt).toDate(),
        }))}
        sx={{ height: '100%' }}
        onVendorUpdated={handleVendorUpdate} // Pass the callback
        customUserlist={userList}
        page={page}
      />

      {/* Pagination component */}
      <Pagination
        count={10} // Calculate total pages
        page={page} // Current page
        onChange={handlePageChange} // Page change handler
        color="primary"
      />
    </Stack>
  );
}

// Pagination helper function
function applyPagination(rows: Customer[], page: number, rowsPerPage: number): Customer[] {
  return rows.slice((page - 1) * rowsPerPage, page * rowsPerPage); // Update to work with 1-based page index
}
