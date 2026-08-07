import { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('createEvent');
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        location: '',
        imageUrl: '',
    });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    const [events, setEvents] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        if (activeTab === 'manageEvents') {
            fetchEvents();
        } else if (activeTab === 'users') {
            fetchUsers();
        }
    }, [activeTab]);

    const fetchEvents = async () => {
        try {
            const res = await axiosPrivate.get('/events');
            setEvents(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await axiosPrivate.get('/auth/users');
            setUsers(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteEvent = async (id) => {
        if (!window.confirm('Are you sure you want to delete this event?')) return;
        try {
            await axiosPrivate.delete(`/events/${id}`);
            setEvents(events.filter(e => e._id !== id));
        } catch (err) {
            console.error(err);
            alert('Failed to delete event');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            await axiosPrivate.post('/events', formData);
            setStatus({ type: 'success', message: 'Event created successfully!' });
            setFormData({ title: '', description: '', date: '', location: '', imageUrl: '' });
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.message || 'Failed to create event. Are you an admin?';
            setStatus({ type: 'error', message: msg });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-container">
            <div className="admin-sidebar">
                <h3>Admin Panel</h3>
                <button className={activeTab === 'createEvent' ? 'active' : ''} onClick={() => setActiveTab('createEvent')}>Create Event</button>
                <button className={activeTab === 'manageEvents' ? 'active' : ''} onClick={() => setActiveTab('manageEvents')}>Manage Events</button>
                <button className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>Users</button>
            </div>

            <div className="admin-content">
                {activeTab === 'createEvent' && (
                    <div className="admin-card">
                        <h2>Create Event</h2>
                        <p>Add a new event to the portal.</p>
                        
                        {status.message && (
                            <div className={`status-msg ${status.type}`}>
                                {status.message}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="admin-form">
                            <div className="input-group">
                                <label>Event Title</label>
                                <input type="text" name="title" value={formData.title} onChange={handleChange} required />
                            </div>
                            
                            <div className="input-group">
                                <label>Description</label>
                                <textarea name="description" value={formData.description} onChange={handleChange} required rows="3"></textarea>
                            </div>

                            <div className="input-group">
                                <label>Date</label>
                                <input type="date" name="date" value={formData.date} onChange={handleChange} required />
                            </div>

                            <div className="input-group">
                                <label>Location</label>
                                <input type="text" name="location" value={formData.location} onChange={handleChange} required />
                            </div>

                            <div className="input-group">
                                <label>Image URL (Optional)</label>
                                <input type="url" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="https://..." />
                            </div>

                            <button type="submit" className="admin-btn" disabled={loading}>
                                {loading ? 'Creating...' : 'Create Event'}
                            </button>
                        </form>
                    </div>
                )}

                {activeTab === 'manageEvents' && (
                    <div className="admin-card">
                        <h2>Manage Events</h2>
                        <div className="admin-list">
                            {events.map(event => (
                                <div key={event._id} className="admin-list-item">
                                    <div className="item-info">
                                        <h4>{event.title}</h4>
                                        <p>{new Date(event.date).toLocaleDateString()}</p>
                                    </div>
                                    <button onClick={() => handleDeleteEvent(event._id)} className="delete-btn">Delete</button>
                                </div>
                            ))}
                            {events.length === 0 && <p>No events found.</p>}
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="admin-card">
                        <h2>Users</h2>
                        <div className="admin-list">
                            {users.map(user => (
                                <div key={user._id} className="admin-list-item">
                                    <div className="item-info">
                                        <h4>{user.email}</h4>
                                        <p>Role: {user.role}</p>
                                    </div>
                                    <div>
                                        {user.isVerified ? <span className="badge verified">Verified</span> : <span className="badge pending">Pending</span>}
                                    </div>
                                </div>
                            ))}
                            {users.length === 0 && <p>No users found.</p>}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
