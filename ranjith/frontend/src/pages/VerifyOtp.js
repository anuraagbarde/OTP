import React, { useContext, useState } from 'react'
import KeyIcon from '@mui/icons-material/Key'
import Typography from '@mui/material/Typography'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { Box, Paper } from '@mui/material'
import { useNavigate} from 'react-router-dom'
import PutReq from '../constants/PutReq'
import axios from 'axios'
import PopBox from '../components/PopBox'
import { emailContext } from '../contexts/emailContext'



const VerifyOtp = () => {
  const [otp, setOTP] = useState('')
  const [open, setOpen] = useState(false)
  const [msg, setMsg] = useState('')
   const {email} = useContext(emailContext)

  let navigate = useNavigate()
  const handleSubmit = (e) => {
     e.preventDefault();
      PutReq.body.email = email
      PutReq.body.otp = otp
      console.log(email)
      axios({
        method: 'put',
        url: 'https://fsz1mr3nmf.execute-api.ap-south-1.amazonaws.com/dev/otp/verify',
        data: PutReq,
      })
        .then((data) => {
          console.log(data)
           if (data.data.statusCode === 200) {
                navigate('/dashboard')
           } else {
             setMsg(data.data.body.message)
             setOpen(true)
           }
        })
        .catch((err) => {
          console.log(err)
        })
  }

    const handleChange = (event) => {
      setOTP(event.target.value)
    }
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '10%',
          flexWrap: 'wrap',
          '& > :not(style)': {
            m: 1,
            width: 350,
            height: 300,
          },
        }}
      >
        <Paper elevation={3}>
          <Box
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'column',
            }}
            paddingY={2}
          >
            <Typography variant='h5' style={{ color: '#695d76' }}>
              Verify your Account
            </Typography>
            <Typography variant='body1' style={{ color: '#cecfd3' }}>
              Enter the OTP and verify your account
            </Typography>
          </Box>
          <Box
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'column',
              height: '60%',
            }}
          >
            <Typography variant='h6' style={{ color: '#695d76' }}>
              {email}
            </Typography>
            <TextField
              placeholder='Enter OTP'
              variant='outlined'
              type='number'
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <KeyIcon />
                  </InputAdornment>
                ),
              }}
              style={{ width: '90%' }}
              onChange={handleChange}
            />
            <Button
              variant='contained'
              style={{ width: '90%' }}
              onClick={handleSubmit}
            >
              Verify Account
            </Button>
            <PopBox open={open} msg={msg} setOpen={setOpen} />
          </Box>
        </Paper>
      </Box>
    )
}

export default VerifyOtp
