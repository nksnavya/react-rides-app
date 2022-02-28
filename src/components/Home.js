/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import {
  Container,
  Navbar,
  Image,
  Tabs,
  Tab,
  Button,
  OverlayTrigger,
  Popover,
  Form,
} from "react-bootstrap";
import Rides from "./Rides";
import styles from "./Home.module.css";

export default function Home() {
  const [cityList, setCityList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [user, setUser] = useState({});
  const [ridesList, setRidesList] = useState([]);
  const [originalRides, setOriginalRides] = useState([]);
  const [filterList, setFilterList] = useState({
    state: "",
    city: "",
  });

  useEffect(() => {
    function fetchData() {
      // Note: getting CORS error for API's so reading the data from json files
      // const userRes = await fetch('https://assessment.api.vweb.app/user');
      // const userInfo =  userRes.json()
      const ridesRes = require("../data/rides.json");
      const userRes = require("../data/user.json");
      const states = ridesRes.map((rider) => rider.state);
      const statesList = Array.from(new Set(states));
      setStateList(statesList);
      setUser(userRes);
      setRidesList(ridesRes);
      setOriginalRides(ridesRes);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (ridesList.length > 0) {
      let filteredList = [...originalRides];
      if (filterList.state) {
        filteredList = filteredList.filter(
          (ride) => ride.state === filterList.state
        );
      }
      if (filterList.city) {
        filteredList = filteredList.filter(
          (ride) => ride.city === filterList.city
        );
      }
      setRidesList(filteredList);
    }
  }, [filterList]);

  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    console.log(selectedState);
    setFilterList({ ...filterList, state: selectedState, city: "" });
    if (selectedState) {
      const filteredCityList = originalRides.filter(
        (ride) => ride.state === selectedState
      );
      setCityList(filteredCityList);
    }
  };

  const handleCityChange = (e) => {
    const selectedCity = e.target.value;
    console.log(selectedCity);
    setFilterList({ ...filterList, city: selectedCity });
  };

  const ridesFilter = (
    <Popover id="filter-menu">
      <Popover.Header as="h3">Filters</Popover.Header>
      <Popover.Body>
        <Form.Select value={filterList.state} onChange={handleStateChange}>
          <option value="">Select State</option>
          {stateList.map((state, i) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </Form.Select>
        <Form.Select
          value={filterList.city}
          onChange={handleCityChange}
          className="mt-2"
        >
          <option value="">Select City</option>
          {cityList.map((ride, i) => (
            <option key={`city+${i}`} value={ride.city}>
              {ride.city}
            </option>
          ))}
        </Form.Select>
      </Popover.Body>
    </Popover>
  );

  return (
    <main className="main-container">
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#home">Edvora</Navbar.Brand>
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>{user.name}</Navbar.Text>
            <Image
              fluid
              roundedCircle
              className={`${styles.userIcon} ms-3`}
              src={user.url}
            />
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <OverlayTrigger trigger="click" placement="bottom" overlay={ridesFilter}>
        <Button variant="secondary" className={styles.filterButton}>
          <Image src={require("../assets/filter.png")} fluid className="pe-2" />
          Filter
        </Button>
      </OverlayTrigger>
      <Tabs defaultActiveKey="nearest" id="rides-tab" className="mb-3">
        <Tab eventKey="nearest" title="Nearest rides">
          <Rides rides={ridesList} />
        </Tab>
        <Tab eventKey="upcoming" title="upcoming rides">
          <Rides rides={ridesList} rideType="upcoming" />
        </Tab>
        <Tab eventKey="past" title="past rides">
          <Rides rides={ridesList} rideType="past" />
        </Tab>
      </Tabs>
    </main>
  );
}
