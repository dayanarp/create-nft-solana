import { AnchorProvider } from '@heavy-duty/anchor';
import { Nft } from '@metaplex-foundation/js';
import { createVerifySizedCollectionItemInstruction } from '@metaplex-foundation/mpl-token-metadata';
import { Transaction } from '@solana/web3.js';
import { Ticket } from './types';
import { writeToLog } from './utils';

export const verifyTicketNft = async (
    provider: AnchorProvider,
    collectionNft: Nft,
    ticketNft: Nft,
    ticket: Ticket
) => {
    if (process.env.LOG_ENABLED === 'true') {
        console.log('ticket being verified', ticketNft.mint.address.toBase58());
    }

    try{
        // Add the NFT to the user's wallet
        await provider.sendAndConfirm(
            new Transaction().add(
                createVerifySizedCollectionItemInstruction({
                    collectionMint: collectionNft.mint.address,
                    collection: collectionNft.metadataAddress,
                    collectionAuthority: provider.wallet.publicKey,
                    collectionMasterEditionAccount: collectionNft.edition.address,
                    metadata: ticketNft.metadataAddress,
                    payer: provider.wallet.publicKey,
                })
            )
        );

        writeToLog({
            ...ticket,
            ticket_mint: ticketNft.mint.address.toBase58()
        }, 'verified-tickets.json')

        if (process.env.LOG_ENABLED === 'true') {
            console.log(
                'ticket successfully verified',
                ticketNft.mint.address.toBase58()
            );
        }

    } catch(err){
        writeToLog({
            ...ticket,
            ticket_mint: ticketNft.mint.address.toBase58()
        }, 'unverified-tickets.json');
        console.log(err)
    }
};
