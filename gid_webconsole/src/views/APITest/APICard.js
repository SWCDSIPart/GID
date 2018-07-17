import React, { Component } from 'react';
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    CardTitle,
    Col,
    Collapse,
    Form,
    FormGroup,
    Input,
    Label,
  } from 'reactstrap';

import axios from 'axios';

class APICard extends Component {
    constructor(props) {
      super(props);
  
      this.toggle = this.toggle.bind(this);
      this.reset = this.reset.bind(this);
      this.send = this.send.bind(this);

      this.queries = this.getQueries(props.info.uri);
  
      this.state = {
        collapse: true,
      };
    }

    toggle() {
        this.setState({ collapse: !this.state.collapse });
    }

    reset() {
      if(this._params) this._params.value = JSON.stringify(this.props.info.example, null, '\t');
      if(this._queries) this._queries.value = JSON.stringify(this.queries.data, null, '\t');
      if(this._result) {
        this._result.rows = 1;
        this._result.value = '';
      }
    }

    send() {
      const info = this.props.info;
      let uri = info.uri;
      
      if(this._queries) {
        const queries = JSON.parse(this._queries.value);
        Object.keys(queries).map(v => uri = uri.replace(`{${v}}`, queries[v]));
      }

      let option = {
        method: info.method,
        url: uri,
      };
      if(info.method === 'POST') {
        option = Object.assign(option, {
          data: JSON.parse(this._params.value),
        })
      }
      
      axios(option)
        .then((res) => {
          const str = JSON.stringify(res.data, null, '\t');
          this._result.rows = str.split(/\r\n|\r|\n/).length;
          this._result.value = str;
        })
    }

    getMethodColor(method) {
      if(method === 'POST') return 'success';
      else if(method === 'GET') return 'info';
      else if(method === 'DELETE') return 'danger';
      else return 'secondary';
    }

    getQueries(uri) {
      const queries = [];

      let splitUri = uri.split('{');
      while(splitUri.length > 1) {
        splitUri = splitUri[1].split('}');
        queries.push(splitUri[0]);
        splitUri = splitUri[1].split('{');
      }

      const result = {
        length: queries.length,
        data: {},
      };
      queries.map(v => result.data[v] = '')

      return result;
    }
  
    render() {
      const info = this.props.info;
      
      return (
        <div className="animated fadeIn">
          <Card className="text-white bg-primary">
            <a className="btn" data-target="#collapseCard" onClick={this.toggle}>
              <CardHeader>
                <CardTitle><Button color={this.getMethodColor(info.method)}>{info.method}</Button> {info.uri}</CardTitle>
                {info.description}
              </CardHeader>
            </a>
            <Collapse isOpen={this.state.collapse} id="collapseCard">
              <CardBody className="pb-0">
                <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                {
                  this.queries.length > 0 ? (
                    <FormGroup row>
                      <Col md="3">
                        <Label htmlFor="textarea-input">Queries</Label>
                      </Col>
                      <Col xs="12" md="9">
                        <Input innerRef={(ref) => this._queries = ref} type="textarea" name="textarea-input"
                          id="textarea-input" rows="3"
                          defaultValue={JSON.stringify(this.queries.data, null, '\t')} />
                      </Col>
                    </FormGroup>
                  ) : ''
                }
                {
                  info.method === 'POST' ? (
                    <FormGroup row>
                      <Col md="3">
                        <Label htmlFor="textarea-input">Params</Label>
                      </Col>
                      <Col xs="12" md="9">
                        <Input innerRef={(ref) => this._params = ref} type="textarea" name="textarea-input"
                          id="textarea-input" rows="8"
                          defaultValue={JSON.stringify(info.example, null, '\t')} />
                      </Col>
                    </FormGroup>
                  ) : ''
                }
                </Form>
              </CardBody>
            </Collapse>
            <CardFooter>
              <Button type="submit" size="sm" color="success" onClick={this.send}><i className="fa fa-dot-circle-o"></i> Send</Button>
              <Button type="reset" size="sm" color="danger" onClick={this.reset}><i className="fa fa-ban"></i> Reset</Button>    
              <Card>
                <CardHeader>Result</CardHeader>
                <CardBody>
                  <Input innerRef={(ref) => this._result = ref} type="textarea" name="textarea-res"
                    id="textarea-res" rows="1" disabled />
                </CardBody>
              </Card>
            </CardFooter>
          </Card>
        </div>
      );
    }
  }
  
  export default APICard;