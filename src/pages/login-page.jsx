import { useState } from "react";
import axios from 'axios';
import '../styles/login-page.css';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [showPassowrd, setShowPassowrd] = useState(false);
    const navigate = useNavigate();


    const handleCheckboxChange = () => {
        setShowPassowrd(!showPassowrd);
    }


    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5000/api/login', {  email, password });
            navigate('/Dashboard');
            setMessage(response.data.message);
        }catch (error) {
            if (error.response && error.response.status === 401) {
                setMessage('Login failed, Wrong Credentials!');
            }else {
                setMessage('An error occured. Please try again later.');
            }
        }
    };
    return (
        <div className="login-container">
            <form onSubmit={handleLogin}>
            <h1>Login</h1>  
                <div className="form-content">
                <label>
                    Email:
                </label>
                    <input placeholder="Email.." type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="form-content">
                <label>
                    Password: 
                </label>
                    <input placeholder="Password.." type={showPassowrd ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required/>
                </div>
                <div className="show-password">
                <input type="checkbox" className="hint-password" checked={showPassowrd} onChange={handleCheckboxChange}/>
                <label className="show-label">show password</label>
                </div>

                <div className="submit-message">
                <button type="submit">Login</button>
                <p>{message}</p>
                </div>
            </form>
        </div>
    )
}; 


export default LoginPage

