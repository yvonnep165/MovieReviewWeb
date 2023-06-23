import React from "react";
import WatchlistButton from "./WatchlistButton";
import WatchedButton from "./WatchedButton";
import { useAuth0 } from "@auth0/auth0-react";

export default function AddReview({movie}){
    const { user } = useAuth0();
    const reviews = movie.reviews;
    const userId = user.sub;
    const isUserIdInList = reviews.some(review => review.userId === userId);
    

    return <div className="review_container">
        <WatchlistButton />
       {isUserIdInList ? (<div><p>You've watched this movie</p></div>): (<WatchedButton />)}
    </div>
}