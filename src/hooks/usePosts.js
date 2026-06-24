import { useQuery } from "@tanstack/react-query";
import { fetchPosts } from "../services/api";

export function usePosts(page, limit = 3) {
  return useQuery({
    queryKey: ["posts", page],
    queryFn: () => fetchPosts(page, limit),
    staleTime: 0,
  });
}
