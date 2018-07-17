import React, { Component } from 'react';
import {
  Col,
  Row,
} from 'reactstrap';

import APICard from './APICard';

const host = 'http://219.254.222.217:23000';

class APITest extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.onRadioBtnClick = this.onRadioBtnClick.bind(this);

    this.state = {
      dropdownOpen: false,
      radioSelected: 2,
    };
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
    });
  }

  onRadioBtnClick(radioSelected) {
    this.setState({
      radioSelected: radioSelected,
    });
  }

  render() {

    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" sm="12" lg="6">
            <APICard info={{
              method: 'POST',
              host: host,
              uri: '/gid',
              description: 'Create a new GID object',
              example: {
                "gid": "",
                "type": "person",
                "parent": "parent",
                "children": [],
                "key": "key",
                "metadata": {}
              },
            }} />
          </Col>
          <Col>
            <APICard info={{
              method: 'GET',
              host: host,
              uri: '/gid/{GID}',
              description: 'Query object by GID',
            }} />
          </Col>
        </Row>
        <Row>
          <Col xs="12" sm="12" lg="6">
            <APICard info={{
              method: 'POST',
              host: host,
              uri: '/gid/{GID}',
              description: 'Updates GID object data',
              example: {
                "gid": "8e29d8973bad4b51b12510ba9a754697",
                "type": "person",
                "parent": "parent",
                "children": [],
                "key": "key",
                "metadata": {}
              },
            }} />
          </Col>
          <Col>
            <APICard info={{
              method: 'DELETE',
              host: host,
              uri: '/gid/{GID}',
              description: 'Deletes specified GID object',
            }} />
          </Col>
        </Row>
        <Row>
          <Col xs="12" sm="12" lg="6">
            <APICard info={{
              method: 'GET',
              host: host,
              uri: '/gid/{GID}/parent',
              description: 'Returns parent GID object of specified GID',
            }} />
          </Col>
          <Col>
            <APICard info={{
              method: 'POST',
              host: host,
              uri: '/gid/{GID}/parent',
              description: 'Set parent of designated GID',
              example: {
                "parent": "newparent"
              },
            }} />
          </Col>
        </Row>
        <Row>
          <Col xs="12" sm="12" lg="6">
            <APICard info={{
              method: 'GET',
              host: host,
              uri: '/gid/{GID}/children',
              description: 'Returns all child GID list of specified GID',
            }} />
          </Col>
          <Col>
            <APICard info={{
              method: 'GET',
              host: host,
              uri: '/gid/{GID}/devices',
              description: 'Returns all child device GID list of specified GID',
            }} />
          </Col>
        </Row>
      </div>
    );
  }
}

export default APITest;
