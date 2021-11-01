import React from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

class JokeListClassComponent extends React.Component {
     
    constructor(props){
        super(props);
        this.jokes = [];
    }

    async componentDidMount() {
       await this.makeAjaxRequest();
       this.setState({state: this.jokes});
    }

    makeAjaxRequestAgain = async () => {
        this.jokes = [];
        await this.makeAjaxRequest();
        this.setState({state: this.jokes});
    }

    makeAjaxRequest = async () => {
        let j = [...this.jokes];
        let seenJokes = new Set();
        try {
            while (j.length < this.props.length ) {
              let res = await axios.get("https://icanhazdadjoke.com", {
                headers: { Accept: "application/json" }
              });
              let { status, ...jokeObj } = res.data;
      
              if (!seenJokes.has(jokeObj.id)) {
                seenJokes.add(jokeObj.id);
                j.push({ ...jokeObj, votes: 0 });
              } else {
                console.error("duplicate found!");
              }
            }
        } catch (e) {
            console.log(e);
        }

        this.jokes = [...j];
    }
    
    vote = (id, delta) => {
        const votedJokes = this.jokes.map(j => (j.id === id ? { ...j, votes: j.votes + delta } : j));
        let sortedJokes = [...votedJokes].sort((a, b) => b.votes - a.votes);
        this.jokes = [...sortedJokes]
        this.setState({state: this.jokes});
    }

    render() {
        return (
            <div className="JokeList">
              <button className="JokeList-getmore" onClick={() => this.makeAjaxRequestAgain()}>
                Get New Jokes
              </button>
              {this.jokes.map(j => (
                <Joke text={j.joke} key={j.id} id={j.id} votes={j.votes} upVote={()=>this.vote(j.id, +1)} downVote={()=>this.vote(j.id, -1)} />
              ))}
            </div>
        );
    }
    
}

export default JokeListClassComponent;