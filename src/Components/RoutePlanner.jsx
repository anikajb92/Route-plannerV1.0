import { useState } from "react";
import LegContainer from "./LegContainer";
import { DirectionsService, useJsApiLoader } from "@react-google-maps/api";
import Button from "@mui/material/Button";
import Input from "@mui/material/Input";

// formatLeg is a here to help parse through the repsonse we get back from DirectionServices Component
// If you need more data fill it out below and it will be taken from the repsonse
const formatLeg = (leg, index) => {
  return {
    distance: leg.distance.text,
    time: leg.duration.text,
    address: leg.end_address,
    index,
  };
};

// below is test data that can be placed into the response state to make sure things fit in that containter.
// using this will aviod unnecessary api call to.
const testData = [
  {
    distance: 57,
    time: "1 hr 20 mins",
    address: "100 El Camino Real Belmont, CA 94002",
  },
  {
    distance: 57,
    time: "1 hr 20 mins",
    address: "100 El Camino Real Belmont, CA 94002",
  },
  {
    distance: 57,
    time: "1 hr 20 mins",
    address: "100 El Camino Real Belmont, CA 94002",
  },
  {
    distance: 57,
    time: "1 hr 20 mins",
    address: "100 El Camino Real Belmont, CA 94002",
  },
  {
    distance: 57,
    time: "1 hr 20 mins",
    address: "100 El Camino Real Belmont, CA 94002",
  },
  {
    distance: 57,
    time: "1 hr 20 mins",
    address: "100 El Camino Real Belmont, CA 94002",
  },
  {
    distance: 57,
    time: "1 hr 20 mins",
    address: "100 El Camino Real Belmont, CA 94002",
  },
];

const RoutePlanner = () => {
  const [origin, setOrigin] = useState("");
  const [currentDestination, setCurrentDestination] = useState("");
  const [waypoints, setWayPoints] = useState([]);
  const [waypointCount, setwaypointCount] = useState(0);
  const [directionServiceOptions, setDirectionServiceOptions] = useState();
  const [response, setResponse] = useState();

  // useJsApiLoader is how the directionsService Component cn call to the @react-google-maps/api
  // you have to use it in this format. put some logic in to show that is loaded is true and it will run to give you a response
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: "key",
  });

  //this function will update the wayPoints array
  //the wayPoints array is sent through to the api and it is what stops we have to take between out origin and destination
  const addDestination = (dest) => {
    dest.length > 1 && waypoints.push({ location: dest });
    setWayPoints(waypoints);
  };

  // creating a date and formatting it to month / day / year
  // slicing the day of week off of the response if you want the day start at index 0
  const date = Date().toString().slice(3, 15);

  return (
    <div className="RoutePlannerContainer">
      <div className="todayStopContainer">
        <span className="todayStopTitle">Number of Stops Today: {date}</span>
        <span className="todayStopTitle">{waypointCount}</span>
      </div>
      <Input
        placeholder="Origin"
        onChange={(e) => setOrigin(e.target.value)}
        value={origin}
        className="inputContainer"
      />
      <div className="destinationContainer">
        <Input
          placeholder="Destination"
          onChange={(e) => setCurrentDestination(e.target.value)}
          value={currentDestination}
          className="inputContainer"
        />
      </div>
      <Button
        onClick={() => {
          addDestination(currentDestination);
          setwaypointCount(waypoints.length);
          setCurrentDestination("");
        }}
      >
        Add Destination
      </Button>
      <Button
        onClick={() => {
          const directionsInfo = {
            origin,
            destination: origin,
            travelMode: "DRIVING",
            // way points takes an array of objects they object must have the key of location
            waypoints,
            // optimizeWayPoints will give you the most efficient route through the way points if it is set to true
            optimizeWaypoints: true,
            provideRouteAlternatives: false,
            avoidFerries: true,
            avoidHighways: false,
            avoidTolls: false,
          };
          setDirectionServiceOptions(directionsInfo);
          setOrigin("");
        }}
      >
        Plan Route
      </Button>
      <Button
        onClick={() => {
          setResponse();
          setWayPoints([]);
          setCurrentDestination("");
          setwaypointCount(0);
          setDirectionServiceOptions();
        }}
      >
        Clear
      </Button>

      {isLoaded && !!directionServiceOptions && !response && (
        <DirectionsService
          options={directionServiceOptions}
          callback={(res) => {
            setResponse(
              // accessing the needed data from the response
              // index is used to keep track of how many stops have been requested.
              res.routes[0].legs.map((leg, index) => formatLeg(leg, index))
            );
          }}
        />
      )}
      {response && <LegContainer legs={response} />}
    </div>
  );
};

export default RoutePlanner;
