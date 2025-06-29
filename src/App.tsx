import React from "react";
import { useState } from "react";
import Navbar from "./components/NavBar";
import { dataState } from "./lib/utils";
const MapComponent = React.lazy(() => import("./components/MapComponent"));
import { Suspense } from 'react';
import Header from "./components/Header";
import Legend from "./components/Legend";

function App() {
  const [data, setData] = useState<dataState>({});
  const [road, setRoad] = useState<boolean>(false);
  const [landuse, setLanduse] = useState<boolean>(false);
  const [railway, setRailway] = useState<boolean>(false);
  const [canals, setCanals] = useState<boolean>(false);
  const [talukas, setTalukas] = useState<boolean>(false);
  const [districts, setDistricts] = useState<boolean>(false);
  const [theme, setTheme] = useState("landuse");
  const [elevation, setElevation] = useState<boolean>(false);
  const [slope, setSlope] = useState<boolean>(false);
  const [aspect, setAspect] = useState<boolean>(false);
  const [mapState, setMapState] = useState<'osm' | 'satellite'>('osm');
  const [selectedBasin, setSelectedBasin] = useState(null);
  const [selectedRiverInfo, setSelectedRiverInfo] = useState(null);

  return (
    <div className="relative h-screen w-screen">
      {/* Header Component */}
      <div className="absolute top-0 left-0 right-0 z-20">
        <Header />
      </div>

      {/* MapComponent - Full Screen */}
      <div className="absolute inset-0">
        <Suspense fallback={<div>Loading...</div>}>
          <MapComponent
            data={data}
            road={road}
            railway={railway}
            canals={canals}
            talukas={talukas}
            districts={districts}
            theme={theme}
            landuse={landuse}
            elevation={elevation}
            slope={slope}
            aspect={aspect}
            mapState={mapState}
          />
        </Suspense>
      </div>

      {/* Navbar - Overlay on Map */}
      <div className="absolute left-0 top-[88px] h-[calc(100%-88px)] w-[300px] md:w-[380px] bg-white bg-opacity-10 p-4 z-10 overflow-y-auto">
        <Navbar
          data={data}
          setData={setData}
          landuse={landuse}
          setLanduse={setLanduse}
          road={road}
          setRoad={setRoad}
          railway={railway}
          setRailway={setRailway}
          canals={canals}
          setCanals={setCanals}
          talukas={talukas}
          setTalukas={setTalukas}
          districts={districts}
          setDistricts={setDistricts}
          theme={theme}
          setTheme={setTheme}
          elevation={elevation}
          setElevation={setElevation}
          slope={slope}
          setSlope={setSlope}
          aspect={aspect}
          setAspect={setAspect}
          mapState={mapState}
          setMapState={setMapState}
        />
      </div>

      {/* Legend - Below Header */}
      <div className="absolute top-[88px] right-2 z-10">
        <Legend
          landuse={landuse}
          elevation={elevation}
          slope={slope}
          aspect={aspect}
          selectedBasin={selectedBasin}
          selectedRiverInfo={selectedRiverInfo}
        />
      </div>
    </div>
  );
}
export default App;