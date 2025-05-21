"use client"
/* eslint-disable -- Allowing console logs for debugging purposes*/
import { Typography } from '@mui/material';
import {Payment_table }  from '@/components/dashboard/payments/payment-table';
import { use } from 'react';

export default function Payments() {
  return (<>
    <Typography variant="h4">
      Payments
    </Typography>
  <Payment_table />

    </>
  );
}
