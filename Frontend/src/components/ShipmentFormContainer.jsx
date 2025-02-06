import { useDispatch } from "react-redux"
import { addShipment } from "../redux/shipmentSlice"
import AddShipmentForm from "./AddShipment"

export default function ShipmentFormContainer({ handleShipmentAdded }) {
    const dispatch = useDispatch()

    const handleSubmit = (data) => {
        dispatch(
            addShipment({
                containerId: data.containerId,
                startLocation: { lat: data.startLat, lng: data.startLng },
                endLocation: { lat: data.endLat, lng: data.endLng },
                status: data.status,
                route: [{ lat: data.currentLat, lng: data.currentLng }],
            }),
        )
    }

    return <AddShipmentForm onSubmit={handleSubmit} handleShipmentAdded={handleShipmentAdded} />
}