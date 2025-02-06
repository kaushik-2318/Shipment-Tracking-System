import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { motion } from "framer-motion"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Label } from "./ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import BackgroundAnimation from "./BackgroundAnimation"

export default function AddShipmentForm({ onSubmit, handleShipmentAdded }) {
    const { control, handleSubmit, reset, formState: { errors } } = useForm()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleFormSubmit = async (data) => {
        setIsSubmitting(true)
        await onSubmit(data)
        reset()
        setIsSubmitting(false)
        handleShipmentAdded()
    }

    return (
        <>
            <BackgroundAnimation />
            <Card className="w-full max-w-md mx-auto mt-8">
                <CardHeader>
                    <CardTitle>Add New Shipment</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                            <Label htmlFor="containerId">Container ID</Label>
                            <Controller
                                name="containerId"
                                control={control}
                                rules={{ required: "Container ID is required" }}
                                render={({ field }) => <Input {...field} placeholder="Container ID" />}
                            />
                            {errors.containerId && <p className="text-red-500 text-sm mt-1">{errors.containerId.message}</p>}
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}  >
                            <Label>Starting Location</Label>
                            <div className="grid grid-cols-2 gap-2">
                                <Controller name="startLat" control={control} rules={{ required: "Latitude is required" }} render={({ field }) => <Input {...field} type="number" placeholder="Latitude" />} />
                                <Controller name="startLng" control={control} rules={{ required: "Longitude is required" }} render={({ field }) => <Input {...field} type="number" placeholder="Longitude" />} />
                            </div>
                            {(errors.startLat || errors.startLng) && (
                                <p className="text-red-500 text-sm mt-1">Both latitude and longitude are required</p>
                            )}
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}   >
                            <Label>Ending Location</Label>
                            <div className="grid grid-cols-2 gap-2">
                                <Controller name="endLat" control={control} rules={{ required: "Latitude is required" }} render={({ field }) => <Input {...field} type="number" placeholder="Latitude" />} />
                                <Controller name="endLng" control={control} rules={{ required: "Longitude is required" }} render={({ field }) => <Input {...field} type="number" placeholder="Longitude" />} />
                            </div>
                            {(errors.endLat || errors.endLng) && (
                                <p className="text-red-500 text-sm mt-1">Both latitude and longitude are required</p>
                            )}
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}  >
                            <Label>Status</Label>
                            <Controller name="status" control={control} rules={{ required: "Status is required" }} render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="Pending">Pending</SelectItem>
                                            <SelectItem value="In Transit">In Transit</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            )}
                            />
                            {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>}
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}       >
                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? "Adding Shipment..." : "Add Shipment"}
                            </Button>
                        </motion.div>
                    </form>
                </CardContent>
            </Card>
        </>
    )
}

