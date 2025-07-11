import Sidebar from './Sidebar'
import MapComponent from './MapComponent'
import { useState, useEffect } from 'react';
import "./BusStopMarkers.css"

function BusStopMarkers() {
  const url = import.meta.env.VITE_URL;
  const [busStops, setStops] = useState([]);
  useEffect(() => {
    fetch(`${url}`)
      .then(res => res.json())
      .then(setStops);
  }, []);
  console.log(busStops);
  const [focus, setFocus] = useState({ lat: 21.1702, lng: 72.8311 })
  return (
    <>
      <div className="layout-container">
        <Sidebar busStops={busStops} setStops={setStops} focus={focus} setFocus={setFocus} />
        <MapComponent busStops={busStops} focus={focus} />
      </div>
    </>
  )
}

export default BusStopMarkers;
