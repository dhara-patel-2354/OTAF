import transitionHousesCsv from '../../BC_Transition_Houses_Safe_Homes.csv?raw';

export const serviceOptions = [
  '24hr In-House Staff',
  'Alcohol & Drug Counselling',
  'Animal Friendly',
  'Children Counselling',
  'Community-Based Victim Services',
  'Follow Up',
  'In-House Counselling',
  'Legal Advocacy',
  'Men Who Use Violence',
  'Older Women',
  'Outreach',
  'Service for the Blind',
  'Service for the Deaf',
  'Sexual Assault',
  'Stopping the Violence Counselling',
  'Support Groups',
  'Transportation',
  'Wheelchair Access'
];

export const populationOptions = [
  'Women-Only',
  'Children Accepted',
  'Animal Friendly',
  'Older Women',
  'Youth'
];

function parseCsvLine(line) {
  const values = [];
  let currentValue = '';
  let isQuoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    const nextCharacter = line[index + 1];

    if (character === '"' && nextCharacter === '"') {
      currentValue += '"';
      index += 1;
    } else if (character === '"') {
      isQuoted = !isQuoted;
    } else if (character === ',' && !isQuoted) {
      values.push(currentValue.trim());
      currentValue = '';
    } else {
      currentValue += character;
    }
  }

  values.push(currentValue.trim());
  return values;
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function parseTransitionHousesCsv(csv) {
  const [headerLine, ...rows] = csv.trim().split(/\r?\n/);
  const headers = parseCsvLine(headerLine);

  return rows
    .filter((row) => row.trim())
    .map((row, index) => {
      const values = parseCsvLine(row);
      const record = Object.fromEntries(
        headers.map((header, headerIndex) => [header, values[headerIndex] ?? ''])
      );
      const contactLines = [
        record.Phone ? `Phone: ${record.Phone}` : '',
        record['Toll Free'] ? `Toll free: ${record['Toll Free']}` : '',
        record['Text Only'] ? `Text only: ${record['Text Only']}` : ''
      ].filter(Boolean);
      const id = `${slugify(record.Program || record.Organization)}-${index + 1}`;

      return {
        id,
        name: record.Program,
        organization: record.Organization,
        status: 'Unknown',
        location: record.Location,
        updatedAt: 'From BC transition houses CSV',
        populationCategories: [record.Type].filter(Boolean),
        serviceCategories: [record.Type].filter(Boolean),
        moreInfo: contactLines.length
          ? contactLines.join(' | ')
          : 'Contact information was not included in the CSV.',
        phone: record.Phone ?? '',
        tollFree: record['Toll Free'] ?? '',
        textOnly: record['Text Only'] ?? '',
        // The CSV carries no email or website; workers fill these in later.
        email: record.Email ?? '',
        website: record.Website ?? '',
        partnered: true
      };
    });
}

export const initialShelters = parseTransitionHousesCsv(transitionHousesCsv);
export const workerShelterId = initialShelters[0]?.id ?? 'transition-house';
