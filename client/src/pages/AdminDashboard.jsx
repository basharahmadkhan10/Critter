import { useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        location: '',
        imageUrl: '',
    });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

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
            setTimeout(() => navigate('/dashboard'), 2000);
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
            <div className="admin-card">
                <h2>Admin Panel - Create Event</h2>
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
        </div>
    );
};

export default AdminDashboard;
