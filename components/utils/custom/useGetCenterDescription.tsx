import { useEffect, useState } from 'react';
import { Center } from '../../../types/types';
import kfiAxios from '../axios';

type UseGetDetailsByIdProps = {
  id: string;
};

const useGetCenterDescription = ({ id }: UseGetDetailsByIdProps) => {
  const [center, setCenter] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setCenter(null);
      return;
    }

    const fetchDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await kfiAxios.get(`center/description/${id}`);
        const { success, description } = data.data;
        if (success) {
          setCenter(description);
          return;
        }
        setError('Failed to fetch center description');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch center description');
        setCenter(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  return { center, loading, error };
};

export default useGetCenterDescription;
