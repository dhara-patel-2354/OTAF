import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  createWorkerAccount,
  loadCurrentWorker,
  loadShelters,
  saveShelters,
  signInWorker,
  signOutWorker
} from '../data/localDatabase.js';
import { workerShelterId as fallbackWorkerShelterId } from '../data/mockData.js';
import { isSupabaseConfigured } from '../data/supabaseClient.js';
import {
  createSupabaseWorkerAccount,
  loadCurrentWorkerFromSupabase,
  loadSheltersFromSupabase,
  signInSupabaseWorker,
  signOutSupabaseWorker,
  updateSupabaseShelter
} from '../data/supabaseDatabase.js';

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
  const [shelters, setShelters] = useState(() => loadShelters());
  const [currentWorker, setCurrentWorker] = useState(() => loadCurrentWorker());
  const [databaseError, setDatabaseError] = useState('');
  const [workerAccount, setWorkerAccount] = useState({
    email: '',
    password: '',
    organizationName: '',
    categories: [],
    populationTags: [],
    moreInfo: ''
  });

  useEffect(() => {
    if (!isSupabaseConfigured) {
      return;
    }

    async function loadSupabaseData() {
      try {
        const [supabaseShelters, supabaseWorker] = await Promise.all([
          loadSheltersFromSupabase(),
          loadCurrentWorkerFromSupabase()
        ]);

        setShelters(supabaseShelters);
        setCurrentWorker(supabaseWorker);
        setDatabaseError('');
      } catch (error) {
        setDatabaseError(error.message);
      }
    }

    loadSupabaseData();
  }, []);

  async function updateShelter(id, updates) {
    const updatesWithTimestamp = {
      ...updates,
      updatedAt: updates.updatedAt ?? formatUpdatedAt()
    };

    setShelters((currentShelters) => {
      const nextShelters = currentShelters.map((shelter) =>
        shelter.id === id
          ? {
              ...shelter,
              ...updatesWithTimestamp
            }
          : shelter
      );

      if (!isSupabaseConfigured) {
        saveShelters(nextShelters);
      }

      return nextShelters;
    });

    if (isSupabaseConfigured) {
      try {
        const updatedShelter = await updateSupabaseShelter(id, updatesWithTimestamp);

        setShelters((currentShelters) =>
          currentShelters.map((shelter) => (shelter.id === id ? updatedShelter : shelter))
        );
        setDatabaseError('');
      } catch (error) {
        setDatabaseError(error.message);
      }
    }
  }

  function updateWorkerAccount(updates) {
    setWorkerAccount((currentAccount) => ({
      ...currentAccount,
      ...updates
    }));
  }

  async function createWorker(updates) {
    const account = {
      ...workerAccount,
      ...updates
    };

    const result = isSupabaseConfigured
      ? await createSupabaseWorkerAccount(account, shelters)
      : createWorkerAccount(account, shelters);

    if (result.ok) {
      setCurrentWorker(result.worker);
    }

    return result;
  }

  async function signIn(email, password) {
    const result = isSupabaseConfigured
      ? await signInSupabaseWorker(email, password)
      : signInWorker(email, password);

    if (result.ok) {
      setCurrentWorker(result.worker);
    }

    return result;
  }

  async function signOut() {
    if (isSupabaseConfigured) {
      await signOutSupabaseWorker();
    } else {
      signOutWorker();
    }

    setCurrentWorker(null);
  }

  const workerShelterId = currentWorker?.organizationId || fallbackWorkerShelterId;
  const workerShelter = shelters.find((shelter) => shelter.id === workerShelterId);

  const value = useMemo(
    () => ({
      shelters,
      workerShelter,
      workerShelterId,
      currentWorker,
      databaseError,
      isSupabaseConfigured,
      workerAccount,
      createWorker,
      signIn,
      signOut,
      updateShelter,
      updateWorkerAccount
    }),
    [shelters, workerShelter, workerShelterId, currentWorker, databaseError, workerAccount]
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
