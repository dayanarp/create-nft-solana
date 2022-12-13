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

    /*  //const keypair = Keypair.generate();
    const keypair = Keypair.fromSecretKey(
        Uint8Array.from([16,251,236,66,185,141,125,173,211,56,33,24,229,241,78,188,196,111,95,175,33,30,136,127,121,194,183,236,106,62,113,238,217,60,140,54,128,133,163,208,124,54,191,121,201,2,243,41,111,134,52,162,208,104,254,252,225,32,252,104,225,167,128,169])
      );
    const uintarray = new Uint8Array(keypair.secretKey)
    const buff = Buffer.from(uintarray)
    console.log(buff.toString('base64'), keypair.publicKey.toBase58()) 
 */
    
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
