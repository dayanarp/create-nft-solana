import { Metaplex, NftWithToken, PublicKey } from '@metaplex-foundation/js';
import { Event } from './types';
import { toAttribute, toAttributes, writeToLog } from './utils';

export const mintCollectionNft = async (metaplex: Metaplex, event: Event) => {
    if (process.env.LOG_ENABLED === 'true') {
        console.log('minting collection', event.name);
    }
    try {
        var collectionNft: NftWithToken;

        if(event.collection === null)
        {
            const { uri: collectionMetadataUri } = await metaplex
            .nfts()
            .uploadMetadata({
                name: event.name,
                description: event.description,
                image: event.image,
                external_url: event.website,
                symbol: 'SG-EVENT',
                attributes: [
                    toAttribute('Fecha')(event.date),
                    toAttribute('Hora')(event.hour),
                    toAttribute('Lugar')(event.location),
                    toAttribute('Organizador')(event.organizer),
                    
                    //toAttribute('Genre')(event.genre),
                ]
                .concat(toAttributes('Artistas', event.artists))
                // .concat(toAttributes('Special Guests', event.specialGuests))
                // .concat(toAttributes('Guests', event.guests))
                .concat(toAttributes('Patrocinadores', event.sponsors)),
            });

            if (process.env.LOG_ENABLED === 'true') {
                console.log('collection metadata uploaded');
            }

            const { nft: collection } = await metaplex.nfts().create({
                name: event.name,
                sellerFeeBasisPoints: 0,
                uri: collectionMetadataUri,
                symbol: 'SG-EVENT',
                isCollection: true,
            });
            // update collection on event
            event.collection = collectionNft.mint.address.toBase58();
            collectionNft = collection;
        } else {
            collectionNft  = await metaplex.nfts().findByMint({
                mintAddress: new PublicKey(event.collection),
                loadJsonMetadata: true
            }) as NftWithToken
        }
        
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
        return;
    }
    
};
