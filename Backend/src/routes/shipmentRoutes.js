const express = require('express');
const { getShipments, getShipment, createShipment, getETA, updateShipmentLocation } = require('../controllers/shipmentController');
const router = express.Router();

router.get('/shipments', getShipments);
router.get('/shipment/:id', getShipment);
router.post('/shipment', createShipment);
router.post('/shipment/:id/updatelocation', updateShipmentLocation);
router.get('/shipment/:id/eta', getETA);

module.exports = router;
