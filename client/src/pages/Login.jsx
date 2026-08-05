import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from '../api/axios';
import useAuth from '../hooks/useAuth';

const Login = () => {
    const { setAuth } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/dashboard";

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await axios.post('/auth/login', 
                JSON.stringify({ email, password }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            
            const accessToken = response?.data?.accessToken;
            const role = response?.data?.role;
            setAuth({ email, role, accessToken });
            setEmail('');
            setPassword('');
            navigate(from, { replace: true });
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Email or Password');
            } else if (err.response?.status === 401) {
                setErrMsg(err.response.data.message || 'Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div style={styles.container}>
            <div style={styles.leftSide}>
                <div style={styles.formContainer}>
                    <div style={styles.header}>
                        <Link to="/" style={styles.logo}>critters.</Link>
                        <h1 style={styles.title}>Welcome back</h1>
                        <p style={styles.subtitle}>Please enter your details.</p>
                    </div>
                    
                    {errMsg && <p style={styles.error}>{errMsg}</p>}
                    
                    <form onSubmit={handleSubmit} style={styles.form}>
                        <div style={styles.inputGroup}>
                            <label htmlFor="email" style={styles.label}>Email Address</label>
                            <input
                                type="email"
                                id="email"
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                required
                                style={styles.input}
                                placeholder="name@example.com"
                            />
                        </div>
                        
                        <div style={styles.inputGroup}>
                            <label htmlFor="password" style={styles.label}>Password</label>
                            <input
                                type="password"
                                id="password"
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                required
                                style={styles.input}
                                placeholder="Enter your password"
                            />
                        </div>
                        
                        <button type="submit" className="btn-primary" style={styles.btn} disabled={isLoading}>
                            {isLoading ? 'Logging in...' : 'Log In'}
                        </button>
                    </form>
                    
                    <div style={styles.footer}>
                        Don't have an account? <Link to="/register" className="btn-secondary">Sign up for free</Link>
                    </div>
                </div>
            </div>
            <div style={styles.rightSide}>
                <div style={styles.rightContent}>
                    <h2 style={styles.rightTitle}>The smarter way to host.</h2>
                    <p style={styles.rightSubtitle}>Join thousands of event organizers who use our platform to seamlessly manage ticketing, attendees, and schedules in one unified portal.</p>
                    <div style={styles.floatingCard}>
                        <div style={styles.cardIcon}>🎟️</div>
                        <div>
                            <div style={styles.cardTitle}>200+ Tickets Sold</div>
                            <div style={styles.cardSub}>Just this week!</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        minHeight: 'calc(100vh - 80px)', // adjust based on navbar
    },
    leftSide: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px'
    },
    formContainer: {
        width: '100%',
        maxWidth: '400px'
    },
    logo: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: 'var(--primary-color)',
        display: 'block',
        marginBottom: '40px'
    },
    title: {
        fontSize: '36px',
        fontWeight: '600',
        marginBottom: '10px'
    },
    subtitle: {
        color: '#666',
        marginBottom: '30px'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    },
    label: {
        fontSize: '14px',
        fontWeight: '500',
        color: '#333'
    },
    input: {
        padding: '14px',
        borderRadius: '8px',
        border: '1px solid #ddd',
        fontSize: '16px',
        fontFamily: 'inherit',
        backgroundColor: '#fff',
        transition: 'border-color 0.3s'
    },
    btn: {
        marginTop: '10px',
        padding: '14px',
        fontSize: '16px',
        width: '100%'
    },
    error: {
        color: '#d93025',
        backgroundColor: '#fce8e6',
        padding: '10px',
        borderRadius: '8px',
        marginBottom: '20px',
        fontSize: '14px',
        border: '1px solid #fad2cf'
    },
    footer: {
        marginTop: '30px',
        textAlign: 'center',
        fontSize: '15px'
    },
    rightSide: {
        flex: 1,
        backgroundColor: 'var(--primary-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px',
        color: 'white',
        borderTopLeftRadius: '40px',
        borderBottomLeftRadius: '40px'
    },
    rightContent: {
        maxWidth: '450px'
    },
    rightTitle: {
        fontSize: '48px',
        lineHeight: '1.2',
        marginBottom: '20px',
        fontWeight: '600'
    },
    rightSubtitle: {
        fontSize: '18px',
        lineHeight: '1.6',
        opacity: 0.9,
        marginBottom: '40px'
    },
    floatingCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        padding: '20px',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        border: '1px solid rgba(255, 255, 255, 0.2)'
    },
    cardIcon: {
        fontSize: '32px'
    },
    cardTitle: {
        fontWeight: 'bold',
        fontSize: '18px'
    },
    cardSub: {
        opacity: 0.8,
        fontSize: '14px'
    }
};

export default Login;
