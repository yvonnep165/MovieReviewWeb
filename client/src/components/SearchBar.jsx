import "../style/searchBar.css";
import Movie from "./Movie.jsx";
import React, { useState } from "react";;

export default function SearchBar({ addMovieToDatabase }) {
  const [searchResult, setSearchResult] = useState([]);
  const [searchMovie, setSearchMovie] = useState("");

  const getSearchList = (searchMovie) => {
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=f699b890c77dbed8ae7006e0ec924d1d&query=${searchMovie}&sort_by=popularity.desc`)
    .then(res => res.json())
    .then(data => setSearchResult(data.results))  

    addMovieToDatabase(searchResult);
  }
  
  function handleChange(e) {
    const value = e.target.value;
    setSearchMovie(value);
    getSearchList(value);
  }

  if (searchResult.length > 10) {
    setSearchResult(searchResult.slice(0, 10))
  }

  if (searchResult.length === 0) {
    return (
      <div>
        <form className="search-form">
          <label className="searchLabel" htmlFor="search">Search</label>
          <input type="text" name="search" id="search" className="search" value={searchMovie} placeholder="Search the movie by its name"
                  onChange={handleChange}></input>
        </form>
        {searchMovie === "" ? 
          <section></section>
        : <section className="warn">Sorry, No movie found</section>}
      </div>
  ) 
  } else {
    return (
      <div>
        <form className="search-form">
          <label className="searchLabel" htmlFor="search">Search</label>
          <input type="text" name="search" id="search" className="search" value={searchMovie} placeholder="Search the movie by its name"
                  onChange={handleChange}></input>
        </form>
        <Movie list={searchResult}/>
      </div>
    )
  }
}