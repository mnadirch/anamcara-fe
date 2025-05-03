import { useState, useEffect } from 'react';
import { AxiosResponse } from 'axios';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

const useApi = <T,>(
  apiFunc: (...params: any[]) => Promise<AxiosResponse<T>>,
  params: any[]
): UseApiState<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    apiFunc(...params)
      .then((response) => {
        setData(response.data);
        setError(null);
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [apiFunc, ...params]);

  return { data, loading, error };
};

export default useApi;
