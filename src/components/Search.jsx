import { useEffect, useRef } from "react"

function Search({query, setQuery}){
    const inputEl = useRef(null)
    useEffect(()=>{
      function callback(e){
        if(document.activeElement===inputEl.current) return;
        if(e.code==='Enter'){
          inputEl.current.focus()
          setQuery('')
        }
      }
      document.addEventListener('keydown',callback)
      return document.addEventListener('keydown',callback)
    },[setQuery])
    return <input
    className="search"
    type="text"
    placeholder="Search movies..."
    value={query}
    onChange={(e) => setQuery(e.target.value)}
    ref={inputEl}
  />
  }

  export default Search