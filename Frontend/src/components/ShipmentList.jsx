import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchShipments, updateShipmentLocationAsync } from "../redux/shipmentSlice"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Search, ArrowUpDown, MapPin, Info } from "lucide-react"

const ShipmentList = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const shipments = useSelector((state) => state.shipment.shipments)
    const [filter, setFilter] = useState("")
    const [sortColumn, setSortColumn] = useState("id")
    const [sortDirection, setSortDirection] = useState("asc")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalShipment, setModalShipment] = useState(null)
    const [newLat, setNewLat] = useState("")
    const [newLng, setNewLng] = useState("")

    useEffect(() => {
        dispatch(fetchShipments())
    }, [dispatch])

    if (!Array.isArray(shipments)) {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex justify-center items-center h-screen"  >
                <p className="text-xl font-semibold">Loading shipments...</p>
            </motion.div>
        )
    }

    const filteredShipments = shipments.filter((shipment) =>
        Object.values(shipment).some((value) => String(value).toLowerCase().includes(filter.toLowerCase())),
    )

    const sortedShipments = [...filteredShipments].sort((a, b) => {
        if (a[sortColumn] < b[sortColumn]) return sortDirection === "asc" ? -1 : 1
        if (a[sortColumn] > b[sortColumn]) return sortDirection === "asc" ? 1 : -1
        return 0
    })

    const handleSort = (column) => {
        if (column === sortColumn) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc")
        } else {
            setSortColumn(column)
            setSortDirection("asc")
        }
    }

    const handleOpenModal = (shipment) => {
        setModalShipment(shipment)
        setIsModalOpen(true)
    }

    const handleUpdateLocation = ({ id }) => {
        if (!modalShipment) return;

        const lat = newLat ? Number.parseFloat(newLat) : modalShipment.currentLocation.lat;
        const lng = newLng ? Number.parseFloat(newLng) : modalShipment.currentLocation.lng;

        if (lat === modalShipment.currentLocation.lat && lng === modalShipment.currentLocation.lng) {
            setIsModalOpen(false);
            return;
        }

        try {
            dispatch(
                updateShipmentLocationAsync({
                    id,
                    newLocation: {
                        lat: Number.parseFloat(newLat),
                        lng: Number.parseFloat(newLng),
                    },
                })
            ).then(() => {
                dispatch(fetchShipments());
            });
            setNewLat("");
            setNewLng("");
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error updating location:", error);
        }
    };


    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} >
            <h1 className="text-3xl font-bold mb-6">Shipment List</h1>
            <div className="relative mb-6">
                <Input placeholder="Filter shipments..." value={filter} onChange={(e) => setFilter(e.target.value)} className="pl-10" />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="cursor-pointer hover:bg-gray-100  transition-colors" onClick={() => handleSort("containerId")}>
                                <div className="flex items-center text-center justify-center">
                                    Container ID
                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                </div>
                            </TableHead>
                            <TableHead className="cursor-pointer hover:bg-gray-100  transition-colors" onClick={() => handleSort("currentLocation")}>
                                <div className="flex items-center text-center justify-center">
                                    Current Location
                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                </div>
                            </TableHead>
                            <TableHead className="cursor-pointer hover:bg-gray-100  transition-colors" onClick={() => handleSort("eta")}>
                                <div className="flex items-center text-center justify-center">
                                    ETA
                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                </div>
                            </TableHead>
                            <TableHead className="cursor-pointer hover:bg-gray-100  transition-colors" onClick={() => handleSort("status")}>
                                <div className="flex items-center text-center justify-center">
                                    Status
                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                </div>
                            </TableHead>
                            <TableHead >
                                <div className="flex items-center text-center justify-center">
                                    View on Map
                                </div>
                            </TableHead>
                            <TableHead>
                                <div className="flex items-center text-center justify-center">
                                    Details
                                </div>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <AnimatePresence>
                            {sortedShipments.map((shipment) => (
                                <motion.tr key={shipment._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                                    <TableCell className="text-center" >{shipment.containerId}</TableCell>
                                    <TableCell className="text-center" >{`${shipment.currentLocation.lat}, ${shipment.currentLocation.lng}`}</TableCell>
                                    <TableCell className="text-center" >{shipment.eta == "0" ? 0 : new Date(shipment.eta).toLocaleString()}</TableCell>
                                    <TableCell className="text-center" >
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${shipment.status === "In Transit" ? "bg-blue-100 text-blue-800" : shipment.status === "Delivered" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}   >
                                            {shipment.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-center" >
                                        <Button variant="ghost" size="sm" onClick={(e) => { e.preventDefault(); navigate(`/map/${shipment._id}`) }}>
                                            <MapPin className="mr-2 h-4 w-4" />
                                            View on Map
                                        </Button>
                                    </TableCell>
                                    <TableCell className="text-center" >
                                        <Button variant="ghost" size="sm" onClick={() => handleOpenModal(shipment)}>
                                            <Info className="mr-2 h-4 w-4" />
                                            Details
                                        </Button>
                                    </TableCell>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Shipment Details</DialogTitle>
                    </DialogHeader>
                    {modalShipment && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="mt-4 p-4 border rounded-md" >
                            <h2 className="text-xl font-bold mb-4">Shipment Information</h2>
                            <div className="space-y-2">
                                <p>
                                    <span className="font-semibold">Container ID:</span> {modalShipment.containerId}
                                </p>
                                <p>
                                    <span className="font-semibold">Current Location:</span> {modalShipment.currentLocation.lat},{" "}
                                    {modalShipment.currentLocation.lng}
                                </p>
                                <p>
                                    <span className="font-semibold">Starting Location:</span> {modalShipment.route[0].lat},{" "}
                                    {modalShipment.route[0].lng}
                                </p>
                                <p>
                                    <span className="font-semibold">Destination:</span> {modalShipment.route[1].lat},{" "}
                                    {modalShipment.route[1].lat}
                                </p>
                                <p>
                                    <span className="font-semibold">ETA:</span> {new Date(modalShipment.eta).toLocaleString()}
                                </p>
                                <p>
                                    <span className="font-semibold">Status:</span> {modalShipment.status}
                                </p>
                            </div>
                            <div className="mt-6">
                                <h3 className="text-lg font-semibold mb-3">Update Location</h3>
                                <div className="space-y-3">
                                    <Input placeholder="New Latitude" type="number" value={newLat} onChange={(e) => setNewLat(e.target.value)} />
                                    <Input placeholder="New Longitude" type="number" value={newLng} onChange={(e) => setNewLng(e.target.value)} />
                                    <Button onClick={(e) => { e.preventDefault(); handleUpdateLocation({ id: modalShipment._id }) }} className="w-full">
                                        Update Location
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </DialogContent>
            </Dialog>
        </motion.div >
    )
}

export default ShipmentList

