const Shipment = require('../model/Shipment');
const calculateETA = require('../utils/calculateETA');
const { v4: uuidv4 } = require('uuid');

exports.getShipments = async (req, res) => {
    try {
        const shipments = await Shipment.find();
        res.status(200).json(shipments);
    } catch (error) {
        res.status(500).json({ message: "Error fetching shipments", error });
    }
};

exports.getShipment = async (req, res) => {
    try {
        const shipment = await Shipment.findById(req.params.id);
        if (!shipment) {
            return res.status(404).json({ message: "Shipment not found" });
        }
        res.status(200).json(shipment);
    } catch (error) {
        res.status(500).json({ message: "Error fetching shipment", error });
    }
};


exports.createShipment = async (req, res) => {
    try {
        const { containerId, startLocation, endLocation, status } = req.body;

        if (!containerId || !startLocation || !endLocation || !status) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const route = [startLocation, endLocation];
        const eta = await calculateETA(route, endLocation);
        console.log(eta)

        const newShipment = new Shipment({
            containerId,
            currentLocation: startLocation,
            startLocation,
            endLocation,
            status,
            eta,
            route,
        });

        await newShipment.save();

        res.status(201).json(newShipment);
    } catch (error) {
        console.error("Error creating shipment:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


exports.updateShipmentLocation = async (req, res) => {
    try {
        const { currentLocation } = req.body;
        const shipment = await Shipment.findById(req.params.id);

        if (!shipment) {
            return res.status(404).json({ message: "Shipment not found" });
        }

        if (shipment.route[1].lat === currentLocation.lat && shipment.route[1].lng === currentLocation.lng) {
            shipment.status = "Delivered";
            shipment.eta = "0";
        } else {
            shipment.currentLocation = currentLocation;
            shipment.eta = await calculateETA(shipment.route, currentLocation);
        }

        await shipment.save();

        res.status(200).json(shipment);
    } catch (error) {
        res.status(500).json({ message: "Error updating location", error });
    }
};


exports.getETA = async (req, res) => {
    const shipment = await Shipment.findById(req.params.id);
    const eta = await calculateETA(shipment.route, shipment.currentLocation);
    res.json({ eta });
};