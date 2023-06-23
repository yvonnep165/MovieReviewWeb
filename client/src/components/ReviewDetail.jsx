import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

function Edit() {
  return <button>Edit</button>;
}

export default function Rating() {
  const { user } = useAuth0();
  const { movieId } = useParams();
  const [reviews, setReviews] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [reviewUsers, setReviewUsers] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/details/reviewByMovie/${movieId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    }).then((data) => {
      setReviews(data);
      setIsLoading(false);
      const userIds = data.map((review) => review.userId);
      getUserInfo(userIds);
    })
}, [movieId])

    async function getUserInfo(userIds) {
        const userPromises = userIds.map((userId) =>
        fetch(`${process.env.REACT_APP_API_URL}/users/${userId}`).then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
      );
      const users = await Promise.all(userPromises);
      setReviewUsers(users);
    }


    if (isLoading) {
        return <div>is loading</div>;
      }

  return reviews.map((review) => {
    const isAuthenticated = user && user.sub === review.userId;
    const reviewUser = reviewUsers.find((user) => user.auth0Id === review.userId);

    return (
      <div>
        <li key={review.id}>
        {reviewUser && (
                <div>
                  <p>{reviewUser.name}</p>
                  </div>)}
        <p>{review.rating}</p>
        <p>
          {review.comment}
        </p>

        {isAuthenticated && <Edit />}
        </li>
      </div>
    );
  });
}
