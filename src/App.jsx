import { useEffect, useState } from "react";
import StarRating from "./components/Starrating";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = '84552b0e'

export default function App() {
  const [selectedId, setSeletedId] = useState(null)
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  const [error,setError] = useState('')
  useEffect(()=>{
    async function fetchMovies(){
      try {
        setIsLoading(true)
        setError('')
        const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`);
        if(!res.ok) throw new Error('failed to featch data')
        const data = await res.json()
      console.log(data.Search)
        if(data.Response === "False") throw new Error("Movie not found")
        setMovies(data.Search)
      } catch(err){
        setError(err.message)
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
  },[query])

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

function ErrorMessage({message}){
  return <p className="error">
    <span>{message}</span>
  </p>
}

function Loader(){
  return <p className="loader">Loading...</p>
}

function MainPage({children}) {
  return <main className="main">
    {children}
  </main>
}

function Box({children}){
  const [isOpen, setIsOpen] = useState(true);
  return <div className="box">
  <button
    className="btn-toggle"
    onClick={() => setIsOpen((open) => !open)}
  >
    {isOpen ? "–" : "+"}
  </button>
  {isOpen && children}
</div>
}

function WatchedSummary({watched}){
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return <div className="summary">
  <h2>Movies you watched</h2>
  <div>
    <p>
      <span>#️⃣</span>
      <span>{watched.length} movies</span>
    </p>
    <p>
      <span>⭐️</span>
      <span>{avgImdbRating.toFixed(2)}</span>
    </p>
    <p>
      <span>🌟</span>
      <span>{avgUserRating.toFixed(2)}</span>
    </p>
    <p>
      <span>⏳</span>
      <span>{avgRuntime.toFixed(2)} min</span>
    </p>
  </div>
</div>
}

function WatchedList({watched, onDeleteWatched}){
  return <ul className="list">
  {watched.map((movie) => (
    <WatchListItem onDeleteWatched={onDeleteWatched} key={movie.imdbID} movie={movie}/>
  ))}
</ul>
}

function WatchListItem({movie, onDeleteWatched}){
  return <li>
  <img src={movie.poster} alt={`${movie.title} poster`} />
  <h3>{movie.title}</h3>
  <div>
    <p>
      <span>⭐️</span>
      <span>{movie.imdbRating}</span>
    </p>
    <p>
      <span>🌟</span>
      <span>{movie.userRating}</span>
    </p>
    <p>
      <span>⏳</span>
      <span>{movie.runtime} min</span>
    </p>
    <button className="btn-delete" onClick={()=>onDeleteWatched(movie.imdbID)}>X</button>
  </div>
</li>
}

function MovieList({movies, onSelectMovie}){
  return <ul className="list list-movies">
  {movies?.map((movie) => (
    <MovieListItem onSelectMovie={onSelectMovie} movie={movie} key={movie.imdbID}/>
  ))}
</ul>
}

function MovieListItem({movie, onSelectMovie}){
  return <li onClick={()=>onSelectMovie(movie.imdbID)}>
  <img src={movie.Poster} alt={`${movie.Title} poster`} />
  <h3>{movie.Title}</h3>
  <div>
    <p>
      <span>🗓</span>
      <span>{movie.Year}</span>
    </p>
  </div>
</li>
}

function MovieDetails({selectedId, onMovieClose, onAddWatched, watched}){
  const [movie, setMovie] = useState({})
  const [isloading, setIsLoading] = useState(false)
  const [userRating, setUserRating] = useState(0)
  const isWatched = watched.find(obj=>obj.imdbID==selectedId)

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
    imdbRating,
  } = movie
console.log(movie);
  useEffect(()=>{
    async function getMovie(){
      setIsLoading(true)
      const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`);
      const data = await res.json()
      setMovie(data)
      setIsLoading(false)
    }
    getMovie()
  },[selectedId])

  function handleOnAddWatched(){
    const newWatchedMovie = {
      imdbID: selectedId,
      userRating,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(' ')[0])
    }
    onAddWatched(newWatchedMovie)
    onMovieClose()
  }

  return <div className="details">
    {isloading?<Loader/>:<>
    <header>
      <button onClick={onMovieClose} className="btn-back">&larr;</button>
      <img src={poster} alt={`Poster of ${movie} Movie`} />
      <div className="details-overview">
        <h2>{title}</h2>
        <p>
          {released} &bull; {runtime}
        </p>
        <p>{genre}</p>
        <p><span>⭐</span>{imdbRating} IMDb rating</p>
      </div>
    </header>
    <section>
      
      <div className="rating">
        {!isWatched ? <>
        <StarRating maxStar={10} size={24} onSetRating={setUserRating}/>
        {userRating>0 && <button onClick={handleOnAddWatched} className="btn-add">+ Add to list</button>}
        </>:<p>You rated this movie {isWatched?.userRating} ⭐</p>}
      </div> 
      <p><em>{plot}</em></p>
      <p>Starring {actors}</p>
      <p>Directed by {director}</p>
    </section>
    </>}
    
    </div>
}

function NavBar({children}) {
  return <nav className="nav-bar">
        {children}
    </nav>
}

function Search({query, setQuery}){
  
  return <input
  className="search"
  type="text"
  placeholder="Search movies..."
  value={query}
  onChange={(e) => setQuery(e.target.value)}
/>
}

function Logo(){
  return <div className="logo">
  <span role="img">🍿</span>
  <h1>usePopcorn</h1>
</div>
}

function NumResults({movies}){
  return <p className="num-results">
  Found <strong>{movies?.length}</strong> results
</p>
}

