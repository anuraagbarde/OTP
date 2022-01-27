import React from 'react'
import { Route, Routes } from 'react-router-dom'

import Signup from './Signup'
import UserDashboard from './UserDashboard'
import VerifyOtp from './VerifyOtp'

const MainRoute = () => {
    return (
        <Routes>
          <Route path='/' element={<Signup />} />
          <Route path='/verify' element={<VerifyOtp />} />
          <Route path='/dashboard' element={<UserDashboard />} />
        </Routes>
    )
}

export default MainRoute
