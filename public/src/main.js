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
import Snackbar from 'material-ui/Snackbar';
import CloseIcon from '@material-ui/icons/Close';
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

export const url = 'http://10.0.0.193:8080/';
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
  },
  mine: {
    background: 'rgba(63, 81, 181, 0.3)'
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
                  this.state.leaders.sort((a,b) => b.latest_score - a.latest_score).map(l => (
                    <ListItem className={l._id === this.state._id ? classes.mine : undefined}>
                      <ListItemText primary={`${l.name}  -  ${l.latest_score}`} secondary={`Total improvement: ${Math.max(Math.round((l.latest_score - l.first_score)/(parseInt(l.first_score) || 1)*100), 0)}%`}/>
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
                        You improved by {Math.max(Math.round((this.state.latest_score - this.state.first_score)/(parseInt(this.state.first_score) || 1) * 100), 0)}% from your first time!
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
                            this.props.do();
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
          <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={this.state.s}
          autoHideDuration={1000}
          onClose={() => this.setState({s: false})}
          SnackbarContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">Correct! 🎉</span>}
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              className={classes.close}
              onClick={() => this.setState({s: false})}
            >
              <CloseIcon />
            </IconButton>,
          ]}
          />
          <Dialog
            open={this.state.d}
            transition={Transition}
            keepMounted
            onClose={() => this.setState({d: false})}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle id="alert-dialog-slide-title">
              {this.state.d && this.state.d.title}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                {this.state.d && this.state.d.sub}
                <br />
                <br />
                {this.state.d && this.state.d.ans}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => this.setState({d: false})} color="primary">
                Continue
              </Button>
            </DialogActions>
          </Dialog>
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
                            if(m.type === "fact") {
                              this.setState({s: true, score: this.state.score + 5});
                            } else {
                              this.setState({d: {title: 'That was actually a myth!', sub: 'The fact is:', ans: myths.find(my => my.id === m.id && my.type === 'fact').question}});
                            }
                            this.setState({qs: this.remove(m)});
                          }}>Fact</Button>
                        <Button variant="raised" color="secondary" size="small" onClick={() => {
                            if(m.type === "myth") this.setState({s:true, score: this.state.score + 5});
                            else {
                              this.setState({d: {title: 'That was actually a fact!', sub: 'Here it is again:', ans: m.question}});
                            }
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
                                    this.setState({s: true, score: this.state.score + 5});
                                  } else {
                                    this.setState({d: {title: "Oops, that wasn't quite right", sub: 'The right answer was:', ans: m.answer}});
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
        {
          !this.state.name ? (
            <div className="asdd">
              <h1>Welcome!</h1>
              <h3>To start, click the button below.</h3>
              <Button variant="raised" color="primary" onClick={() => this.setState({d: false, s:false, isPlaying: true, qs: shuffleArray([...getRandomMyths(), ...getRandomDefs()]), score: 0})}>Start</Button>
            </div>
          ) : (
            <div className="asdd">
              <h1>Welcome back, {this.state.name}!</h1>
              <h3>Your latest score is {this.state.latest_score}! Feel like beating it?</h3>
              <Button variant="raised" color="primary" onClick={() => this.setState({d: false, s:false, isPlaying: true, qs: shuffleArray([...getRandomMyths(), ...getRandomDefs()]), score: 0})}>Let's do it</Button>
            </div>
          )
        }
      </div>
    );
  }
}

export default withStyles(styles)(MainApp);
