import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import shoes from '../services/shoes.js';
import {API_BASE_URL} from "../utils/config.js";

const HomePage = () => {
    const navigate = useNavigate();
    const [shoesData, setShoesData] = useState([]);
    const [textSearch, setTextSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [sortedBy, setSortedBy] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);


    useEffect(() => {
        const fetchShoesData = async () => {
            try {
                const data = await shoes.getAll();
                setShoesData(data);
            } catch (error) {
                console.error('Error fetching shoes data:', error);
            }
        };

        fetchShoesData();
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);


    const filteredShoesData = shoesData.filter((shoe) => {
        const modelMatch = shoe.model.toLowerCase().includes(textSearch.toLowerCase());
        const designerMatch = shoe.designer.toLowerCase().includes(textSearch.toLowerCase());
        const categoryMatch = categoryFilter === '' || shoe.category === categoryFilter;

        return (modelMatch || designerMatch) && categoryMatch;
    });

    const sortedShoesData = filteredShoesData.sort((a, b) => {
        if (sortedBy === 'price') {
            return a.originalPrice - b.originalPrice;
        } else if (sortedBy === 'releaseYear') {
            return a.releaseYear - b.releaseYear;
        } else {
            return 0;
        }
    });

    const handleCategoryChange = (event) => {
        setCategoryFilter(event.target.value);
    };

    const handleSortChange = (event) => {
        setSortedBy(event.target.value);
    };

    const handleShoeClick = (shoeId) => {
        navigate(`/shoe/${shoeId}`);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        localStorage.removeItem('token');
    };


    return (
        <div className="homepage">
            <div className="homepage-controls">
                <h1>Jordan Shoe Hub: Explore Nike's Finest</h1>
                <div className="centerDiv">
                {isLoggedIn ? (
                    <button onClick={handleLogout} className="logoutButton">
                        Logout
                    </button>
                ) : (
                    <button onClick={() => navigate('/login')} className="loginButton">
                        Login
                    </button>
                )}
                <button onClick={() => navigate('/register')} className="registerButton">Register</button>
                <input
                    type="text"
                    placeholder="Search..."
                    value={textSearch}
                    onChange={(e) => setTextSearch(e.target.value)}
                    className="searchInput"
                />
                <select value={categoryFilter} onChange={handleCategoryChange} className="category-filter">
                    <option value="">All Categories</option>
                    <option value="men">Men</option>
                    <option value="kids">Kids</option>
                    <option value="women">Women</option>
                </select>
                <select value={sortedBy} onChange={handleSortChange} className="sort-filter">
                    <option value="">Sort By</option>
                    <option value="price">Price</option>
                    <option value="releaseYear">Release Year</option>
                </select>
                <button onClick={() => navigate('/create-shoe')} className="addButton">Add your favorite Jordan</button>
                </div>
                <div className="shoesContainer">
                    {sortedShoesData.map((shoe) => (
                        <div key={shoe.id} className="shoeCard" onClick={() => handleShoeClick(shoe.id)}>
                            <img src={`${API_BASE_URL}${shoe.image}`} alt={shoe.model} className="shoeImage"/>
                            <div className="shoeText">
                                <h2>
                                    {shoe.model} | <b>Designer: {shoe.designer}</b> | <b>Released: {shoe.releaseYear}</b> | <b>Category: {shoe.category}</b> | <b>Original
                                    Price: ${shoe.originalPrice / 100}</b>
                                </h2>
                                <p>{shoe.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HomePage;