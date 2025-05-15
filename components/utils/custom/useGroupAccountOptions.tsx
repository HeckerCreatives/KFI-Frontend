import React, { useEffect, useRef, useState } from 'react';
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

const useGroupAccountOptions = () => {
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
        const result = await kfiAxios.get('/option/group-account');
        const { success, groupAccounts } = result.data;
        if (success) {
          setState({
            data: groupAccounts,
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
            error: 'Failed to fetch group accounts',
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

export default useGroupAccountOptions;
