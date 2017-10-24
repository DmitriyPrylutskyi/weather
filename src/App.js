import React, { Component } from 'react';
import logo from './logo.svg';
//import "bootstrap/dist/css/bootstrap.css";
import "bootswatch/united/bootstrap.css";
import { Navbar, NavItem, Nav, Grid, Row, Col } from "react-bootstrap";
import './App.css';

const PLACES = [
    { name: "Kiev", id: "703448" },
    { name: "Odessa", id: "698740" },
    { name: "Mykolayiv", id: "700569" },
];

class App extends Component {
    constructor() {
        super();
        this.state = {
            activePlace: 0,
        };
    }

    render() {
        const activePlace = this.state.activePlace;
        return (
            <div>
                <Navbar>
                    <Navbar.Header>
                        <Navbar.Brand className="App-header">
                            <img src={logo} className="App-logo" alt="logo" />
                            React Simple Weather App
                        </Navbar.Brand>
                    </Navbar.Header>
                </Navbar>
                <Grid>
                    <Row>
                        <Col md={4} sm={4}>
                            <h3>Select a city</h3>
                            <Nav
                                bsStyle="pills"
                                stacked
                                activeKey={activePlace}
                                onSelect={index => {
                                    this.setState({ activePlace: index });
                                }}
                            >
                                {PLACES.map((place, index) => (
                                    <NavItem key={index} eventKey={index}>{place.name}</NavItem>
                                ))}
                            </Nav>
                        </Col>
                        <Col md={8} sm={8}>
                            <WeatherDisplay key={activePlace} id={PLACES[activePlace].id} />
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

class WeatherDisplay extends Component {
    constructor() {
        super();
        this.state = {
            weatherData: null,
            weatherDataForecast: null
        };
    }

    componentDidMount() {
        const id = this.props.id;
        const URL = "http://api.openweathermap.org/data/2.5/weather?id=" +
            id +
            "&appid=b1b35bba8b434a28a0be2a3e1071ae5b&units=metric";
        const URLforecast = "http://api.openweathermap.org/data/2.5/forecast/daily?id=" +
            id +
            "&appid=b1b35bba8b434a28a0be2a3e1071ae5b&units=metric&cnt=5";
        fetch(URL).then(res => res.json()).then(json => {
            this.setState({ weatherData: json });
        });
        fetch(URLforecast).then(res => res.json()).then(json => {
            this.setState({ weatherDataForecast: json });
        });
    }

    render() {
        const weatherData = this.state.weatherData;
        const weatherDataForecast = this.state.weatherDataForecast;
        if (!weatherData) return <div>Loading...</div>;
        const weather = weatherData.weather[0];
        const iconUrl = "http://openweathermap.org/img/w/" + weather.icon + ".png";
        if (!weatherDataForecast) return <div>Loading...</div>;
        const weatherForecast = weatherDataForecast.list;
        const currentTemp = Math.round(weatherData.main.temp);
        const currentWindSpeed = Math.round(weatherData.wind.speed);
        let dates = [];
        for (let i = 0; i < 5; i++) {
            let date = new Date(weatherForecast[i].dt*1000).toDateString();
            let iconForecast = "http://openweathermap.org/img/w/" + weatherForecast[i].weather[0].icon + ".png";
            let dayTemp = Math.round(weatherForecast[i].temp.day);
            let nightTemp = Math.round(weatherForecast[i].temp.night);
            let wind_speed = Math.round(weatherForecast[i].speed);
            dates.push(
                <h3>Date: {date}</h3>,
                <p>{weatherForecast[i].weather[0].main} <img src={iconForecast} alt={weatherForecast[i].weather.description} /></p>,
                <p>Temperature Day: {dayTemp}°&nbsp;</p>,
                <p>Temperature Night: {nightTemp}°&nbsp;</p>,
                <p>Wind Speed: {wind_speed} m/s</p>
            );
        }
        return (
            <div>
                <h1>
                    {weather.main} in {weatherData.name}
                    <img src={iconUrl} alt={weatherData.description} />
                </h1>
                <p>Current Temperature: {currentTemp}°&nbsp;</p>
                <p>Wind Speed: {currentWindSpeed} m/s</p>
                <h2>Forecast on 5 days</h2>
                {dates}
            </div>
        );
    }
}

export default App;
