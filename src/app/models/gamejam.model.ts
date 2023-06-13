import { Category } from "./category.model";
import { Theme } from "./theme.model";

export interface Gamejam {
    _id: number; // fecha
    description: string;
    categories?: [Category];
    themes?: [Theme];
}