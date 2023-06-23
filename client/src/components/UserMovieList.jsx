import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useAuthToken } from "../AuthTokenContext";
import "../style/userMovieList.css";

export default function UserMovieList() {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const [watchedMovies, setWatchedMovies] = useState([]);
  const [watchList, setWatchList] = useState([]);
  const { accessToken } = useAuthToken();

  useEffect(() => {
    if (isAuthenticated && accessToken) {
        fetch(`${process.env.REACT_APP_API_URL}/watchedMovies`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          setWatchedMovies(data);
        })
        .catch((error) => {
          console.error("Error retrieving watched movies:", error);
        });

        fetch(`${process.env.REACT_APP_API_URL}/watchList`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
         return response.json();
       })
        .then((data) => {
          setWatchList(data);
        })
        .catch((error) => {
          console.error("Error retrieving watch list", error);
        });
    }
  }, [isAuthenticated, accessToken]);

  return (
    <div>
      <h2>Movies Watched</h2>
      <div>
        {!isAuthenticated ? (
            <div>
                <h3 className="remind">Sign in to keep track of what you have watched</h3>
                <button className="login" onClick={loginWithRedirect}>
                    Login/Sign Up
                </button>
          </div>
        ) : (
          <div className="user-list">
            {watchedMovies.map((movie) => (
              <div key={movie.tmdbID} className="individual-movie">
                <Link to={`/details/${movie.tmdbID}`}>
                  <img
                    alt="movie poster"
                    src={`https://image.tmdb.org/t/p/original${movie && movie.poster}`}
                  />
                  <h4 className="movie-title">{movie ? movie.title : ""}</h4>
               </Link>
              </div>
            ))}
          </div>
        )}
      </div>
      <h2>Watch List</h2>
      <div>
        {!isAuthenticated ? (
            <div>
                <h3 className="remind">Sign in to access your Watchlist</h3>
                <button className="login" onClick={loginWithRedirect}>
                    Login/Sign Up
                </button>
          </div>
        ) : (
          <div className="user-list">
            {watchList.map((movie) => (
              <div key={movie.tmdbID} className="individual-movie">
                <Link key={movie.tmdbID} to={`/details/${movie.tmdbID}`}>
                  <img
                    alt="movie poster"
                    src={`https://image.tmdb.org/t/p/original${movie && movie.poster}`}
                  />
                <h4 className="movie-title">{movie ? movie.title : ""}</h4>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
