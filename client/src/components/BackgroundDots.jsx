const BackgroundDots = () => {
    // Generate an array of dots with random properties
    const dots = Array.from({ length: 15 }).map((_, i) => {
        // Random properties for initial position and animation speed
        const size = Math.random() * 20 + 10; // 10px to 30px
        const left = Math.random() * 100; // 0% to 100%
        const top = Math.random() * 100; // 0% to 100%
        const duration = Math.random() * 15 + 15; // 15s to 30s
        const delay = Math.random() * 10; // 0s to 10s
        const opacity = Math.random() * 0.3 + 0.1; // 0.1 to 0.4
        
        return (
            <div
                key={i}
                className="floating-dot"
                style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    left: `${left}%`,
                    top: `${top}%`,
                    animationDuration: `${duration}s`,
                    animationDelay: `-${delay}s`,
                    opacity: opacity
                }}
            ></div>
        );
    });

    return (
        <div style={styles.container}>
            {dots}
        </div>
    );
};

const styles = {
    container: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1, // Keep it behind everything
        overflow: 'hidden',
        pointerEvents: 'none', // Prevent interactions
    }
};

export default BackgroundDots;
