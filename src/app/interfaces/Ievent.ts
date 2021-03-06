import { Ilabel } from "./Ilabel";

export interface Ievent {
    title: string;
    date: string;
    description: string;
    image: string;
    subtitle: string;
    labels: Ilabel[];
}