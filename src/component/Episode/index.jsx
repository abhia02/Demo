import React, { useEffect, useState } from "react";
import './index.css';

function Episode() {
  const [episodes, setEpisodes] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [selectedEpisode, setSelectedEpisode] = useState(null);

  // Fetch episodes
  const getEpisodes = () => {
    fetch('https://rickandmortyapi.com/api/episode')
      .then(response => response.json())
      .then(data => setEpisodes(data.results)) // assuming results is the key where episodes are stored
      .catch(error => console.error('Error fetching episodes:', error));
  }

  // Fetch characters on page load
  const getCharacters = () => {
    fetch('https://rickandmortyapi.com/api/character')
      .then((response) => response.json())
      .then((data) => setCharacters(data.results)) // assuming results is the key where characters are stored
      .catch((error) => console.error('Error fetching characters:', error));
  }

  // Fetch the selected episode to get its character URLs
  const getCharactersByEpisode = () => {
    fetch(`https://rickandmortyapi.com/api/episode/${selectedEpisode}`)
      .then((response) => response.json())
      .then(async (episodeData) => {
        // episodeData.characters contains URLs of the characters in this episode
        const characterPromises = episodeData.characters.map((characterUrl) =>
          fetch(characterUrl).then((res) => res.json())
        );
        const charactersData = await Promise.all(characterPromises);
        setCharacters(charactersData);
      })
      .catch((error) => console.error('Error fetching characters for episode:', error));
  }

  useEffect(() => {
    getEpisodes();
    getCharacters();
  }, []);

  useEffect(() => {
    if (selectedEpisode != null) getCharactersByEpisode();
  }, [selectedEpisode])

  return (
    <div className="app-container">
      <div className="sidebar">
        <h2>Episodes</h2>
        <ul>
          {episodes.map((episode) => (
            <li
              key={episode.id}
              className={selectedEpisode === episode.id ? "selected" : ""}
              onClick={() => setSelectedEpisode(episode.id)}
            >
              {episode.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="main-content">
        <h2>Characters</h2>
        <div className="characters-grid">
          {characters.map((character) => (
            <div key={character.id} className="character-card">
              <img src={character.image} alt={character.name} />
              <p>{character.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Episode;