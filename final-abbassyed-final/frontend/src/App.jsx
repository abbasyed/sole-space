import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import HomePage from './HomePage.jsx';
import CreateNewShoe from './CreateNewShoe.jsx';
import ShoeDetails from './ShoeDetails.jsx';
import Login from './Login.jsx';
import Register from "./Register.jsx";


const App = () => {
    return (
        <Router>
            <div className="app-container">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/create-shoe" element={<CreateNewShoe />} />
                    <Route path="/shoe/:shoeId" element={<ShoeDetails />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
