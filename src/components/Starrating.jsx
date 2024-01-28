import { useState } from "react"
import PropTypes from "prop-types"

const starContainerstyle = {
    display: "flex",
    gap: "10px",
    alignItems: 'center'
}

const starComponentStyle = {
    display: "flex",
    gap: "4px",
}

StarRating.propTypes = {
  maxStar: PropTypes.number,
  color: PropTypes.string,
  size: PropTypes.number,
  className: PropTypes.string,
  messages: PropTypes.array,
  defaultRating: PropTypes.number,
  onSetRating: PropTypes.func,
}

function StarRating({
  onSetRating,
  maxStar=5, 
  color='#fcc491', 
  size=48,
  className = "",
  messages = [],
  defaultRating = 0
}) {
  const [rating, setRating] = useState(defaultRating)
  const [tempRating, setTempRating] = useState(0)
  
  const textStyle = {
    lineHeight: "1",
    margin: '0',
    color,
    fontSize: `${size / 1.5}px`
  }

  return (
      <div style={starContainerstyle} className={className}>
          <div style={starComponentStyle}>
              {Array.from({length: maxStar},(_,i)=><Star color={color} size={size} key={i} full={tempRating?tempRating>=(i+1):rating>=(i+1)?true:false} onClick={()=>{setRating(i+1);onSetRating(i+1)}}
              onEnter={()=>setTempRating(i+1)}
              onLeave={()=>{setTempRating(0)}}
              />)}
          </div>
          <p style={textStyle}>{messages.length===maxStar ? messages[tempRating ? tempRating - 1 : rating - 1] :tempRating || rating || ""}</p>
      </div>
  )
}

function Star({onClick, full, onEnter, onLeave, color, size}){
  const starStyle = {
    width: `${size}px`,
    height: `${size}px`,
    display: 'block',
    cursor: 'pointer',
  }

  return <span style={starStyle} onClick={onClick} onMouseEnter={onEnter} onMouseLeave={onLeave}>
  {full ? <svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 20 20"
  fill={color}
  stroke={color}
>
  <path
    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
  />
</svg>: <svg
xmlns="http://www.w3.org/2000/svg"
fill="none"
viewBox="0 0 24 24"
stroke={color}
>
<path
  strokeLinecap="round"
  strokeLinejoin="round"
  strokeWidth="{2}"
  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
/>
</svg>}
</span>
}

export default StarRating
