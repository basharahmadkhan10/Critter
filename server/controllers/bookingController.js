const Booking = require('../models/Booking');
const Event = require('../models/Event');

// @desc    Book an event
// @route   POST /bookings
const createBooking = async (req, res) => {
    try {
        const { eventId } = req.body;
        
        // Check if event exists
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check if already booked
        const existingBooking = await Booking.findOne({ user: req.user._id, event: eventId });
        if (existingBooking) {
            return res.status(400).json({ message: 'You have already booked this event' });
        }

        const booking = await Booking.create({
            user: req.user._id,
            event: eventId
        });

        res.status(201).json({ message: 'Event booked successfully', booking });
    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
             return res.status(400).json({ message: 'You have already booked this event' });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get user's bookings
// @route   GET /bookings
const getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id }).populate('event');
        res.status(200).json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { createBooking, getUserBookings };
