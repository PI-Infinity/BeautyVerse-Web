import React from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { useSelector } from "react-redux";

function Map(props) {
  // import current user from redux state
  const userUnparsed = useSelector((state) => state.storeMain.user);

  let user;
  if (userUnparsed?.length > 0) {
    user = JSON.parse(userUnparsed);
  }

  // define mobile or desktop

  const [width, setWidth] = React.useState(window.innerWidth);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }
  React.useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  const isMobile = width <= 768;

  let containerStyle;
  if (isMobile) {
    containerStyle = {
      width: "90vw",
      height: "50vw",
    };
  } else {
    containerStyle = {
      width: "35vw",
      height: "20vw",
    };
  }

  let center = {
    lat: parseFloat(props?.latitude?.toFixed(7)),
    lng: parseFloat(props?.longitude?.toFixed(7)),
  };
  //
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyA61_a1cztE7_ygTRUdET6qN62cnYrOMvY",
  });

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={16}
      options={{
        zoomControl: false,
        streerViewControl: false,
        mapTypeControl: false,
        fullScreenControl: false,
      }}
    >
      <Marker
        position={{
          lat: center.lat,
          lng: center.lng,
        }}
      />
    </GoogleMap>
  ) : (
    <></>
  );
}

export default React.memo(Map);
