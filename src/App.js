import React from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Component } from 'react';
import { Container, Form, Toast } from 'react-bootstrap';
import './App.css';
import Weather from './components/Weather';

const SERVER = process.env.REACT_APP_BACKEND_URL;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: '',
      location: [],
      error: false,
      errorMessage: '',
      image: '',
      weather: [],
      weatherError: '',
      movie: [],
      movieError: '',
    };
  }

  getLocation = async e => {
    e.preventDefault();

    const url = `https://us1.locationiq.com/v1/search.php?key=${process.env.REACT_APP_locationiq_api_key}&q=${this.state.searchQuery}&format=json`;

    const locationArray = [];

    try {
      const response = await axios.get(url);

      for (const locationData of response.data) {
        locationArray.push({
          place_id: locationData.place_id,
          display_name: locationData.display_name,
          lat: locationData.lat,
          lon: locationData.lon,
          map: `https://maps.locationiq.com/v3/staticmap?key=${process.env.REACT_APP_locationiq_api_key}&center=${locationData.lat},${locationData.lon}&zoom=9`,
        });
      }

      this.setState({
        location: [...locationArray],
        error: false,
      });
    } catch (error) {
      console.error('Unable to find city', this.state.searchQuery);

      this.setState({
        error: true,
        errorMessage: error.response.status + ': ' + error.response.data.error,
      });
    }
  };

  getWeather = async searchQuery => {
    // check this url
    const server = `${SERVER}/weather?searchQuery=${searchQuery}&lat=${this.state.location.lat}&lon=${this.state.location.lon}`;

    try {
      const response = await axios.get(server);
      this.setState({ weather: response.data });
    } catch (error) {
      this.setState({ weatherError: true });
    }
  };

  // }

  handleClose = () => {
    this.setState({ error: false });
  };

  render() {
    return (
      <>
        <Form onSubmit={this.getLocation}>
          <input
            onChange={event =>
              this.setState({ searchQuery: event.target.value })
            }
            placeholder='search for a city'
          ></input>
          <button type='submit'>Explore!</button>
        </Form>
        <Toast onClose={this.handleClose}>
          {this.state.error && (
            <>
              <Toast.Header>
                <strong className='me-auto'>Bootstrap</strong>
              </Toast.Header>
              <Toast.Body>
                <h2>Oops! That city couldn't be found.</h2>
                <p>{this.state.errorMessage}</p>
              </Toast.Body>
            </>
          )}
        </Toast>
        <Container id='map' fluid='sm'>
          {this.state.location.length > 0 && (
            <>
              <Container id='mapText'>
                <h2>The city is: {this.state.location[0].display_name}</h2>
                <h3>latitude: {this.state.location[0].lat}</h3>
                <h3>longitude: {this.state.location[0].lon}</h3>
              </Container>
              <img src={this.state.location[0].map} alt='map of city' />
            </>
          )}
        </Container>
        <Weather weather={this.state.weather} />
      </>
    );
  }
}

export default App;
