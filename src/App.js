import React from 'react';
import axios from 'axios';
import { Component } from 'react';
import { Container, Form } from 'react-bootstrap';
import './App.css';

require('dotenv').config();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: '',
      location: [],
      error: false,
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

      this.setState({ error: true });
    }
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
        {this.state.error && <h2>Oops!</h2>}
      </>
    );
  }
}

export default App;
