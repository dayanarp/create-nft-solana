import { AnchorProvider, Wallet } from '@heavy-duty/anchor';
import {
    bundlrStorage,
    keypairIdentity,
    Metaplex
} from '@metaplex-foundation/js';
import { clusterApiUrl, Connection, Keypair } from '@solana/web3.js';

export const getConfig = () => {
    if (process.env.PAYER_PRIVATE_KEY === undefined) {
        throw new Error('Payer private key missing.');
    }

    const keypair = Keypair.fromSecretKey(
        new Uint8Array(Buffer.from(process.env.PAYER_PRIVATE_KEY, 'base64'))
    );
    const connection = new Connection(
        clusterApiUrl(
            process.env.PRODUCTION === 'true' ? 'mainnet-beta' : 'devnet'
        ),
        {
            commitment: 'confirmed',
            confirmTransactionInitialTimeout: 60000
        }
        
    );
    const provider = new AnchorProvider(
        connection,
        new Wallet(keypair),
        AnchorProvider.defaultOptions()
    );
    const metaplex = new Metaplex(connection).use(keypairIdentity(keypair)).use(
        bundlrStorage(
            process.env.PRODUCTION === 'true'
                ? {
                      address: 'https://node1.bundlr.network',
                      providerUrl: 'https://api.mainnet-beta.solana.com',
                      timeout: 60000,
                }
                : {
                      address: 'https://devnet.bundlr.network',
                      providerUrl: 'https://api.devnet.solana.com',
                      timeout: 60000,
                  }
        )
    );

    return {
        provider,
        metaplex,
    };
};
