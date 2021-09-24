import React from 'react';
import axios from 'axios';
import { Component } from 'react';
import { Form } from 'react-bootstrap';

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

    console.log(url);

    try {
      const response = await axios.get(url);
      console.log(response);

      for (const locationData of response.data) {
        this.state.location.push({
          place_id: locationData.place_id,
          display_name: locationData.display_name,
          lat: locationData.lat,
          lon: locationData.lon,
        });
      }

      console.log(this.state.location);

      this.setState({
        location: [...this.state.location],
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
        {this.state.location.length > 0 && (
          <>
            <h2>The city is: {this.state.location[0].display_name}</h2>
            <h3>The latitude is: {this.state.location[0].lat}</h3>
            <h3>The longitude is: {this.state.location[0].lon}</h3>
          </>
        )}

        {this.state.error && <h2>Oops!</h2>}
      </>
    );
  }
}

export default App;
