import { Metaplex } from '@metaplex-foundation/js';
import { PublicKey } from '@solana/web3.js';
import { Event, Ticket } from './types';
import { toAttribute } from './utils';

export const mintTicketNft = async (
    metaplex: Metaplex,
    event: Event,
    eventMintAddress: PublicKey,
    ticket: Ticket
) => {
    const ticketName = `POAP #${ticket.number}`;

    if (process.env.LOG_ENABLED === 'true') {
        console.log('minting ticket', ticketName);
    }

    try {
        const { uri: ticketMetadataUri } = await metaplex.nfts().uploadMetadata({
            name: ticketName,
            description: event.description,
            image: event.image,
            external_url: event.website,
            symbol: 'EVENT',
            attributes: [
                toAttribute('POAP #')(`${ticket.number}`),
                ...event.attributes
                ]
        });

        if (process.env.LOG_ENABLED === 'true') {
            console.log("ticket metadata uploaded");
        }

        const { nft: ticketNft } = await metaplex.nfts().create({
            name: ticketName,
            sellerFeeBasisPoints: 0,
            uri: ticketMetadataUri,
            collection: eventMintAddress,
            tokenOwner: new PublicKey(ticket.wallet),
            symbol: 'POAP',
        });
    
        if (process.env.LOG_ENABLED === 'true') {
            console.log('ticket minted', ticketNft.mint.address.toBase58());
        }
    
        return ticketNft;
    } catch(err) {
        console.log(err);
    }

};
