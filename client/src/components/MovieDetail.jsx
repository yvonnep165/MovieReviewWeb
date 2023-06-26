import React from "react";
import Rating from "./ReviewDetail";
import "../style/movieDetail.css";
import { useAuthToken } from "../AuthTokenContext";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AddReview from "./AddReview";

export default function MovieDetail() {
  const {movieId} = useParams();
  const [movieDetail, setMovieDetail] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
      fetch(`${process.env.REACT_APP_API_URL}/details/${movieId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      }).then((data) => {
        setMovieDetail(data)
        setIsLoading(false)});
  }, [movieId])


  const {accessToken} = useAuthToken();
  const isAuthenticated = accessToken !== undefined;

  if (isLoading) {
    return <div>is loading</div>;
  } 

  return (
    <div className="content">
    <div className="info">
      <div className="container">
        <img className="poster" src={`https://image.tmdb.org/t/p/original${movieDetail.poster}`} alt="poster" />
      <div className="brief">
        <h1 className="title">{movieDetail.title}</h1>
        <p className="plot">{movieDetail.plot}</p>
        <p className="year">{movieDetail.year}</p>
        <p>IMDB Rating: {movieDetail.tmdbRating}</p>
        <p>Local Rating: {movieDetail.rating}</p>
      </div>
      </div>
      {isAuthenticated && <AddReview movie={movieDetail} />}
      <h2 className="subheading">Reviews</h2>
      <div className="rating-list">
      <Rating />
      </div>
    </div>
    </div>
  );
}