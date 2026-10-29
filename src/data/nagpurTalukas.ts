export interface TalukaMeta {
  id: string;
  nameMr: string;
  nameEn: string;
  expectedDivisions: number;
  expectedGana: number;
}

export const NAGPUR_DISTRICT_TALUKAS: TalukaMeta[] = [
  { id: 'savner', nameMr: 'सावनेर', nameEn: 'Savner', expectedDivisions: 7, expectedGana: 14 },
  { id: 'bhiwapur', nameMr: 'भिवापूर', nameEn: 'Bhiwapur', expectedDivisions: 3, expectedGana: 6 },
  { id: 'umred', nameMr: 'उमरेड', nameEn: 'Umred', expectedDivisions: 4, expectedGana: 8 },
  { id: 'hingna', nameMr: 'हिंगणा', nameEn: 'Hingna', expectedDivisions: 5, expectedGana: 10 },
  { id: 'narkhed', nameMr: 'नरखेड', nameEn: 'Narkhed', expectedDivisions: 4, expectedGana: 8 },
  { id: 'katol', nameMr: 'काटोल', nameEn: 'Katol', expectedDivisions: 4, expectedGana: 8 },
  { id: 'kalmeshwar', nameMr: 'कळमेश्वर', nameEn: 'Kalmeshwar', expectedDivisions: 3, expectedGana: 6 },
  { id: 'nagpur_rural', nameMr: 'नागपूर ग्रामीण', nameEn: 'Nagpur Rural', expectedDivisions: 5, expectedGana: 10 },
  { id: 'kamptee', nameMr: 'कामठी', nameEn: 'Kamptee', expectedDivisions: 4, expectedGana: 8 },
  { id: 'kuhi', nameMr: 'कुही', nameEn: 'Kuhi', expectedDivisions: 4, expectedGana: 8 },
  { id: 'mouda', nameMr: 'मौदा', nameEn: 'Mouda', expectedDivisions: 5, expectedGana: 10 },
  { id: 'ramtek', nameMr: 'रामटेक', nameEn: 'Ramtek', expectedDivisions: 5, expectedGana: 10 },
  { id: 'parseoni', nameMr: 'पारशिवनी', nameEn: 'Parseoni', expectedDivisions: 4, expectedGana: 8 },
];
