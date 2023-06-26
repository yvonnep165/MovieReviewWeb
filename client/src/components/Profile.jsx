import { useAuth0 } from "@auth0/auth0-react";
import UserMovieList from "./UserMovieList";
import { useEffect, useState } from "react";
import UserReview from "./UserReview";
import { useAuthToken } from "../AuthTokenContext";
import "../style/userReview.css";


export default function Profile() {
  const { user } = useAuth0();
  const {accessToken} = useAuthToken();
  const [currentUser, setCurrentUser] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/users/${user.sub}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    }).then((data) => {
      setCurrentUser(data);
      setIsLoading(false);
    });
  }, [user, accessToken])

  if (isLoading) {
    return <div>is loading</div>;
  }


  return (
    <div>
      <h2>Personal Infomation</h2>
      <div className="personal-info">
        <p>Name: {currentUser.name}</p>
        <p>📧 Email: {currentUser.email}</p>
      </div>

      <UserMovieList />

      <h2>Reviews</h2>
      <div className="user-review-list">
      <UserReview />
      </div>
    </div>
  );
}
