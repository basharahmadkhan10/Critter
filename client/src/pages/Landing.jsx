import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { LuTicket, LuChartColumn, LuZap } from 'react-icons/lu';

const Landing = () => {
    const heroRef = useRef(null);
    const subtitleRef = useRef(null);
    const btnRef = useRef(null);
    const illustrationRef = useRef(null);
    const phoneMockupRef = useRef(null);
    const featuresRef = useRef(null);

    useEffect(() => {
        const tl = gsap.timeline();
        
        tl.fromTo(heroRef.current, 
            { y: 30, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
        )
        .fromTo(subtitleRef.current, 
            { y: 20, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
            "-=0.4"
        )
        .fromTo(btnRef.current, 
            { y: 20, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
            "-=0.4"
        )
        .fromTo(illustrationRef.current,
            { opacity: 0, scale: 0.95 },
            { opacity: 1, scale: 1, duration: 1, ease: "power2.out" },
            "-=0.2"
        )
        .fromTo(phoneMockupRef.current,
            { y: 100, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: "back.out(1.7)" },
            "-=0.8"
        );

        // Floating animation for the phone
        gsap.to(phoneMockupRef.current, {
            y: "-=15",
            duration: 2.5,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut"
        });

        // Intersection Observer for Features section
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Target all elements with class 'feature-item'
                    gsap.fromTo('.feature-item', 
                        { y: 50, opacity: 0 }, 
                        { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power2.out" }
                    );
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        if (featuresRef.current) {
            observer.observe(featuresRef.current);
        }

        return () => observer.disconnect();

    }, []);

    return (
        <div style={styles.container}>
            {/* Hero Section */}
            <div style={styles.hero}>
                <h1 ref={heroRef} style={styles.title}>
                    Smart Event Management<br/>Portal
                </h1>
                <p ref={subtitleRef} style={styles.subtitle}>
                    Browse upcoming events, book tickets seamlessly,<br/>and manage your history all in one place.
                </p>
                <div ref={btnRef}>
                    <Link to="/register" className="btn-primary" style={styles.ctaBtn}>
                        Get Started
                    </Link>
                </div>
            </div>

            {/* Illustration Section */}
            <div style={styles.illustrationContainer} ref={illustrationRef}>
                <img src="/illustration.png" alt="Event portal illustration" style={styles.bgIllustration} />
                <div style={styles.overlayGradient}></div>
                
                <div style={styles.phoneMockup} ref={phoneMockupRef}>
                    <div style={styles.phoneHeader}>
                        <span style={styles.logo}>critters.</span>
                        <div style={styles.phoneIcons}>
                            <div style={styles.iconCircle}></div>
                            <div style={styles.iconCircle}></div>
                            <div style={styles.iconCirclePlus}>+</div>
                        </div>
                    </div>
                    <div style={styles.phoneDate}>Upcoming Events</div>
                    
                    <div style={styles.scheduleItem}>
                        <div style={styles.scheduleTime}>7:00 PM</div>
                        <div style={styles.scheduleDetails}>
                            <div>Tech Conference 2026</div>
                            <div style={styles.scheduleSub}>San Francisco, CA</div>
                        </div>
                        <div style={styles.avatar}></div>
                    </div>

                    <div style={styles.scheduleItem}>
                        <div style={styles.scheduleTime}>9:00 AM</div>
                        <div style={styles.scheduleDetails}>
                            <div>Annual Music Fest</div>
                            <div style={styles.scheduleSub}>VIP Pass</div>
                        </div>
                        <div style={styles.avatar}></div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div id="features" style={styles.featuresSection} ref={featuresRef}>
                <h2 className="feature-item" style={{...styles.title, fontSize: '40px', opacity: 0}}>Why Choose Our Platform?</h2>
                <div style={styles.featuresGrid}>
                    <div className="feature-item" style={styles.featureCard}>
                        <div style={styles.featureIcon}><LuTicket /></div>
                        <h3 style={styles.featureTitle}>Seamless Ticketing</h3>
                        <p style={styles.featureDesc}>Manage and sell event tickets effortlessly with our streamlined booking system.</p>
                    </div>
                    <div className="feature-item" style={styles.featureCard}>
                        <div style={styles.featureIcon}><LuChartColumn /></div>
                        <h3 style={styles.featureTitle}>Real-time Analytics</h3>
                        <p style={styles.featureDesc}>Track your attendees, monitor sales, and view insights as they happen.</p>
                    </div>
                    <div className="feature-item" style={styles.featureCard}>
                        <div style={styles.featureIcon}><LuZap /></div>
                        <h3 style={styles.featureTitle}>Automated Workflows</h3>
                        <p style={styles.featureDesc}>Save hours of work with automated confirmations, emails, and reminders.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        textAlign: 'center',
        paddingTop: '60px',
        overflow: 'hidden'
    },
    hero: {
        marginBottom: '40px',
        position: 'relative',
        zIndex: 10
    },
    title: {
        fontSize: '64px',
        fontWeight: '600',
        lineHeight: '1.1',
        marginBottom: '20px',
        fontFamily: "'Outfit', sans-serif", 
        letterSpacing: '-1px'
    },
    subtitle: {
        fontSize: '20px',
        color: '#666',
        marginBottom: '30px',
        lineHeight: '1.5'
    },
    ctaBtn: {
        fontSize: '18px',
        padding: '14px 32px'
    },
    illustrationContainer: {
        position: 'relative',
        maxWidth: '1000px',
        margin: '0 auto',
        height: '550px', // Increased height
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        overflow: 'hidden', 
        borderBottom: '2px solid rgba(0,0,0,0.05)'
    },
    bgIllustration: {
        width: '100%',
        height: '100%', // Added to make objectPosition work correctly
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 1,
        objectFit: 'cover',
        objectPosition: 'top', // Show top part
        opacity: 0.85
    },
    overlayGradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '40%',
        background: 'linear-gradient(to top, var(--bg-color) 0%, transparent 100%)',
        zIndex: 2
    },
    phoneMockup: {
        position: 'relative',
        zIndex: 3,
        width: '320px',
        height: '400px',
        backgroundColor: '#fff',
        borderRadius: '40px 40px 0 0',
        boxShadow: '0 -15px 40px rgba(0,0,0,0.12)',
        padding: '30px 20px',
        textAlign: 'left',
        border: '8px solid var(--bg-color)',
        borderBottom: 'none'
    },
    phoneHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
    },
    logo: {
        color: 'var(--primary-color)',
        fontWeight: 'bold',
        fontSize: '18px'
    },
    phoneIcons: {
        display: 'flex',
        gap: '8px'
    },
    iconCircle: {
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        border: '2px solid var(--primary-color)',
        opacity: 0.5
    },
    iconCirclePlus: {
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        backgroundColor: 'var(--primary-color)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '16px',
        fontWeight: 'bold'
    },
    phoneDate: {
        fontWeight: '600',
        fontSize: '18px',
        marginBottom: '15px'
    },
    scheduleItem: {
        backgroundColor: 'var(--bg-color)',
        borderRadius: '16px',
        padding: '15px',
        marginBottom: '12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    scheduleTime: {
        fontSize: '12px',
        fontWeight: 'bold',
        width: '60px',
        color: 'var(--primary-color)'
    },
    scheduleDetails: {
        flex: 1,
        marginLeft: '10px',
        fontSize: '14px',
        fontWeight: '600'
    },
    scheduleSub: {
        fontSize: '11px',
        color: '#888',
        marginTop: '4px',
        fontWeight: '400'
    },
    avatar: {
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        backgroundColor: '#ccc',
        backgroundImage: 'url(https://i.pravatar.cc/100?img=3)',
        backgroundSize: 'cover'
    },
    featuresSection: {
        padding: '100px 20px',
        maxWidth: '1200px',
        margin: '0 auto',
    },
    featuresGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '40px',
        marginTop: '60px'
    },
    featureCard: {
        backgroundColor: '#fff',
        padding: '40px 30px',
        borderRadius: '24px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
        textAlign: 'center',
        transition: 'transform 0.3s ease',
        opacity: 0 // For GSAP to animate
    },
    featureIcon: {
        fontSize: '48px',
        marginBottom: '20px',
        color: 'var(--primary-color)'
    },
    featureTitle: {
        fontSize: '22px',
        fontWeight: '600',
        marginBottom: '15px',
        color: 'var(--text-color)'
    },
    featureDesc: {
        fontSize: '16px',
        color: '#666',
        lineHeight: '1.6'
    }
};

export default Landing;
