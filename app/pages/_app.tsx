import "../styles/globals.css";
import type { AppProps } from "next/app";

import { useCallback, useEffect, useState } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletDialogProvider } from "@solana/wallet-adapter-material-ui";
import {} from "@solana/wallet-adapter-wallets";
import { SnackbarProvider, useSnackbar } from "notistack";
import { createTheme, ThemeProvider } from "@mui/material";
import { blue, orange } from "@mui/material/colors";
import { clusterApiUrl } from "@solana/web3.js";
import { web3 } from "@project-serum/anchor";

const devnet = clusterApiUrl("devnet");
const network = devnet;

const wallets = [];

const theme = createTheme({
  palette: {
    primary: {
      main: blue[300],
    },
    secondary: {
      main: orange[300],
    },
  },
  overrides: {
    MuiButtonBase: {
      root: {
        justifyContent: "flex-start",
      },
    },
    MuiButton: {
      root: {
        textTransform: undefined,
        padding: "12px 16px",
        fontWeight: 600,
      },
      startIcon: {
        marginRight: 8,
      },
      endIcon: {
        marginLeft: 8,
      },
      label: {
        color: "white",
      },
    },
    MuiLink: {
      root: {
        color: "initial",
      },
    },
  },
});

// function AppWrapperWithProviders() {
//   const { enqueueSnackbar } = useSnackbar();
//   const [voteAccount, setVoteAccount] = useState(null);

//   useEffect(() => {
//     fetch("/voteAccount")
//       .then((response) => response.json())
//       .then((data) => {
//         const accountArray = Object.values(data.voteAccount._keypair.secretKey);
//         const secret = new Uint8Array(accountArray);
//         const kp = web3.Keypair.fromSecretKey(secret);
//         setVoteAccount(kp);
//       })
//       .catch((error) => {
//         console.log(error);
//         enqueueSnackbar("Could not fetch vote account", { variant: "error" });
//       });
//   }, [enqueueSnackbar]);

//   const onWalletError = useCallback(
//     (error: any) => {
//       enqueueSnackbar(
//         error.message ? `${error.name}: ${error.message}` : error.name,
//         { variant: "error" }
//       );
//       console.error(error);
//     },
//     [enqueueSnackbar]
//   );

//   return (
//     <WalletProvider wallets={wallets} onError={onWalletError} autoConnect>
//       <WalletDialogProvider></WalletDialogProvider>
//     </WalletProvider>
//   );
// }

function MyApp({ Component, pageProps }: AppProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [voteAccount, setVoteAccount] = useState(null);

  useEffect(() => {
    fetch("/voteAccount")
      .then((response) => response.json())
      .then((data) => {
        const accountArray = Object.values(data.voteAccount._keypair.secretKey);
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

  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider>
        <ConnectionProvider endpoint={network}>
          <WalletProvider wallets={wallets} onError={onWalletError} autoConnect>
            <WalletDialogProvider>
              <Component {...pageProps} />
            </WalletDialogProvider>
          </WalletProvider>
        </ConnectionProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default MyApp;
