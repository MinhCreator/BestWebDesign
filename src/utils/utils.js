import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function ClassN(...inputs) {
    return twMerge(clsx(inputs));
}