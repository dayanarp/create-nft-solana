export interface Ticket {
    number: number;
    wallet: string;
}

export interface Event {
    collection: string;
    name: string;
    description: string;
    date: string;
    hour:string;
    location: string;
    // genre: string;
    organizer:string;
    artists: string[];
    // specialGuests: string[];
    // guests: string[];
    sponsors: string[];
    website: string;
    image: string;
    tickets: Ticket[];
}