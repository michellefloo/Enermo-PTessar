import axios from "./axios";
import axiosNew from "./axiosNew";

import { useQuery, useMutation, useQueryClient } from "react-query";
import { logout } from "./auth";

export const handleQueryError = (queryClient) => {
  const { response } = queryClient.error;
  if (response) if (response.status === 401) logout();
  return queryClient;
};

export const useFecth = (url, params, config) => {
  const queryClient = useQuery(
    config.queryKey || url,
    async () => {
      return await axios.post(url, params);
    },
    {
      enabled: !!url,
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnmount: false,
      ...config,
    }
  );
  if (queryClient.isError) return handleQueryError(queryClient);
  return queryClient;
};

export const useFetchNew = (url, params, config) => {
  const queryClient = useQuery(
    config.queryKey || url,
    async () => {
      return await axiosNew.post(url, params);
    },
    {
      enabled: !!url,
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      ...config,
    }
  );
  if (queryClient.isError) return handleQueryError(queryClient);
  return queryClient;
};

export const useRqMutation = (url, updater, config) => {
  const queryClient = useQueryClient();
  // const queryCache = queryClient.getQueryCache();
  // const queryKeys = queryCache.getAll().map((cache) => cache.queryKey);
  return useMutation({
    mutationFn: (data) => (config.onlyToCache ? null : axios.post(url, data)),
    onMutate: async (newData) => {
      await queryClient.cancelQueries(config.queryKey);
      const previousData = queryClient.getQueryData(config.queryKey);
      queryClient.setQueryData(config.queryKey, newData, (oldData) => {
        return updater ? updater(oldData, newData) : newData;
      });
      return previousData;
    },
    onError: (err, _, context) => {
      queryClient.setQueryData(config.queryKey, context.previousData);
    },
    onSettled: () => {
      queryClient.invalidateQueries(config.queryKey);
    },
  });
};

export const usePost = (url, updater, config) => {
  return useRqMutation(url, updater, config);
};

export const useUpdate = (url, updater, config) => {
  return useRqMutation(url, updater, config);
};

export const useDelete = (url, updater, config) => {
  return useRqMutation(url, updater, config);
};
