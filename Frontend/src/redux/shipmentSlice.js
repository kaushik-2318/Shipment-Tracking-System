import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const baseurl = "https://shipment-tracking-system.onrender.com"

export const fetchShipments = createAsyncThunk('shipment/fetchShipments', async () => {
    const response = await axios.get(`${baseurl}/api/shipments`);
    return response.data;
});

export const addShipment = createAsyncThunk('shipment/addShipment', async (shipment) => {
    const response = await axios.post(`${baseurl}/api/shipment`, shipment);
    return response.data;
});

export const updateShipmentLocationAsync = createAsyncThunk('shipment/updateShipmentLocation', async ({ id, newLocation }) => {
    const response = await axios.post(`${baseurl}/api/shipment/${id}/updatelocation`, { currentLocation: newLocation });
    console.log(response)
    return { id, newLocation };
}
);

const shipmentSlice = createSlice({
    name: 'shipment',
    initialState: { shipments: [] },
    reducers: {
        updateShipmentLocation: (
            state,
            action,
        ) => {
            const shipment = state.shipments.find((s) => s._id === action.payload.id);
            if (shipment) {
                shipment.currentLocation = action.payload.newLocation
                shipment.route.push(action.payload.newLocation)
            }
        },
        setSelectedShipment: (state, action) => {
            state.selectedShipment = action.payload ? state.shipments.find((s) => s.id === action.payload) || null : null
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchShipments.fulfilled, (state, action) => {
            state.shipments = Array.isArray(action.payload) ? action.payload : [];
        });
        builder.addCase(addShipment.fulfilled, (state, action) => {
            state.shipments.push(action.payload);
        });
        builder.addCase(updateShipmentLocationAsync.fulfilled, (state, action) => {
            const shipment = state.shipments.find((s) => s.id === action.payload.id);
            if (shipment) {
                shipment.currentLocation = action.payload.newLocation;
                shipment.route.push(action.payload.newLocation);
            }
        });
    }

});

export const { updateShipmentLocation, setSelectedShipment } = shipmentSlice.actions

export default shipmentSlice.reducer
