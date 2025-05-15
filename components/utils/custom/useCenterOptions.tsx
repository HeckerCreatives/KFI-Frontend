import { useEffect, useRef, useState } from 'react';
import kfiAxios from '../axios';

export type Option = {
  label: string;
  value: string;
};

export type OptionsState = {
  data: Option[];
  loading: boolean;
  error: string | null;
};

const useCenterOptions = () => {
  const [state, setState] = useState<OptionsState>({
    data: [],
    loading: false,
    error: null,
  });

  const isMounted = useRef(false);

  const fetchOptions = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    if (isMounted.current) {
      try {
        const result = await kfiAxios.get('/option/center');
        const { success, centers } = result.data;
        if (success) {
          setState({
            data: centers,
            loading: false,
            error: null,
          });
          return;
        }
      } catch (error) {
        if (isMounted.current) {
          setState({
            data: [],
            loading: false,
            error: 'Failed to fetch centers',
          });
        }
      }
    }
  };

  useEffect(() => {
    isMounted.current = true;
    fetchOptions();

    return () => {
      isMounted.current = false;
    };
  }, []);

  return { ...state };
};

export default useCenterOptions;
