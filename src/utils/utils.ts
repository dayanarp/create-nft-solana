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


export const initFiles = () => {
    const data_events = '{ "events": [\n'
    fs.appendFile('events.json', data_events, err => {
        if (err) { throw err }
    })

    const failedTickets = '{ "failed_tickets": [\n'
    fs.appendFile('failed-tickets.json', failedTickets, err => {
        if (err) { throw err }
    })

    const verifiedTickets = '{ "verified_tickets": [\n'
    fs.appendFile('verified-tickets.json', verifiedTickets, err => {
        if (err) { throw err }
    })

    const unverifiedTickets = '{ "unverified_tickets": [\n'
    fs.appendFile('unverified-tickets.json', unverifiedTickets, err => {
        if (err) { throw err }
    })
}

export const closeFiles = () => {
    const data = "] }"

    fs.appendFile('events.json', data, err => {
        if (err) { throw err }
    })

    fs.appendFile('failed-tickets.json', data, err => {
        if (err) { throw err }
    })

    fs.appendFile('verified-tickets.json', data, err => {
        if (err) { throw err }
    })

    fs.appendFile('unverified-tickets.json', data, err => {
        if (err) { throw err }
    })
}

export const writeToLog = (object: any, file: string) =>{
    // convert JSON object to a string
    const data = JSON.stringify(object) + ',\n'
    // write JSON string to a file
    fs.appendFile(file, data, err => {
        if (err) { throw err }
    })
}

export const getTickets = async () => {
    let tickets: Ticket[] = []
    const parser = fs
    .createReadStream(`${__dirname}/wallets.csv`)
    .pipe(parse({
        // CSV options
        from_line: 2,
    }));
    for await (const record of parser) {
      // Work with each record
      tickets.push({
        number: record[0],
        wallet: record[1]} as Ticket)
    }
    return tickets
  }