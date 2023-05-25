import { Metaplex, NftWithToken, PublicKey } from '@metaplex-foundation/js';
import { Event } from './types';

export const mintCollectionNft = async (metaplex: Metaplex, event: Event) => {
    if (process.env.LOG_ENABLED === 'true') {
        console.log('minting collection', event.name);
    }
    try {
        var collectionNft: NftWithToken;

        if(event.collection === null) 
        {
            //create new collection
            const { uri: collectionMetadataUri } = await metaplex
            .nfts()
            .uploadMetadata({
                name: event.name,
                description: event.description,
                image: event.image,
                external_url: event.website,
                symbol: 'EVENT',
                attributes: event.attributes,
            });

            if (process.env.LOG_ENABLED === 'true') {
                console.log('collection metadata uploaded');
            }

            const { nft: collection } = await metaplex.nfts().create({
                name: event.name,
                sellerFeeBasisPoints: 0,
                uri: collectionMetadataUri,
                symbol: 'EVENT',
                isCollection: true,
            });

            // update collection on event
            collectionNft = collection;
            event.collection = collectionNft.mint.address.toBase58();

        } else { 
            // return existing collection
            collectionNft  = await metaplex.nfts().findByMint({
                mintAddress: new PublicKey(event.collection),
                loadJsonMetadata: true
            }) as NftWithToken
        }
        
        if (process.env.LOG_ENABLED === 'true') {
            console.log('collection minted', event.collection);
        }

        return collectionNft;
    } catch(err){
        console.log(err);
    }
    
};
