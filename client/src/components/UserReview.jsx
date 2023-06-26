import React from "react";
import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useAuthToken } from "../AuthTokenContext";
import Edit from "./EditButton";
import HalfRating from "./RatingStar";
import "../style/userReview.css";

export default function UserReview() {
    const { user } = useAuth0();
    const {accessToken} = useAuthToken();
    const [reviews, setReviews] = useState();
    const [movieList, setMovieList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/details/reviewByUser/${user.sub}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setReviews(data);
        setIsLoading(false);
        const movieIds = data.map((review) => review.movieId);
        getMovieInfo(movieIds);
      });
  }, [user, accessToken]);

  async function getMovieInfo(movieIds) {
    const userPromises = movieIds.map((movieId) =>
    fetch(`${process.env.REACT_APP_API_URL}/details/${movieId}`).then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
  );
  const movies = await Promise.all(userPromises);
  setMovieList(movies);
}

  if (isLoading) {
    return <div>is loading</div>;
  }

  
  return reviews.map((review) => {
    const isAuthenticated = user && user.sub === review.userId;
    const reviewMovie = movieList.find((movie) => movie.tmdbID === review.movieId);
    const star = parseFloat((Math.round(review.rating / 2)).toFixed(1));

    return (
        <li key={review.id} className="review-item">
          {reviewMovie && <img className="review-poster" src={`https://image.tmdb.org/t/p/original${reviewMovie.poster}`} alt="poster" />}
          <div className="review">
        {reviewMovie && (
                <div className="user-info">
                  <p className="title">{reviewMovie.title}</p>
                  {isAuthenticated && <Edit movieId={review.movieId} />}
                  </div>)}
        <div className="comment-info">
          <div className="rating-value">
        <HalfRating value={star}/>
        <p>{review.rating}</p></div>
          </div>
          <p>
          {review.comment}
        </p>
        </div>
        </li>
    );
  });
}
