/* global BigInt */
import React, { useContext, useEffect, useState } from "react";
import { DrizzleContext } from "@drizzle/react-plugin";
import { AddressTranslator } from 'nervos-godwoken-integration';
import VoteButton from "./VoteButton";
import CompiledContractArtifact from '../ERC20/ERC20.json';

const addressTranslator = new AddressTranslator();
const SUDT_PROXY_CONTRACT_ADDRESS = '0x663C3716AD9AE3B08D444DD720AA196B8B45e60b';

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
  const [ethAddress, setEthAddress] = useState("")
  const [balance, setBalance] = useState(null)
  const [depositAddress, setDepositAddress] = useState("")
  const [SUDTBalance, setSUDTBalance] = useState(null)

  const polyjuiceAddress = ethAddress ? addressTranslator.ethAddressToGodwokenShortAddress(ethAddress) : "";

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
      connect();
    }
  }, [initialized]);

  useEffect(() => {
    if (ethAddress) {
      getLayer2DepositAddress();
      const id = setInterval(getBalance, 5000);
      return () => clearInterval(id);
    }
  }, [ethAddress]);

  async function getBalance() {
    if (ethAddress && polyjuiceAddress) {
      const balance = BigInt(await drizzle.web3.eth.getBalance(ethAddress));
      setBalance(balance)
      
      const contract = new drizzle.web3.eth.Contract(CompiledContractArtifact.abi, SUDT_PROXY_CONTRACT_ADDRESS);
      const SUDT = await contract.methods.balanceOf(polyjuiceAddress).call({
        from: ethAddress
      })
      setSUDTBalance(BigInt(SUDT));
    }
  }

  async function getLayer2DepositAddress() {
    const deposit = await addressTranslator.getLayer2DepositAddress(drizzle.web3, ethAddress)
    setDepositAddress(deposit.addressString);
  }

  async function connect() {
    if (typeof window.ethereum !== 'undefined') {
      console.log('MetaMask is installed!');
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        setEthAddress(window.ethereum.selectedAddress)
      } catch(err) {
        window.alert("Error connecting to the wallet, please refresh")
        console.log(err)
      }
    }
  }

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
      <div className="section" style={{lineBreak: "anywhere"}}>
        <h2>Voting</h2>
        <div>ETH address: {ethAddress}</div>
        <div>Polyjuice address: {polyjuiceAddress}</div>
        <div>L2 Balance: {balance ? (Number(balance) / 10 ** 8).toString() : ""} CKB</div>
        <br />
        <div>
          <div>Deposit address: {depositAddress}</div>
          <a href={`https://force-bridge-test.ckbapp.dev/bridge/Ethereum/Nervos?xchain-asset=0x0000000000000000000000000000000000000000&recipient=${depositAddress ? depositAddress : ""}`}>
            Click here to use Force Bridge to deposit to Layer 2 
          </a>
          <div>ckETH balance: {SUDTBalance ? (Number(SUDTBalance) / 10 ** 18).toString() : ""} ckETH</div>
        </div>
        <br />
        <div>{question && question.value}</div>
        <div>Registered voter count: {votersCount && votersCount.value}</div>
        <div>Voting start at: {startTimestamp && new Date(startTimestamp.value*1000).toLocaleString()}</div>
        <div>Voting ends at: {endTimestamp && new Date(endTimestamp.value*1000).toLocaleString()}</div>
        <div style={{display: "flex"}}>{answers && answers.value.map((answer, index) => <VoteButton key={answer.answer} index={index} answer={answer} setStatus={setStatus} account={ethAddress}/>)}</div>
        <div>{status}</div>
      </div>
    </div>
  );
};
