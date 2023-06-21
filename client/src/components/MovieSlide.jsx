import React from "react";
import { Link } from "react-router-dom";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

export default function MovieSlide( {list} ) {
    return (
        <div className="slide">
          <Carousel showThumbs={false} autoPlay={true} transitionTime={3} infiniteLoop={true} showStatus={false}>
            {
              list.map(movie => (
                <Link key={movie.id} to={`/details/${movie.id}`}>
                  <div className="largePoster">
                      <img alt="movie poster" src={`https://image.tmdb.org/t/p/original${movie && movie.backdrop_path}`} />
                  </div>
                  <div className="movieInfo">
                      <div>{movie ? movie.original_title: ""}</div>
                      <div>{movie ? movie.release_date : ""}</div>
                  </div>
                </Link>
              ))
            }
          </Carousel>
        </div>
    )
}