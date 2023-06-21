import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useAuthToken } from "../AuthTokenContext";

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
                <h3>Please login to see the watched movie list</h3>
                <button className="btn-primary" onClick={loginWithRedirect}>
                    Login
                </button>
          </div>
        ) : (
          <div>
            {watchedMovies.map((movie) => (
              <Link key={movie.tmdbID} to={`/details/${movie.tmdbID}`}>
                <div className="poster">
                  <img
                    alt="movie poster"
                    src={`https://image.tmdb.org/t/p/original${movie && movie.poster}`}
                  />
                </div>
                <div>{movie ? movie.title : ""}</div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <h2>Watch List</h2>
      <div>
        {!isAuthenticated ? (
            <div>
                <h3>Please login to see the watch list</h3>
                <button className="btn-primary" onClick={loginWithRedirect}>
                    Login
                </button>
          </div>
        ) : (
          <div>
            {watchList.map((movie) => (
              <Link key={movie.tmdbID} to={`/details/${movie.tmdbID}`}>
                <div className="poster">
                  <img
                    alt="movie poster"
                    src={`https://image.tmdb.org/t/p/original${movie && movie.poster}`}
                  />
                </div>
                <div>{movie ? movie.title : ""}</div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
