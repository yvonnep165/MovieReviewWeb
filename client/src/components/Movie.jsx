import React from "react";
import { Link } from "react-router-dom";

export default function Movie( {list} ) {
    return (
      <div>
        {list.map(movie => (
            <Link key={movie.id} to={`/details/${movie.id}`}>
                <div className="poster">
                    <img alt="movie poster" src={`https://image.tmdb.org/t/p/original${movie && movie.poster_path}`} />
                </div>
                <div>{movie ? movie.original_title: ""}</div>
            </Link>
            ))}
      </div>
    )
}