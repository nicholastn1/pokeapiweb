import { useState } from 'react';
import './App.css';
import { GET_POKEMON } from '../api';

function App() {
  const [pokemonSearchName, setPokemonSearchName] = useState('');
  const [pokemonAbilities, setPokemonAbilities] = useState([]);
  const [pokemonName, setPokemonName] = useState([]);
  const [pokemonSprite, setPokemonSprite] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPokemonData = async () => {
    try {
      setLoading(true);
      setError(null);

      const { url, options } = GET_POKEMON(pokemonSearchName.toLowerCase());
      const response = await fetch(url, options);
      const json = await response.json();

      if (!response.ok) {
        throw new Error('Pokémon not found');
      }

      const { name, abilities, sprite } = json;

      setPokemonAbilities(abilities);
      setPokemonSprite(sprite);
      setPokemonName(name);
    } catch (err) {
      setPokemonAbilities([]);
      setPokemonSprite('');
      setPokemonName('');
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchPokemonData();
    }
  };

  return (
    <div className="App">
      <div className="search-container">
        <input
          className="search-input"
          type="text"
          placeholder="Enter Pokémon Name"
          value={pokemonSearchName}
          onChange={(e) => setPokemonSearchName(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button className="search-button" onClick={fetchPokemonData}>
          Search
        </button>
      </div>
      {loading && <p className="loading-text">Loading...</p>}
      {!pokemonSprite && !pokemonAbilities.length && !error ? null : (
        <div className="card">
          {pokemonSprite && (
            <div className="upper-container">
              <div className="sprite-container">
                <img
                  className="sprite"
                  src={pokemonSprite}
                  alt={pokemonSearchName}
                />
              </div>
              <h2>{pokemonName}</h2>
            </div>
          )}
          {pokemonAbilities.length > 0 && (
            <div className="abilities-container">
              <ul>
                {pokemonAbilities.map((ability, index) => (
                  <li key={index}>{ability}</li>
                ))}
              </ul>
            </div>
          )}
          {error ? (
            <div className="error-container">
              <img
                className="error-image"
                src="https://imgur.com/MGh60KR.png"
                alt="No Results"
              />
              Invalid Pokémon!
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
export default App;
