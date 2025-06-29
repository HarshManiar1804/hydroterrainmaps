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
  const [isLegendCollapsed, setIsLegendCollapsed] = useState(true);
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
    <div className="fixed top-28 right-4 flex flex-col gap-3 z-10 max-h-[calc(100vh-2rem)] w-[280px] sm:w-[250px] md:w-[280px]">
      {/* Legend Panel */}
      <div className="bg-white text-black rounded-lg shadow-lg p-4 border border-gray-200 max-h-[55vh] overflow-hidden">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-gray-800">Legend</h2>
          <button
            onClick={() => setIsLegendCollapsed(!isLegendCollapsed)}
            className="text-gray-700 hover:text-gray-500 focus:outline-none transition-colors duration-200 p-1"
            aria-label={isLegendCollapsed ? 'Expand legend' : 'Collapse legend'}
          >
            {isLegendCollapsed ? '▼' : '▲'}
          </button>
        </div>

        <div className={`transition-all duration-300 ease-in-out ${isLegendCollapsed ? 'max-h-0 opacity-0' : 'max-h-[50vh] opacity-100'} overflow-hidden`}>
          <div className="overflow-y-auto space-y-4 pr-2 max-h-[45vh]">
            {/* Landuse Section */}
            {landuse && (
              <div>
                <h3 className="text-sm font-semibold mb-2 text-gray-700">LANDUSE</h3>
                <div className="space-y-1.5">
                  {Object.entries(landuseInfo).map(([key, { color, label }]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-xs text-gray-600 flex-1 mr-2">{label}</span>
                      <div
                        style={{ backgroundColor: color }}
                        className="w-4 h-4 border border-gray-300 rounded flex-shrink-0"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mahi Elevation Section */}
            {elevation && (
              <div>
                <h3 className="text-sm font-semibold mb-2 text-gray-700">MAHI ELEVATION</h3>
                <div className="flex space-x-3">
                  <div className="h-[180px] w-6 relative flex-shrink-0">
                    <div
                      className="h-full w-full rounded"
                      style={{
                        background: 'linear-gradient(to bottom, #ff0000, #ff8f00, #ffff00, #4defef)'
                      }}
                    />
                  </div>
                  <div className="flex flex-col justify-between text-xs py-1 flex-1">
                    <span className="font-medium text-gray-600">968.69m</span>
                    <span className="font-medium text-gray-600">726.52m</span>
                    <span className="font-medium text-gray-600">484.35m</span>
                    <span className="font-medium text-gray-600">242.17m</span>
                    <span className="font-medium text-gray-600">0m</span>
                  </div>
                </div>
              </div>
            )}

            {/* Mahi Slope Section */}
            {slope && (
              <div>
                <h3 className="text-sm font-semibold mb-2 text-gray-700">MAHI SLOPE</h3>
                <div className="flex space-x-3">
                  <div className="h-[180px] w-6 relative flex-shrink-0">
                    <div
                      className="h-full w-full rounded"
                      style={{
                        background: 'linear-gradient(to bottom, #00aaff, #95ffd9, #fcff80, #ffcf5f, #ff1a00)'
                      }}
                    />
                  </div>
                  <div className="flex flex-col justify-between text-xs py-1 flex-1">
                    <span className="font-medium text-gray-600">53.94°</span>
                    <span className="font-medium text-gray-600">40.45°</span>
                    <span className="font-medium text-gray-600">26.97°</span>
                    <span className="font-medium text-gray-600">13.48°</span>
                    <span className="font-medium text-gray-600">0.00°</span>
                  </div>
                </div>
              </div>
            )}

            {/* Mahi Aspect Section */}
            {aspect && (
              <div>
                <h3 className="text-sm font-semibold mb-2 text-gray-700">MAHI ASPECT</h3>
                <div className="flex space-x-3">
                  <div className="h-[240px] w-6 relative flex-shrink-0">
                    <div
                      className="h-full w-full rounded"
                      style={{
                        background: 'linear-gradient(to bottom, #030077, #0064ff, #00c2ff, #00ffbb, #fffa00, #ffb300, #ff0200, #930000, #030077)'
                      }}
                    />
                  </div>
                  <div className="flex flex-col justify-between text-xs py-1 flex-1 space-y-1">
                    <div>
                      <div className="font-medium text-gray-600">North</div>
                      <div className="text-gray-400 text-xs">(337.5°-22.5°)</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-600">Northeast</div>
                      <div className="text-gray-400 text-xs">(22.5°-67.5°)</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-600">East</div>
                      <div className="text-gray-400 text-xs">(67.5°-112.5°)</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-600">Southeast</div>
                      <div className="text-gray-400 text-xs">(112.5°-157.5°)</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-600">South</div>
                      <div className="text-gray-400 text-xs">(157.5°-202.5°)</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-600">Southwest</div>
                      <div className="text-gray-400 text-xs">(202.5°-247.5°)</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-600">West</div>
                      <div className="text-gray-400 text-xs">(247.5°-292.5°)</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-600">Northwest</div>
                      <div className="text-gray-400 text-xs">(292.5°-337.5°)</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Boundaries Section */}
            <div>
              <h3 className="text-sm font-semibold mb-2 text-gray-700">BOUNDARIES</h3>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600 flex-1 mr-2">District Boundary</span>
                  <div className="w-4 h-4 bg-black border border-gray-300 rounded flex-shrink-0"></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600 flex-1 mr-2">Taluka Boundary</span>
                  <div className="w-4 h-4 bg-[#1f78b4] border border-gray-300 rounded flex-shrink-0"></div>
                </div>
              </div>
            </div>

            {/* Infrastructure Section */}
            <div>
              <h3 className="text-sm font-semibold mb-2 text-gray-700">INFRASTRUCTURE</h3>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600 flex-1 mr-2">Road</span>
                  <div className="w-4 h-4 bg-[#878787] border border-gray-300 rounded flex-shrink-0"></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600 flex-1 mr-2">Railway</span>
                  <div className="w-4 h-4 bg-[#e31a1c] border border-gray-300 rounded flex-shrink-0"></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600 flex-1 mr-2">Canal</span>
                  <div className="w-4 h-4 bg-[#2741ea] border border-gray-300 rounded flex-shrink-0"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Panel */}
      {landuse && (
        <div className="bg-white text-black rounded-lg shadow-lg p-4 border border-gray-200 max-h-[35vh] overflow-hidden">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold text-gray-800">Statistics</h2>
            <button
              onClick={() => setIsStatsCollapsed(!isStatsCollapsed)}
              className="text-gray-700 hover:text-gray-500 focus:outline-none transition-colors duration-200 p-1"
              aria-label={isStatsCollapsed ? 'Expand statistics' : 'Collapse statistics'}
            >
              {isStatsCollapsed ? '▼' : '▲'}
            </button>
          </div>

          <div className={`transition-all duration-300 ease-in-out ${isStatsCollapsed ? 'max-h-0 opacity-0' : 'max-h-[30vh] opacity-100'} overflow-hidden`}>
            <div className="overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 space-y-4 pr-2 max-h-[25vh]">
              {Object.entries(chartData).map(([key, { labels, data, colors }]) => (
                <div key={key} className="min-h-[160px]">
                  <h3 className="text-sm font-semibold mb-2 text-gray-700">{key} Distribution</h3>
                  <div className="h-[140px]">
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
        </div>
      )}

      {/* Basin Info Box */}
      {selectedBasin && (
        <div className="bg-gray-800 text-white rounded-lg shadow-lg p-4 border border-gray-600">
          <h2 className="text-lg font-semibold text-center mb-4 text-gray-100">Basin Information</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300 flex-1 mr-2">Basin Name</span>
              <span className="text-sm font-medium bg-gray-700 px-2 py-1 rounded text-gray-100 text-right max-w-[120px] truncate">
                {selectedBasin.name}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300 flex-1 mr-2">Basin Number</span>
              <span className="text-sm font-medium bg-gray-700 px-2 py-1 rounded text-gray-100">
                {selectedBasin.number}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300 flex-1 mr-2">Basin Area</span>
              <span className="text-sm font-medium bg-gray-700 px-2 py-1 rounded text-gray-100">
                {selectedBasin.area.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300 flex-1 mr-2">Basin Perimeter</span>
              <span className="text-sm font-medium bg-gray-700 px-2 py-1 rounded text-gray-100">
                {selectedBasin.perimeter.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Stream Info Box */}
      {selectedBasin && selectedRiverInfo && (
        <div className="bg-gray-800 text-white rounded-lg shadow-lg p-4 border border-gray-600">
          <h2 className="text-lg font-semibold text-center mb-4 text-gray-100">Stream Information</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300 flex-1 mr-2">Segment ID</span>
              <span className="text-sm font-medium bg-gray-700 px-2 py-1 rounded text-gray-100 max-w-[120px] truncate">
                {selectedRiverInfo.segmentId}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300 flex-1 mr-2">Stream Order</span>
              <span className="text-sm font-medium bg-gray-700 px-2 py-1 rounded text-gray-100">
                {selectedRiverInfo.order}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300 flex-1 mr-2">Length</span>
              <span className="text-sm font-medium bg-gray-700 px-2 py-1 rounded text-gray-100">
                {selectedRiverInfo.length.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Legend;