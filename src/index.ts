import { Keypair, PublicKey } from '@solana/web3.js';
import * as dotenv from 'dotenv';
import { event } from './event-data';
import {
    closeFiles,
    Event,
    getConfig,
    getTickets,
    initFiles,
    mintCollectionNft,
    mintTicketNft,
    verifyTicketNft
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

    const tickets = await getTickets();
    event.tickets = tickets

    initFiles();
    
    const balance = await provider.connection.getBalance(provider.publicKey)
    console.log("INITIAL BALANCE:", balance*0.000000001);

    const collectionNft = await mintCollectionNft(metaplex, event);

    const balanceA = await provider.connection.getBalance(provider.publicKey)
    console.log("COLLECTION CREATION FEE:",((balance - balanceA)*0.000000001));

    for (const ticket of event.tickets) {
        const ticketNft = await mintTicketNft(
            metaplex,
            event,
            collectionNft.address,
            ticket
        );
        await verifyTicketNft(provider, collectionNft, ticketNft, ticket);
    }

    const balanceB = await provider.connection.getBalance(provider.publicKey)
    console.log("MINT NFTS FEES:",((balanceA-balanceB)*0.000000001));
    console.log("MINT FEE P/NFT:",((balanceA-balanceB)*0.000000001)/event.tickets.length)
    console.log("TOTAL FEES:", ((balance - balanceB)*0.000000001));
    console.log("FINAL BALANCE:", balanceB*0.000000001);

    closeFiles();
};

main(event)
    .then(() => {
        console.log('OK');
    })
    .catch((error) => {
        console.log(error);
        return;
    });
