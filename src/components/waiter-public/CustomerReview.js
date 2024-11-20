import React, { useState } from "react";
import { createNewReview } from "../../services/controller/reviewController";
import { getVisitorId } from "../../services/controller/visitorController";
import '../../styles/customer-review.css'
import { useNavigate } from "react-router-dom";

const CustomerReview = (waiter) => {
    const [selectedStars, setSelectedStars] = useState(0);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleStarClick = (index) => {
        setSelectedStars(index + 1);
    };

    const handleConfirm = () => {
        setLoading(true)
        const waiterSlug = waiter.waiterData.waiter_slug
        const visitorId = getVisitorId()
        const reviewInfo = {
            rating: selectedStars,
            visitor_id: visitorId,
            waiter_id: waiterSlug
        }
        
        createNewReview(reviewInfo)
        setTimeout(() => {
            setLoading(false)
            navigate('/')
        }, 500)
    };

    return (
        <div className="star-rating-container">
            
            <h3> Avalie a sua experiência! </h3>
          
            <div className="stars">
            {[...Array(5)].map((_, index) => (
                <span
                    key={index}
                    className={`star ${index < selectedStars ? 'selected' : ''}`}
                    onClick={() => handleStarClick(index)}
                >
                ★
                </span>
            ))}
            </div>

            <button className="confirm-button" onClick={handleConfirm} disabled={selectedStars === 0}>
            Confirmar
            </button>

            {loading && <div className="loader-container"><div className="loader"/></div>}

        </div>
      );
};

export default CustomerReview