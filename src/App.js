import React, { Component } from 'react';
import './App.css';

import openSocket from 'socket.io-client';
const  socket = openSocket('https://hfc2018red.herokuapp.com');

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: '',
      messages: [],
      threadId: undefined
    }

    socket.on('message', msg => {
      console.log('got message');
      /*
      if (this.state.loading === true) {
        return;
      }
      */

      window.fetch(`https://hfc2018red.herokuapp.com/threads/${window.location.hash.slice(1)}`)
        .then(res => {
          return res.json();
        }).then(json => {
          this.setState(Object.assign({}, this.state, {
            loading: false,
            threadId: json.length > 0 ? json[0].uuid : undefined,
            messages: json.length > 0 ? json[0].messages || [] : []
          }));
        });
    });

    if (window.location.hash) {
      this.state.loading = true;
      window.fetch(`https://hfc2018red.herokuapp.com/threads/${window.location.hash.slice(1)}`)
        .then(res => {
          return res.json();
        }).then(json => {
          this.setState(Object.assign({}, this.state, {
            loading: false,
            threadId: json.length > 0 ? json[0].uuid : undefined,
            messages: json.length > 0 ? json[0].messages || [] : []
          }));
        });
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    window.fetch('https://hfc2018red.herokuapp.com/message', {
      method: 'POST',
      body: JSON.stringify({
        body: this.state.message,
        threadId: this.state.threadId
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      return res.json();
    }).then(json => {
      if (!json) {
        console.log('bad json');
        return;
      }

      if (json.uuid) {
        window.location.hash = '#' + json.uuid;
      }
      this.setState(Object.assign({}, this.state, {
        messages: json.messages || [],
        message: '',
        threadId: json.uuid || undefined
      }));
    });
  }

  handleChange(e) {
    this.setState(Object.assign({}, this.state, {
      message: e.target.value
    }));
  }

  render() {
    return (
      <div className="container">
        {!this.state.loading && this.state.messages.length === 0 &&
          <div>
            <h1>Friends Helping Friends</h1>
              <div className="row margin-top-md">
                <div className="col-xs-12 col-lg-4">
                  <p>Hello, we're here to help!</p>

                  <p>Any questions you submit here will be answered by another Portlander who's been there and can help you find the resources you're looking for. They will reply to you within 24 hours.</p>

                  <p>(As always, if you're experiencing a medical or other emergency, please be safe and call 911.)</p>
                </div>
                <div className="col-xs-12 col-lg-8">
                  <h4>What can we help you find today?</h4>
                    <div>
                      <div className="margin-top-md">
                        <label>I need help with...</label><br/>
                        <input className="lrg-input" type="text" value={this.state.message} onChange={this.handleChange.bind(this)} />
                      </div>

                      <div className="margin-top-md">
                        <label for="location">Where are you located?</label><br/>
                        <input type="text" id="location" />
                      </div>
                      <div className="margin-top-md">
                        <label for="notification">How would you like us to reply to you?</label> &nbsp; &nbsp;
                        <select id="notification">
                          <option value="text">By text message</option>
                          <option value="email">By email</option>
                        </select>
                      </div>
                      <div className="margin-top-md">
                        <label for="location">What's your cell number or email address?</label><br/>
                        <input type="text" id="contact-method" />
                      </div>
                      <div className="margin-top-md">
                        <button onClick={this.handleSubmit.bind(this)} disabled={this.state.message.length === 0}>Send</button>
                      </div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>

  );
  }
}

export default App;
