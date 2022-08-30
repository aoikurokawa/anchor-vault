import React, { useMemo } from "react";

import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletDialogProvider } from "@solana/wallet-adapter-material-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { SnackbarProvider, useSnackbar } from "notistack";
import { createTheme, ThemeProvider } from "@mui/material";
import { blue, orange } from "@mui/material/colors";
import { clusterApiUrl } from "@solana/web3.js";
import { useCallback, useEffect, useState } from "react";
import { web3 } from "@project-serum/anchor";

import Main from "../src/components/Main";

// const localnet = "http://127.0.0.1:8899";
// const devnet = clusterApiUrl("devnet");
const mainnet = clusterApiUrl("mainnet-beta");
const network = mainnet;

// const wallets = [getPhantomWallet()];

const theme = createTheme({
  palette: {
    primary: {
      main: blue[300],
    },
    secondary: {
      main: orange[300],
    },
  },
  // overrides: {
  //   MuiButtonBase: {
  //     root: {
  //       justifyContent: "flex-start",
  //     },
  //   },
  //   MuiButton: {
  //     root: {
  //       textTransform: undefined,
  //       padding: "12px 16px",
  //       fontWeight: 600,
  //     },
  //     startIcon: {
  //       marginRight: 8,
  //     },
  //     endIcon: {
  //       marginLeft: 8,
  //     },
  //     label: {
  //       color: "white",
  //     },
  //   },
  //   MuiLink: {
  //     root: {
  //       color: "initial",
  //     },
  //   },
  // },
});

// Nest app within <SnackbarProvider /> so that we can set up Snackbar notifications on Wallet errors
function AppWrappedWithProviders() {
  const { enqueueSnackbar } = useSnackbar();
  const [voteAccount, setVoteAccount] = useState({});

  const wallets = useMemo(
    () => [
      /**
       * Select the wallets you wish to support, by instantiating wallet adapters here.
       *
       * Common adapters can be found in the npm package `@solana/wallet-adapter-wallets`.
       * That package supports tree shaking and lazy loading -- only the wallets you import
       * will be compiled into your application, and only the dependencies of wallets that
       * your users connect to will be loaded.
       */
      new PhantomWalletAdapter(),
    ],
    []
  );

  useEffect(() => {
    fetch("/voteAccount")
      .then((response) => response.json())
      .then((data) => {
        const accountArray = Object.values(
          data.voteAccount._keypair.secretKey
        ) as number[];
        const secret = new Uint8Array(accountArray);
        const kp = web3.Keypair.fromSecretKey(secret);
        setVoteAccount(kp);
      })
      .catch((error) => {
        console.log(error);
        enqueueSnackbar("Could not fetch vote account", { variant: "error" });
      });
  }, [enqueueSnackbar]);

  const onWalletError = useCallback(
    (error: any) => {
      enqueueSnackbar(
        error.message ? `${error.name}: ${error.message}` : error.name,
        { variant: "error" }
      );
      console.error(error);
    },
    [enqueueSnackbar]
  );

  // Wrap <Main /> within <WalletProvider /> so that we can access useWallet hook within Main
  return (
    <WalletProvider wallets={wallets} onError={onWalletError} autoConnect>
      <WalletDialogProvider>
        <Main network={network} voteAccount={voteAccount} />
      </WalletDialogProvider>
    </WalletProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider>
        <ConnectionProvider endpoint={network}>
          <AppWrappedWithProviders />
        </ConnectionProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}
