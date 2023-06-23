import React from "react";
import WatchlistButton from "./WatchlistButton";
import WatchedButton from "./WatchedButton";

export default function AddReview(){

    return <div className="review_container">
       <WatchlistButton />
       <WatchedButton />
    </div>
}