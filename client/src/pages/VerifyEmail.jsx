import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from '../api/axios';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    
    const [status, setStatus] = useState('Verifying...');

    useEffect(() => {
        const verify = async () => {
            if (!token || !email) {
                setStatus('Invalid verification link.');
                return;
            }

            try {
                const res = await axios.get(`/auth/verify-email?token=${token}&email=${email}`);
                setStatus(res.data.message);
            } catch (err) {
                setStatus(err.response?.data?.message || 'Verification failed. Please try again.');
            }
        };
        verify();
    }, [token, email]);

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>Email Verification</h1>
                <p style={styles.status}>{status}</p>
                {status.includes('successfully') && (
                    <Link to="/login" className="btn-primary" style={styles.btn}>Go to Login</Link>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '80vh'
    },
    card: {
        backgroundColor: '#fff',
        padding: '40px',
        borderRadius: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center'
    },
    title: {
        fontSize: '24px',
        marginBottom: '20px'
    },
    status: {
        fontSize: '16px',
        marginBottom: '20px'
    },
    btn: {
        display: 'inline-block',
        marginTop: '10px'
    }
};

export default VerifyEmail;
