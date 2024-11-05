'use client'
import ExpandedCalendar from '@/components/dashboard/ExpandedCalendar'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import React from 'react'

function page() {
  return (
    <DashboardLayout>
        <ExpandedCalendar />

    </DashboardLayout>
   
  )
}

export default page