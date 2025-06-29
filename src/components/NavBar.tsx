import { channels, dataState, NavbarProps, subCheckboxRanges } from "@/lib/utils";
import { useState, useEffect } from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import OutlinedInput from '@mui/material/OutlinedInput';

// Switch component
function Switch({ checked, onChange, size = 'default' }: { checked: boolean; onChange: () => void; size?: 'default' | 'small' }) {
  const baseClasses = "relative inline-flex items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2";
  const sizeClasses = size === 'small' ? 'h-5 w-9' : 'h-6 w-11';

  return (
    <button
      type="button"
      className={`${baseClasses} ${sizeClasses} ${checked ? 'bg-indigo-600' : 'bg-gray-400'}`}
      role="switch"
      aria-checked={checked}
      onClick={onChange}
    >
      <span
        className={`${checked ? (size === 'small' ? 'translate-x-4' : 'translate-x-6') : 'translate-x-0'} 
        inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out
        ${size === 'small' ? 'h-4 w-4' : 'h-5 w-5'}`}
      />
    </button>
  );
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function Navbar({
  data,
  setData,
  setLanduse,
  road,
  setRoad,
  railway,
  setRailway,
  canals,
  setCanals,
  talukas,
  setTalukas,
  districts,
  setDistricts,
  theme,
  setTheme,
  elevation,
  setElevation,
  slope,
  setSlope,
  aspect,
  setAspect,
  mapState,
  setMapState
}: NavbarProps) {
  const [isBasinOpen, setIsBasinOpen] = useState(false);
  const [isLanduseBasinOpen, setIsLanduseBasinOpen] = useState(false);
  const [isTerrainBasinOpen, setIsTerrainBasinOpen] = useState(false);
  const [isMapLayersOpen, setIsMapLayersOpen] = useState(true);
  const [isMapTypeOpen, setIsMapTypeOpen] = useState(true);
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [selectedSubCheckboxes, setSelectedSubCheckboxes] = useState<string[]>([]);
  const [availableSubCheckboxes] = useState<string[]>(['1-2', '2-3', '3-4', '4-5', '5-6']);

  // Function to initialize basin state with all values set to true
  const initializeBasinState = () => {
    const initialState: dataState = channels.reduce((acc, channel) => {
      acc[channel] = {
        isChecked: true,
        subCheckboxes: Object.fromEntries(['1-2', '2-3', '3-4', '4-5', '5-6'].map((sub) => [sub, false]))
      };
      return acc;
    }, {} as dataState);
    setData(initialState);
    setSelectedChannels(channels);
  };

  // Initialize basin data with all values set to true
  useEffect(() => {
    initializeBasinState();
  }, []);

  // Update data state when selected channels change
  useEffect(() => {
    setData(prevState => {
      const newState = { ...prevState };

      // First, set all channels to unchecked
      channels.forEach(ch => {
        if (newState[ch]) {
          newState[ch].isChecked = false;
        }
      });

      // Then set selected channels to checked
      selectedChannels.forEach(channel => {
        newState[channel] = {
          isChecked: true,
          subCheckboxes: newState[channel]?.subCheckboxes ||
            Object.fromEntries(['1-2', '2-3', '3-4', '4-5', '5-6'].map(sub => [sub, false]))
        };
      });

      return newState;
    });
  }, [selectedChannels]);

  // Update data state when selected subcheckboxes change
  useEffect(() => {
    setData(prevState => {
      const newState = { ...prevState };

      // Reset all subcheckboxes to false
      selectedChannels.forEach(channel => {
        if (newState[channel] && newState[channel].subCheckboxes) {
          Object.keys(newState[channel].subCheckboxes).forEach(sub => {
            newState[channel].subCheckboxes[sub] = false;
          });
        }
      });

      // Set selected subcheckboxes to true for all selected channels
      selectedChannels.forEach(channel => {
        if (newState[channel] && newState[channel].subCheckboxes) {
          selectedSubCheckboxes.forEach(sub => {
            newState[channel].subCheckboxes[sub] = true;
          });
        }
      });

      return newState;
    });
  }, [selectedSubCheckboxes]);

  // Handler for channel multi-select
  const handleChannelChange = (event: { target: { value: string | string[] } }) => {
    const {
      target: { value },
    } = event;
    const newSelectedChannels = typeof value === 'string' ? value.split(',') : value;
    setSelectedChannels(newSelectedChannels);
  };

  // Handler for subcheckbox multi-select
  const handleSubCheckboxChange = (event: { target: { value: string | string[] } }) => {
    const {
      target: { value },
    } = event;
    const newSelectedSubCheckboxes = typeof value === 'string' ? value.split(',') : value;
    setSelectedSubCheckboxes(newSelectedSubCheckboxes);
  };

  const handleRoadChange = () => {
    setRoad(!road);
  };
  const handleRailwayChange = () => {
    setRailway(!railway);
  };
  const handleTalukasChange = () => {
    setTalukas(!talukas);
  };
  const handleDistrictsChange = () => {
    setDistricts(!districts);
  };
  const handleCanalChange = () => {
    setCanals(!canals);
  };

  useEffect(() => {
    setTheme('landuse');
    setLanduse(true);
  }, []);
  // Handle theme selection
  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newTheme = event.target.value as 'landuse' | 'hydrology' | 'terrain';
    setTheme(newTheme);

    // Reset all theme-specific states first
    setLanduse(false);
    setElevation(false);
    setSlope(false);
    setAspect(false);

    // Initialize basin state to ensure all basins are selected
    initializeBasinState();

    // Enable specific features based on selected theme
    switch (newTheme) {
      case 'landuse':
        setLanduse(true);
        break;
      case 'terrain':
        setElevation(true); // Default to elevation
        break;
      case 'hydrology':
        break;
    }
  };

  // Handle terrain radio selection
  const handleTerrainOptionChange = (option: 'elevation' | 'slope' | 'aspect') => {
    // Reset all terrain options
    setElevation(false);
    setSlope(false);
    setAspect(false);

    // Set the selected option
    switch (option) {
      case 'elevation':
        setElevation(true);
        break;
      case 'slope':
        setSlope(true);
        break;
      case 'aspect':
        setAspect(true);
        break;
    }
  };

  // Render component
  return (
    <>
      <div className="flex-1 space-y-4 p-6 font-sans">
        {/* Map Type Selection */}
        <div className="overflow-hidden bg-black opacity-90 rounded-lg">
          <div className="p-4 flex items-center justify-between cursor-pointer" onClick={() => setIsMapTypeOpen(!isMapTypeOpen)}>
            <span className="text-lg font-semibold text-white">Map Type</span>
            <button className="text-white hover:text-gray-300">
              <svg
                className={`w-6 h-6 transition-transform ${isMapTypeOpen ? 'transform rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          {isMapTypeOpen && (
            <div className="bg-gray-600 p-4 space-y-4 text-white">
              <div className="flex items-center justify-between">
                <span>OpenStreetMap</span>
                <input
                  type="radio"
                  name="mapType"
                  checked={mapState === 'osm'}
                  onChange={() => setMapState('osm')}
                  className="w-6 h-6"
                />
              </div>
              <div className="flex items-center justify-between">
                <span>Satellite</span>
                <input
                  type="radio"
                  name="mapType"
                  checked={mapState === 'satellite'}
                  onChange={() => setMapState('satellite')}
                  className="w-6 h-6"
                />
              </div>
            </div>
          )}
        </div>

        {/* Map Layers Panel */}
        <div className="overflow-hidden bg-black opacity-90 rounded-lg">
          <div className="p-4 flex items-center justify-between cursor-pointer" onClick={() => setIsMapLayersOpen(!isMapLayersOpen)}>
            <span className="text-lg font-semibold text-white">Administrative Layers</span>
            <button className="text-white hover:text-gray-300">
              <svg
                className={`w-6 h-6 transition-transform ${isMapLayersOpen ? 'transform rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          {isMapLayersOpen && (
            <div className="bg-gray-600 p-4 space-y-4 text-white">
              {/* Districts Checkbox */}
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">Districts</span>
                <Switch checked={districts} onChange={handleDistrictsChange} />
              </div>
              {/* Talukas Checkbox */}
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">Talukas</span>
                <Switch checked={talukas} onChange={handleTalukasChange} />
              </div>
              {/* Road Checkbox */}
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">Road</span>
                <Switch checked={road} onChange={handleRoadChange} />
              </div>
              {/* Railway Checkbox */}
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">Railway</span>
                <Switch checked={railway} onChange={handleRailwayChange} />
              </div>
              {/* Canals Checkbox */}
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">Canals</span>
                <Switch checked={canals} onChange={handleCanalChange} />
              </div>
            </div>
          )}
        </div>

        {/* Theme Selection Dropdown */}
        <div className="flex items-center justify-between bg-black opacity-90 text-white p-4 gap-2 rounded-lg">
          <label className="text-lg font-semibold">Select Theme</label>
          <select
            value={theme}
            onChange={handleThemeChange}
            className="mt-2 p-2 border border-gray-300 bg-black opacity-90 text-white"
          >
            <option value="landuse">Landuse</option>
            <option value="hydrology">Hydrology</option>
            <option value="terrain">Terrain</option>
          </select>
        </div>

        {theme === 'hydrology' && (
          <div className="bg-gray-900 text-white rounded-lg">
            <div className="p-4">
              <h3 className="text-lg font-semibold">Hydrology Layers</h3>
            </div>
            <div className="bg-gray-600 p-4 space-y-4">
              {/* Channels Multi-Select with MUI FormControl */}
              <FormControl sx={{ width: '100%', m: 0, marginBottom: 2 }}>
                <InputLabel id="channels-multiple-checkbox-label" sx={{ color: 'white' }}>Select Channels (Sub-Basins)</InputLabel>
                <Select
                  labelId="channels-multiple-checkbox-label"
                  id="channels-multiple-checkbox"
                  multiple
                  value={selectedChannels}
                  onChange={handleChannelChange}
                  input={<OutlinedInput label="Select Channels (Sub-Basins)" sx={{ color: 'white', borderColor: 'white' }} />}
                  renderValue={(selected) => selected.map((channel, index) => `Mahi Sub-Basin (MA - ${channels.indexOf(channel) + 1})`).join(', ')}
                  MenuProps={MenuProps}
                  sx={{
                    color: 'white',
                    '.MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                  }}
                >
                  {channels.map((channel, index) => (
                    <MenuItem key={channel} value={channel}>
                      <Checkbox checked={selectedChannels.indexOf(channel) > -1} />
                      <ListItemText primary={`Mahi Sub-Basin (MA - ${index + 1})`} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Sub-Checkbox Multi-Select with MUI FormControl */}
              <FormControl sx={{ width: '100%', m: 0 }} disabled={selectedChannels.length === 0}>
                <InputLabel id="subcheckbox-multiple-checkbox-label" sx={{ color: 'white' }}>Select Sub-Ranges</InputLabel>
                <Select
                  labelId="subcheckbox-multiple-checkbox-label"
                  id="subcheckbox-multiple-checkbox"
                  multiple
                  value={selectedSubCheckboxes}
                  onChange={handleSubCheckboxChange}
                  input={<OutlinedInput label="Select Sub-Ranges" sx={{ color: 'white', borderColor: 'white' }} />}
                  renderValue={(selected) => selected.join(', ')}
                  MenuProps={MenuProps}
                  sx={{
                    color: 'white',
                    '.MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                  }}
                >
                  {availableSubCheckboxes.map((subValue) => (
                    <MenuItem key={subValue} value={subValue}>
                      <Checkbox checked={selectedSubCheckboxes.indexOf(subValue) > -1} />
                      <ListItemText primary={subValue} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>
        )}

        {/* Conditional Rendering based on selected theme */}
        {theme === 'landuse' && (
          <>
            {/* Landuse Basin Dropdown */}
            <div className="text-white">
              <div className="bg-black opacity-90 rounded-lg">
                <div className="p-4 flex items-center justify-between">
                  <span className="text-lg font-semibold">Landuse Basin</span>
                  <button
                    onClick={() => setIsLanduseBasinOpen(!isLanduseBasinOpen)}
                    className="text-white hover:text-gray-300"
                  >
                    <svg
                      className={`w-6 h-6 transition-transform ${isLanduseBasinOpen ? 'transform rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
                {isLanduseBasinOpen && (
                  <div className="bg-gray-600 text-white">
                    {channels.map((channel, index) => {
                      const subCheckboxValues = subCheckboxRanges[index + 1];
                      return (
                        <div key={channel}>
                          <div className="p-4 flex items-center justify-between">
                            <span className="text-base font-xs">
                              {`Landuse Sub-Basin (MA-${index + 1})`}
                            </span>
                            <Switch
                              checked={data[channel]?.isChecked || false}
                              onChange={() => handleChannelChange({ target: { value: data[channel]?.isChecked ? selectedChannels.filter(ch => ch !== channel) : [...selectedChannels, channel] } })}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {theme === 'terrain' && (
          <>
            <div className="bg-black opacity-90 text-white rounded-lg">
              <div className="p-4">
                <span className="text-lg font-semibold">Terrain Options</span>
              </div>
              <div className="bg-gray-600 p-4 space-y-4">
                {/* Elevation Radio */}
                <div className="flex items-center justify-between mb-4">
                  <span>Elevation</span>
                  <input
                    type="radio"
                    name="terrainOption"
                    checked={elevation}
                    onChange={() => handleTerrainOptionChange('elevation')}
                    className="w-6 h-6"
                  />
                </div>
                {/* Aspect Radio */}
                <div className="flex items-center justify-between mb-4">
                  <span>Aspect</span>
                  <input
                    type="radio"
                    name="terrainOption"
                    checked={aspect}
                    onChange={() => handleTerrainOptionChange('aspect')}
                    className="w-6 h-6"
                  />
                </div>
                {/* Slope Radio */}
                <div className="flex items-center justify-between mb-4">
                  <span>Slope</span>
                  <input
                    type="radio"
                    name="terrainOption"
                    checked={slope}
                    onChange={() => handleTerrainOptionChange('slope')}
                    className="w-6 h-6"
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}