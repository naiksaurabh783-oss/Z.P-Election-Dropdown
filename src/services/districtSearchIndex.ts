import { PanchayatSamitiHierarchy } from '../data/savnerData';

export type SearchItemType = 'village' | 'gp' | 'gana' | 'division' | 'taluka';

export interface SearchResultItem {
  id: string;
  type: SearchItemType;
  titleMr: string;
  titleEn: string;
  badgeMr: string;
  badgeEn: string;
  talukaMr: string;
  talukaEn: string;
  divisionNumber?: number;
  divisionCode?: string;
  divisionNameMr?: string;
  divisionNameEn?: string;
  ganNumber?: number;
  ganCode?: string;
  ganNameMr?: string;
  ganNameEn?: string;
  gpSerial?: number;
  gpNameMr?: string;
  gpNameEn?: string;
  villageSerial?: number;
  villageNameMr?: string;
  villageNameEn?: string;
  notes?: string;
  siblingVillages?: { serialNo: number; nameMr: string; nameEn: string; notes?: string }[];
  searchTokens: string;
}

export function buildDistrictSearchIndex(talukas: PanchayatSamitiHierarchy[]): SearchResultItem[] {
  const index: SearchResultItem[] = [];

  talukas.forEach((taluka) => {
    // 1. Taluka item
    index.push({
      id: `taluka-${taluka.talukaEn}`,
      type: 'taluka',
      titleMr: `${taluka.talukaMr} पंचायत समिती`,
      titleEn: `${taluka.talukaEn} Panchayat Samiti`,
      badgeMr: 'तालुका / पं.स.',
      badgeEn: 'Taluka / P.S.',
      talukaMr: taluka.talukaMr,
      talukaEn: taluka.talukaEn,
      searchTokens: `${taluka.talukaMr} ${taluka.talukaEn} taluka taluka panchayat samiti पंचायत समिती नागपूर Nagpur`.toLowerCase(),
    });

    taluka.divisions.forEach((div) => {
      // 2. Z.P. Electoral Division item
      index.push({
        id: `div-${taluka.talukaEn}-${div.number}-${div.id}`,
        type: 'division',
        titleMr: `${div.code || `${div.number}-${div.nameMr}`}`,
        titleEn: `Division ${div.number}: ${div.nameEn}`,
        badgeMr: 'जि.प. निवडणूक विभाग',
        badgeEn: 'Z.P. Division',
        talukaMr: taluka.talukaMr,
        talukaEn: taluka.talukaEn,
        divisionNumber: div.number,
        divisionCode: div.code,
        divisionNameMr: div.nameMr,
        divisionNameEn: div.nameEn,
        searchTokens: `${div.nameMr} ${div.nameEn} ${div.code} ${div.number} zp zilla parishad जिल्हा परिषद विभाग ${taluka.talukaMr} ${taluka.talukaEn}`.toLowerCase(),
      });

      div.gana.forEach((gan) => {
        // 3. P.S. Electoral Gana item
        index.push({
          id: `gan-${taluka.talukaEn}-${gan.number}-${gan.id}`,
          type: 'gana',
          titleMr: `${gan.code || `${gan.number}-${gan.nameMr}`}`,
          titleEn: `P.S. Gan ${gan.number}: ${gan.nameEn}`,
          badgeMr: 'पं.स. निर्वाचक गण',
          badgeEn: 'P.S. Gana',
          talukaMr: taluka.talukaMr,
          talukaEn: taluka.talukaEn,
          divisionNumber: div.number,
          divisionCode: div.code,
          divisionNameMr: div.nameMr,
          divisionNameEn: div.nameEn,
          ganNumber: gan.number,
          ganCode: gan.code,
          ganNameMr: gan.nameMr,
          ganNameEn: gan.nameEn,
          searchTokens: `${gan.nameMr} ${gan.nameEn} ${gan.code} ${gan.number} ps gana gan पंचायत समिती गण निर्वाचक ${taluka.talukaMr} ${taluka.talukaEn} ${div.nameMr}`.toLowerCase(),
        });

        gan.gramPanchayats.forEach((gp) => {
          // 4. Gram Panchayat item
          index.push({
            id: `gp-${taluka.talukaEn}-${gan.number}-${gp.serialNo}-${gp.id}`,
            type: 'gp',
            titleMr: `${gp.serialNo}. ${gp.nameMr} ग्रा.पं.`,
            titleEn: `GP ${gp.serialNo}: ${gp.nameEn}`,
            badgeMr: 'ग्रामपंचायत',
            badgeEn: 'Gram Panchayat',
            talukaMr: taluka.talukaMr,
            talukaEn: taluka.talukaEn,
            divisionNumber: div.number,
            divisionCode: div.code,
            divisionNameMr: div.nameMr,
            divisionNameEn: div.nameEn,
            ganNumber: gan.number,
            ganCode: gan.code,
            ganNameMr: gan.nameMr,
            ganNameEn: gan.nameEn,
            gpSerial: gp.serialNo,
            gpNameMr: gp.nameMr,
            gpNameEn: gp.nameEn,
            siblingVillages: gp.villages,
            searchTokens: `${gp.nameMr} ${gp.nameEn} gp gram panchayat ग्रामपंचायत ${taluka.talukaMr} ${taluka.talukaEn} ${gan.nameMr} ${div.nameMr}`.toLowerCase(),
          });

          // 5. Village / Area items
          gp.villages.forEach((village) => {
            index.push({
              id: `v-${taluka.talukaEn}-${gan.number}-${gp.serialNo}-${village.serialNo}-${village.id}`,
              type: 'village',
              titleMr: village.nameMr,
              titleEn: village.nameEn,
              badgeMr: 'गाव / क्षेत्र',
              badgeEn: 'Village / Area',
              talukaMr: taluka.talukaMr,
              talukaEn: taluka.talukaEn,
              divisionNumber: div.number,
              divisionCode: div.code,
              divisionNameMr: div.nameMr,
              divisionNameEn: div.nameEn,
              ganNumber: gan.number,
              ganCode: gan.code,
              ganNameMr: gan.nameMr,
              ganNameEn: gan.nameEn,
              gpSerial: gp.serialNo,
              gpNameMr: gp.nameMr,
              gpNameEn: gp.nameEn,
              villageSerial: village.serialNo,
              villageNameMr: village.nameMr,
              villageNameEn: village.nameEn,
              notes: village.notes,
              siblingVillages: gp.villages,
              searchTokens: `${village.nameMr} ${village.nameEn} ${village.notes || ''} village गाव वस्ती ${gp.nameMr} ${gp.nameEn} ${gan.nameMr} ${div.nameMr} ${taluka.talukaMr} ${taluka.talukaEn}`.toLowerCase(),
            });
          });
        });
      });
    });
  });

  return index;
}

export function searchDistrictIndex(
  index: SearchResultItem[],
  rawQuery: string,
  options: {
    typeFilter?: SearchItemType | 'all';
    talukaFilter?: string | 'all';
    limit?: number;
  } = {}
): SearchResultItem[] {
  const query = rawQuery.trim().toLowerCase();
  if (!query) return [];

  const { typeFilter = 'all', talukaFilter = 'all', limit = 40 } = options;

  // Split query into terms for multi-word matching
  const terms = query.split(/\s+/).filter(Boolean);

  const matched = index.filter((item) => {
    // Type filter
    if (typeFilter !== 'all' && item.type !== typeFilter) {
      return false;
    }

    // Taluka filter
    if (talukaFilter !== 'all') {
      const cleanTaluka = talukaFilter.toLowerCase();
      if (item.talukaEn.toLowerCase() !== cleanTaluka && item.talukaMr !== talukaFilter) {
        return false;
      }
    }

    // Match all terms
    const haystack = item.searchTokens;
    return terms.every((term) => haystack.includes(term));
  });

  // Relevance ranking: exact title match > title starts with > title includes > parent match
  matched.sort((a, b) => {
    const aTitleMr = a.titleMr.toLowerCase();
    const aTitleEn = a.titleEn.toLowerCase();
    const bTitleMr = b.titleMr.toLowerCase();
    const bTitleEn = b.titleEn.toLowerCase();

    const aExact = aTitleMr === query || aTitleEn === query;
    const bExact = bTitleMr === query || bTitleEn === query;
    if (aExact && !bExact) return -1;
    if (!aExact && bExact) return 1;

    const aStarts = aTitleMr.startsWith(query) || aTitleEn.startsWith(query);
    const bStarts = bTitleMr.startsWith(query) || bTitleEn.startsWith(query);
    if (aStarts && !bStarts) return -1;
    if (!aStarts && bStarts) return 1;

    const aTitleIncludes = aTitleMr.includes(query) || aTitleEn.includes(query);
    const bTitleIncludes = bTitleMr.includes(query) || bTitleEn.includes(query);
    if (aTitleIncludes && !bTitleIncludes) return -1;
    if (!aTitleIncludes && bTitleIncludes) return 1;

    // Type priority: village > gana > division > gp > taluka
    const typeWeights: Record<SearchItemType, number> = {
      village: 1,
      gana: 2,
      division: 3,
      gp: 4,
      taluka: 5,
    };
    return typeWeights[a.type] - typeWeights[b.type];
  });

  return matched.slice(0, limit);
}
