use anchor_lang::prelude::*;

declare_id!("7dJxpeqJYp8rQt3mmV8Y8xp5pKcnbPqzht4T4its77hG");

#[program]
pub mod crunchy_vs_smooth {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, vote_account_bump: u8) -> Result<()> {
        ctx.accounts.vote_account.bump = vote_account_bump;
        Ok(())
    }

    pub fn vote_crunchy(ctx: Context<Vote>) -> Result<()> {
        ctx.accounts.vote_account.crunchy += 1;
        Ok(())
    }

    pub fn vote_smooth(ctx: Context<Vote>) -> Result<()> {
        ctx.accounts.vote_account.smooth += 1;
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(vote_account_bump: u8)]
pub struct Initialize<'info> {
    #[account(
        init, 
        seeds = [b"vote_account".as_ref()],
        bump,
        payer = user,
        space = 8 + VotingState::MAX_SIZE
    )]
    pub vote_account: Account<'info, VotingState>,
    #[account(mut, signer)]
    /// CHECK: This is not dangerous because we don't read or write from this account
    pub user: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Vote<'info> {
    #[account(
        mut,
        seeds = [b"vote_account".as_ref()],
        bump,
    )]
    pub vote_account: Account<'info, VotingState>,
}

#[account]
#[derive(Default)]
pub struct VotingState {
    pub crunchy: u64,
    pub smooth: u64,
    pub bump: u8,
}

impl VotingState {
    pub const MAX_SIZE: usize = 8 + 8 + 1;
}
