import { useEffect, useState } from "react";
import NavBar from "./components/NavBar";
import Logo from "./components/Logo";
import Search from "./components/Search";
import MainPage from "./components/MainPage";
import Box from "./components/Box";
import ErrorMessage from "./components/ErrorMessage";
import MovieDetails from "./components/MovieDetails";
import WatchedSummary from "./components/WatchedSummary";
import WatchedList from "./components/WatchedList";
import NumResults from "./components/NumResults";
import MovieList from "./components/MovieList";
import Loader from "./components/Loader";

const KEY = '84552b0e'

export default function App() {
  const [selectedId, setSeletedId] = useState(null)
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  const [error,setError] = useState('')
  //const [watched, setWatched] = useState([])
  const [watched, setWatched] = useState(()=>{
    const storedValue = localStorage.getItem('watched')
    return JSON.parse(storedValue)
  });

  function handleSelectedMovie(imdbId){
    setSeletedId(prevId=>(prevId===imdbId ? null : imdbId))
  }

  function handleMovieClose(){
    setSeletedId(null)
  }

  function handleAddWatched(movie){
    setWatched(prev=>[...prev, movie])
  }

  function handleDeleteWatched(id){
    setWatched(watched=>watched.filter(obj=>obj.imdbID!==id))
  }

  useEffect(()=>{
    localStorage.setItem('watched',JSON.stringify(watched))
  },[watched])

  useEffect(()=>{
    const controller = new AbortController()
    async function fetchMovies(){
      try {
        setIsLoading(true)
        setError('')
        const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,{signal: controller.signal});
        if(!res.ok) throw new Error('failed to featch data')
        const data = await res.json()
        if(data.Response === "False") throw new Error("Movie not found")
        setMovies(data.Search)
      } catch(err){
        if(err.name !== "AbortError"){
          setError(err.message)
        }
      } finally {
        setIsLoading(false)
      }
    }
    if(query.length < 3){
      setMovies([])
      setError([])
      return;
    }
    fetchMovies();
    return function(){
      controller.abort()
    }
  },[query])

  return (
    <>
      <NavBar>
        <Logo/>
        <Search query={query} setQuery={setQuery}/>
        <NumResults movies={movies}/>
      </NavBar>
      <MainPage>
        <Box>
          {/* {isLoading ? <Loader/> : <MovieList movies={movies}/>} */}
          {isLoading && <Loader/>}
          {!isLoading && !error && <MovieList onSelectMovie={handleSelectedMovie} movies={movies}/>}
          {error && <ErrorMessage message={error}/>}
        </Box>
        <Box>
          {
          selectedId ? <MovieDetails watched={watched} onAddWatched={handleAddWatched} onMovieClose={handleMovieClose} selectedId={selectedId}/> : 
          <>
          <WatchedSummary watched={watched}/>
          <WatchedList watched={watched} onDeleteWatched={handleDeleteWatched}/>
          </>
          }
        </Box>
      </MainPage>
    </>
  );
}