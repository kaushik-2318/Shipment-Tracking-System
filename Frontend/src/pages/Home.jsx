import ShipmentList from '../components/ShipmentList.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import ShipmentFormContainer from "../components/ShipmentFormContainer.jsx"

const Home = () => {
    return (
        <div className='cursor-default container mx-auto p-5'>
            <h1 className="text-2xl font-bold mb-4">Shipping Dashboard</h1>
            <Tabs defaultValue="table">
                <TabsList>
                    <TabsTrigger value="table">Shipments Table</TabsTrigger>
                    <TabsTrigger value="add">Add Shipment</TabsTrigger>
                </TabsList>
                <TabsContent value="table">
                    <ShipmentList />
                </TabsContent>
                <TabsContent value="add">
                    <ShipmentFormContainer />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Home;