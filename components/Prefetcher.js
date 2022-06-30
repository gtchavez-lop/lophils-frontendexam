import { createContext, useContext, useEffect, useState } from 'react';

const PrefetcherContext = createContext();

export const PrefetcherWrapper = ({ children }) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetch('/api/getData');
      const json = await data.json();
      setData(json);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const sharedState = {
    emailDataList: data,
    setEmailDataList: setData,
    selectedItems,
    setSelectedItems,
  };

  return (
    <PrefetcherContext.Provider value={sharedState}>
      {isLoading ? (
        <div>
          <p>Loading...</p>
        </div>
      ) : (
        children
      )}
    </PrefetcherContext.Provider>
  );
};

export const usePrefetcher = () => {
  return useContext(PrefetcherContext);
};
