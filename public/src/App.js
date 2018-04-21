import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from 'material-ui/Drawer';
import List from 'material-ui/List';
import Divider from 'material-ui/Divider';
import cookies from 'browser-cookies';
import MainApp from './main';
import Icon from 'material-ui/Icon';
import './App.css';

import {url} from './main';
// const url = 'http://localhost:8080/';

const styles = {
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  list: {
    width: 250,
  },
  btn: {
    color: 'white'
  }
};

class App extends Component {
  state = {
    isOpen: false,
    name: '',
    l: false
  }

  componentDidMount() {
    const userId = cookies.get('userId');

    if(userId) {
      fetch(`${url}user/${userId}`).then(function(response) {
        return response.json();
      })
      .then(user => {
        this.setState(user);
      });
    }
  }

  showLeaders = () => {
    this.setState({l : true});
    const userId = cookies.get('userId');

    if(userId) {
      fetch(`${url}user/${userId}`).then(function(response) {
        return response.json();
      })
      .then(user => {
        this.setState(user);
      });
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <AppBar position="static">
        <Toolbar>
          <Typography variant="title" color="inherit" className={classes.flex}>
            The more you know 🌈
          </Typography>
          {this.state.name}
          <Button className={classes.btn} onClick={() => this.setState({l: !this.state.l})}>{this.state.l ? 'Back' : 'Leaderboards'}</Button>
        </Toolbar>
      </AppBar>
              <MainApp showLeaders={this.state.l} do={this.showLeaders}/>
      </div>
    );
  }
}

export default withStyles(styles)(App);
