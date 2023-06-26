import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Edit from "./EditButton";
import HalfRating from "./RatingStar";
import Avatar from '@mui/material/Avatar';
import "../style/movieDetail.css";

export default function Rating() {
  const { user } = useAuth0();
  const { movieId } = useParams();
  const [reviews, setReviews] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [reviewUsers, setReviewUsers] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/details/reviewByMovie/${movieId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    }).then((data) => {
      setReviews(data);
      setIsLoading(false);
      const userIds = data.map((review) => review.userId);
      getUserInfo(userIds);
    })
}, [movieId])

    async function getUserInfo(userIds) {
        const userPromises = userIds.map((userId) =>
        fetch(`${process.env.REACT_APP_API_URL}/users/${userId}`).then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
      );
      const users = await Promise.all(userPromises);
      setReviewUsers(users);
    }


    if (isLoading) {
        return <div>is loading</div>;
      }

  return reviews.map((review) => {
    const isAuthenticated = user && user.sub === review.userId;
    const reviewUser = reviewUsers.find((user) => user.auth0Id === review.userId);
    const star = parseFloat((Math.round(review.rating / 2)).toFixed(1));
    const char = reviewUser && reviewUser.name.charAt(0).toUpperCase();

    return (
      <div>
        <ul className="movie-review-list">
        <li key={review.id} className="movie-review-item"> 
          {reviewUser && (
                <div className="user-info">
                  <Avatar>{char}</Avatar>
                  <p className="name">{reviewUser.name}</p>
                  {isAuthenticated && <Edit movieId={movieId}/>}
                  </div>)}
        <div className="comment-info">
          <div className="rating-value">
        <HalfRating value={star}/>
        <p>{review.rating}</p></div>
        <p>
          {review.comment}
        </p>

        </div>
        </li>
        </ul>
      </div>
    );
  });
}
