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
import Card, { CardActions, CardContent, CardHeader } from 'material-ui/Card';
import './App.css';

import myths from './myths.json';

const styles = {
  root: {
    flex: 1,
    width: '100%',
    height: '100%',
    flexDirection: 'column',
  },
  card: {
    width: '60%',
  }
};

const getRandomMyths = () => {
  return shuffleArray([...myths]).slice(0, 5);
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

class MainApp extends React.Component {
  state = {
    isPlaying: true,
    score: 0,
    qs: getRandomMyths()
  }



  remove = m => {
    console.log(m);
    return this.state.qs.filter(q => q.question !== m.question);
  }

  render() {
    const { classes } = this.props;

    if(this.state.isPlaying) {
      return (
        <div className="main playing">
          <h2>Current Score: {this.state.score}. Keep it up!</h2>
          {
            this.state.qs.map(m => {
              if(m.question) {
                return (
                  <div className='pCard'>
                    <Card className={classes.card}>
                      <CardHeader title="Myth or Fact"/>
                      <CardContent>
                        {m.question}
                      </CardContent>
                      <CardActions>
                        <Button variant="raised" color="primary" size="small" onClick={() => {
                            if(m.type === "fact") this.setState({score: this.state.score + 5});
                            this.setState({qs: this.remove(m)});
                          }}>Fact</Button>
                        <Button variant="raised" color="secondary" size="small" onClick={() => {
                            if(m.type === "myth") this.setState({score: this.state.score + 5});
                            this.setState({qs: this.remove(m)});
                          }}>Myth</Button>
                      </CardActions>
                    </Card>
                  </div>
                )
              } else {
                return (
                  <div className='pCard'>
                    <Card className={classes.card}>
                      <CardHeader title="Myth or Fact"/>
                      <CardContent>
                        Placeholder
                      </CardContent>
                      <CardActions>
                        <Button variant="raised" color="primary" size="small" onClick={() => {
                            if(m.type === "fact") this.setState({score: this.state.score + 5});
                            this.setState({qs: this.remove(m)});
                          }}>Fact</Button>
                        <Button variant="raised" color="secondary" size="small" onClick={() => {
                            if(m.type === "myth") this.setState({score: this.state.score + 5});
                            this.setState({qs: this.remove(m)});
                          }}>Myth</Button>
                      </CardActions>
                    </Card>
                  </div>
                )
              }})
          }
        </div>
      )
    }

    return (
      <div className="main">
        <h1>Welcome!</h1>
        <h3>To start, click the button below.</h3>
        <Button variant="raised" color="primary" onClick={() => this.setState({isPlaying: true, qs: getRandomMyths()})}>Start</Button>
      </div>
    );
  }
}

export default withStyles(styles)(MainApp);
