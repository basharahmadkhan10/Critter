import { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { LuCalendar, LuMapPin, LuTicket } from 'react-icons/lu';

const History = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await axiosPrivate.get('/bookings');
                setBookings(response.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError('Failed to fetch your booking history.');
                setLoading(false);
            }
        };
        fetchBookings();
    }, [axiosPrivate]);

    if (loading) return <div className="loading">Loading History...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h2>My Booked Tickets</h2>
                <p style={{ textAlign: 'center' }}>View all the events you have booked.</p>
            </div>

            <div className="events-grid">
                {bookings.length === 0 ? (
                    <div style={{ width: '100%', gridColumn: '1 / -1', display: 'flex', justifyContent: 'center' }}>
                        <p style={{ textAlign: 'center', padding: '40px 0', color: '#666' }}>
                            You have not booked any events yet.
                        </p>
                    </div>
                ) : (
                    bookings.map((booking) => {
                        const event = booking.event;
                        if (!event) return null; // Defensive check
                        return (
                        <div key={booking._id} className="event-card">
                            <div className="event-image-wrapper">
                                <img src={event.imageUrl} alt={event.title} className="event-image" />
                            </div>
                            <div className="event-content">
                                <h3>{event.title}</h3>
                                
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
                                <div className="booking-info">
                                    <span className="event-detail" style={{color: 'var(--primary-color)'}}>
                                        <LuTicket className="detail-icon" />
                                        Ticket Confirmed
                                    </span>
                                    <p className="booked-date" style={{fontSize: '0.8rem', color: 'gray', marginTop: '0.5rem'}}>
                                        Booked on: {new Date(booking.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )})
                )}
            </div>
        </div>
    );
};

export default History;
