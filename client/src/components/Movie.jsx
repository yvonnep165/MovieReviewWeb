import React from "react";
import { Link } from "react-router-dom";
import "../style/movie.css";
import no_poster_default from "./no_poster_default.jpeg"

export default function Movie( {list} ) {
    return (
      <div className="movieDynamic">
        {list.map(movie => (
            <div className="singleMovie" key={movie.id}>
                <Link to={`/details/${movie.id}`}>
                    {movie.poster_path ?
                    <img alt="movie poster" src={`https://image.tmdb.org/t/p/original${movie && movie.poster_path}`} />
                    : <img alt="no movie poster" src={no_poster_default} />}
                    <div className="movie-info">
                        <h3>{movie ? movie.original_title: ""}</h3>
                        <span>{movie ? movie.release_date : ""}</span>
                    </div>
                    <article className="overview">{movie ? movie.overview : ""}</article>
                </Link>
            </div>
            ))}
      </div>
    )
}