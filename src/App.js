import React, { useState } from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import './App.css';

function App() {
  const position = [14.7123189, 121.09594745]
  const [boundary, setBoundary] = useState(0)
  console.log({ Map })
  return (
    <div className="App">
      <div className="columns map-container">
        <div id="map" className="column is-12">
           <Map center={position} zoom={12}>
            <TileLayer
              //url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
            />
            <Marker position={position}>
              <Popup>A pretty CSS3 popup.<br />Easily customizable.</Popup>
            </Marker>
          </Map>
        </div>
      </div>
    </div>
  );
}

export default App;
