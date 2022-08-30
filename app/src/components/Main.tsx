import React, { useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";
import { Program, AnchorProvider, web3, Idl, BN } from "@project-serum/anchor";
import { useState } from "react";
import { Box, Container, Grid } from "@mui/material";

import idl from "../idl.json";
import Navbar from "./Navbar";
import VoteOption from "./VoteOption";
import VoteTally from "./VoteTally";
import Footer from "./Footer";
import Intro from "./Intro";
import { useSnackbar } from "notistack";
import VoteHistory from "./VoteHistory";
import { preflightCommitment, programID, capitalize } from "../utils";

interface IMain {
  voteAccount: any;
  voteAccountBump: any;
  network: any;
}

interface IVoteAccount {
  crunchy: number;
  smooth: number;
}

export default function Main({ voteAccount, voteAccountBump, network }: IMain) {
  const { enqueueSnackbar } = useSnackbar();
  const { publicKey, signTransaction, signAllTransactions, wallet } =
    useWallet();
  const signerWallet = {
    publicKey: publicKey!,
    signTransaction: signTransaction!,
    signAllTransactions: signAllTransactions!,
  };

  const [votes, setVotes] = useState({
    crunchy: 0,
    smooth: 0,
  });
  const [voteTxHistory, setVoteTxHistory] = useState([]) as any[];

  useEffect(() => {
    async function getVotes() {
      const connection = new Connection(network, preflightCommitment);
      const provider = new AnchorProvider(connection, signerWallet, {
        preflightCommitment: "recent",
      });
      const program = new Program(idl as Idl, programID, provider);
      try {
        const account: any = await program.account.votingState.fetch(
          voteAccount
        );
        setVotes({
          crunchy: account.crunchy?.toNumber(),
          smooth: account.smooth?.toNumber(),
        });
      } catch (error) {
        console.log("could not getVotes: ", error);
      }
    }

    if (!!voteAccount) {
      getVotes();
    }
  }, [voteAccount, network, wallet]);

  async function getProvider() {
    const connection = new Connection(network, preflightCommitment);
    const provider = new AnchorProvider(connection, signerWallet, {
      preflightCommitment: "recent",
    });
    return provider;
  }

  // Initialize the program if this is the first time its launched
  async function initializeVoting() {
    const provider = await getProvider();
    const program = new Program(idl as Idl, programID, provider);
    console.log("Vote Account Bump", voteAccountBump);
    console.log("Vote Account", voteAccount);
    console.log("wallet public key", provider.wallet.publicKey);

    try {
      await program.methods
        .initialize(voteAccountBump)
        .accounts({
          voteAccount: voteAccount,
          user: provider.wallet.publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();

      const account: any = await program.account.votingState.fetch(voteAccount);

      console.log("Account", account);

      setVotes({
        crunchy: account.crunchy?.toNumber(),
        smooth: account.smooth?.toNumber(),
      });
      enqueueSnackbar("Vote account initialized", { variant: "success" });
    } catch (error: any) {
      console.log("Transaction error: ", error);
      // console.log(error.toString());
      // enqueueSnackbar(`Error: ${error.toString()}`, { variant: "error" });
    }
  }

  // Vote for either crunchy or smooth. Poll for updated vote count on completion
  async function handleVote(side: any) {
    const provider = await getProvider();
    const program = new Program(idl as Idl, programID, provider);
    try {
      let tx;
      if (side === "crunchy") {
        await program.methods
          .voteCrunchy()
          .accounts({
            voteAccount: voteAccount,
          })
          .rpc();
      } else {
        await program.methods
          .voteSmooth()
          .accounts({
            voteAccount: voteAccount,
          })
          .rpc();
      }

      const account: any = await program.account.votingState.fetch(voteAccount);
      setVotes({
        crunchy: account.crunchy.toNumber(),
        smooth: account.smooth.toNumber(),
      });
      enqueueSnackbar(`Voted for ${capitalize(side)}!`, { variant: "success" });
      setVoteTxHistory((oldVoteTxHistory: any) => [...oldVoteTxHistory, tx]);
    } catch (error: any) {
      console.log("Transaction error: ", error);
      console.log(error.toString());
      enqueueSnackbar(`Error: ${error.toString()}`, { variant: "error" });
    }
  }

  return (
    <Box height="100%" display="flex" flexDirection="column">
      <Box flex="1 0 auto">
        <Navbar />
        <Container>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Intro
                votes={votes}
                initializeVoting={initializeVoting}
                programID={programID}
                voteAccount={voteAccount}
              />
            </Grid>
            <Grid item xs={12}>
              <VoteTally votes={votes} />
            </Grid>
            <Grid item xs={6}>
              <VoteOption side="crunchy" handleVote={handleVote} />
            </Grid>
            <Grid item xs={6}>
              <VoteOption side="smooth" handleVote={handleVote} />
            </Grid>
            <Grid item xs={12}>
              <VoteHistory voteTxHistory={voteTxHistory} />
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Footer programID={programID} voteAccount={voteAccount} />
    </Box>
  );
}
