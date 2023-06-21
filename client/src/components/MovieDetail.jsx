import React from "react";
import Rating from "./Rating";
import "../style/movieDetail.css";
import { useAuthToken } from "../AuthTokenContext";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function MakeReviews(){
  return <button>Rate</button>;
}

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
  console.log(movieDetail);

  if (isLoading) {
    return <div>is loading</div>;
  }

  return (
    <div className="info">
      <div className="container">
      <div className="posters">
        <img className="poster" src={`https://image.tmdb.org/t/p/original${movieDetail.poster}`} alt="poster" />
      </div>
      <div className="brief">
        <h1 className="title">{movieDetail.title}</h1>
        <p className="plot">{movieDetail.plot}</p>
        <p className="year">{movieDetail.year}</p>
        <p>{movieDetail.tmdbRating}</p>
        <p>{movieDetail.rating}</p>
      </div>
      </div>

      {isAuthenticated && <MakeReviews />}

      <Rating />
    </div>
  );
}