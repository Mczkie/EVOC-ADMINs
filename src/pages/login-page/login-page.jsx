import { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginLogo from "../../assets/EcoVistaLogo.png";
import "../login-page/login-page.css";


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
      const response = await fetch(
        "https://evoc-backend.onrender.com/api/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));


        setMessage(data.message);
        setTimeout(() => {
          navigate("/Dashboard"); // redirect after login
          setMessage(data.message);
        }, 1000);
        alert("Login Successful");
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
      <section className="VMG-header">
        <div>
          <img src={loginLogo} alt="EVOC Logo" height={600}/>
        </div>
      </section>

      <section className="login-header">
        <div className="header-container-text">
          <h1 className="header-name">Welcome Back!</h1>
          <p className="header-subtitle">Login to continue</p>
        </div>
        <form className="login-form" onSubmit={handleLogin}>
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
      </section>
    </div>
  );
}

export default LoginPage;
