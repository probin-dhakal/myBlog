import axios from "axios";
import React, { useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";

const PopularAuthors = () => {
  const [authors, setAuthors] = useState([]);
  useEffect(() => {
    const fetchAuthors = async () => {
      const { data } = await axios.get(
        "http://localhost:4000/api/v1/user/authors",
        { withCredentials: true }
      );
      setAuthors(data.authors);
    };
    fetchAuthors();
  }, []);
  return (
    <section className="popularAuthors">
      <h3>Popular Authors</h3>
      <div className="container">
      {authors.slice(0, 4).map((element) => {
  return (
    <div className="card" key={element._id}>
      {element.avatar && element.avatar.url ? (
        <img src={element.avatar.url} alt="author" />
      ) : (
        <img src={"profile.jpeg"} alt="author" />
      )}
      <p>{element.name}</p>
      <p>{element.role}</p>
    </div>
  );
})}

      </div>
    </section>
  );
};

export default PopularAuthors;