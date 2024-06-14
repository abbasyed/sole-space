import axios from 'axios';

const baseURL = "/api/shoes";

// Helper function to get the authorization token
const getAuthToken = () => localStorage.getItem('token');

// Function to get all shoes
const getAll = () => {
    const request = axios.get(baseURL);
    return request.then(response => response.data);
}

// Function to get a shoe by ID
const getShoeById = async (shoeId) => {
    try {
        const response = await fetch(`${baseURL}/${shoeId}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching shoe data:', error);
        throw error;
    }
};

// Function to create a new shoe
const create = async (shoe) => {
    try {
        const formData = new FormData();
        Object.keys(shoe).forEach(key => {
            formData.append(key, shoe[key]);
        });
        const response = await axios.post(baseURL, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating shoe:', error);
        throw error;
    }
}

// Function to update an existing shoe
const update = async (shoe) => {
    const response = await axios.put(`${baseURL}/${shoe.id}`, shoe);
    return response.data;
}

// Function to get all comments for a specific shoe
const getComments = async (shoeId) => {
    try {
        const response = await fetch(`${baseURL}/${shoeId}/comments?populate=author`);
        if (!response.ok) {
            throw new Error('Failed to fetch comments');
        }
        return response.json();
    } catch (error) {
        console.error('Error fetching comments:', error);
        throw error;
    }
};


const getComment = async (commentId) => {
    try {
        const token = getAuthToken();
        const response = await fetch(`${baseURL}/comments/${commentId}?populate=author`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch comment');
        }
        return response.json();
    } catch (error) {
        console.error('Error fetching comment:', error);
        throw error;
    }
};


// Function to add a new comment to a shoe
const addComment = async (shoeId, comment) => {
    try {
        const token = getAuthToken();
        const response = await fetch(`${baseURL}/${shoeId}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({content: comment}),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error adding comment:', error);
        throw error;
    }
};

// Function to submit a rating for a shoe
const submitRating = async (shoeId, rating) => {
    try {
        const token = getAuthToken();
        const response = await fetch(`${baseURL}/${shoeId}/rating`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({rating}),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error submitting rating:', error);
        throw error;
    }
};

export default {getAll, create, update, getComments, addComment, getShoeById, submitRating, getComment};
