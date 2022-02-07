import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

function Home() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        marginTop: "20%",
        flexWrap: "wrap",
      }}
    >
      <Typography
        style={{ fontFamily: "Montserrat", fontSize: 20, fontWeight: "bolder" }}
      >
        Your Email is successfully Verified!
      </Typography>
    </Box>
  );
}

export default Home;
