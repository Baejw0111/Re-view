import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "@/shared/constants";

export default function useAuth() {
  const { isError, isPending } = useQuery({
    queryKey: ["auth"],
    refetchOnWindowFocus: false,
    retry: false,
    queryFn: async () =>
      await axios.get(`${API_URL}/auth/kakao/check`, {
        withCredentials: true,
      }),
  });

  return { isPending, isError };
}
