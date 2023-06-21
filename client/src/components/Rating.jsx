import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const reviews = [
    {
        id: 1,
        rating: 3.5,
        comment: "",
        userId: "auth0|648fbddc1413ef120a254dce",
        movieId: 1,
    },
    {
        id: 2,
        rating: 3.5,
        comment: "",
        userId: "648fbddc1413ef120a254dcs",
        movieId: 1,
    }
]

function Edit(){
    return <button>Edit</button>;
}


export default function Rating(){
    const { user } = useAuth0();


    return (reviews.map((review) => {
    
        const isAuthenticated = user && user.sub === review.userId;
        return <div>
        <p>James</p>
        <p>Rate: 4.5</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. In eum dolorum aliquid quis cumque aut saepe quos porro explicabo rerum soluta sequi animi deserunt nemo est esse placeat, sed deleniti.</p>

        {isAuthenticated && <Edit />}
    </div>}))
}