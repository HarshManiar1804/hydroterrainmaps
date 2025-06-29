import { useEffect, useRef, useState } from "react";
import "ol/ol.css";
import { Map, View } from "ol";
import { fromLonLat } from "ol/proj";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import { Overlay } from "ol";
import XYZ from "ol/source/XYZ";
import * as GeoTIFF from "geotiff";
import {
  Basin,
  createVectorLayer,
  createVectorLayerForRiver,
  defaultStyleOptionsRiver,
  MapComponentProps,
  RiverInfo,
} from "@/lib/utils";
import { Fill, Stroke, Style, Text, Circle as CircleStyle } from "ol/style";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";


const MapComponent = ({ data, road, railway, canals, talukas, districts, theme, landuse, elevation, slope, aspect, mapState }: MapComponentProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [layerList, setLayerList] = useState<string[]>([]);
  const [riverLayers, setRiverLayers] = useState<VectorLayer[]>([]);
  const [hoverCoordinates, setHoverCoordinates] = useState<[number, number] | null>(null);
  const [isRiverLayerHovered, setIsRiverLayerHovered] = useState(false);
  const [selectedRiverInfo, setSelectedRiverInfo] = useState<RiverInfo | null>(null);
  const [selectedBasin, setSelectedBasin] = useState<Basin | null>(null);
  const popupRef = useRef<HTMLDivElement>(document.createElement('div'));

  const defaultStyleOptionsBasin = {
    radius: 2,
    circleFillColor: (elevation || slope || aspect) ? "black" : "red",
    circleStrokeColor: "black",
    circleStrokeWidth: (elevation || slope || aspect) ? 1 : 2,
    lineStrokeColor: (elevation || slope || aspect) ? "black" : "red",
    lineStrokeWidth: (elevation || slope || aspect) ? 2 : 1,
    fillColor: "rgba(0, 0, 255, 0.1)",
  };
  const fetchRiverLayers = async () => {
    const geoJSONFiles: { fileName: string; channel: string }[] = [];
    const promises = [];

    for (const [channel, channelData] of Object.entries(data)) {
      if (channelData.isChecked) {
        for (const [range, isChecked] of Object.entries(channelData.subCheckboxes || {})) {
          if (isChecked) {
            const orderNumber = range.split("-")[0];
            const fileName = `order${orderNumber}.geojson`;
            geoJSONFiles.push({ fileName, channel });

            promises.push(
              createVectorLayerForRiver(
                fileName,
                channel,
                defaultStyleOptionsRiver,
                Number(orderNumber)
              )
            );
          }
        }
      }
    }

    try {
      const results = await Promise.all(promises);
      setRiverLayers(results.map((result) => result.layer));
    } catch (error) {
      console.error("Error fetching river layers:", error);
    }
  };

  const fetchBasinLayer = async () => {
    const updatedLayers: string[] = [];
    Object.keys(data).forEach((key) => {
      const match = key.match(/MainChannel(\d+)/);
      if (match) {
        const channelIndex = match[1];
        const geoJsonPath = `/MA${channelIndex}.geojson`;

        if (data[key]?.isChecked) {
          updatedLayers.push(geoJsonPath);
        }
      }
    });

    setLayerList((prev) =>
      JSON.stringify(prev) !== JSON.stringify(updatedLayers) ? updatedLayers : prev
    );
  };

  useEffect(() => {
    fetchBasinLayer();
    fetchRiverLayers();
  }, [data]);

  useEffect(() => {
    if (!mapRef.current) return;

    // Create base layer based on mapState
    const baseLayer = mapState === 'osm' ?
      new TileLayer({ source: new OSM() }) :
      new TileLayer({
        source: new XYZ({
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          maxZoom: 19
        })
      });

    const vectorLayers = layerList.map((file) =>
      createVectorLayer(file, defaultStyleOptionsBasin)
    );
    const styleRiver = new Style({
      stroke: new Stroke({
        color: 'rgba(0, 0, 255, 0)'
      })
    });

    const styleTalukaBoundary = new Style({
      stroke: new Stroke({
        color: '#1f78b4', // Blue
        width: 2,
        lineDash: [6, 2] // Dashed pattern
      })
    });

    const styleDistrictBoundary = new Style({
      stroke: new Stroke({
        color: '#000000', // Black
        width: 3, // Thicker for prominence
        lineDash: [18, 6] // Long dashes with medium gaps
      })
    });

    const canalStyle = new Style({
      stroke: new Stroke({
        color: '#2741ea', // Primary Blue
        width: 2.5,
        lineDash: [10, 5] // Dashed pattern to mimic canal flow
      }),
      text: new Text({
        text: '— — — — —', // White dashes to overlay on blue stroke
        font: 'bold 12px sans-serif',
        fill: new Fill({ color: '#ffffff' }), // White dashed effect
        placement: 'line',
      }),
      fill: new Fill({
        color: 'rgba(39, 65, 234, 0.3)', // Light blue transparent fill
      }),
    });


    const railwayStyle = new Style({
      stroke: new Stroke({
        color: '#e31a1c', // Red
        width: 2.5,
        lineDash: [10, 5], // Dashed with small perpendicular markers
      }),
      text: new Text({
        text: '| — | — | — | — |', // Mimicking railway track pattern
        font: 'bold 14px sans-serif',
        fill: new Fill({ color: '#e31a1c' }), // Red color for visibility
        placement: 'line', // Aligns text along the railway line
      })
    });


    const roadStyle = new Style({
      stroke: new Stroke({
        color: '#878787', // Gray base color
        width: 2, // Slightly thicker for visibility
      }),
      text: new Text({
        text: '— — — — —',
        font: 'bold 12px sans-serif',
        fill: new Fill({ color: '#ffffff' }),
        placement: 'line',
      })
    });


    const basinLayer = new VectorLayer({
      source: new VectorSource({
        url: "/Mahi_Basins.geojson", // Ensure correct path
        format: new GeoJSON(),
      }),
      style: styleRiver,
    });

    // Add Mahi Basin centroids layer with labels
    const basinCentroidsLayer = new VectorLayer({
      source: new VectorSource({
        url: "/MahiBasinCentroids.geojson",
        format: new GeoJSON(),
      }),
      style: function (feature) {
        return new Style({
          text: new Text({
            text: feature.get('Basin Name'),
            font: 'bold 13px Arial',
            fill: new Fill({
              color: '#e31a1c'
            }),
            stroke: new Stroke({
              color: '#ffffff',
              width: 3
            }),
            offsetY: -15
          }),
          image: new CircleStyle({
            radius: 4,
            fill: new Fill({
              color: '#e31a1c'
            }),
            stroke: new Stroke({
              color: '#ffffff',
              width: 2
            })
          })
        });
      }
    });

    const canalLayer = new VectorLayer({
      source: new VectorSource({
        url: "/Canals.geojson", // Ensure correct path
        format: new GeoJSON(),
      }),
      style: canalStyle,
    });


    const railwayLayer = new VectorLayer({
      source: new VectorSource({
        url: "/Railway.geojson", // Ensure correct path
        format: new GeoJSON(),
      }),
      style: railwayStyle,
    });


    const roadLayer = new VectorLayer({
      source: new VectorSource({
        url: "/Roads_layer.geojson",
        format: new GeoJSON(),
        loader: function (_extent, _resolution, projection) {
          fetch("/Roads_layer.geojson")
            .then(response => response.json())
            .then(data => {
              const features = new GeoJSON().readFeatures(data, {
                featureProjection: projection,
              });

              const filteredFeatures = features.filter(feature => {
                const roadType = feature.get("Road");
                return roadType && (roadType.includes("SH") || roadType.includes("NH"));
              });

              (this as VectorSource).addFeatures(filteredFeatures);
            });
        }
      }),
      style: roadStyle,
    });

    const streamsLayer = new VectorLayer({
      source: new VectorSource({
        url: "/Mahi_Streams.geojson", // Ensure correct path
        format: new GeoJSON(),
      }),
      style: styleRiver,
    });

    const talukaBoundaryLayer = new VectorLayer({
      source: new VectorSource({
        url: "/TalukaBoundary.geojson", // Ensure correct path
        format: new GeoJSON(),
      }),
      style: styleTalukaBoundary,
    });

    // Add taluka centroids layer with labels
    const talukaCentroidsLayer = new VectorLayer({
      source: new VectorSource({
        url: "/TalukaCentroids.geojson",
        format: new GeoJSON(),
      }),
      style: function (feature) {
        return new Style({
          text: new Text({
            text: feature.get('NAME_3'),
            font: '12px Arial',
            fill: new Fill({
              color: '#1f78b4'
            }),
            stroke: new Stroke({
              color: '#ffffff',
              width: 3
            }),
            offsetY: -15
          }),
          image: new CircleStyle({
            radius: 4,
            fill: new Fill({
              color: '#1f78b4'
            }),
            stroke: new Stroke({
              color: '#ffffff',
              width: 2
            })
          })
        });
      },
      visible: talukas // Sync visibility with talukas layer
    });

    const districtBoundaryLayer = new VectorLayer({
      source: new VectorSource({
        url: "/DistrictBoundary.geojson", // Ensure correct path
        format: new GeoJSON(),
      }),
      style: styleDistrictBoundary,
    });

    // Add district centroids layer with labels
    const districtCentroidsLayer = new VectorLayer({
      source: new VectorSource({
        url: "/DitsrictCentroids.geojson",
        format: new GeoJSON(),
      }),
      style: function (feature) {
        return new Style({
          text: new Text({
            text: feature.get('NAME_2'),
            font: '14px Arial',
            fill: new Fill({
              color: '#000000'
            }),
            stroke: new Stroke({
              color: '#ffffff',
              width: 3
            }),
            offsetY: -15
          }),
          image: new CircleStyle({
            radius: 5,
            fill: new Fill({
              color: '#000000'
            }),
            stroke: new Stroke({
              color: '#ffffff',
              width: 2
            })
          })
        });
      },
      visible: districts // Sync visibility with districts layer
    });

    const landuseBaseUrl = "https://earthengine.googleapis.com/v1/projects/ee-himani202302/maps/5c23e4dbf9085ff9159f65e3fa93a7ab-ff952d69912029c40c199ddff46431b7/tiles";
    const elevationBaseUrl = "https://earthengine.googleapis.com/v1/projects/ee-himani202302/maps/439eab434f6b6bf51f39ee79b7348b1e-19557a5c1c7e844d7ac200c9003ac727/tiles";
    const slopeBaseUrl = "https://earthengine.googleapis.com/v1/projects/ee-himani202302/maps/89b8d6eae9f54d5a31017d11935e99ce-5cad597eed4a6db38970046115a6c6f8/tiles";
    const aspectBaseUrl = "https://earthengine.googleapis.com/v1/projects/ee-himani202302/maps/d4336fc697dde32f57436160707bc1ff-54f37e406741806e52bba49f53cd6923/tiles";

    const createXYZSource = (baseUrl: string) => new XYZ({
      tileUrlFunction: (tileCoord: number[]) => {
        if (!tileCoord) return '';
        const [z, x, y] = tileCoord;
        return `${baseUrl}/${z}/${x}/${y}`;
      },
      crossOrigin: 'anonymous',
    });

    const landuseSource = createXYZSource(landuseBaseUrl);
    const elevationSource = createXYZSource(elevationBaseUrl);
    const slopeSource = createXYZSource(slopeBaseUrl);
    const aspectSource = createXYZSource(aspectBaseUrl);

    // Create marker source and layer
    const markerSource = new VectorSource();
    const markerLayer = new VectorLayer({
      source: markerSource,
      style: new Style({
        image: new CircleStyle({
          radius: 7,
          fill: new Fill({ color: 'red' }),
          stroke: new Stroke({ color: 'white', width: 2 })
        })
      })
    });

    // Create popup overlay
    popupRef.current.className = 'ol-popup';
    popupRef.current.style.position = 'absolute';
    popupRef.current.style.backgroundColor = 'white';
    popupRef.current.style.padding = '10px';
    popupRef.current.style.borderRadius = '5px';
    popupRef.current.style.boxShadow = '0 1px 4px rgba(0,0,0,0.2)';
    popupRef.current.style.zIndex = '1000';
    popupRef.current.style.minWidth = '150px';
    popupRef.current.style.textAlign = 'center';

    const popupOverlay = new Overlay({
      element: popupRef.current,
      positioning: 'bottom-center',
      stopEvent: false,
      offset: [0, -10]
    });

    const map = new Map({
      target: mapRef.current || undefined,
      layers: [
        baseLayer,
        ...(landuse ? [new TileLayer({ source: landuseSource })] : []),
        ...(elevation ? [new TileLayer({ source: elevationSource })] : []),
        ...(slope ? [new TileLayer({ source: slopeSource })] : []),
        ...(aspect ? [new TileLayer({ source: aspectSource })] : []),
        basinLayer,
        basinCentroidsLayer,
        streamsLayer,
        ...(talukas ? [talukaBoundaryLayer, talukaCentroidsLayer] : []),
        ...(districts ? [districtBoundaryLayer, districtCentroidsLayer] : []),
        ...(road ? [roadLayer] : []),
        ...(railway ? [railwayLayer] : []),
        ...(canals ? [canalLayer] : []),
        ...vectorLayers,
        ...riverLayers,
        ...(!landuse && (elevation || slope || aspect) ? [markerLayer] : []),
      ],
      view: new View({
        center: fromLonLat([74.2684, 23.2803]),
        zoom: 7.3,
      }),
    });

    // Add popup overlay to map
    map.addOverlay(popupOverlay);

    // Pointer move event to update hover coordinates
    map.on("pointermove", (event) => {
      if (event.originalEvent instanceof MouseEvent) {
        const coordinates = map.getEventCoordinate(event.originalEvent) as [number, number];
        setHoverCoordinates(event.coordinate as [number, number]);
      }
      setHoverCoordinates(coordinates);

      let hoveredRiver = false;
      map.forEachFeatureAtPixel(event.pixel, (_, layer) => {
        if (riverLayers.includes(layer as VectorLayer)) {
          hoveredRiver = true;

        }
      });
      setIsRiverLayerHovered(hoveredRiver);
    });

    map.on("click", async (event) => {
      // If landuse is active, don't show marker
      if (theme === "landuse") {
        return;
      }
      // Only proceed if at least one of elevation, slope, or aspect is active
      else if (theme === "hydrology") {
        console.log("hydro")
        let clickedBasin = null;
        let clickedRiver = null;

        map.forEachFeatureAtPixel(event.pixel, (feature) => {
          const properties = feature.getProperties();

          // Check Basins GeoJSON for a match
          if (basinsGeojson) {
            const matchedBasin = basinsGeojson.features.find(f => {
              return f.properties["Basin Name"] === properties["Basin Name"];
            });

            if (matchedBasin) {
              clickedBasin = {
                name: matchedBasin.properties["Basin Name"],
                number: matchedBasin.properties["number"],
                area: matchedBasin.properties["area"],
                perimeter: matchedBasin.properties["perimeter"],
              };
            }
          }
          // Check Streams GeoJSON for a match
          if (streamsGeojson) {
            const matchedStream = streamsGeojson.features.find(f => {
              return f.properties["SEGMENT_ID"] === properties["SEGMENT_ID"];
            });

            if (matchedStream) {
              clickedRiver = {
                segmentId: matchedStream.properties["SEGMENT_ID"],
                length: matchedStream.properties["len"] || 0,
                order: matchedStream.properties["ORDER"] || 0,
              };
            }
          }
        });
        // Update UI state
        setSelectedBasin(clickedBasin);
        setSelectedRiverInfo(clickedRiver);
        return;
      }
      else {
        const coord = event.coordinate;
        const [lon, lat] = coord;

        console.log(`Clicked at: Lat ${lat}, Lon ${lon}`);

        // Determine which GeoTIFF file to load based on active layer
        let tifFileName = "";
        let layerType = "";

        if (elevation) {
          tifFileName = "/MahiElevation.tif";
          layerType = "Elevation";
        } else if (slope) {
          tifFileName = "/MahiSlope.tif";
          layerType = "Slope";
        } else if (aspect) {
          tifFileName = "/MahiAspect.tif";
          layerType = "Aspect";
        }

        try {
          const response = await fetch(tifFileName);
          const arrayBuffer = await response.arrayBuffer();
          const tiff = await GeoTIFF.fromArrayBuffer(arrayBuffer);
          const image = await tiff.getImage();
          const rasters = await image.readRasters();
          const bbox = image.getBoundingBox();

          const width = image.getWidth();
          const height = image.getHeight();

          const x = ((lon - bbox[0]) / (bbox[2] - bbox[0])) * width;
          const y = ((bbox[3] - lat) / (bbox[3] - bbox[1])) * height;

          const pixelIndex = Math.floor(y) * width + Math.floor(x);
          const pixelValue = Array.isArray(rasters[0])
            ? rasters[0][pixelIndex]
            : (rasters[0] as any)[pixelIndex];

          console.log(`${layerType} Value at (${lat}, ${lon}): ${pixelValue}`);

          // Clear existing markers and add new one
          markerSource.clear();
          const markerFeature = new Feature({
            geometry: new Point(coord)
          });
          markerSource.addFeature(markerFeature);

          // Show popup at clicked location with appropriate layer type
          popupRef.current.innerHTML = `<strong>${layerType}:</strong> ${pixelValue !== undefined ? pixelValue.toFixed(2) : 'N/A'} ${layerType === 'Elevation' ? 'meters' : ''}`;
          popupOverlay.setPosition(coord);
        } catch (error) {
          console.error(`Error loading ${tifFileName}:`, error);
        }
      }
    });

    // Click event to capture coordinates & find basin
    // Load GeoJSON Data for basins and streams
    let basinsGeojson: { features: { properties: { "Basin Name": string; number: number; area: number; perimeter: number; } }[]; } | null = null;
    let streamsGeojson: { features: { properties: { SEGMENT_ID: string; len: number; ORDER: number; } }[]; } | null = null;
    // Fetch Mahi Basins GeoJSON
    fetch("/Mahi_Basins.geojson")
      .then(response => response.json())
      .then(data => {
        basinsGeojson = data;
      })
      .catch(error => console.error("Error loading Mahi Basins GeoJSON:", error));

    // Fetch Mahi Streams GeoJSON
    fetch("/Mahi_Streams.geojson")
      .then(response => response.json())
      .then(data => {
        streamsGeojson = data;
      })
      .catch(error => console.error("Error loading Mahi Streams GeoJSON:", error));


    return () => map.setTarget(undefined);
  }, [layerList, riverLayers, road, railway, canals, talukas, districts, theme, landuse, elevation, slope, aspect, mapState, selectedBasin, selectedRiverInfo]);

  return (
    <div style={{ display: "flex", width: "100%", height: "100vh" }}>
      <div ref={mapRef} style={{ flex: 1 }}></div>

      {/* Hover Info */}
      {hoverCoordinates && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 p-2 bg-white bg-opacity-80 rounded text-center ml-32">
          <div>Lat & Lon: {hoverCoordinates.map((c) => c.toFixed(2)).join(", ")}</div>
          {
            isRiverLayerHovered &&
            <div>River: {isRiverLayerHovered ? "Yes" : "No"}</div>
          }
        </div>
      )}

    </div>
  );
};

export default MapComponent;