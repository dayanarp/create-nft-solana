export interface Ticket {
    number: number;
    wallet: string;
}

export interface Event {
    collection: string;
    name: string;
    description: string;
    date: string;
    location: string;
    genre: string;
    artists: string[];
    specialGuests: string[];
    guests: string[];
    sponsors: string[];
    website: string;
    image: string;
    tickets: Ticket[];
}