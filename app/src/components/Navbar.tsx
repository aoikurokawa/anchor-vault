import { AppBar, Container, Toolbar } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { WalletMultiButton } from "@solana/wallet-adapter-material-ui";
import Image from "next/image";
import React from "react";

const useStyles = makeStyles((theme: any) => ({
  root: {
    backgroundColor: "transparent",
    boxShadow: "none",
  },
  toolbar: {
    justifyContent: "space-between",
  },
}));

export default function Navbar() {
  // @ts-ignore
  const classes = useStyles();
  return (
    <AppBar position="static" className={classes.root}>
      <Container maxWidth="xl">
        <Toolbar className={classes.toolbar}>
          <Image src="/pb-icon.svg" alt="PB Vote" height={40} width={40} />
          <WalletMultiButton />
        </Toolbar>
      </Container>
    </AppBar>
  );
}
