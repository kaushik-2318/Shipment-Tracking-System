import { configureStore } from '@reduxjs/toolkit';
import shipmentReducer from './shipmentSlice';

const store = configureStore({
    reducer: { shipment: shipmentReducer }
});

export default store;
