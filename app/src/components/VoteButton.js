import React, { useContext, useEffect, useState } from "react";
import { DrizzleContext } from "@drizzle/react-plugin";


export default ({ answer, index, setStatus, account }) => {
    const { drizzle, drizzleState, initialized } = useContext(DrizzleContext.Context);

    const voteOnChain = async() => {
        const contract = drizzle.contracts.Voting;
        try {
            setStatus("Voting in progress...")
            await contract.methods["vote"](index).send({ 
                gas: 6000000,
                from: account
            });
            setStatus("Successfully voted!")
        } catch (err) {
            console.log(err.message);
            setStatus(err.message.replace("Returned error: VM Exception while processing transaction: revert ", ""))
        }
    }

    return (
        <span style={{display: "flex", flexDirection: "column", marginRight: "5px"}}>
            <span style={{display: "flex", alignSelf: "center"}}>{answer.count}</span>
            <button onClick={voteOnChain}>{answer.answer}</button>
        </span>
    )
}