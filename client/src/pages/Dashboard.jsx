import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { LuCalendar, LuMapPin } from 'react-icons/lu';

const Dashboard = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('/events');
                setEvents(response.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError('Failed to fetch events.');
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    if (loading) return <div className="loading">Loading Events...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h2>Upcoming Events</h2>
                <p>Browse and discover amazing events near you.</p>
            </div>

            <div className="events-grid">
                {events.length === 0 ? (
                    <div className="no-events">
                        <p>No events available right now. Check back later!</p>
                    </div>
                ) : (
                    events.map((event) => (
                        <div key={event._id} className="event-card">
                            <img src={event.imageUrl} alt={event.title} className="event-image" />
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
                                <button className="book-btn">Book Ticket</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Dashboard;
