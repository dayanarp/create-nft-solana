export interface Ticket {
    number: number;
    wallet: string;
}

export interface Attribute {
    [key: string]: unknown;
    trait_type?: string;
    value?: string;
}

export interface Event {
    collection: string;
    name: string;
    description: string;
    attributes: Attribute[];
    website: string;
    image: string;
    tickets: Ticket[];
}