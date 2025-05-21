"use client"
/* eslint-disable -- Allowing console logs for debugging purposes*/
import * as React from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import dayjs from 'dayjs';
import axios from 'axios'; // Import Axios

import { config } from '@/config';
import { Budget } from '@/components/dashboard/overview/budget';
import { LatestOrders } from '@/components/dashboard/overview/latest-orders';
import { LatestProducts } from '@/components/dashboard/overview/latest-products';
import { Sales } from '@/components/dashboard/overview/sales';
import { TasksProgress } from '@/components/dashboard/overview/tasks-progress';
import { TotalCustomers } from '@/components/dashboard/overview/total-customers';
import { TotalProfit } from '@/components/dashboard/overview/total-profit';
import { Traffic } from '@/components/dashboard/overview/traffic';
import { useEffect, useState } from 'react';
import { GET_VENDOR } from '@/constants';

export default function Page(): React.JSX.Element {
  const [vendors, setVendors]: any = useState([]);

  const fetchVendors = async () => {
    try {
      // Retrieve the authentication token (e.g., from localStorage or a context)
      const authToken = localStorage.getItem('auth-token'); // Replace with your token retrieval logic

      if (!authToken) {
        console.error('No authentication token found');
        return;
      }

      // Make the API request with Axios
      const response = await axios.get(`${GET_VENDOR}`, {
        headers: {
          Authorization: `Bearer ${authToken}`, // Add the auth token to the header
        },
      });

      // Handle the response
      const data: any = response.data;
      if (Array.isArray(data)) {
        console.log(data, 'data');

        setVendors(data);
      } else if (data.data && Array.isArray(data.data)) {
        setVendors(data.data);
      } else {
        console.error('Unexpected API response format:', data);
      }
    } catch (error) {
      console.error('Error fetching vendors:', error);
    }
  };

  useEffect(() => {
    fetchVendors(); // Fetch vendors on component mount
  }, []);

  return (
    <Grid container spacing={3}>
      <Grid lg={3} sm={6} xs={12}>
        <Budget diff={12} trend="up" sx={{ height: '100%' }} value="$24k" />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <TotalCustomers diff={16} trend="down" sx={{ height: '100%' }} value="1.6k" />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <TasksProgress sx={{ height: '100%' }} value={75.5} />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <TotalProfit sx={{ height: '100%' }} value="$15k" />
      </Grid>
      <Grid md={12} xs={12}>
        <LatestOrders
          orders={vendors.map((vendor: any) => ({
            id: vendor.id,
            customer: { name: vendor.firstName + ' ' + vendor.lastName },
            // amount: vendor.amount,
            status: vendor.profileStatus.toLowerCase(),
            createdAt: dayjs(vendor.createdAt).toDate(),
          }))}
          sx={{ height: '100%' }} customUserlist={[]} page={0}        />
      </Grid>
    </Grid>
  );
}