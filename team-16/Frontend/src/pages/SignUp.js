import React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import InputAdornment from "@mui/material/InputAdornment";
import { AccountCircle } from "@mui/icons-material";
import { useNavigate } from "react-router";
import { emailContext } from "../context/emailContext";
import { useContext } from "react";
import { useState } from "react";
import validateSignUp from "../components/validateSignUp";
import axios from "axios";
import DialogBox from "../components/DialogBox";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="">
        Serverless-OTP-system
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme();

export default function SignUp() {
  const { email, setEmail } = useContext(emailContext);
  const [errors, setErrors] = useState(false);
  const [message, setMessage] = useState();
  const [open, setOpen] = useState(false);

  let navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors(validateSignUp(email));
    console.log(email);

    const params = {
      email: email,
    };

    axios
      .post(
        process.env.REACT_APP_API_URL_GENERATE_OTP,
        params
      )
      .then((data) => {
        console.log(data);
        if (data.data.statusCode === 200) {
          navigate("/verify");
        } else {
          setMessage(data.data.body);
          setOpen(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 7,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar style={{ color: "white" }} sx={{ m: 1, bgcolor: "black" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5" style={{}}>
              Sign up
            </Typography>
            <Typography
              style={{
                fontWeight: "normal",
                marginTop: "2%",
                fontSize: "100%",
              }}
              component="h1"
              variant="h6"
            >
              Create Account
            </Typography>
            <Box
              style={{ marginTop: "5%", borderRadius: "5%" }}
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 3 }}
            >
              <TextField
                required
                id="email"
                type="email"
                //   label="Email Address"
                name="email"
                autoComplete="email"
                placeholder="Enter your email address"
                style={{ height: 75, width: 350, marginBottom: "5%" }}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircle />
                    </InputAdornment>
                  ),
                }}
              />

              <div
                style={{
                  color: "red",
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: "4%",
                }}
              >
                {errors.email && <p>{errors.email}</p>}
              </div>
              <Button
                type="submit"
                style={{
                  display: "flex",
                  margin: "auto",
                  backgroundColor: "black",
                  borderRadius: 50,
                  padding: "10px 15px",
                }}
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>

              <DialogBox open={open} message={message} setOpen={setOpen}/>
            </Box>
          </Box>
          <Copyright
            style={{ marginTop: "50%", color: "black" }}
            sx={{ mt: 5 }}
          />
        </Container>
      </ThemeProvider>
    </>
  );
}
