import React from "react";
import Rating from "./Rating";
import "../style/movieDetail.css";
import { useAuthToken } from "../AuthTokenContext";

function MakeReviews(){
  return <button>Rate</button>;
}

export default function MovieDetail() {

  const {accessToken} = useAuthToken();
  const isAuthenticated = accessToken !== undefined;


  return (
    <div className="info">
      <div className="container">
      <div className="posters">
        <img className="poster" src="https://m.media-amazon.com/images/M/MV5BYjVmZTIwN2EtZjQ2NC00Y2Q4LTg1NDgtNDJiZTI3YjBlYjM4XkEyXkFqcGdeQXVyMTU5ODM0Nzcw._V1_.jpg" alt="poster" />
      </div>
      <div className="brief">
        <h1 className="title">Spider-Man: Across the Spider-Verse</h1>
        <p className="plot">Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence. When the heroes clash on how to handle a new threat, Miles must redefine what it means to be a hero.</p>
        <p className="year">2023</p>
        <p className="director">Directors: Joaquim Dos SantosKemp PowersJustin K. Thompson</p>
        <p className="cast">Shameik Moore, Hailee Steinfeld, Brian Tyree Henry</p>
      </div>
      </div>

      {isAuthenticated && <MakeReviews />}

      <Rating />
    </div>
  );
}