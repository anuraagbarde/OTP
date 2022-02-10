import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import LockOpenOutlined from "@mui/icons-material/LockOpenOutlined";
import InputAdornment from "@mui/material/InputAdornment";
import KeyIcon from "@mui/icons-material/Key";
import { useNavigate } from "react-router";
import { useContext, useState } from "react";
import validateVerify from "../components/validateVerify";
import axios from "axios";
import DialogBox from "../components/DialogBox";
import { emailContext } from "../context/emailContext";

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

export default function Verify() {
  const [otp, setOtp] = useState({
    otp: "",
  });
  const { email } = useContext(emailContext);

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState();
  const [open, setOpen] = useState(false);

  const handleChange = (e) => {
    setOtp(e.target.value);
  };

  let navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors(validateVerify(otp));

    const params = {
      email: email,
      OTP: otp,
    };

    console.log(params);

    axios
      .post(
        process.env.REACT_APP_API_URL_VERIFY_OTP,
        params
      )
      .then((data) => {
        console.log(data);
        if (data.data.statusCode === 200) {
          navigate("/home");
        }
        else {
          setMessage(data.data.body);
          setOpen(true);
        }
      });
  };

  return (
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
            <LockOpenOutlined />
          </Avatar>
          <Typography
            style={{ marginTop: "2%", marginBottom: "5%" }}
            component="h1"
            variant="h6"
          >
            Verify OTP
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              marginBottom="3%"
              required
              maxWidth
              style={{ height: 75, width: 350, marginBottom: "5%" }}
              name="otp"
              //   label="OTP"
              type="number"
              id="otp"
              autoComplete="current-password"
              placeholder="Enter the OTP"
              value={otp}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <KeyIcon />
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
              {errors.otp && <p>{errors.otp}</p>}
            </div>
            <Button
              style={{
                display: "flex",
                margin: "auto",
                backgroundColor: "black",
                borderRadius: 50,
                padding: "10px 15px",
              }}
              type="submit"
              halfWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleSubmit}
            >
              Submit
            </Button>
            <DialogBox open={open} message={message} setOpen={setOpen}/>
          </Box>
        </Box>
        <Copyright
          style={{ marginTop: "50%", color: "black" }}
          sx={{ mt: 8, mb: 4 }}
        />
      </Container>
    </ThemeProvider>
  );
}
