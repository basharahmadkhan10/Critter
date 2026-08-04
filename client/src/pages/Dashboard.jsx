import { useState, useEffect } from 'react';
import axios from '../api/axios';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { LuCalendar, LuMapPin } from 'react-icons/lu';

const Dashboard = () => {
    const [events, setEvents] = useState([]);
    const [bookedEvents, setBookedEvents] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        const fetchEventsAndBookings = async () => {
            try {
                const response = await axios.get('/events');
                setEvents(response.data);
                
                try {
                     const bookingsRes = await axiosPrivate.get('/bookings');
                     const bookedIds = new Set(bookingsRes.data.map(b => b.event._id));
                     setBookedEvents(bookedIds);
                } catch (e) {
                }
                
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError('Failed to fetch events.');
                setLoading(false);
            }
        };
        fetchEventsAndBookings();
    }, [axiosPrivate]);

    const showToast = (message, type) => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
    };

    const handleBook = async (eventId) => {
        try {
            await axiosPrivate.post('/bookings', { eventId });
            setBookedEvents(prev => new Set(prev).add(eventId));
            showToast('Ticket booked successfully!', 'success');
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.message || 'Failed to book ticket. Please login.';
            showToast(msg, 'error');
        }
    };

    if (loading) return <div className="loading">Loading Events...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="dashboard-container">
            {toast.show && (
                <div className={`toast-notification ${toast.type}`}>
                    {toast.message}
                </div>
            )}
            <div className="dashboard-header">
                <h2>Awesome Upcoming Events</h2>
                <p style={{ textAlign: 'center' }}>Browse and discover amazing events near you.</p>
            </div>

            <div className="events-grid">
                {events.length === 0 ? (
                    <div style={styles.grid}>
                        <p style={{ textAlign: 'center', width: '100%', gridColumn: '1 / -1', padding: '40px 0', color: '#666' }}>
                            No events available right now. Check back later!
                        </p>
                    </div>
                ) : (
                    events.map((event) => {
                        const isBooked = bookedEvents.has(event._id);
                        return (
                        <div key={event._id} className="event-card">
                            <div className="event-image-wrapper">
                                <img src={event.imageUrl} alt={event.title} className="event-image" />
                            </div>
                            <div className="event-content">
                                <h3>{event.title}</h3>
                                <p className="event-desc">{event.description}</p>
                                
                                <div className="event-details">
                                    <span className="event-detail">
                                        <LuCalendar className="detail-icon" />
                                        {new Date(event.date).toLocaleDateString()}
                                    </span>
                                    <span className="event-detail">
                                        <LuMapPin className="detail-icon" />
                                        {event.location}
                                    </span>
                                </div>
                                <button 
                                    className={`book-btn ${isBooked ? 'booked' : ''}`}
                                    onClick={() => !isBooked && handleBook(event._id)}
                                    disabled={isBooked}
                                >
                                    {isBooked ? 'Booked' : 'Book Ticket'}
                                </button>
                            </div>
                        </div>
                    )})
                )}
            </div>
        </div>
    );
};

export default Dashboard;
