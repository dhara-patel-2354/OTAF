import { createContext, useContext, useMemo, useState } from 'react';
import { initialShelters, workerShelterId } from '../data/mockData.js';

const AppDataContext = createContext(null);

function formatUpdatedAt() {
  return new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
    .format(new Date())
    .replace(',', '');
}

export function AppDataProvider({ children }) {
  const [shelters, setShelters] = useState(initialShelters);
  const [workerAccount, setWorkerAccount] = useState({
    email: '',
    password: '',
    organizationName: '',
    categories: [],
    populationTags: [],
    moreInfo: ''
  });

  function updateShelter(id, updates) {
    setShelters((currentShelters) =>
      currentShelters.map((shelter) =>
        shelter.id === id
          ? {
              ...shelter,
              ...updates,
              updatedAt: updates.updatedAt ?? formatUpdatedAt()
            }
          : shelter
      )
    );
  }

  function updateWorkerAccount(updates) {
    setWorkerAccount((currentAccount) => ({
      ...currentAccount,
      ...updates
    }));
  }

  const workerShelter = shelters.find((shelter) => shelter.id === workerShelterId);

  const value = useMemo(
    () => ({
      shelters,
      workerShelter,
      workerShelterId,
      workerAccount,
      updateShelter,
      updateWorkerAccount
    }),
    [shelters, workerShelter, workerAccount]
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const context = useContext(AppDataContext);

  if (!context) {
    throw new Error('useAppData must be used inside AppDataProvider');
  }

  return context;
}
