import logo from './logo.svg';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid'
import './App.css';
import React from 'react';
import styleFunctionSx from '@mui/system/styleFunctionSx';

class App extends React.Component {
  constructor(props) {
    super(props); 
    this.state = {
      items: [], 
      DataisLoaded: false
    };
  }
  componentDidMount() {
    fetch("https://opentdb.com/api.php?amount=10")
        .then((res) => res.json())
        .then((json) => {
            this.setState({
                items: json.results,
                DataisLoaded: true
            });
        })
  }
  render() {
    const {DataisLoaded, items} = this.state; 
    if(!DataisLoaded) {return <div><h1>Please Wait...</h1></div>}
    else {
      console.log(items); 
      return (
        <div className="App">
          {items.map((item) => <TriviaCard key={item.question} item={item}/>)}
        </div>
      );
    }
  }
}

class TriviaCard extends React.Component {
  constructor(props) {
    super(props); 
    const correctAnswer = this.props.item.correct_answer; 
    let allAnswers = []; 
    let correctAnswerPosition = Math.floor(Math.random()*(this.props.item.incorrect_answers.length+1));
    for(let x = 0; x < (this.props.item.incorrect_answers.length-correctAnswerPosition); x++) {
      allAnswers.push(this.props.item.incorrect_answers[x]); 
    }
    allAnswers.push(correctAnswer); 
    for(let x = 0; x < (correctAnswerPosition); x++) {
      allAnswers.push(this.props.item.incorrect_answers[x+(this.props.item.incorrect_answers.length-correctAnswerPosition)]);
    }
    this.state = {disabled: false, correct: null, answers: allAnswers, correct: correctAnswer};
  }
  fix(string) {
    let newString = string; 
    //while(newString.includes('&quot;')) { 
      newString = newString.replace(/&quot;/g, '"'); 
    //}
    //while(newString.includes('&#039;')) {
    newString = newString.replace(/&#039;/g, "'"); 
    //}
    return newString;
  }
  render() {
    if(!this.state.disabled) {
      return(
        <div>
          <h3>{this.fix(this.props.item.question)}</h3>
          {this.state.answers.map((answer) => <Button variant="outlined" onClick={() => {
            if(answer == this.state.correct) {
              this.setState({disabled: true, correct:true});
              console.log("correct");
            }
            else {
              this.setState({disabled: true, correct:false});
              console.log("incorrect"); 
            }
          }}> {this.fix(answer)} </Button>)}
          <AnswerGrid answers={this.state.answers} />
        </div>
      );
    }
    else if(!this.state.correct) {
      return(
        <div>
          <h3 style={{color: "red"}}>{this.fix(this.props.item.question)}</h3>
          {this.state.answers.map((answer) => <Button variant="outlined" disabled> {this.fix(answer)} </Button>)}
        </div>
      );
    }
    else{
      return(
        <div>
          <h3 style={{color: 'green'}}>{this.fix(this.props.item.question)}</h3>
          {this.state.answers.map((answer) => <Button variant="outlined" disabled> {this.fix(answer)} </Button>)}
        </div>
      );
    }
  }
}

class AnswerGrid extends React.Component {
  render() {
  return(
    <Grid container spacing={2}>
  <Grid item xs={3}>
    <Button>{this.props.answers[0]}</Button>
  </Grid>
  <Grid item xs={3}>
    <Button>{this.props.answers[1]}</Button>
  </Grid>
  <Grid item xs={3}>
    <Button>{this.props.answers[2]}</Button>
  </Grid>
  <Grid item xs={3}>
    <Button variant="outlined">{this.props.answers[3]}</Button>
  </Grid>
    </Grid>
  );
  }
}

class TriviaButton extends React.Component {
  render() {
    return(
      <div>
        <Button variant="outlined"> {this.props.answer} </Button>
      </div>
    );
  }
}

export default App;
