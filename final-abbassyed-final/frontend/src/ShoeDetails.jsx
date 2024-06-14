import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import shoes from '../services/shoes.js';
import { API_BASE_URL } from "../utils/config.js";
import { FaStar } from 'react-icons/fa';

const ShoeDetails = () => {
    const { shoeId } = useParams();
    const [shoe, setShoe] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [rating, setRating] = useState(0);
    const [ebayPrice, setEbayPrice] = useState(null);

    useEffect(() => {
        const fetchShoeData = async () => {
            try {
                const data = await shoes.getShoeById(shoeId);
                setShoe(data);
                const comments = await shoes.getComments(shoeId);
                setComments(comments);
            } catch (error) {
                console.error('Error fetching shoe data:', error);
            }
        };

        fetchShoeData();
    }, [shoeId]);

    const fetchEbayPrice = async () => {
        if (!shoe) return;
        try {
            const url = `${API_BASE_URL}/ebay-data?keywords=${encodeURIComponent(shoe.model)}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'X-EBAY-SOA-OPERATION-NAME': 'findItemsByKeywords',
                    'SECURITY-APPNAME': 'AbbasSye-JordanSh-PRD-ee1d2d212-8b7db400',
                    'RESPONSE-DATA-FORMAT': 'JSON',
                    'keywords': shoe.model
                }
            });
            const data = await response.json();
            const item = data.findItemsByKeywordsResponse[0].searchResult[0].item[0];
            const ebayPrice = item.sellingStatus[0].currentPrice[0].__value__;
            setEbayPrice(ebayPrice);
        } catch (error) {
            console.error('Error fetching eBay price:', error);
        }
    };

    useEffect(() => {
        fetchEbayPrice();
    }, [shoe]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        try {
            const addedComment = await shoes.addComment(shoeId, newComment);
            const populatedComment = await shoes.getComment(addedComment._id);
            setComments(prevComments => [...prevComments, populatedComment]);
            setNewComment('');
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const handleRatingSubmit = async (e, selectedRating) => {
        e.preventDefault();
        try {
            const updatedShoe = await shoes.submitRating(shoeId, selectedRating);
            setShoe(updatedShoe);
            setRating(selectedRating);
        } catch (error) {
            console.error('Error submitting rating:', error);
        }
    };

    const averageRating = shoe && shoe.ratings.length > 0 ?
        shoe.ratings.reduce((acc, cur) => acc + cur.rating, 0) / shoe.ratings.length :
        0;

    const ratingCount = shoe ? shoe.ratings.length : 0;

    return (
        <div className="container">
            <div className="shoe-details-container">
                <div className="shoe-details-card">
                    {shoe ? (
                        <>
                            <h1>{shoe.model}</h1>
                            <h2>
                                eBay current Price: ${ebayPrice}
                            </h2>
                            <img src={`${API_BASE_URL}${shoe.image}`} alt={shoe.model} />
                            <h2>
                                <b>Designer: {shoe.designer}</b> | <b>Released: {shoe.releaseYear}</b> | <b>Category: {shoe.category}</b> | <b>Original
                                Price: ${shoe.originalPrice / 100}</b>
                            </h2>
                            <p>{shoe.description}</p>
                            <div>
                                <span>Rating: </span>
                                {[...Array(5)].map((_, index) => (
                                    <FaStar
                                        key={index}
                                        color={index < rating ? 'gold' : 'gray'}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleRatingSubmit(e, index + 1);
                                        }}
                                    />
                                ))}
                            </div>
                            <div>
                                <span>Average Rating: {averageRating.toFixed(1)}</span>
                                <span> ({ratingCount} Ratings)</span>
                            </div>
                        </>
                    ) : (
                        <div className="loading">Loading...</div>
                    )}
                    <h2>Comments</h2>
                    <form className="comment-form" onSubmit={handleCommentSubmit}>
                        <textarea
                            className="comment-input"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add your comment..."
                        />
                        <button type="submit" className="submit-button">Submit</button>
                    </form>
                    <ul className="comment-list">
                        {comments.map((comment, index) => (
                            <li className="comment-item" key={index}>
                                <div>
                                    <strong>{comment.author?.username || 'Anonymous'}</strong>
                                </div>
                                <div>{comment.content}</div>
                                <div className="comment-date">
                                    {new Date(comment.createdAt).toLocaleString()}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ShoeDetails;
