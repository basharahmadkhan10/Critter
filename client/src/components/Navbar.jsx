import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import axios from '../api/axios';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';

const Navbar = () => {
    const { auth, setAuth } = useAuth();
    const navigate = useNavigate();
    const navRef = useRef(null);

    useEffect(() => {
        gsap.fromTo(navRef.current, 
            { y: -50, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
        );
    }, []);

    const logout = async () => {
        try {
            await axios.post('/auth/logout', {}, { withCredentials: true });
            setAuth({});
            navigate('/');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <nav ref={navRef} style={styles.navbar}>
            <div style={styles.left}>
                <Link to="/" style={styles.logo}>events.</Link>
                <div style={styles.links}>
                    <Link to="#features" style={styles.link}>Features</Link>
                    <Link to="/" style={styles.link}>Contact us</Link>
                </div>
            </div>
            
            <div style={styles.right}>
                {auth?.accessToken ? (
                    <>
                        <Link to="/dashboard" style={styles.link}>Dashboard</Link>
                        {auth?.role === 'admin' && (
                            <Link to="/admin" style={styles.link}>Admin Panel</Link>
                        )}
                        <button onClick={logout} className="btn-secondary" style={styles.loginBtn}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="btn-secondary" style={styles.loginBtn}>Log in</Link>
                        <Link to="/register" className="btn-primary">Start for free</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

const styles = {
    navbar: {
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '20px 50px',
        maxWidth: '100%',
        margin: '0 auto',
        width: '100%'
    },
    left: {
        display: 'flex',
        alignItems: 'center',
        gap: '40px'
    },
    logo: {
        fontSize: '24px',
        fontWeight: '700',
        color: 'var(--primary-color)',
        letterSpacing: '-1px'
    },
    links: {
        display: 'flex',
        gap: '24px'
    },
    link: {
        color: 'var(--nav-text)',
        fontSize: '14px',
        fontWeight: '500'
    },
    right: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px'
    },
    loginBtn: {
        fontSize: '14px'
    }
};

export default Navbar;
