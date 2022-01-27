import { Box, Paper } from '@mui/material'
import React, { useContext, useState } from 'react'
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail'
import Button from '@mui/material/Button'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PostReq from '../constants/PostReq';
import PopBox from '../components/PopBox';
import { emailContext } from '../contexts/emailContext';
import Tab from '@mui/material/Tab'
import TabPanel from '@mui/lab/TabPanel'
import { TabContext, TabList } from '@mui/lab';


const Signup = () => {

  const {email,setEmail} = useContext(emailContext);  
  const [open, setOpen] = useState(false)
  const [msg, setMsg] = useState('');

  let navigate = useNavigate();

    const [value, setValue] = useState('1')

    const handleValChange = (event, newValue) => {
      setValue(newValue)
    }

  const handleSubmit = (e) => {
    e.preventDefault();
    PostReq.body.email = email;
    console.log(PostReq);
    axios({
      method: 'post',
      url: 'https://fsz1mr3nmf.execute-api.ap-south-1.amazonaws.com/dev/otp/generate',
      data: PostReq,
    })
      .then((data) => {
        console.log(data)
        if (data.data.statusCode === 200) {
          navigate('/verify')
        } else {
          setMsg(data.data.body.message);
          setOpen(true);
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }
  const handleChange = (event) => {
    setEmail(event.target.value);
  }

  const createAccount = () => (
    <Box style={{ height:'100%' }}>
      <Box
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'column'
        }}
        paddingY={2}
      >
        <Typography variant='h5' style={{ color: '#695d76' }}>
          Welcome !
        </Typography>
        <Typography variant='body1' style={{ color: '#cecfd3' }}>
          Enter your Email to Create your Account
        </Typography>
      </Box>
      <Box
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'column',
          height:'50%'
        }}
      >
        <TextField
          placeholder='Enter your Email'
          type='email'
          variant='outlined'
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <AlternateEmailIcon />
              </InputAdornment>
            ),
          }}
          style={{ width: '90%' }}
          onChange={handleChange}
          required
        />
        <Button
          variant='contained'
          style={{ width: '90%' }}
          onClick={handleSubmit}
        >
          Signup
        </Button>
        <PopBox open={open} msg={msg} setOpen={setOpen} />
      </Box>
    </Box>
  )
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '10%',
          flexWrap: 'wrap',
          '& > :not(style)': {
            m: 1,
            width: 450,
            height: 250,
          },
        }}
      >
        <Paper elevation={3}>
        {createAccount()}
          {/* <TabContext value={value}>
            <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
              <TabList onChange={handleValChange} centered >
                <Tab label='Sign Up' value='1' />
                <Tab label='Check Status' value='2' />
              </TabList>
            </Box>
            <TabPanel value='1'>{createAccount()}</TabPanel>
            <TabPanel value='2'>Item Two</TabPanel>
          </TabContext> */}
        </Paper>
      </Box>
    )
}     

export default Signup   
