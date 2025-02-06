# Cargo Shipment Tracker

## Overview
The Cargo Shipment Tracker is a MERN stack-based application designed to manage and track cargo shipments efficiently. It features a user-friendly dashboard, real-time shipment updates, and interactive map integration.

## Features
- Create, update, and track shipments
- Interactive dashboard with shipment status
- Map integration for tracking
- RESTful API with Node.js and Express
- State management using Redux
- Database management with MongoDB

## Tech Stack
### Frontend
- React.js
- Redux Toolkit
- Tailwind CSS
- Map integration (Leaflet)

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose ORM)

## Installation

### Prerequisites
- Node.js and npm installed
- MongoDB instance running (local or cloud-based)

### Backend Setup
```bash
cd backend
npm install
node server.js
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## Environment Variables
Create a `.env` file in the backend root directory and configure the following:
```
MONGO_URI=your_mongodb_connection_string
```

## API Endpoints
- `GET /api/shipments` - Fetch all shipments
- `GET /api/shipments/:id` - Fetch a specific shipment
- `PUT /api/shipment/:id/update-location` – Update the current location of the shipment.
- `POST /api/shipment` - Create a new shipment
- `PUT /api/shipments/:id` - Update shipment details
- `GET /api/shipment/:id/eta` – Retrieve the estimated time of arrival (ETA) based on current location and route data.

## License
This project is licensed under the MIT License.

## Contributors
- [Kaushik Verma](https://github.com/kaushik-2318)
