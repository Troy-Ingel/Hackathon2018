import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from 'material-ui/Drawer';
import Divider from 'material-ui/Divider';
import cookies from 'browser-cookies';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Card, { CardActions, CardContent, CardHeader } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import './App.css';

import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import Slide from 'material-ui/transitions/Slide';

import myths from './myths.json';
import defs from './mental.json';

const url = 'http://localhost:8080/';
var myHeaders = new Headers();
myHeaders.append('Content-Type', 'application/json');

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

const styles = {
  root: {
    flex: 1,
    width: '100%',
    height: '100%',
    flexDirection: 'column',
  },
  textField: {
    width: '100%'
  },
  card: {
    width: '60%',
  },
  leader: {
    width: '80%',
  }
};

const getRandomMyths = () => {
  return shuffleArray([...myths]).slice(0, 5);
}

const getRandomDefs = () => {
  return shuffleArray(
    defs.map(
      d => {
        const final = {};
        if(Math.round(Math.random()) === 0) {
          final.title = d.title;
          final.answer = d.description;
          final.options = shuffleArray([final.answer, ...shuffleArray(defs.filter(dd => dd.title !== d.title).map(dd => dd.description).slice(0,2))])
        } else {
          final.title = d.description;
          final.answer = d.title;
          final.options = shuffleArray([final.answer, ...shuffleArray(defs.filter(dd => dd.title !== d.title).map(dd => dd.title).slice(0,2))])
        }

        return final;
      }
    )
  ).slice(0,5);
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
    isPlaying: false,
    showingResults: false,
    open: false,
    score: 0,
    leaders: [],
    qs: []// shuffleArray([...getRandomMyths(), ...getRandomDefs()]).slice(0
  }

  componentWillReceiveProps(newProps) {
    if(newProps.showLeaders) {
      fetch(`${url}users`).then(res => res.json()).then(data => {
        console.log(data);
        this.setState({leaders: data});
      });
    }
  }



  remove = m => {
    const result = this.state.qs.filter(q => (q.question !== m.question || m.title !== q.title));
    if(result.length === 0) {
      if(cookies.get('userId')) {
        // fetch(`${url}user/${cookies.get('userId')}`).then(res => res.json()).then(data => {
        //   this.setState(data);
        // });
        const bodyData = {_id: cookies.get('userId'), latest_score: this.state.score};
        fetch(`${url}user/${cookies.get('userId')}`, {method: 'POST', headers: myHeaders, body: JSON.stringify(bodyData)}).then(response => response.json()).then(data => {
          console.log(data);
          this.setState(data);
        });
      }
      // fetch(`${url}users`).then(res => res.json()).then(data => {
      //   console.log(data);
      //   this.setState({leaders: data});
      // });
      this.props.do();
      this.setState({showingResults: true, isPlaying: false, open: true});
    }
    return result;
  }

  handleChange = e => {
    if(e && e.target) {
      this.setState({name: e.target.value});
    }
  }

  render() {
    const { classes } = this.props;

    if(this.props.showLeaders) {
      return (
        <div className="leaderboard">
          <Card className={classes.leader}>
            <CardHeader title="Leaderboard"/>
            <CardContent>
              <List>
                {
                  this.state.leaders.map(l => (
                    <ListItem>
                      <ListItemText primary={`${l.name}  -  ${l.latest_score}`} secondary={`Total improvement: ${(l.latest_score - l.first_score)/l.first_score*100}%`}/>
                    </ListItem>
                  ))
                }
              </List>
            </CardContent>
          </Card>
          <Dialog
            open={this.state.open}
            transition={Transition}
            keepMounted
            onClose={() => this.setState({open: false})}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle id="alert-dialog-slide-title">
              Congratulations! You scored {this.state.score} points! 🎉 🎉
            </DialogTitle>
              {
                cookies.get('userId') ? (
                  <div>
                    <DialogContent>
                      <DialogContentText id="alert-dialog-slide-description">
                        You improved by {(this.state.latest_score - this.state.first_score)/this.state.first_score * 100}% from your first time!
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={() => this.setState({open: false})} color="primary">
                        View Leaderboards
                      </Button>
                    </DialogActions>
                  </div>
                ) : (
                  <div>
                    <DialogContent>
                      <DialogContentText id="alert-dialog-slide-description">
                        Enter your name below to share you score with the world:
                      </DialogContentText>
                      <TextField
                        id="name"
                        className={classes.textField}
                        value={this.state.name}
                        onChange={this.handleChange}
                        margin="normal"
                      />
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={() => {
                          const bodyData = {name: this.state.name, first_score: this.state.score};
                          fetch(`${url}user`, {method: 'POST', headers: myHeaders, body: JSON.stringify(bodyData)}).then(response => response.json()).then(data => {
                            console.log(data);
                            cookies.set('userId', data._id);
                            this.setState({open: false});
                          })
                        }} color="primary">
                        Done
                      </Button>
                      <Button onClick={() => this.setState({open: false})} color="primary">
                        Cancel
                      </Button>
                    </DialogActions>
                  </div>
                  )
              }
          </Dialog>
        </div>
      )
    }

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
                      <CardHeader title="Myth or Fact?"/>
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
                      <CardHeader title={`Which of the options best matches "${m.title}"?`}/>
                      <CardContent>
                        <List>
                          {
                            m.options.map(option => (
                              <ListItem button onClick={() => {
                                  if(option === m.answer) {
                                    this.setState({score: this.state.score + 5});
                                  }
                                  this.setState({qs: this.remove(m)});
                                }}>
                                <ListItemText primary={option} />
                              </ListItem>
                            ))
                          }
                        </List>
                      </CardContent>
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
        <Button variant="raised" color="primary" onClick={() => this.setState({isPlaying: true, qs: shuffleArray([...getRandomMyths(), ...getRandomDefs()]), score: 0})}>Start</Button>
      </div>
    );
  }
}

export default withStyles(styles)(MainApp);
