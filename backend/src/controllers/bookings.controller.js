import {
    approveBooking,
    createBooking,
    getAllBookings,
    rejectBooking,
} from '../services/booking.service.js';

export async function getBookings(req, res, next) {
    try {
        const items = await getAllBookings();
        res.json(items);
    } catch (error) {
        next(error);
    }
}

export async function postBooking(req, res, next) {
    try {
        const booking = await createBooking(req.body);
        res.status(201).json(booking);
    } catch (error) {
        next(error);
    }
}

export async function patchApproveBooking(req, res, next) {
    try {
        const booking = await approveBooking(req.params.id, req.user.id);
        res.json(booking);
    } catch (error) {
        next(error);
    }
}

export async function patchRejectBooking(req, res, next) {
    try {
        const booking = await rejectBooking(req.params.id, req.body?.reason, req.user.id);
        res.json(booking);
    } catch (error) {
        next(error);
    }
}