import React, { useState, useEffect } from 'react';
import Downshift from 'downshift';
import { compose, flatten, map, pick, values } from 'ramda';
import {
  Map,
  Marker,
  TileLayer,
  Polygon
} from 'react-leaflet';
import useFetch from './utils/useFetch';
import './App.css';

function App(props) {
  const [barangays, setBarangays] = useState([])
  const [boundary, setBoundary] = useState(0)
  const [marker, setMarkerPosition] = useState(null)
  const [polygon, setPolygon] = useState(0)
  useEffect(() => {
    //fetch(`http://localhost:4001/api/reports/city/quezon-city/boundary/d57235ab-65bb-48b6-8cc6-430ae9525258`)
      //.then(response => response.json())
      //.then((data) => {
        //setBoundary([14.7123189, 121.09594745])
        //setPolygon(data.result.data)
    //})
      
    fetch(`http://localhost:4001/api/reports/city/quezon-city`)
      .then(response => response.json())
      .then((data) => {
        const { result } = data
        setBarangays(data)
        setBoundary([14.7123189, 121.09594745])
      
        const extractBarangay = pick(['barangays'])
        const transformData = compose( // TODO: Convert to reduce
          flatten,
          map(values),
          map(extractBarangay)
        )


        const barangays = transformData(result);
        setBarangays(barangays);
    })

  }, [])


  const clickPolygon = e => {
    setMarkerPosition(e.latlng)
  }

  return (
    <div className="App">
      <div className="columns">
        <div className="column is-12 map-container">
            <Map className="map" center={boundary} zoom={13}>
            <Polygon onClick={clickPolygon} color="blue" positions={polygon} />
              {marker &&
                <Marker position={marker}></Marker>
              }
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
            />
          </Map>
            <div className="search-form">
                <Downshift
                  onChange={selection => {
                    console.log({ selection })
                  }}
                  itemToString={item => (item ? item.name : '')}
                >
                {({
                  getInputProps,
                  getItemProps,
                  isOpen,
                  inputValue,
                  highlightedIndex,
                  }) => (
                    <div>
                      <input {...getInputProps()} type="text" placeholder="Search Barangay"/>
                        {barangays && barangays.length > 0 && (
                          <ul>
                            {barangays.filter(brgy => brgy.name.toLowerCase().includes(inputValue.toLowerCase())).map((brgy, index) => (
                              <li
                                key={brgy.name}
                                {...getItemProps({
                                  key: brgy.name,
                                  item: brgy,
                                index,
                                style: {
                                  backgroundColor: highlightedIndex === index ? '#ddd' : '#fff'
                                }
                                })}
                              >{brgy.name}</li>
                            ))}
                          </ul>
                        )}
                            {/*barangays && barangays.length > 0 && barangays.map(brgy => 
                        <li
                          key={brgy.name}
                          {...getItemProps({
                            key: brgy.name,
                            item: brgy,
                          })}
                        >{brgy.name}</li>
                            ) */}
                    </div>
                  )}
              </Downshift>
            </div>
        </div>
      </div>
    </div>
  );
}

export default App;
