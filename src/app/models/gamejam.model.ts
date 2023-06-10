import { Category } from "./category.model";
import { Theme } from "./theme.model";

export interface Gamejam {
    _id: string; // fecha
    description: string;
    categories?: [Category];
    themes?: [Theme];
}