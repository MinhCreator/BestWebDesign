import { useQuery } from "@tanstack/react-query";
import { fetchResults } from "../services/api";

export function useResults(eventId) {
  return useQuery({
    queryKey: ["results", eventId],
    queryFn: () => fetchResults(eventId),
    enabled: !!eventId,
    staleTime: 5 * 60 * 1000,
  });
}
