import React from "react";
import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useAuthToken } from "../AuthTokenContext";
import Edit from "./EditButton";

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

    return (
      <div>
        <li key={review.id}>
        {reviewMovie && (
                <div>
                  <p>{reviewMovie.title}</p>
                  </div>)}
          <p>{review.rating}</p>
          <p>{review.comment}</p>

          {isAuthenticated && <Edit movieId={review.movieId} />}
        </li>
      </div>
    );
  });
}
