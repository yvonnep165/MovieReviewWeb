import React from "react";
import WatchlistButton from "./WatchlistButton";
import WatchedButton from "./WatchedButton";
import { useAuth0 } from "@auth0/auth0-react";
import "../style/movieDetail.css";

export default function AddReview({movie}){
    const { user } = useAuth0();
    const reviews = movie.reviews;
    const userId = user.sub;
    const isUserIdInList = reviews.some(review => review.userId === userId);
    

    return <div className="review-container">
        <WatchlistButton />
       {isUserIdInList ? (<div className="watched-text"><p className="watched-text-p">You've watched this movie</p></div>): (<WatchedButton />)}
    </div>
}