import { channels, dataState, NavbarProps } from "@/lib/utils";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import {
  ChevronDown,
  ChevronUp,
  Map,
  MapPin,
  Train,
  Waves,
  Mountain,
  Compass,
  TrendingUp,
  TreePine,
  Droplets,
  Settings,
  Layers,
  Globe,
  Car
} from 'lucide-react';

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
  const [isLanduseBasinOpen, setIsLanduseBasinOpen] = useState(false);
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

  useEffect(() => {
    setTheme('landuse');
    setLanduse(true);
  }, []);

  // Handle theme selection
  const handleThemeChange = (newTheme: 'landuse' | 'hydrology' | 'terrain') => {
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

  const getThemeIcon = (themeType: string) => {
    switch (themeType) {
      case 'landuse':
        return <TreePine className="h-4 w-4" />;
      case 'hydrology':
        return <Droplets className="h-4 w-4" />;
      case 'terrain':
        return <Mountain className="h-4 w-4" />;
      default:
        return <Settings className="h-4 w-4" />;
    }
  };

  const getTerrainIcon = (terrainType: string) => {
    switch (terrainType) {
      case 'elevation':
        return <Mountain className="h-4 w-4" />;
      case 'slope':
        return <TrendingUp className="h-4 w-4" />;
      case 'aspect':
        return <Compass className="h-4 w-4" />;
      default:
        return <Mountain className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex-1 space-y-4 p-6  dark:from-slate-900 dark:to-slate-800 min-h-screen">
      {/* Map Type Selection */}
      <Card className="shadow-lg border-0 bg-white/95 dark:bg-slate-800/95 ">
        <Collapsible open={isMapTypeOpen} onOpenChange={setIsMapTypeOpen}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors rounded-t-lg">
              <CardTitle className="flex items-center justify-between text-lg">
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Map Type
                </div>
                {isMapTypeOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0 space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <div className="flex items-center gap-2">
                  <Map className="h-4 w-4 text-green-600" />
                  <Label htmlFor="osm-radio" className="font-medium">OpenStreetMap</Label>
                </div>
                <input
                  id="osm-radio"
                  type="radio"
                  name="mapType"
                  checked={mapState === 'osm'}
                  onChange={() => setMapState('osm')}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-blue-600" />
                  <Label htmlFor="satellite-radio" className="font-medium">Satellite</Label>
                </div>
                <input
                  id="satellite-radio"
                  type="radio"
                  name="mapType"
                  checked={mapState === 'satellite'}
                  onChange={() => setMapState('satellite')}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Administrative Layers */}
      <Card className="shadow-lg border-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm">
        <Collapsible open={isMapLayersOpen} onOpenChange={setIsMapLayersOpen}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors rounded-t-lg">
              <CardTitle className="flex items-center justify-between text-lg">
                <div className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  Administrative Layers
                  <Badge variant="secondary" className="ml-2">
                    {[districts, talukas, road, railway, canals].filter(Boolean).length}
                  </Badge>
                </div>
                {isMapLayersOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0 space-y-4">
              {[
                { label: 'Districts', checked: districts, onChange: () => setDistricts(!districts), icon: MapPin, color: 'text-red-600' },
                { label: 'Talukas', checked: talukas, onChange: () => setTalukas(!talukas), icon: MapPin, color: 'text-gray-600' },
                { label: 'Road', checked: road, onChange: () => setRoad(!road), icon: Car, color: 'text-gray-600' },
                { label: 'Railways', checked: railway, onChange: () => setRailway(!railway), icon: Train, color: 'text-blue-600' },
                { label: 'Canals', checked: canals, onChange: () => setCanals(!canals), icon: Waves, color: 'text-cyan-600' }
              ].map(({ label, checked, onChange, icon: Icon, color }) => (
                <div key={label} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 ${color}`} />
                    <Label htmlFor={label.toLowerCase()} className="font-medium">{label}</Label>
                  </div>
                  <Switch
                    id={label.toLowerCase()}
                    checked={checked}
                    onCheckedChange={onChange}
                  />
                </div>
              ))}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Theme Selection */}
      <Card className="shadow-lg border-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            {getThemeIcon(theme)}
            Select Theme
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Select value={theme} onValueChange={handleThemeChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="landuse">
                <div className="flex items-center gap-2">
                  <TreePine className="h-4 w-4 text-green-600" />
                  Landuse
                </div>
              </SelectItem>
              <SelectItem value="hydrology">
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-blue-600" />
                  Hydrology
                </div>
              </SelectItem>
              <SelectItem value="terrain">
                <div className="flex items-center gap-2">
                  <Mountain className="h-4 w-4 text-amber-600" />
                  Terrain
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Hydrology Theme */}
      {theme === 'hydrology' && (
        <Card className="shadow-lg border-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Droplets className="h-5 w-5 text-blue-600" />
              Hydrology Layers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Channels Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Waves className="h-4 w-4" />
                Select Channels (Sub-Basins)
              </Label>
              <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto border rounded-lg p-3 bg-slate-50 dark:bg-slate-700/50">
                {channels.map((channel, index) => (
                  <div key={channel} className="flex items-center space-x-2 p-2 hover:bg-slate-100 dark:hover:bg-slate-600 rounded">
                    <Checkbox
                      id={`channel-${channel}`}
                      checked={selectedChannels.includes(channel)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedChannels([...selectedChannels, channel]);
                        } else {
                          setSelectedChannels(selectedChannels.filter(ch => ch !== channel));
                        }
                      }}
                    />
                    <Label htmlFor={`channel-${channel}`} className="text-sm">
                      Sub-Basin (MA-{index + 1})
                    </Label>
                  </div>
                ))}
              </div>
              {selectedChannels.length > 0 && (
                <Badge variant="outline" className="w-fit">
                  {selectedChannels.length} selected
                </Badge>
              )}
            </div>

            {/* Sub-ranges Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Select Sub-Ranges
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {availableSubCheckboxes.map((subValue) => (
                  <div key={subValue} className="flex items-center space-x-2 p-2 bg-slate-50 dark:bg-slate-700/50 rounded hover:bg-slate-100 dark:hover:bg-slate-600">
                    <Checkbox
                      id={`sub-${subValue}`}
                      checked={selectedSubCheckboxes.includes(subValue)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedSubCheckboxes([...selectedSubCheckboxes, subValue]);
                        } else {
                          setSelectedSubCheckboxes(selectedSubCheckboxes.filter(sub => sub !== subValue));
                        }
                      }}
                      disabled={selectedChannels.length === 0}
                    />
                    <Label
                      htmlFor={`sub-${subValue}`}
                      className={`text-sm ${selectedChannels.length === 0 ? 'text-muted-foreground' : ''}`}
                    >
                      {subValue}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Landuse Theme */}
      {theme === 'landuse' && (
        <Card className="shadow-lg border-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm">
          <Collapsible open={isLanduseBasinOpen} onOpenChange={setIsLanduseBasinOpen}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors rounded-t-lg">
                <CardTitle className="flex items-center justify-between text-lg">
                  <div className="flex items-center gap-2">
                    <TreePine className="h-5 w-5 text-green-600" />
                    Landuse Basin
                    <Badge variant="secondary" className="ml-2">
                      {Object.values(data).filter(item => item?.isChecked).length}
                    </Badge>
                  </div>
                  {isLanduseBasinOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0 space-y-3">
                {channels.map((channel, index) => (
                  <div key={channel} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3 text-green-600" />
                      <Label htmlFor={`landuse-${channel}`} className="font-medium">
                        Sub-Basin (MA-{index + 1})
                      </Label>
                    </div>
                    <Switch
                      id={`landuse-${channel}`}
                      checked={data[channel]?.isChecked || false}
                      onCheckedChange={() => {
                        const newSelectedChannels = data[channel]?.isChecked
                          ? selectedChannels.filter(ch => ch !== channel)
                          : [...selectedChannels, channel];
                        handleChannelChange({ target: { value: newSelectedChannels } });
                      }}
                    />
                  </div>
                ))}
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      )}

      {/* Terrain Theme */}
      {theme === 'terrain' && (
        <Card className="shadow-lg border-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Mountain className="h-5 w-5 text-amber-600" />
              Terrain Options
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: 'Elevation', value: 'elevation', checked: elevation, icon: Mountain, color: 'text-amber-600' },
              { label: 'Aspect', value: 'aspect', checked: aspect, icon: Compass, color: 'text-blue-600' },
              { label: 'Slope', value: 'slope', checked: slope, icon: TrendingUp, color: 'text-green-600' }
            ].map(({ label, value, checked, icon: Icon, color }) => (
              <div key={value} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <div className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 ${color}`} />
                  <Label htmlFor={`terrain-${value}`} className="font-medium">{label}</Label>
                </div>
                <input
                  id={`terrain-${value}`}
                  type="radio"
                  name="terrainOption"
                  checked={checked}
                  onChange={() => handleTerrainOptionChange(value as 'elevation' | 'slope' | 'aspect')}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}