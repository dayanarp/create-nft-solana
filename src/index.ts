import { Keypair, PublicKey } from '@solana/web3.js';
import * as dotenv from 'dotenv';
import { event } from './event-data';
import {
    Event,
    getConfig,
    mintCollectionNft,
    mintTicketNft,
    verifyTicketNft,
    writeLog
} from './utils';

dotenv.config();

const main = async (event: Event) => {

    const { provider, metaplex } = getConfig();
    writeLog(`Event: ${event.name}`);
    
    const balance = await provider.connection.getBalance(provider.publicKey)
    writeLog(`Initial balance: ${balance*0.000000001}`);

    const collectionNft = await mintCollectionNft(metaplex, event);
    writeLog(`Event Collection NFT: ${collectionNft.mint.address.toBase58()}`);

    const collectionFee = await provider.connection.getBalance(provider.publicKey)
    writeLog(`Create Collection Fee: ${(balance - collectionFee)*0.000000001}`);

    for (const ticket of event.tickets) {
        const ticketNft = await mintTicketNft(
            metaplex,
            event,
            collectionNft.address,
            ticket
        );
        await verifyTicketNft(provider, collectionNft, ticketNft, ticket);
    }

    const mintFee = await provider.connection.getBalance(provider.publicKey);

    writeLog(`Total Minting Fee: ${(collectionFee-mintFee)*0.000000001}`);
    writeLog(`Minting Fee: ${((collectionFee-mintFee)*0.000000001)/event.tickets.length}`);
    writeLog(`Total Fees: ${(balance - mintFee)*0.000000001}`);
    writeLog(`Final Balance: ${mintFee*0.000000001} \n\n`);
};

main(event)
    .then(() => {
        console.log('OK');
    })
    .catch((error) => {
        console.log(error);
        return;
    });
