import { Component } from 'react';
import TodayWeather from './TodayWeather';

class Weather extends Component {
  render() {
    return this.props.weather.map((location, idx) => {
      return (
        <TodayWeather
          description={location.description}
          date={location.date}
          key={idx}
        ></TodayWeather>
      );
    });
  }
}

export default Weather;
