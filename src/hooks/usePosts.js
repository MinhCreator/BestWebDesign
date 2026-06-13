import { useQuery } from "@tanstack/react-query";
import { fetchPosts } from "../services/api";

export function usePosts(page, limit = 4) {
  return useQuery({
    queryKey: ["posts", page],
    queryFn: () => fetchPosts(page, limit),
    staleTime: 5 * 60 * 1000,
  });
}
