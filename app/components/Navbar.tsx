import { AppBar, Container, makeStyles, Toolbar } from "@mui/material";
import { WalletMultiButton } from "@solana/wallet-adapter-material-ui";
import Image from "next/image";

const useStyles = makeStyles(() => ({
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
          <Image src="/images/pb-icon.svg" alt="PB Vote" height={40} />
          <WalletMultiButton />
        </Toolbar>
      </Container>
    </AppBar>
  );
}
