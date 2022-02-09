import "./App.css";
import SignUp from "./pages/SignUp";
import Verify from "./pages/Verify";
import Home from "./pages/Home";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { EmailProvider } from "./context/emailContext";

function App() {
  return (
    <div className="container">
      <EmailProvider>
        <Router>
          <Routes>
            <Route exact path="/" element={<SignUp />} />
            <Route exact path="/verify" element={<Verify />} />
            <Route exact path="/home" element={<Home />} />
          </Routes>
        </Router>
      </EmailProvider>
    </div>
  );
}

export default App;
