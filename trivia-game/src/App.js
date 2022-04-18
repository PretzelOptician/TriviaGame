import logo from './logo.svg';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid'
import './App.css';
import React from 'react';

class App extends React.Component {
  constructor(props) {
    super(props); 
    this.state = {
      items: [], 
      DataisLoaded: false,
      incorrectScore: 0, 
      correctScore: 0,
    };
  }
  componentDidMount() {
    fetch("https://opentdb.com/api.php?amount=20")
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
        <div className="App" style={{display: "flex", backgroundColor: '#D3D3D3'}}>
          <StatsCard correctScore={this.state.correctScore} incorrectScore={this.state.incorrectScore} />
          <TriviaGrid items={items} correct={this.state.correctScore} correctCounter={() => this.setState({correctScore: this.state.correctScore+1})} incorrect={this.state.incorrectScore} incorrectCounter={() => this.setState({incorrectScore: this.state.incorrectScore+1})}/>
        </div>
      );
    }
  }
}

class TriviaGrid extends React.Component {
  render() {
    return(
      <div>
        {this.props.items.map((item) => <TriviaCard key={item.question} item={item} correctCounter={() => this.props.correctCounter()} incorrectCounter={() => this.props.incorrectCounter()}/>)}
      </div>
    );
  }
}

class StatsCard extends React.Component {
  render() {
    let percent = 0; 
    if(this.props.incorrectScore > 0) {
      percent = this.props.correctScore*100/(this.props.incorrectScore+this.props.correctScore);
    }
    return ( 
      <div style={{borderRight: "dotted", borderWidth: "6px", width: "300px", backgroundColor: "#daf0e3", padding: "6px"}}>
        <h1 style={{fontFamily: "Courier New, monospace"}}>Statistics</h1>
        <h5>Questions Correct: {this.props.correctScore}</h5>
        <h5>Questions Incorrect: {this.props.incorrectScore} </h5>
        <h5>Percentage: {percent}%</h5>
      </div>
    );
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
    newString = newString.replace(/&quot;/g, '"'); 
    newString = newString.replace(/&#039;/g, "'"); 
    return newString;
  }
  render() {
    const divStyle = {
      padding: "10px", 
      margin: "23px", 
      marginLeft: "30px",
      borderLeft: "solid", 
      borderColor: "lightblue", 
      borderWidth: "6px", 
      backgroundColor: "white",
    }
    const buttonStyle = {
      margin: "5px",
    }
    if(!this.state.disabled) {
      return(
        <div style={divStyle}>
          <h3>{this.fix(this.props.item.question)}</h3>
          {this.state.answers.map((answer) => <Button style={buttonStyle} variant="outlined" onClick={() => {
            if(answer == this.state.correct) {
              this.setState({disabled: true, correct:true});
              this.props.correctCounter(); 
              console.log("correct");
            }
            else {
              this.setState({disabled: true, correct:false});
              this.props.incorrectCounter(); 
              console.log("incorrect"); 
            }
          }}> {this.fix(answer)} </Button>)}
        </div>
      );
    }
    else if(!this.state.correct) {
      return(
        <div style={divStyle}>
          <h3 style={{color: "red"}}>{this.fix(this.props.item.question)}</h3>
          {this.state.answers.map((answer) => <Button style={buttonStyle} variant="outlined" disabled> {this.fix(answer)} </Button>)}
        </div>
      );
    }
    else{
      return(
        <div style={divStyle}>
          <h3 style={{color: 'green'}}>{this.fix(this.props.item.question)}</h3>
          {this.state.answers.map((answer) => <Button style={buttonStyle} variant="outlined" disabled> {this.fix(answer)} </Button>)}
        </div>
      );
    }
  }
}


export default App;
