// src/App.js

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Netflix from "./pages/Netflix";
import Player from "./pages/Player";
import TVShows from "./pages/TVShows";
import UserListedMovies from "./pages/UserListedMovies";
import MoviePage from "./pages/Movies";

// **********************************************
// 1. Correction de l'importation du Chatbot
// **********************************************
import Chatbot from "./components/chatbot"; // Importation correcte

export default function App() {
  return (
    // Tout ce qui est rendu doit être enveloppé dans un seul élément.
    <BrowserRouter>
      {/* Les Routes définissent ce qui est affiché pour chaque URL */}
      <Routes>
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/signup" element={<Signup />} />
        <Route exact path="/player" element={<Player />} />
        <Route exact path="/tv" element={<TVShows />} />
        <Route exact path="/movies" element={<MoviePage />} />
        <Route exact path="/new" element={<Player />} />
        <Route exact path="/mylist" element={<UserListedMovies />} />
        <Route exact path="/" element={<Netflix />} />
      </Routes>
      
      {/* ***************************************************************** */}
      {/* 2. Ajout du Chatbot APRES les Routes, mais DANS le BrowserRouter.  */}
      {/* Le Chatbot sera ainsi affiché sur TOUTES les pages.            */}
      {/* ***************************************************************** */}
      <Chatbot />

    </BrowserRouter>
  );
}

// L'export est déjà fait en haut. Vous pouvez supprimer la ligne "export default App;" à la fin.



