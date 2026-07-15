import { initialShelters } from './mockData.js';

const storageKeys = {
  shelters: 'that:shelters',
  workers: 'that:workers',
  currentWorkerEmail: 'that:current-worker-email'
};

function readJson(key, fallback) {
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

// The signed-in worker is kept in sessionStorage (not localStorage) so closing
// the browser requires credentials again, matching the Supabase auth client.
function readCurrentWorkerEmail() {
  try {
    return window.sessionStorage.getItem(storageKeys.currentWorkerEmail);
  } catch {
    return null;
  }
}

function writeCurrentWorkerEmail(email) {
  try {
    window.sessionStorage.setItem(storageKeys.currentWorkerEmail, email);
  } catch {
    // Storage can be unavailable (private mode); sign-in stays in memory only.
  }
}

function normalize(value) {
  return value.trim().toLowerCase();
}

function normalizeForMatch(value) {
  return normalize(value).replace(/[^a-z0-9]+/g, ' ');
}

function findOrganizationMatch(organizationName, shelters) {
  const requestedName = normalizeForMatch(organizationName);

  if (!requestedName) {
    return null;
  }

  return (
    shelters.find((shelter) => normalizeForMatch(shelter.organization) === requestedName) ??
    shelters.find((shelter) => normalizeForMatch(shelter.name) === requestedName) ??
    shelters.find((shelter) => normalizeForMatch(shelter.organization).includes(requestedName)) ??
    shelters.find((shelter) => normalizeForMatch(shelter.name).includes(requestedName)) ??
    null
  );
}

export function loadShelters() {
  return readJson(storageKeys.shelters, initialShelters);
}

export function saveShelters(shelters) {
  writeJson(storageKeys.shelters, shelters);
}

export function loadWorkers() {
  return readJson(storageKeys.workers, []);
}

export function loadCurrentWorker() {
  const workers = loadWorkers();
  const currentWorkerEmail = readCurrentWorkerEmail();
  return workers.find((worker) => worker.email === currentWorkerEmail) ?? null;
}

export function createWorkerAccount(account, shelters) {
  const workers = loadWorkers();
  const email = normalize(account.email);
  const existingWorker = workers.find((worker) => worker.email === email);

  if (existingWorker) {
    return {
      ok: false,
      error: 'An account already exists for this email.'
    };
  }

  const matchedShelter = findOrganizationMatch(account.organizationName, shelters);
  const worker = {
    id: `worker-${Date.now()}`,
    email,
    password: account.password,
    organizationName: account.organizationName.trim(),
    organizationId: matchedShelter?.id ?? '',
    approvalStatus: 'pending',
    categories: account.categories,
    populationTags: account.populationTags,
    moreInfo: account.moreInfo,
    createdAt: new Date().toISOString()
  };

  writeJson(storageKeys.workers, [...workers, worker]);
  writeCurrentWorkerEmail(worker.email);

  return {
    ok: true,
    worker
  };
}

export function signInWorker(email, password) {
  const worker = loadWorkers().find(
    (account) => account.email === normalize(email) && account.password === password
  );

  if (!worker) {
    return {
      ok: false,
      error: 'No worker account matched that email and password.'
    };
  }

  writeCurrentWorkerEmail(worker.email);

  return {
    ok: true,
    worker
  };
}

export function signOutWorker() {
  try {
    window.sessionStorage.removeItem(storageKeys.currentWorkerEmail);
    // Clear the pre-sessionStorage pointer too, so an old sign-in cannot linger.
    window.localStorage.removeItem(storageKeys.currentWorkerEmail);
  } catch {
    // Storage unavailable; nothing to clear.
  }
}
