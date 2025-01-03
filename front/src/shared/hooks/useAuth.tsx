import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "@/shared/constants";

export default function useAuth() {
  const { isFetched, isError } = useQuery({
    queryKey: ["auth"],
    refetchOnWindowFocus: false,
    retry: false,
    queryFn: async () =>
      await axios.get(`${API_URL}/auth/kakao/check`, {
        withCredentials: true,
      }),
  });

  return isFetched && !isError; // 쿼리가 완료되었고 에러가 없으면 인증된 것으로 간주하고 true 반환
}
