import useSWR from "swr";
import useSWRMutation from "swr/mutation";

import { Config } from "@/components/ui/Workspace";

export const useWorkspaces = () => useSWR("/api/workspaces", fetcher);

export const useWorkspaceMutation = () =>
  useSWRMutation("/api/workspaces", fetcher);

const fetcher = async (url: string, data?: { arg: Config }) => {
  const apiKey = window.localStorage.getItem("@nuotillee-api-key");

  const headers = {
    "Content-Type": "application/json",
    "x-api-key": apiKey || "",
  };

  // TODO: Implement api key
  const options = data?.arg
    ? {
        method: "POST",
        headers,
        body: JSON.stringify(data.arg),
      }
    : {
        method: "GET",
        headers,
      };

  const res = await fetch(url, options);

  return res.json();
};
