import { Metaplex } from '@metaplex-foundation/js';
import { Event } from './types';
import { toAttribute, toAttributes, writeToLog } from './utils';

export const mintCollectionNft = async (metaplex: Metaplex, event: Event) => {
    if (process.env.LOG_ENABLED === 'true') {
        console.log('minting collection', event.name);
    }
    try {
        const { uri: collectionMetadataUri } = await metaplex
        .nfts()
        .uploadMetadata({
            name: event.name,
            description: event.description,
            image: event.image,
            external_url: event.website,
            symbol: 'EVENT',
            attributes: [
                toAttribute('Location')(event.location),
                toAttribute('Date')(event.date),
                toAttribute('Genre')(event.genre),
            ]
            .concat(toAttributes('Resident DJs', event.artists))
            .concat(toAttributes('Special Guests', event.specialGuests))
            .concat(toAttributes('Guests', event.guests))
            .concat(toAttributes('Sponsors', event.sponsors)),
        });

        if (process.env.LOG_ENABLED === 'true') {
            console.log('collection metadata uploaded');
        }

        const { nft: collectionNft } = await metaplex.nfts().create({
            name: event.name,
            sellerFeeBasisPoints: 0,
            uri: collectionMetadataUri,
            symbol: 'EVENT',
            isCollection: true,
        });
        // update collection on event
        event.collection = collectionNft.address.toBase58();

        writeToLog(event, 'events.json')

        if (process.env.LOG_ENABLED === 'true') {
            console.log('event data saved')
        }

        if (process.env.LOG_ENABLED === 'true') {
            console.log('collection minted', collectionNft.mint.address.toBase58());
        }

        return collectionNft;
    } catch(err){
        console.log(err);
    }
    
};
