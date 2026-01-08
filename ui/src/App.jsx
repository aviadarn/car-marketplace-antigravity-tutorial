import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Gallery from './pages/Gallery';
import VehicleDetail from './pages/VehicleDetail';
import CustomerLounge from './pages/CustomerLounge';

function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-elite-darker text-slate-100 selection:bg-elite-gold selection:text-elite-darker">
                <Navbar />
                <main className="pt-20 pb-10 px-4 container mx-auto">
                    <Routes>
                        <Route path="/" element={<Gallery />} />
                        <Route path="/car/:id" element={<VehicleDetail />} />
                        <Route path="/lounge" element={<CustomerLounge />} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}

export default App;
