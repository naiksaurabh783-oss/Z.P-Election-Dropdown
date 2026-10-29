/**
 * Nagpur District 13 Panchayat Samiti Ward Delimitation Master Data
 * Source: Official Maharashtra Gazette (Parishishth 8-B)
 * Total: 13 Talukas, 54 Z.P. Electoral Divisions, 108 P.S. Electoral Gana, 760 Gram Panchayats, 1,847 Villages/Areas
 */

import { PanchayatSamitiHierarchy } from './savnerData';
import { NAGPUR_DISTRICT_FULL_HIERARCHY } from './nagpurDistrictFullHierarchy';

// All 13 verified talukas of Nagpur District
export const INITIAL_NAGPUR_TALUKAS: PanchayatSamitiHierarchy[] = NAGPUR_DISTRICT_FULL_HIERARCHY;

// Individual exports for convenience
export const SAVNER_HIERARCHY = NAGPUR_DISTRICT_FULL_HIERARCHY.find((t) => t.talukaEn === 'Savner')!;
export const BHIWAPUR_HIERARCHY = NAGPUR_DISTRICT_FULL_HIERARCHY.find((t) => t.talukaEn === 'Bhiwapur')!;
export const UMRED_HIERARCHY = NAGPUR_DISTRICT_FULL_HIERARCHY.find((t) => t.talukaEn === 'Umred')!;
export const HINGNA_HIERARCHY = NAGPUR_DISTRICT_FULL_HIERARCHY.find((t) => t.talukaEn === 'Hingna')!;
export const NARKHED_HIERARCHY = NAGPUR_DISTRICT_FULL_HIERARCHY.find((t) => t.talukaEn === 'Narkhed')!;
export const KATOL_HIERARCHY = NAGPUR_DISTRICT_FULL_HIERARCHY.find((t) => t.talukaEn === 'Katol')!;
export const KALMESHWAR_HIERARCHY = NAGPUR_DISTRICT_FULL_HIERARCHY.find((t) => t.talukaEn === 'Kalmeshwar')!;
export const NAGPUR_RURAL_HIERARCHY = NAGPUR_DISTRICT_FULL_HIERARCHY.find((t) => t.talukaEn === 'Nagpur Rural')!;
export const KAMPTEE_HIERARCHY = NAGPUR_DISTRICT_FULL_HIERARCHY.find((t) => t.talukaEn === 'Kamptee')!;
export const KUHI_HIERARCHY = NAGPUR_DISTRICT_FULL_HIERARCHY.find((t) => t.talukaEn === 'Kuhi')!;
export const MOUDA_HIERARCHY = NAGPUR_DISTRICT_FULL_HIERARCHY.find((t) => t.talukaEn === 'Mouda')!;
export const RAMTEK_HIERARCHY = NAGPUR_DISTRICT_FULL_HIERARCHY.find((t) => t.talukaEn === 'Ramtek')!;
export const PARSEONI_HIERARCHY = NAGPUR_DISTRICT_FULL_HIERARCHY.find((t) => t.talukaEn === 'Parseoni')!;
