import { useQuery } from "@tanstack/react-query";
import { fetchEvents } from "../services/api";


export function useEvents() {
    return useQuery({
        queryKey: ["events"],
        queryFn: fetchEvents,
        staleTime: 5 * 60 * 1000,
    });
}