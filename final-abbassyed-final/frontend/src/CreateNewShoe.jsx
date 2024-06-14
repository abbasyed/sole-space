import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import Form from './Form.jsx';
import shoes from '../services/shoes.js';

const CreateNewShoePage = () => {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');

    const addShoe = async (shoe) => {
        try {
            await shoes.create(shoe);
            navigate('/');
        } catch (error) {
            setErrorMessage('Error creating shoe');
        }
    };

    return (
        <div className="created-newshoe">
            <Form addShoe={addShoe}/>
            {errorMessage && <p className="errorMessage">{errorMessage}</p>}
        </div>
    );
};

export default CreateNewShoePage;