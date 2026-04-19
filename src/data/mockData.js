export const workerShelterId = 'shimai-transition-house';

export const populationOptions = [
  'Women-Only',
  'Children Accepted',
  'Animal Friendly',
  'Older Women',
  'Youth'
];

export const serviceOptions = [
  '24hr In-House Staff',
  'Children Counselling',
  'Legal Advocacy',
  'Alcohol & Drug Counselling',
  'Safety Planning'
];

export const initialShelters = [
  {
    id: workerShelterId,
    name: 'Shimai Transition House',
    organization: 'Atira Women’s Resource Society',
    status: 'Unavailable',
    location: 'Surrey',
    updatedAt: '2026-03-09 11:24 PM',
    populationCategories: ['Women-Only', 'Children Accepted', 'Animal Friendly'],
    serviceCategories: [
      '24hr In-House Staff',
      'Children Counselling',
      'Legal Advocacy',
      'Alcohol & Drug Counselling'
    ],
    moreInfo: 'Please make sure to call us for an intake process.',
    partnered: true
  },
  {
    id: 'maxxine-wright-shelter',
    name: 'Maxxine Wright Shelter',
    organization: 'Atira Women’s Resource Society',
    status: 'Available',
    location: 'Surrey',
    updatedAt: '2026-03-09 10:52 PM',
    populationCategories: ['Women-Only', 'Children Accepted'],
    serviceCategories: ['24hr In-House Staff', 'Children Counselling', 'Safety Planning'],
    moreInfo: 'Call ahead for intake availability and current bed details.',
    partnered: true
  },
  {
    id: 'virginia-sam-transition-house',
    name: 'Virginia Sam Transition House',
    organization: 'Options Community Services Society',
    status: 'Available',
    location: 'Surrey/Newton',
    updatedAt: '2026-03-09 09:47 PM',
    populationCategories: ['Women-Only', 'Children Accepted'],
    serviceCategories: ['24hr In-House Staff', 'Legal Advocacy', 'Safety Planning'],
    moreInfo: 'Support workers are available for confidential safety planning.',
    partnered: true
  },
  {
    id: 'evergreen-transition-house',
    name: 'Evergreen Transition House',
    organization: 'Options Community Services Society',
    status: 'Unknown—Organization not partnered yet!',
    location: 'Surrey/Newton',
    updatedAt: 'Pending partnership',
    populationCategories: ['Women-Only'],
    serviceCategories: ['Safety Planning'],
    moreInfo: 'This organization is not partnered yet. Please verify details directly.',
    partnered: false
  },
  {
    id: 'ama-house-for-older-women',
    name: 'Ama House for Older Women',
    organization: 'Atira Women’s Resource Society',
    status: 'Unavailable',
    location: 'South Surrey',
    updatedAt: '2026-03-08 07:16 PM',
    populationCategories: ['Women-Only', 'Older Women'],
    serviceCategories: ['24hr In-House Staff', 'Legal Advocacy'],
    moreInfo: 'Priority support for older women. Call for intake information.',
    partnered: true
  }
];
