import React from 'react'
import { Box } from '@mui/material'
import Typography from '@mui/material/Typography'

const UserDashboard = () => {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '20%',
          flexWrap: 'wrap',
        }}
      >
        <Typography variant='h4' style={{ color: '#695d76' }}>
          Congrats !! you are verified ✨✨
        </Typography>
      </Box>
    )
}

export default UserDashboard
