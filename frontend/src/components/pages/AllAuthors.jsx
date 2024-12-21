import React, { useEffect, useState,useContext } from 'react'

import {Context} from"../../main"
import axios from 'axios';
import { BeatLoader, BounceLoader } from "react-spinners";
function AllAuthors() {
    const {mode,blogs} =useContext(Context);
    const [authors,setAuthors] = useState([]);
useEffect(()=>{
  const fetchAuthors = async() =>{
   const {data} =await axios.get("http://localhost:4000/api/v1/user/authors", {withCredentials: true})
   setAuthors(data.authors);
   console.log(data)
  }
fetchAuthors();
},[])

  return (
    <article className={mode === "dark" ? "dark-bg all-authors" : "light-bg all-authors"}>
            <h2>AUTHORS</h2>
            <div className="container">
        {authors && authors.length > 0 ? (
          authors.map((element) => {
            return (
              <div className="card" key={element._id}>
                {/* {authors && authors.avatar && ( */}
                  <img src={element.avatar.url} alt="author_avatar" />
                {/* )} */}
                <h3>{element.name}</h3>
                <p>{element.role}</p>
              </div>
            );
          })
        ) : (
          <BeatLoader color="gray" size={50} style={{ padding: "200px 0" }} />
        )}
      </div>
    </article>
  )
}

export default AllAuthors
