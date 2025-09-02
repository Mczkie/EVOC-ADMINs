import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login-page.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleCheckboxChange = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5001/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setTimeout(() => {
            navigate("/Dashboard"); // redirect after login
            setMessage(data.message);
        }, 1000);
        alert('Login Successful');
        
      } else if (response.status === 401) {
        setMessage("Login failed: Wrong credentials!");
      } else {
        console.log(data);
        setMessage("An error occurred. Please try again later.");
      }
    } catch (error) {
      console.error(error);
      setMessage("An error occurred. Please try again later.");
    }


  };

  return (
    <div className="login-container">
        {/* <img src="3174411-uhd_3840_2160_30fps.mp4" alt="waste video"  className="image-background"/> */}
      <form onSubmit={handleLogin}>
        <h1>Login</h1>
        <div className="form-content">
          <label>Email:</label>
          <input
            type="email"
            placeholder="Email.."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-content">
          <label>Password:</label>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password.."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="show-password">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={handleCheckboxChange}
          />
          <label>Show password</label>
        </div>
        <div className="submit-message">
          <button type="submit">Login</button>
            {message && <p>{message}</p>}
        </div>

      </form>
    </div>
  );
}

export default LoginPage;
