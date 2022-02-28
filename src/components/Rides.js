/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Image } from "react-bootstrap";
import styles from "./Rides.module.css";

const InfoText = ({ label, value }) => {
  return (
    <p className={`${styles.infoTextLabel} ms-4 mb-0`}>
      {label}
      <span className="ps-1 text-white">{value}</span>
    </p>
  );
};

const Rides = ({ rides, rideType }) => {
  const [rideList, setRideList] = useState([]);

  useEffect(() => {
    let filteredRides = [...rides];
    if (rideType === "upcoming") {
      filteredRides = rides.filter((ride) => new Date(ride.date) > Date.now());
    } else if (rideType === "past") {
      filteredRides = rides.filter((ride) => new Date(ride.date) < Date.now());
    }
    setRideList(filteredRides);
  }, [rides]);

  return (
    <>
      {rideList.length === 0 && <p>No Rides Available</p>}
      {rideList.map((ride, i) => (
        <div key={ride.date} className={`${styles.rideList} ms-4 mb-2`}>
          <Image
            alt="loaction"
            style={{ height: 100 }}
            src={require("../assets/location.png")}
            thumbnail
          />
          <div className="ms-4">
            <InfoText label="Ride Id:" value={ride.id} />
            <InfoText
              label="Origin station:"
              value={ride.origin_station_code}
            />
            <InfoText label="Station_path:" value={ride.station_path} />
            <InfoText label="Date:" value={ride.date} />
            <InfoText label="Distance:" value={i} />
          </div>
          <div className={styles.placeWrapper}>
            <span className={`${styles.placeName} py-1 px-2 mx-2`}>
              {ride.city}
            </span>
            <span className={`${styles.placeName} py-1 px-2 mx-2`}>
              {ride.state}
            </span>
          </div>
        </div>
      ))}
    </>
  );
};

export default Rides;
