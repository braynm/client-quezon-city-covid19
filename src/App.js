import React, { useState, useEffect } from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import useFetch from './utils/useFetch';
import './App.css';

function App() {
  //const position = [14.7123189, 121.09594745]
  const [boundary, setBoundary] = useState(0)
  useEffect(() => {
//fetch(`http://localhost:4001/api/reports/city/quezon-city/boundary/d57235ab-65bb-48b6-8cc6-430ae9525258`)
  //.then(response => response.json())
//.then((data) => {
    //console.log({ data })
    //setBoundary([14.7123189, 121.09594745])
//})
  
setBoundary([14.7123189, 121.09594745])
  }, [])

  return (
    <div className="App">
      <div className="columns map-container">
        <div id="map" className="column is-12">
           <Map className="map" center={boundary} zoom={13}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              //url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
              attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
            />
          </Map>
        </div>
      </div>
    </div>
  );
}

export default App;
