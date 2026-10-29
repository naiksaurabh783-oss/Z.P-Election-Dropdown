import { SAVNER_HIERARCHY, PanchayatSamitiHierarchy, FlatRecord } from '../data/savnerData';

export interface ExportResult {
  spreadsheetId: string;
  spreadsheetUrl: string;
  title: string;
}

export const flattenHierarchy = (data: PanchayatSamitiHierarchy): FlatRecord[] => {
  const records: FlatRecord[] = [];
  data.divisions.forEach((div) => {
    div.gana.forEach((gan) => {
      gan.gramPanchayats.forEach((gp) => {
        gp.villages.forEach((village) => {
          records.push({
            id: `${data.talukaEn}-${village.id}`,
            talukaMr: data.talukaMr,
            talukaEn: data.talukaEn,
            divisionNumber: div.number,
            divisionCode: div.code,
            divisionNameMr: div.nameMr,
            divisionNameEn: div.nameEn,
            ganNumber: gan.number,
            ganCode: gan.code,
            ganNameMr: gan.nameMr,
            ganNameEn: gan.nameEn,
            gpSerialNo: gp.serialNo,
            gpNameMr: gp.nameMr,
            gpNameEn: gp.nameEn,
            villageSerialNo: village.serialNo,
            villageNameMr: village.nameMr,
            villageNameEn: village.nameEn,
            notes: village.notes,
          });
        });
      });
    });
  });
  return records;
};

export const exportToGoogleSheets = async (
  accessToken: string,
  hierarchy: PanchayatSamitiHierarchy = SAVNER_HIERARCHY
): Promise<ExportResult> => {
  const title = `${hierarchy.talukaMr} पंचायत समिती - अंतिम प्रभाग रचना २०२५ (${new Date().toISOString().slice(0, 10)})`;
  
  const createPayload = {
    properties: {
      title,
      locale: 'mr_IN',
      autoRecalc: 'ON_CHANGE',
    },
    sheets: [
      {
        properties: {
          title: '१. संपूर्ण रचना (Full Hierarchy)',
          gridProperties: { frozenRowCount: 1 },
        },
      },
      {
        properties: {
          title: '२. जि.प. विभाग व पं.स. गण (Z.P. & P.S.)',
          gridProperties: { frozenRowCount: 1 },
        },
      },
      {
        properties: {
          title: '३. ग्रामपंचायती (Gram Panchayats)',
          gridProperties: { frozenRowCount: 1 },
        },
      },
      {
        properties: {
          title: '४. शासन आदेश तपशील (Metadata)',
          gridProperties: { frozenRowCount: 1 },
        },
      },
    ],
  };

  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(createPayload),
  });

  if (!createRes.ok) {
    const errorText = await createRes.text();
    throw new Error(`Failed to create spreadsheet: ${errorText}`);
  }

  const sheetData = await createRes.json();
  const spreadsheetId = sheetData.spreadsheetId;
  const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

  const flat = flattenHierarchy(hierarchy);
  const sheet1Header = [
    'अ.क्र. (Sr No)',
    'तालुक्याचे नाव (Taluka)',
    'जि.प. निवडणूक विभाग क्रमांक व नाव (Z.P. Division)',
    'Z.P. Division (English)',
    'पं.स. निर्वाचक गण क्रमांक व नाव (P.S. Gan)',
    'P.S. Gan (English)',
    'ग्रामपंचायतीचे नाव (Gram Panchayat)',
    'Gram Panchayat (English)',
    'समाविष्ट क्षेत्र (गावे/वस्त्या/तांडे) (Villages & Areas)',
    'Village/Area (English)',
    'शेरा / टिप्पणी (Notes)',
  ];

  const sheet1Rows = flat.map((r, idx) => [
    idx + 1,
    r.talukaMr,
    r.divisionCode,
    r.divisionNameEn,
    r.ganCode,
    r.ganNameEn,
    `${r.gpSerialNo}. ${r.gpNameMr}`,
    r.gpNameEn,
    `${r.villageSerialNo}. ${r.villageNameMr}`,
    r.villageNameEn,
    r.notes || '',
  ]);

  const sheet2Header = [
    'जि.प. विभाग क्र. (Z.P. Div No)',
    'जि.प. विभाग नाव (मराठी)',
    'Z.P. Division Name (English)',
    'पं.स. गण क्र. (P.S. Gan No)',
    'पं.स. निर्वाचक गण नाव (मराठी)',
    'P.S. Gan Name (English)',
    'समाविष्ट ग्रामपंचायती संख्या (GPs Count)',
    'समाविष्ट गावे/क्षेत्रे संख्या (Villages Count)',
  ];

  const sheet2Rows: any[][] = [];
  hierarchy.divisions.forEach((div) => {
    div.gana.forEach((gan) => {
      let vCount = 0;
      gan.gramPanchayats.forEach((gp) => (vCount += gp.villages.length));
      sheet2Rows.push([
        div.number,
        div.nameMr,
        div.nameEn,
        gan.number,
        gan.nameMr,
        gan.nameEn,
        gan.gramPanchayats.length,
        vCount,
      ]);
    });
  });

  const sheet3Header = [
    'अ.क्र.',
    'ग्रामपंचायत नाव (मराठी)',
    'Gram Panchayat Name (English)',
    'संबंधित गण (Gan)',
    'संबंधित विभाग (Division)',
    'समाविष्ट गावे संख्या',
    'समाविष्ट गावांची यादी (Villages List)',
  ];

  let gpIndex = 1;
  const sheet3Rows: any[][] = [];
  hierarchy.divisions.forEach((div) => {
    div.gana.forEach((gan) => {
      gan.gramPanchayats.forEach((gp) => {
        sheet3Rows.push([
          gpIndex++,
          gp.nameMr,
          gp.nameEn,
          gan.code,
          div.code,
          gp.villages.length,
          gp.villages.map((v) => v.nameMr).join(', '),
        ]);
      });
    });
  });

  const sheet4Rows = [
    ['तपशील (Parameter)', 'मूल्य (Value)'],
    ['जिल्हा (District)', `${hierarchy.districtMr} (${hierarchy.districtEn})`],
    ['तालुका / पंचायत समिती (Taluka)', `${hierarchy.talukaMr} (${hierarchy.talukaEn})`],
    ['शासन अधिसूचना क्रमांक (Notification)', hierarchy.notificationNumber || ''],
    ['आदेश क्रमांक (Order No)', hierarchy.orderNumber || ''],
    ['आदेश दिनांक (Order Date)', hierarchy.orderDateMr || ''],
    ['सक्षम अधिकारी (Issuing Authority)', `${hierarchy.issuingAuthorityMr || ''} (${hierarchy.issuingAuthorityEn || ''})`],
    ['कायदा व कलम (Act & Section)', 'महाराष्ट्र जिल्हा परिषद व पंचायत समिती अधिनियम, १९६१ चे कलम ५८(१)(अ) व कलम १२(१)'],
    ['एकूण निवडणूक विभाग (Total Divisions)', hierarchy.divisions.length],
    ['एकूण निर्वाचक गण (Total Gana)', hierarchy.divisions.reduce((acc, d) => acc + d.gana.length, 0)],
    ['एकूण ग्रामपंचायती (Total Gram Panchayats)', hierarchy.divisions.reduce((acc, d) => acc + d.gana.reduce((gAcc, g) => gAcc + g.gramPanchayats.length, 0), 0)],
    ['एकूण समाविष्ट गावे/वस्त्या (Total Villages & Areas)', flat.length],
    ['निर्यात वेळ (Export Timestamp)', new Date().toLocaleString()],
  ];

  const batchData = [
    {
      range: "'१. संपूर्ण रचना (Full Hierarchy)'!A1",
      values: [sheet1Header, ...sheet1Rows],
    },
    {
      range: "'२. विभाग व गण (Divisions & Gana)'!A1",
      values: [sheet2Header, ...sheet2Rows],
    },
    {
      range: "'३. ग्रामपंचायती (Gram Panchayats)'!A1",
      values: [sheet3Header, ...sheet3Rows],
    },
    {
      range: "'४. शासन आदेश तपशील (Metadata)'!A1",
      values: sheet4Rows,
    },
  ];

  await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      valueInputOption: 'USER_ENTERED',
      data: batchData,
    }),
  });

  return {
    spreadsheetId,
    spreadsheetUrl,
    title,
  };
};

export const exportMasterDistrictSpreadsheet = async (
  accessToken: string,
  talukas: PanchayatSamitiHierarchy[]
): Promise<ExportResult> => {
  const title = `नागपूर जिल्हा - सर्व पंचायत समित्या अंतिम प्रभाग रचना २०२५ (${new Date().toISOString().slice(0, 10)})`;

  const sheetDefinitions = [
    {
      properties: {
        title: 'जिल्हा सारांश (District Summary)',
        gridProperties: { frozenRowCount: 1 },
      },
    },
    ...talukas.map((t) => ({
      properties: {
        title: `${t.talukaMr} (${t.talukaEn})`,
        gridProperties: { frozenRowCount: 1 },
      },
    })),
  ];

  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: { title, locale: 'mr_IN' },
      sheets: sheetDefinitions,
    }),
  });

  if (!createRes.ok) {
    const errorText = await createRes.text();
    throw new Error(`Failed to create master spreadsheet: ${errorText}`);
  }

  const sheetData = await createRes.json();
  const spreadsheetId = sheetData.spreadsheetId;
  const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

  const summaryHeader = [
    'अ.क्र.',
    'तालुका / पंचायत समिती (मराठी)',
    'Taluka (English)',
    'एकूण निवडणूक विभाग (Divisions)',
    'एकूण निर्वाचक गण (Gana)',
    'एकूण ग्रामपंचायती (GPs)',
    'एकूण गावे व क्षेत्रे (Villages/Areas)',
    'आदेश क्रमांक',
  ];

  const summaryRows = talukas.map((t, i) => {
    const flat = flattenHierarchy(t);
    const divCount = t.divisions.length;
    let ganCount = 0;
    let gpCount = 0;
    t.divisions.forEach((d) => {
      ganCount += d.gana.length;
      d.gana.forEach((g) => (gpCount += g.gramPanchayats.length));
    });

    return [
      i + 1,
      t.talukaMr,
      t.talukaEn,
      divCount,
      ganCount,
      gpCount,
      flat.length,
      t.orderNumber || '',
    ];
  });

  const batchData = [
    {
      range: "'जिल्हा सारांश (District Summary)'!A1",
      values: [summaryHeader, ...summaryRows],
    },
    ...talukas.map((t) => {
      const flat = flattenHierarchy(t);
      const header = [
        'अ.क्र.',
        'तालुका',
        'विभाग क्र. व नाव',
        'गण क्र. व नाव',
        'ग्रामपंचायत',
        'समाविष्ट क्षेत्र',
        'शेरा',
      ];
      const rows = flat.map((r, idx) => [
        idx + 1,
        r.talukaMr,
        r.divisionCode,
        r.ganCode,
        `${r.gpSerialNo}. ${r.gpNameMr}`,
        `${r.villageSerialNo}. ${r.villageNameMr}`,
        r.notes || '',
      ]);
      return {
        range: `'${t.talukaMr} (${t.talukaEn})'!A1`,
        values: [header, ...rows],
      };
    }),
  ];

  await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      valueInputOption: 'USER_ENTERED',
      data: batchData,
    }),
  });

  return {
    spreadsheetId,
    spreadsheetUrl,
    title,
  };
};
