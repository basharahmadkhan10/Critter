import { useState } from 'react';
import axios from '../api/axios';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    
    const [msg, setMsg] = useState('');
    const [errMsg, setErrMsg] = useState('');
    
    const [isLoading, setIsLoading] = useState(false);
    const [showOtp, setShowOtp] = useState(false);
    
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrMsg('');
        setMsg('');
        
        try {
            const response = await axios.post('/auth/register', 
                JSON.stringify({ email, password }),
                { headers: { 'Content-Type': 'application/json' } }
            );
            
            setMsg(response.data.message);
            setShowOtp(true);
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg(err.response.data.message);
            } else {
                setErrMsg('Registration Failed');
            }
        } finally {
            setIsLoading(false);
        }
    }

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrMsg('');
        setMsg('');
        
        try {
            const response = await axios.post('/auth/verify-email', 
                JSON.stringify({ email, otp }),
                { headers: { 'Content-Type': 'application/json' } }
            );
            
            setMsg(response.data.message);
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg(err.response.data.message || 'Invalid OTP');
            } else {
                setErrMsg('Verification Failed');
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div style={styles.container}>
            <div style={styles.leftSide}>
                <div style={styles.formContainer}>
                    <Link to="/" style={styles.logo}>critters.</Link>
                    
                    {!showOtp ? (
                        <>
                            <h1 style={styles.title}>Start for free</h1>
                            <p style={styles.subtitle}>Create your account to launch and grow your events.</p>
                            
                            {msg && <p style={styles.success}>{msg}</p>}
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
                                        placeholder="Create a strong password"
                                    />
                                </div>
                                
                                <button type="submit" className="btn-primary" style={styles.btn} disabled={isLoading}>
                                    {isLoading ? 'Loading...' : 'Create Account'}
                                </button>
                            </form>
                            
                            <div style={styles.footer}>
                                Already have an account? <Link to="/login" className="btn-secondary">Log in here</Link>
                            </div>
                        </>
                    ) : (
                        <>
                            <h1 style={styles.title}>Verify Email</h1>
                            <p style={styles.subtitle}>We've sent a 6-digit OTP to <b>{email}</b></p>
                            
                            {msg && <p style={styles.success}>{msg}</p>}
                            {errMsg && <p style={styles.error}>{errMsg}</p>}
                            
                            <form onSubmit={handleVerifyOtp} style={styles.form}>
                                <div style={styles.inputGroup}>
                                    <label htmlFor="otp" style={styles.label}>Enter OTP</label>
                                    <input
                                        type="text"
                                        id="otp"
                                        onChange={(e) => setOtp(e.target.value)}
                                        value={otp}
                                        required
                                        maxLength="6"
                                        style={{...styles.input, textAlign: 'center', letterSpacing: '4px', fontSize: '20px'}}
                                        placeholder="123456"
                                    />
                                </div>
                                <button type="submit" className="btn-primary" style={styles.btn} disabled={isLoading}>
                                    {isLoading ? 'Verifying...' : 'Verify OTP'}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
            
            <div style={styles.rightSide}>
                <div style={styles.rightContent}>
                    <h2 style={styles.rightTitle}>Bring your events to life.</h2>
                    <p style={styles.rightSubtitle}>Setup takes less than 2 minutes. Get powerful tools for ticketing, analytics, and attendee management instantly.</p>
                    <div style={styles.floatingCard}>
                        <div style={styles.cardIcon}>🚀</div>
                        <div>
                            <div style={styles.cardTitle}>Zero Setup Fees</div>
                            <div style={styles.cardSub}>Start hosting today.</div>
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
    success: {
        color: '#0d652d',
        backgroundColor: '#e6f4ea',
        padding: '10px',
        borderRadius: '8px',
        marginBottom: '20px',
        fontSize: '14px',
        border: '1px solid #ceead6'
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
    }
};

export default Register;
