const mongoose = require('mongoose');

const ShipmentSchema = new mongoose.Schema({
    containerId: { type: String, required: true },
    route: [{ lat: Number, lng: Number }],
    currentLocation: { lat: Number, lng: Number },
    status: { type: String, enum: ['In Transit', 'Delivered', 'Pending'], default: 'In Transit' },
    eta: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Shipment", ShipmentSchema);
