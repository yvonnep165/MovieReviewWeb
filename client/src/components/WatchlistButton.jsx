import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuthToken } from "../AuthTokenContext"; 
import { useState } from "react";

// to be fixed: the button will not be rerendered after becoming not in the watchlist again

export default function WatchlistButton(){
    const {movieId} = useParams();
    const {accessToken} = useAuthToken();
    const [watchlisted, setWatchlisted] = useState(false);

    function addWatchlist(){
        fetch(`${process.env.REACT_APP_API_URL}/details/watchlist/${movieId}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${accessToken}`,
              },
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
              }
            window.location.reload();
        })
    }

    function removeWatchlist() {
        fetch(`${process.env.REACT_APP_API_URL}/details/watchlist/remove/${movieId}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${accessToken}`,
              },
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
              }
              window.location.reload();
        })
    }

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/details/watchlist/${movieId}`, {
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
            if (data.length > 0){
                setWatchlisted(true);
            }
        })
    }, [movieId, accessToken, setWatchlisted])

    return (
        <div className="watchlist">
            {!watchlisted ? (
                <button className="detail-button" onClick={addWatchlist}>+ Watchlist</button>
            ) : (
                <button className="detail-button" onClick={removeWatchlist}>✔︎ Watchlist</button>
            )}
        </div>
    );
}