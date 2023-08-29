import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import MoviesList from './components/MoviesList';
import AddMovie from './components/AddMovie';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get('https://simple-http-start-default-rtdb.firebaseio.com/movies.json');
      let parsedData = [];
      for (let key in response.data) {
        parsedData.push({
          id: key,
          openingText: response.data[key].openingText,
          releaseDate: response.data[key].releaseDate,
          title: response.data[key].title
        });
      }
      setMovies(parsedData);
    } catch (error) {
      setError('Something went wrong');
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  async function addMovieHandler(movie) {
    try {
      await axios.post('https://simple-http-start-default-rtdb.firebaseio.com/movies.json', movie);
      fetchMoviesHandler()
    }
    catch (e) {
      console.log(e);
    }
  }

  let content = <p>Found no movies.</p>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }

  if (error) {
    content = <p>{error}</p>;
  }

  if (isLoading) {
    content = <p>Loading...</p>;
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
