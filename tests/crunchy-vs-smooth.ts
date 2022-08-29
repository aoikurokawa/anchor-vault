import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { CrunchyVsSmooth } from "../target/types/crunchy_vs_smooth";
import assert from "assert";

describe("crunchy-vs-smooth", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();  
  anchor.setProvider(provider);

  const program = anchor.workspace.CrunchyVsSmooth as Program<CrunchyVsSmooth>;
  
  const voteAccount = anchor.web3.Keypair.generate();

  it("Initializes with 0 votes for crunchy and smooth", async () => {
    // Add your test here.
    console.log("Testing Initialize...");
    
    await program.methods
      .initialize()
      .accounts({
        voteAccount: voteAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([voteAccount])
      .rpc();
    
    const account = await program.account.voteAccount.fetch(
      voteAccount.publicKey
    );
    console.log("Crunchy: ", account.crunchy.toString());
    console.log("Smooth: ", account.smooth.toString());
    assert.ok(
      account.crunchy.toNumber() == 0 && account.smooth.toNumber() == 0 
    );
  });
  
  it("Votes correctly for crunchy", async () => {
    console.log("Testing voteCrunchy...");
    await program.methods
      .voteCrunchy()
      .accounts({
        voteAccount: voteAccount.publicKey,
      })
      .rpc();
    
    const account = await program.account.voteAccount.fetch(
      voteAccount.publicKey
    );

    console.log("Crunchy: ", account.crunchy.toString());
    console.log("Smooth: ", account.smooth.toString());
    assert.ok(
      account.crunchy.toNumber() == 1 && account.smooth.toNumber() == 0 
    );
  })

  it("Votes correctly for smooth", async () => {
    console.log("Testing voteSmooth...");
    await program.methods
      .voteSmooth()
      .accounts({
        voteAccount: voteAccount.publicKey,
      })
      .rpc();
    
    const account = await program.account.voteAccount.fetch(
      voteAccount.publicKey
    );

    console.log("Crunchy: ", account.crunchy.toString());
    console.log("Smooth: ", account.smooth.toString());
    assert.ok(
      account.crunchy.toNumber() == 1 && account.smooth.toNumber() == 1 
    );
  })
});
