import React from "react";
//import { Link } from "react-router-dom";

export default function SearchBar() {
    return (
        <div>
          <form>
            <label htmlFor="title">Search</label>
            <input type="text" name="title" id="title"></input>
            <div>
              <input type="submit" id="submit" value="search"></input>
            </div>
          </form>
        </div>
    )
}