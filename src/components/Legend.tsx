import { useState } from 'react';

interface LegendProps {
  landuse: boolean;
  elevation: boolean;
  slope: boolean;
  aspect: boolean;
  selectedBasin: { name: string; number: number; area: number; perimeter: number } | null;
  selectedRiverInfo: { segmentId: string; order: number; length: number } | null;
}
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend as ChartLegend,
  ChartOptions
} from 'chart.js';
import { chartData } from '@/lib/utils';

ChartJS.register(ArcElement, Tooltip, ChartLegend);

const Legend = ({ landuse, elevation, slope, aspect, selectedBasin, selectedRiverInfo }: LegendProps) => {
  console.log(selectedBasin,selectedRiverInfo);
  const [isLegendCollapsed, setIsLegendCollapsed] = useState(false);
  const [isStatsCollapsed, setIsStatsCollapsed] = useState(true);

  const options: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'right',
        display: true,
        labels: {
          boxWidth: 10,
          padding: 8,
          font: {
            size: 10
          }
        }
      },
    },
    layout: {
      padding: 5
    },
    aspectRatio: 2,
  };

  const landuseInfo = {
    1: { color: "#ff0000", label: "Builtup" },
    2: { color: "#013ddc", label: "Waterbodies" },
    3: { color: "#feff73", label: "Agriculture" },
    4: { color: "#7ac602", label: "Vegetation Patches" },
    5: { color: "#95e689", label: "Shrubland" },
    6: { color: "#dfaaf0", label: "Salineland" },
    7: { color: "#fe95e7", label: "Barrenland" },
    8: { color: "#fefeb4", label: "Fallowland" },
    9: { color: "#267300", label: "Forest Patches" }
  };

  return (
    <div className="relative top-4 right-2 flex flex-col gap-4 z-10 max-h-[calc(100vh-2rem)] overflow-y-auto">
      {/* Legend Panel */}
      <div className="w-[250px] bg-black text-white rounded-lg shadow-md p-4 opacity-90">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">Legend</h2>
          <button
            onClick={() => setIsLegendCollapsed(!isLegendCollapsed)}
            className="text-white hover:text-gray-300 focus:outline-none"
          >
            {isLegendCollapsed ? '▼' : '▲'}
          </button>
        </div>

        <div className={`transition-all duration-300 ${isLegendCollapsed ? 'hidden' : 'block'}`}>
          <div className="max-h-[30vh] overflow-y-auto space-y-4">
            {/* Landuse Section */}
            {landuse && (
              <div>
                <h3 className="text-sm font-semibold mb-2">LANDUSE</h3>
                <div className="space-y-2">
                  {Object.entries(landuseInfo).map(([key, { color, label }]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-sm">{label}</span>
                      <div style={{ width: '20px', height: '20px', backgroundColor: color }} className="border border-white rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Mahi Elevation Section */}
            {elevation && (
              <div>
                <h3 className="text-sm font-semibold mb-2">MAHI ELEVATION</h3>
                <div className="flex space-x-4">
                  <div className="h-[200px] w-8 relative">
                    <div
                      className="h-full w-8 rounded"
                      style={{
                        background: 'linear-gradient(to bottom, #ff0000, #ff8f00, #ffff00, #4defef)'
                      }}
                    />
                  </div>
                  <div className="flex flex-col justify-between text-xs py-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">968.69m</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">726.52m</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">484.35m</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">242.17m</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">0m</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Mahi Slope Section */}
            {slope && (
              <div>
                <h3 className="text-sm font-semibold mb-2">MAHI SLOPE</h3>
                <div className="flex space-x-4">
                  <div className="h-[200px] w-8 relative">
                    <div
                      className="h-full w-8 rounded"
                      style={{
                        background: 'linear-gradient(to bottom, #00aaff, #95ffd9, #fcff80, #ffcf5f, #ff1a00)'
                      }}
                    />
                  </div>
                  <div className="flex flex-col justify-between text-xs py-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">53.9395°</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">40.4546°</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">26.9697°</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">13.4849°</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">0.000431°</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Mahi Aspect Section */}
            {aspect && (
              <div>
                <h3 className="text-sm font-semibold mb-2">MAHI ASPECT</h3>
                <div className="flex space-x-4">
                  <div className="h-[280px] w-8 relative">
                    <div
                      className="h-full w-8 rounded"
                      style={{
                        background: 'linear-gradient(to bottom, #030077, #0064ff, #00c2ff, #00ffbb, #fffa00, #ffb300, #ff0200, #930000, #030077)'
                      }}
                    />
                  </div>
                  <div className="flex flex-col justify-between text-xs py-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">North</span>
                      <span className="text-gray-300">(337.5° - 360° - <br /> 0° - 22.5°)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Northeast</span>
                      <span className="text-gray-300">(22.5° - 67.5°)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">East</span>
                      <span className="text-gray-300">(67.5° - 112.5°)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Southeast</span>
                      <span className="text-gray-300">(112.5° - 157.5°)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">South</span>
                      <span className="text-gray-300">(157.5° - 202.5°)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Southwest</span>
                      <span className="text-gray-300">(202.5° - 247.5°)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">West</span>
                      <span className="text-gray-300">(247.5° - 292.5°)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Northwest</span>
                      <span className="text-gray-300">(292.5° - 337.5°)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Boundaries Section */}
            <div>
              <h3 className="text-sm font-semibold mb-2">BOUNDARIES</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">District Boundary</span>
                  <div className="w-5 h-5 bg-black border border-white rounded"></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Taluka Boundary</span>
                  <div className="w-5 h-5 bg-[#1f78b4] border border-white rounded"></div>
                </div>
              </div>
            </div>

            {/* Infrastructure Section */}
            <div>
              <h3 className="text-sm font-semibold mb-2">INFRASTRUCTURE</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Road</span>
                  <div className="w-5 h-5 bg-[#878787] border border-white rounded"></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Railway</span>
                  <div className="w-5 h-5 bg-[#e31a1c] border border-white rounded"></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Canal</span>
                  <div className="w-5 h-5 bg-[#2741ea] border border-white rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Panel */}
      {landuse && <div className="w-[250px] bg-black text-white rounded-lg shadow-md p-4 opacity-90">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">Statistics</h2>
          <button
            onClick={() => setIsStatsCollapsed(!isStatsCollapsed)}
            className="text-white hover:text-gray-300 focus:outline-none"
          >
            {isStatsCollapsed ? '▼' : '▲'}
          </button>
        </div>

        <div className={`transition-all duration-300 ${isStatsCollapsed ? 'hidden' : 'block'}`}>
          <div className="max-h-[40vh] overflow-y-auto space-y-4">
            {Object.entries(chartData).map(([key, { labels, data, colors }]) => (
              <div key={key} className="h-[200px] w-full">
                <h3 className="text-sm font-semibold mb-2">{key} Distribution</h3>
                <div className="h-[170px]">
                  <Pie
                    data={{
                      labels,
                      datasets: [{
                        data,
                        backgroundColor: colors,
                        borderWidth: 1,
                      }],
                    }}
                    options={options}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>}
      {/* Basin Info Box */}
      {selectedBasin && (
        <div className="w-[250px] bg-gray-800 text-white rounded-lg shadow-md p-4 opacity-90">
          <h2 className="text-lg font-semibold text-center mb-4">Basin Information</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Basin Name</span>
              <span className="text-sm font-medium bg-gray-700 px-3 py-1 rounded">{selectedBasin.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Basin Number</span>
              <span className="text-sm font-medium bg-gray-700 px-3 py-1 rounded">{selectedBasin.number}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Basin Area</span>
              <span className="text-sm font-medium bg-gray-700 px-3 py-1 rounded">{selectedBasin.area.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Basin Perimeter</span>
              <span className="text-sm font-medium bg-gray-700 px-3 py-1 rounded">{selectedBasin.perimeter.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
      {selectedBasin && selectedRiverInfo && (
        <div className="w-[250px] bg-gray-800 text-white rounded-lg shadow-md p-4 opacity-90 mt-4">
          <h2 className="text-lg font-semibold text-center mb-4">Stream Information</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Segment ID</span>
              <span className="text-sm font-medium bg-gray-700 px-3 py-1 rounded">{selectedRiverInfo.segmentId}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Stream Order</span>
              <span className="text-sm font-medium bg-gray-700 px-3 py-1 rounded">{selectedRiverInfo.order}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Length</span>
              <span className="text-sm font-medium bg-gray-700 px-3 py-1 rounded">{selectedRiverInfo.length.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Legend;