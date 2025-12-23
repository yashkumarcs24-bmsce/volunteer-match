import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateOpportunity from "./pages/CreateOpportunity";
import Applicants from "./pages/Applicants";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-opportunity" element={<CreateOpportunity />} />
          <Route path="/applicants" element={<Applicants />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
 




















