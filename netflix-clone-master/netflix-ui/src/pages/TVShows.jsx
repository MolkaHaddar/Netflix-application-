import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchMovies, getGenres } from "../store";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "../utils/firebase-config";
import styled from "styled-components";
// eslint-disable-next-line
import CardSlider from "../components/CardSlider";
import Navbar from "../components/Navbar";
import Slider from "../components/Slider";
import SelectGenre from "../components/SelectGenre";

function TVShows() {
  const [isScrolled, setIsScrolled] = useState(false);
  const movies = useSelector((state) => state.netflix.movies);
  const genres = useSelector((state) => state.netflix.genres);
  const genresLoaded = useSelector((state) => state.netflix.genresLoaded);
  // eslint-disable-next-line
  const dataLoading = useSelector((state) => state.netflix.dataLoading);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!genres.length) dispatch(getGenres());
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (genresLoaded) {
      dispatch(fetchMovies({ genres, type: "tv" }));
    }
    // eslint-disable-next-line
  }, [genresLoaded]);

  // eslint-disable-next-line
  const [user, setUser] = useState(undefined);

  onAuthStateChanged(firebaseAuth, (currentUser) => {
    if (currentUser) setUser(currentUser.uid);
    else navigate("/login");
  });

  window.onscroll = () => {
    setIsScrolled(window.scrollX === 0 ? false : true);
    return () => (window.onscroll = null);
  };

  return (
    <Container>
      <Navbar isScrolled={isScrolled} />
      <div className="data">
        <SelectGenre genres={genres} type="tv" />
        {movies.length ? ( // <-- Changement ici : Si 'movies.length' est > 0 (vrai)
          <Slider movies={movies} /> // <-- Afficher le Slider avec les séries
        ) : ( // <-- Sinon
          <h1 className="not-available">
            No TV Shows available for the selected genre. Please select a
            different genre.
          </h1> // <-- Afficher le message 'Non disponible'
        )}
      </div>
    </Container>
  );
  {movies.length === 0 ? (
  <>
    {" "}
    <Slider movies={movies} />{" "}
  </>
) : (
  <h1 className="not-available">
    No TV Shows avaialble for the selected genre. Please select a
    different genre.
  </h1>
)}
}

const Container = styled.div`
  .data {
    margin-top: 8rem;
    .not-available {
      text-align: center;
      color: white;
      margin-top: 4rem;
    }
  }
`;

export default TVShows;
