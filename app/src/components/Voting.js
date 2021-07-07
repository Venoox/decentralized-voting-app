import React, { useContext, useEffect, useState } from "react";
import { DrizzleContext } from "@drizzle/react-plugin";
import VoteButton from "./VoteButton";

export default () => {
  const { drizzle, drizzleState, initialized } = useContext(DrizzleContext.Context);
  const [voting, setVoting] = useState({
    question: null,
    answers: null,
    startTimestamp: null,
    endTimestamp: null,
    votersCount: null,
  })
  const [status, setStatus] = useState("")

  useEffect(() => {
    if (initialized) {
      console.log(drizzle, drizzleState)
      const contract = drizzle.contracts.Voting;
      const question = contract.methods["question"].cacheCall();
      const answers = contract.methods["getAllAnswers"].cacheCall();
      const votersCount = contract.methods["votersCount"].cacheCall();
      const startTimestamp = contract.methods["startTimestamp"].cacheCall();
      const endTimestamp = contract.methods["endTimestamp"].cacheCall();
      setVoting({ answers, question, votersCount, startTimestamp, endTimestamp });
    }
  }, [initialized]);

  if (!initialized) {
    return "Loading..."
  }

  const { Voting } = drizzleState.contracts;
  const question = Voting.question[voting.question];
  const answers = Voting.getAllAnswers[voting.answers];
  const votersCount = Voting.votersCount[voting.votersCount];
  const startTimestamp = Voting.startTimestamp[voting.startTimestamp];
  const endTimestamp = Voting.endTimestamp[voting.endTimestamp];

  return (
    <div className="App">
      <div className="section">
        <h2>Voting</h2>
        <div>{question && question.value}</div>
        <div>Registered voter count: {votersCount && votersCount.value}</div>
        <div>Voting start at: {startTimestamp && new Date(startTimestamp.value*1000).toLocaleString()}</div>
        <div>Voting ends at: {endTimestamp && new Date(endTimestamp.value*1000).toLocaleString()}</div>
        <div style={{display: "flex"}}>{answers && answers.value.map((answer, index) => <VoteButton key={answer.answer} index={index} answer={answer} setStatus={setStatus}/>)}</div>
        <div>{status}</div>
      </div>
    </div>
  );
};
