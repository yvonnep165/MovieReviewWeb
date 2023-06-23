import React from "react";
import { Link } from "react-router-dom";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import "../style/movieSlide.css";

export default function MovieSlide( {list} ) {
    return (
        <div className="slide">
          <Carousel showThumbs={false} autoPlay={true} interval={3500} infiniteLoop={true} showStatus={false}>
            {
              list.map(movie => (
                <Link key={movie.id} to={`/details/${movie.id}`}>
                  <div className="largePoster">
                      <img alt="movie poster" src={`https://image.tmdb.org/t/p/original${movie && movie.backdrop_path}`} />
                  </div>
                  <div className="movieInfo">
                      <span>{movie ? movie.original_title: ""}</span>
                      <span>{movie ? movie.release_date : ""}</span>
                      <article className="introduce">{movie ? movie.overview : ""}</article>
                  </div>
                </Link>
              ))
            }
          </Carousel>
        </div>
    )
}