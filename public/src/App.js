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

const url = 'http://localhost:8080/';

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
};

class App extends Component {
  state = {
    isOpen: false,
    name: ''
  }

  componentDidMount() {
    const userId = cookies.get('userId');

    fetch(`${url}user/${userId}`).then(function(response) {
      return response.json();
    })
    .then(function(user) {
      this.setState(user);
    });
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <AppBar position="static">
        <Toolbar>
          <Typography variant="title" color="inherit" className={classes.flex}>
            Title
          </Typography>
          {this.state.name}
        </Toolbar>
      </AppBar>
              <MainApp/>
      </div>
    );
  }
}

export default withStyles(styles)(App);
