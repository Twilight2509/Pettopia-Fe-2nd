import { publicApiClient } from "@/services/apiClient";

export async function fetchAreaData(url: string, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await publicApiClient.get(url);
      return response.data;
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}
