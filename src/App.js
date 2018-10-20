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
        {this.state.messages.length === 0 &&
          <div>
            <label>I am looking for...</label>
            <input type="text" value={this.state.message} onChange={this.handleChange.bind(this)} />
            <button onClick={this.handleSubmit.bind(this)} disabled={this.state.message.length === 0}>Send</button>
          </div>
        }
        <ul>
        {this.state.messages.map(m => {
          return (
            <li>{m.body}</li>
          )
        })}
        </ul>
        {this.state.messages.length > 0 &&
          <div>
            <input type="text" value={this.state.message} onChange={this.handleChange.bind(this)} />
            <button onClick={this.handleSubmit.bind(this)} disabled={this.state.message.length === 0}>Send</button>
          </div>
        }
      </div>
    );
  }
}

export default App;
