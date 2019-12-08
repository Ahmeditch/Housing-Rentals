const express = require('express');
const router = express.Router();
const Rental = require('../models/rental');
const UserCntrl = require('../controllers/user');

router.get('', UserCntrl.authMiddleware ,(req, res) => {
    Rental.find({}, (error, foundRentals) => {
            res.status(200).json({
                foundRentals
            });
    });
});

router.get('/:id', (req, res) => {
const rentalId = req.params.id;
Rental.findById(rentalId, (err, foundRental) => {
    if (err) {
        res.status(422).json({
            errors: [
                {title: 'error', detail: 'Could not find rental'}
            ]
        });
    }
    res.status(201).json({
        foundRental
    });
});
});

module.exports = router;