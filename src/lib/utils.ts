// Importing utility functions and types from clsx and tailwind-merge
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Importing classes and modules from OpenLayers (ol) for map styling and data handling
import { Style, Fill, Stroke, Circle as CircleStyle } from "ol/style";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import MultiLineString from "ol/geom/MultiLineString";

// Utility function to merge class names with Tailwind's utility-first approach
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Function to create a vector layer with a GeoJSON source and custom styling
export interface StyleOptions {
  radius?: number;
  circleFillColor?: string;
  circleStrokeColor?: string;
  circleStrokeWidth?: number;
  lineStrokeColor?: string;
  lineStrokeWidth?: number;
  fillColor?: string;
}

export const chartData = {
  MA1: {
    labels: ["1.0", "2.0", "3.0", "4.0", "5.0", "7.0", "8.0"],
    data: [
      35184067.84, 114602638.47, 2836033560.99, 1658631848.4, 3761984509.47,
      107928901.04, 45017608.19,
    ],
    colors: [
      "#ff0000",
      "#013ddc",
      "#feff73",
      "#7ac602",
      "#95e689",
      "#fe95e7",
      "#fefeb4",
    ],
  },
  MA2: {
    labels: ["1.0", "2.0", "3.0", "4.0", "5.0", "7.0", "8.0"],
    data: [
      1395533.99, 10209576.98, 511467314.03, 105310335.3, 394788259.72,
      13988197.46, 36834247.99,
    ],
    colors: [
      "#ff0000",
      "#013ddc",
      "#feff73",
      "#7ac602",
      "#95e689",
      "#fe95e7",
      "#fefeb4",
    ],
  },
  MA3: {
    labels: ["1.0", "2.0", "3.0", "4.0", "5.0", "7.0", "8.0"],
    data: [
      14634396.32, 38854988.51, 653344473.22, 8372291.22, 404835374.27,
      826915.5, 361834855.76,
    ],
    colors: [
      "#ff0000",
      "#013ddc",
      "#feff73",
      "#7ac602",
      "#95e689",
      "#fe95e7",
      "#fefeb4",
    ],
  },
  MA4: {
    labels: ["1.0", "2.0", "3.0", "4.0", "5.0", "7.0", "8.0"],
    data: [
      37809022.55, 43937871.95, 1682449022.66, 241407300.41, 1119828862.06,
      57550945.49, 39517616.16,
    ],
    colors: [
      "#ff0000",
      "#013ddc",
      "#feff73",
      "#7ac602",
      "#95e689",
      "#fe95e7",
      "#fefeb4",
    ],
  },
  MA5: {
    labels: ["1.0", "2.0", "3.0", "4.0", "5.0", "6.0", "7.0", "8.0"],
    data: [
      66279193.71, 121298280.94, 2532718949.02, 6358852.39, 1225216777.73,
      30119.44, 571356.62, 786455050.36,
    ],
    colors: [
      "#ff0000",
      "#013ddc",
      "#feff73",
      "#7ac602",
      "#95e689",
      "#dfaaf0",
      "#fe95e7",
      "#fefeb4",
    ],
  },
  MA6: {
    labels: ["1.0", "2.0", "3.0", "4.0", "5.0", "7.0", "8.0", "9.0"],
    data: [
      5514595.4, 112920513.46, 1062583674.51, 114169101.09, 727862702.46,
      39002847.57, 11707334.51, 382186469.15,
    ],
    colors: [
      "#ff0000",
      "#013ddc",
      "#feff73",
      "#7ac602",
      "#95e689",
      "#fe95e7",
      "#fefeb4",
      "#267300",
    ],
  },
  MA7: {
    labels: ["1.0", "2.0", "3.0", "4.0", "5.0", "7.0", "8.0", "9.0"],
    data: [
      49341116.69, 55447148.34, 2587329142.05, 53170848.95, 1594324108.85,
      196279254.28, 883509008.64, 261236843.53,
    ],
    colors: [
      "#ff0000",
      "#013ddc",
      "#feff73",
      "#7ac602",
      "#95e689",
      "#fe95e7",
      "#fefeb4",
      "#267300",
    ],
  },
  MA8: {
    labels: ["1.0", "2.0", "3.0", "4.0", "5.0", "7.0", "8.0", "9.0"],
    data: [
      4747918.78, 57414951.66, 982575493.05, 236263265.38, 746691915.14,
      26527011.02, 8930869.9, 660050155.51,
    ],
    colors: [
      "#ff0000",
      "#013ddc",
      "#feff73",
      "#7ac602",
      "#95e689",
      "#fe95e7",
      "#fefeb4",
      "#267300",
    ],
  },
  MA9: {
    labels: ["1.0", "2.0", "3.0", "4.0", "5.0", "6.0", "7.0", "8.0", "9.0"],
    data: [
      76006859.67, 67531432.19, 2384695598.94, 257031987.36, 639581715.2,
      1955938.09, 45093363.14, 148761732.69, 405690583.79,
    ],
    colors: [
      "#ff0000",
      "#013ddc",
      "#feff73",
      "#7ac602",
      "#95e689",
      "#dfaaf0",
      "#fe95e7",
      "#fefeb4",
      "#267300",
    ],
  },
  MA10: {
    labels: ["1.0", "2.0", "3.0", "4.0", "5.0", "6.0", "7.0", "8.0", "9.0"],
    data: [
      277507729.35, 224528549.56, 3650695009.25, 573368236.63, 432528829.01,
      192809129.87, 29941460.1, 598471419.64, 83711959.69,
    ],
    colors: [
      "#ff0000",
      "#013ddc",
      "#feff73",
      "#7ac602",
      "#95e689",
      "#dfaaf0",
      "#fe95e7",
      "#fefeb4",
      "#267300",
    ],
  },
};
export function createVectorLayer(
  geojsonPath: string,
  styleOptions: StyleOptions
) {
  const vectorSource = new VectorSource();

  // Fetch the GeoJSON file and add features to the vector source
  fetch(geojsonPath)
    .then((response) => response.json())
    .then((data) => {
      const features = new GeoJSON().readFeatures(data, {
        featureProjection: "EPSG:3857", // Convert GeoJSON coordinates to the map's projection
      });
      vectorSource.addFeatures(features);
    })
    .catch((error) =>
      console.error(`Error loading GeoJSON (${geojsonPath}):`, error)
    );

  // Create and return a vector layer with styling based on the given options
  return new VectorLayer({
    source: vectorSource,
    style: new Style({
      image: new CircleStyle({
        radius: styleOptions.radius || 2, // Default radius
        fill: new Fill({ color: styleOptions.circleFillColor || "red" }),
        stroke: new Stroke({
          color: styleOptions.circleStrokeColor || "black",
          width: styleOptions.circleStrokeWidth || 1,
        }),
      }),
      stroke: new Stroke({
        color: styleOptions.lineStrokeColor || "red",
        width: styleOptions.lineStrokeWidth || 1,
      }),
      fill: new Fill({
        color: styleOptions.fillColor || "rgba(0, 0, 255, 0.1)",
      }),
    }),
  });
}

// Function to create a vector layer for a specific river channel with advanced styling and coordinate extraction
export async function createVectorLayerForRiver(
  geojsonPath: string,
  channelName: string,
  styleOptions: StyleOptions,
  orderNumber: number
): Promise<{ layer: VectorLayer; coords: number[][][] }> {
  const vectorSource = new VectorSource();
  const coords: number[][][] = []; // Array to store extracted coordinates

  try {
    // Fetch GeoJSON data from the given path
    const response = await fetch(geojsonPath);
    const data = await response.json();

    // Filter features based on the `layer` property
    const filteredFeatures = new GeoJSON().readFeatures(
      {
        ...data,
        features: data.features.filter(
          (feature: { properties: { layer: string } }) =>
            feature.properties.layer === channelName
        ),
      },
      {
        featureProjection: "EPSG:3857", // Convert coordinates to the map's projection
      }
    );

    // Extract coordinates from the geometry of the filtered features
    filteredFeatures.forEach((feature) => {
      const geometry = feature.getGeometry();
      if (geometry instanceof MultiLineString) {
        const multiLineCoords = geometry.getCoordinates();
        coords.push(...multiLineCoords);
      }
    });

    // Adjust line stroke width dynamically based on the order number
    const dynamicStyleOptions = {
      ...styleOptions,
      lineStrokeWidth: orderNumber - 0.5,
    };

    // Add the filtered features to the vector source
    vectorSource.addFeatures(filteredFeatures);

    // Create and return the vector layer with styling
    const layer = new VectorLayer({
      source: vectorSource,
      style: new Style({
        image: new CircleStyle({
          radius: dynamicStyleOptions.radius || 2,
          fill: new Fill({
            color: dynamicStyleOptions.circleFillColor || "red",
          }),
          stroke: new Stroke({
            color: dynamicStyleOptions.circleStrokeColor || "black",
            width: dynamicStyleOptions.circleStrokeWidth || 1,
          }),
        }),
        stroke: new Stroke({
          color: dynamicStyleOptions.lineStrokeColor || "blue",
          width: dynamicStyleOptions.lineStrokeWidth || 1,
        }),
        fill: new Fill({
          color: dynamicStyleOptions.fillColor || "rgba(0, 0, 255, 0.1)",
        }),
      }),
    });

    return { layer, coords }; // Return the layer and extracted coordinates
  } catch (error) {
    console.error(`Error loading GeoJSON (${geojsonPath}):`, error);
    throw error;
  }
}

// Interfaces for managing checkbox and channel states

export interface dataState {
  [key: string]: {
    isChecked: boolean;

    subCheckboxes: {
      [key: string]: boolean;
    };
  };
}

export interface ChannelData {
  isChecked?: boolean;
  subCheckboxes?: { [key: string]: boolean }; // Sub-checkboxes structure
}

export interface MapComponentProps {
  data: dataState;
  road: boolean;
  railway: boolean;
  canals: boolean;
  talukas: boolean;
  districts: boolean;
  theme: string;
  landuse: boolean;
  elevation: boolean;
  slope: boolean;
  aspect: boolean;
  mapState: "osm" | "satellite";
}

export interface Basin {
  name: string;
  number: number;
  area: number;
  perimeter: number;
}
export interface RiverInfo {
  order: number;
  basin: string;
  segmentId: string;
  length: number;
}
export interface SubCheckboxes {
  [subValue: string]: boolean;
}

export interface ChannelState {
  isChecked: boolean;
  subCheckboxes: SubCheckboxes;
}

export interface State {
  [channel: string]: ChannelState;
}

export interface DataContextProps {
  data: State;
  updateData: (
    channel: string,
    updateCallback: (prevState: State) => State
  ) => void;
  landUse: boolean; // Updated from State to boolean
  updateLandUse: (updateCallback: (prevLandUse: boolean) => boolean) => void; // Added this function
}

export const defaultStyleOptionsRiver = {
  radius: 5,
  circleFillColor: "blue",
  circleStrokeColor: "white",
  circleStrokeWidth: 2,
  lineStrokeColor: "blue",
  lineStrokeWidth: 1,
  fillColor: "rgba(0, 255, 0, 0.3)",
};

// Mapping of sub-checkbox ranges for different orders
export const subCheckboxRanges = {
  1: ["1-2", "2-3", "3-4", "4-5", "5-6"],
  2: ["1-2", "2-3", "3-4"],
  3: ["1-2", "2-3", "3-4"],
  4: ["1-2", "2-3", "3-4", "4-5"],
  5: ["1-2", "2-3", "3-4", "4-5"],
  6: ["1-2", "2-3", "3-4"],
  7: ["1-2", "2-3", "3-4", "4-5"],
  8: ["1-2", "2-3", "3-4", "4-5"],
  9: ["1-2", "2-3", "3-4", "4-5"],
  10: ["1-2", "2-3", "3-4", "4-5"],
} as { [key: number]: string[] };

// Array of main channel names
export const channels = Array.from(
  { length: 10 },
  (_, i) => `MainChannel${i + 1}`
);

// Array of order labels
export const orders = Array.from({ length: 6 }, (_, i) => `order${i + 1}`);

export interface NavbarProps {
  data: dataState;
  setData: React.Dispatch<React.SetStateAction<dataState>>;
  landuse: boolean;
  setLanduse: React.Dispatch<React.SetStateAction<boolean>>;
  road: boolean;
  setRoad: React.Dispatch<React.SetStateAction<boolean>>;
  railway: boolean;
  setRailway: React.Dispatch<React.SetStateAction<boolean>>;
  canals: boolean;
  setCanals: React.Dispatch<React.SetStateAction<boolean>>;
  talukas: boolean;
  setTalukas: React.Dispatch<React.SetStateAction<boolean>>;
  districts: boolean;
  setDistricts: React.Dispatch<React.SetStateAction<boolean>>;
  theme: string;
  setTheme: React.Dispatch<React.SetStateAction<string>>;
  elevation: boolean;
  setElevation: React.Dispatch<React.SetStateAction<boolean>>;
  slope: boolean;
  setSlope: React.Dispatch<React.SetStateAction<boolean>>;
  aspect: boolean;
  setAspect: React.Dispatch<React.SetStateAction<boolean>>;
  mapState: "osm" | "satellite";
  setMapState: React.Dispatch<React.SetStateAction<"osm" | "satellite">>;
}

import { FeatureCollection } from "geojson";

export let Mahi_Streams: FeatureCollection | null = null;

export const fetchMahiStreams = async () => {
  try {
    const response = await fetch("/Mahi_Streams.geojson");
    Mahi_Streams = await response.json();
  } catch (error) {
    console.error("Error fetching Mahi_Streams geojson:", error);
  }
};

export interface Basin {
  name: string;
  number: number;
  area: number;
  perimeter: number;
}
export interface RiverInfo {
  order: number;
  basin: string;
  segmentId: string;
  length: number;
}
