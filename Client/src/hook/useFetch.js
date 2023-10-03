import { useState, useEffect } from 'react';

const useFetch = (url, reqData, method = 'GET') => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!url) return;
    const token = JSON.parse(localStorage.getItem('curUser')) || null;

    const fetchData = async () => {
      try {
        setData(null);
        setIsLoading(true);
        setError(false);
        let response;
        if (method === 'GET') {
          response = await fetch(url, {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          });
        } else {
          response = await fetch(url, {
            method,
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + token,
            },
            body: JSON.stringify(reqData),
          });
        }

        if (!response.ok) {
          throw new Error('Error!');
        }

        const resData = await response.json();
        setData(resData);
      } catch (err) {
        setError(true);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [url, method, reqData]);

  return {
    data,
    isLoading,
    error,
  };
};

export default useFetch;
