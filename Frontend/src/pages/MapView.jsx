import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet"
import { useLocation } from "react-router-dom"
import axios from "axios"
import { motion } from "framer-motion"
import { Loader2, AlertCircle, Package, MapPin, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { useToast } from "../hooks/use-toast"

const ShipmentMap = () => {
    const path = useLocation().pathname.split("/").pop();
    const [shipment, setShipment] = useState(null)

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const { toast } = useToast()

    useEffect(() => {
        const getShipment = async () => {
            try {
                setLoading(true)
                const res = await axios.get(`https://shipment-tracking-system.onrender.com/api/shipment/${path}`)
                setShipment(res.data)
                setLoading(false)
            } catch (error) {
                console.error("Error fetching shipment data:", error)
                setError("Failed to fetch shipment data. Please try again.")
                setLoading(false)
                toast({
                    title: "Error",
                    description: "Failed to fetch shipment data. Please try again.",
                    variant: "destructive",
                })
            }
        }
        getShipment()
    }, [path, toast])

    if (loading) {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center h-screen" >
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
                <p className="mt-4 text-lg font-semibold">Loading shipment data...</p>
            </motion.div>
        )
    }

    if (error) {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center h-screen" >
                <AlertCircle className="h-16 w-16 text-destructive" />
                <p className="mt-4 text-lg font-semibold text-destructive">{error}</p>
                <Button className="mt-4" onClick={() => window.location.reload()}>
                    Try Again
                </Button>
            </motion.div>
        )
    }

    if (!shipment) return null

    const mapCenter = shipment.currentLocation
    const mapBounds = [shipment.route[0], shipment.route[1]]

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-screen flex flex-col md:flex-row"  >
            <Card className="w-full md:w-1/3 p-4 m-4 overflow-y-auto">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Shipment Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <Package className="mr-2" />
                            <span className="font-semibold">Container ID: </span> {shipment.containerId}
                        </div>
                        <div className="flex items-center">
                            <MapPin className="mr-2" />
                            <span className="font-semibold">Current Location: </span>{" "}
                            {`${shipment.currentLocation.lat}, ${shipment.currentLocation.lng}`}
                        </div>
                        <div className="flex items-center">
                            <MapPin className="mr-2" />
                            <span className="font-semibold">Starting Location: </span>{" "}
                            {` ${shipment.route[0].lat}, ${shipment.route[0].lng}`}
                        </div>
                        <div className="flex items-center">
                            <MapPin className="mr-2" />
                            <span className="font-semibold">Destination: </span>{" "}
                            {`${shipment.route[1].lat}, ${shipment.route[1].lng}`}
                        </div>
                        <div className="flex items-center">
                            <Calendar className="mr-2" />
                            <span className="font-semibold">ETA:</span> {new Date(shipment.eta).toLocaleString()}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex-grow m-4">
                <MapContainer center={mapCenter} zoom={5} style={{ width: "100%", height: "100%" }} bounds={mapBounds}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                    <Marker position={shipment.route[0]}>
                        <Popup>Starting Point</Popup>
                    </Marker>

                    <Marker position={shipment.currentLocation}>
                        <Popup>
                            <p>Container ID: {shipment.containerId}</p>
                            <p>ETA: {new Date(shipment.eta).toLocaleString()}</p>
                        </Popup>
                    </Marker>

                    <Marker position={shipment.route[1]}>
                        <Popup>Destination</Popup>
                    </Marker>

                    <Polyline positions={[shipment.currentLocation, shipment.route[1]]} color="blue" />
                </MapContainer>
            </div>
        </motion.div>
    )
}

export default ShipmentMap

