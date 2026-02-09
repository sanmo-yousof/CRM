"use client"


import SuperAdminDashboard from '@/components/dashboard/SuperAdmin/SuperAdminDashboard'
import { useAuth } from '@/hooks/useAuth'
import React from 'react'

const DashboardPage = () => {
  const {role,loading} = useAuth()
  if(loading)return(<p className='text-center'>Loading.....</p>)
  
    if(!role)return null

  if(role === "super_admin") return <SuperAdminDashboard></SuperAdminDashboard>
  
}

export default DashboardPage
