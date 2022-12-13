import { toMetaplexFile } from '@metaplex-foundation/js';
import fs from 'fs';
import * as path from "path";
import { parse } from 'csv-parse';
import { Ticket } from './types';

export const toAttribute = (traitType: string) => (entry: string) => ({
    trait_type: traitType,
    value: entry,
});

export const toAttributes = (traitType: string, entries: string[]) =>
    entries.map(toAttribute(traitType));

export const writeLog = (value: string) =>{
    // convert JSON object to a string
    const data = value + '\n'
    // write JSON string to a file
    fs.appendFile('eventLog.txt', data, err => {
        if (err) { throw err }
    })
}

