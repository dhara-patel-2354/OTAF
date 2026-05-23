import { supabase } from './supabaseClient.js';

function toShelter(record) {
  return {
    id: record.id,
    name: record.program,
    organization: record.organization,
    status: record.status,
    location: record.location,
    updatedAt: record.updated_at_label ?? record.updated_at ?? 'Not updated yet',
    populationCategories: record.population_categories ?? [],
    serviceCategories: record.service_categories ?? [],
    moreInfo: record.more_info ?? '',
    partnered: record.partnered
  };
}

function toWorker(profile) {
  return {
    id: profile.user_id,
    email: profile.email,
    organizationName: profile.organization_name,
    organizationId: profile.organization_id ?? '',
    approvalStatus: profile.approval_status,
    categories: profile.categories ?? [],
    populationTags: profile.population_tags ?? [],
    moreInfo: profile.more_info ?? '',
    createdAt: profile.created_at
  };
}

function normalize(value) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, ' ');
}

function findOrganizationMatch(organizationName, shelters) {
  const requestedName = normalize(organizationName);

  if (!requestedName) {
    return null;
  }

  return (
    shelters.find((shelter) => normalize(shelter.organization) === requestedName) ??
    shelters.find((shelter) => normalize(shelter.name) === requestedName) ??
    shelters.find((shelter) => normalize(shelter.organization).includes(requestedName)) ??
    shelters.find((shelter) => normalize(shelter.name).includes(requestedName)) ??
    null
  );
}

export async function loadSheltersFromSupabase() {
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .order('location', { ascending: true })
    .order('program', { ascending: true });

  if (error) {
    throw error;
  }

  return data.map(toShelter);
}

export async function loadCurrentWorkerFromSupabase() {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

  if (sessionError) {
    throw sessionError;
  }

  const user = sessionData.session?.user;

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from('worker_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error) {
    throw error;
  }

  return toWorker(data);
}

export async function createSupabaseWorkerAccount(account, shelters) {
  const matchedShelter = findOrganizationMatch(account.organizationName, shelters);
  const approvalStatus = matchedShelter ? 'approved' : 'pending';

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: account.email.trim().toLowerCase(),
    password: account.password
  });

  if (authError) {
    return {
      ok: false,
      error: authError.message
    };
  }

  const userId = authData.user?.id;

  if (!userId) {
    return {
      ok: false,
      error: 'Supabase did not return a user for this signup.'
    };
  }

  const profile = {
    user_id: userId,
    email: account.email.trim().toLowerCase(),
    organization_name: account.organizationName.trim(),
    organization_id: matchedShelter?.id ?? null,
    approval_status: approvalStatus,
    categories: account.categories,
    population_tags: account.populationTags,
    more_info: account.moreInfo
  };

  const { data, error } = await supabase
    .from('worker_profiles')
    .insert(profile)
    .select()
    .single();

  if (error) {
    return {
      ok: false,
      error: error.message
    };
  }

  return {
    ok: true,
    worker: toWorker(data)
  };
}

export async function signInSupabaseWorker(email, password) {
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password
  });

  if (authError) {
    return {
      ok: false,
      error: authError.message
    };
  }

  const { data, error } = await supabase
    .from('worker_profiles')
    .select('*')
    .eq('user_id', authData.user.id)
    .single();

  if (error) {
    return {
      ok: false,
      error: error.message
    };
  }

  return {
    ok: true,
    worker: toWorker(data)
  };
}

export async function signOutSupabaseWorker() {
  await supabase.auth.signOut();
}

export async function updateSupabaseShelter(id, updates) {
  const payload = {
    status: updates.status,
    population_categories: updates.populationCategories,
    service_categories: updates.serviceCategories,
    more_info: updates.moreInfo,
    updated_at_label: updates.updatedAt,
    updated_at: new Date().toISOString()
  };

  Object.keys(payload).forEach((key) => {
    if (payload[key] === undefined) {
      delete payload[key];
    }
  });

  const { data, error } = await supabase
    .from('organizations')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return toShelter(data);
}
