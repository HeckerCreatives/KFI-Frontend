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

const useBusinessTypesOptions = () => {
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
        const result = await kfiAxios.get('/option/business-type');
        const { success, businessTypes } = result.data;
        if (success) {
          setState({
            data: businessTypes,
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
            error: 'Failed to fetch business types',
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

export default useBusinessTypesOptions;
