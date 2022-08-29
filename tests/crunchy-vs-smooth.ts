import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { CrunchyVsSmooth } from "../target/types/crunchy_vs_smooth";

describe("crunchy-vs-smooth", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.CrunchyVsSmooth as Program<CrunchyVsSmooth>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
