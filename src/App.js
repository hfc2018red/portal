import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: '',
      messages: [],
      threadId: undefined
    }

    if (window.location.hash) {
      this.state.loading = true;
      window.fetch(`https://hfc2018red.herokuapp.com/threads/${window.location.hash.slice(1)}`)
        .then(res => {
          return res.json();
        }).then(json => {
          this.setState(Object.assign({}, this.state, {
            loading: false,
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
      <div>
        {!this.state.loading && this.state.messages.length === 0 &&
          <div>
            <label>I am looking for...</label>
            <input type="text" value={this.state.message} onChange={this.handleChange.bind(this)} />
            <button onClick={this.handleSubmit.bind(this)} disabled={this.state.message.length === 0}>Send</button>
          </div>
        }
        <ul>
        {!this.state.loading && this.state.messages.map(m => {
          return (
            <li>{m.body}</li>
          )
        })}
        </ul>
        {!this.state.loading && this.state.messages.length > 0 &&
          <div>
            <input type="text" value={this.state.message} onChange={this.handleChange.bind(this)} />
            <button onClick={this.handleSubmit.bind(this)} disabled={this.state.message.length === 0}>Send</button>
          </div>
        }
        {this.state.loading &&
            <div>loading...</div>
        }
      </div>
    );
  }
}

export default App;
