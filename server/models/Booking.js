const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true,
    }
}, {
    timestamps: true
});

// Ensure a user can only book a specific event once
bookingSchema.index({ user: 1, event: 1 }, { unique: true });

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
