import { Link } from "react-router-dom";

export default function Home() {

  const movies = [
    {
      id: 1,
      title: "Captain America: Winter Soldier",
      year: 2014,
      imdbRating: "8.8",
      watchedBy: [1, 2],
      WatchListBy: [3, 4, 5],
      rating: 8,
      reviews: [1]
    },{
      id: 2,
      title: "Captain America: Winter Soldier",
      year: 2014,
      imdbRating: "8.8",
      watchedBy: [1, 2],
      rating: 8,
      reviews: [],
      WatchListBy: []
    },{
      id: 3,
      title: "Captain America: Winter Soldier",
      year: 2014,
      imdbRating: "8.8",
      watchedBy: [1, 2],
      rating: 8,
      reviews: [],
      WatchListBy: []
    }
  ]
  

  return (
    <div className="home">
      <h1>home content</h1>
      <div>
        {movies.map((movie) => 
          (<div>
          <Link to={`/MovieDetail/${movie.id}`}>{movie.title}</Link>
          <br></br>
          </div>)
        )}
      </div>
    </div>
  );
}
