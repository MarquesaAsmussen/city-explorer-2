import { Component } from 'react';
import { Container, ListGroup } from 'react-bootstrap';

class TodayWeather extends Component {
  render() {
    return (
      <Container id='renderedWeather'>
        <ListGroup>
          <ListGroup.Item>{this.props.description}</ListGroup.Item>
          <ListGroup.Item>{this.props.date}</ListGroup.Item>
        </ListGroup>
      </Container>
    );
  }
}

export default TodayWeather;
