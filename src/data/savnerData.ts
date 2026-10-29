/**
 * Structured Hierarchical Extraction of Savner Panchayat Samiti
 * Source: Official Notification (परिशिष्ट - ८ (ब), नमुना सावनेर पंचायत समिती)
 * Order No: निवडणूक-१/कार्या-३/कावि-३९८-२०२५, दिनांक २२ ऑगस्ट २०२५
 * District: Nagpur (नागपूर), Taluka: Savner (सावनेर)
 */

export interface VillageArea {
  id: string;
  serialNo: number;
  nameMr: string;
  nameEn: string;
  notes?: string; // e.g. "पाण्याखाली" (submerged), "री.", "वार्ड क्रं."
}

export interface GramPanchayat {
  id: string;
  serialNo: number;
  nameMr: string;
  nameEn: string;
  villages: VillageArea[];
}

export interface ElectoralGan {
  id: string;
  number: number;
  nameMr: string;
  nameEn: string;
  code: string; // e.g. "१-बडेगाव"
  gramPanchayats: GramPanchayat[];
}

export interface ElectoralDivision {
  id: string;
  number: number;
  nameMr: string;
  nameEn: string;
  code: string; // e.g. "१-बडेगाव"
  gana: ElectoralGan[];
}

export interface PanchayatSamitiHierarchy {
  districtMr: string;
  districtEn: string;
  talukaMr: string;
  talukaEn: string;
  notificationNumber: string;
  notificationDateMr: string;
  orderNumber: string;
  orderDateMr: string;
  issuingAuthorityMr: string;
  issuingAuthorityEn: string;
  divisions: ElectoralDivision[];
  isVerifiedFromPdf?: boolean;
  sourcePdfFilename?: string;
}

export const SAVNER_HIERARCHY: PanchayatSamitiHierarchy = {
  districtMr: "नागपूर",
  districtEn: "Nagpur",
  talukaMr: "सावनेर",
  talukaEn: "Savner",
  notificationNumber: "जिपनि-२०२५/प्र.क्र.३६/पं.रा.२ दिनांक १२ जून, २०२५",
  notificationDateMr: "१२ जून, २०२५",
  orderNumber: "निवडणूक-१/कार्या-३/कावि-३९८-२०२५",
  orderDateMr: "२२ ऑगस्ट, २०२५",
  issuingAuthorityMr: "डॉ. विपीन, जिल्हाधिकारी, नागपूर",
  issuingAuthorityEn: "Dr. Vipin, District Collector, Nagpur",
  isVerifiedFromPdf: true,
  sourcePdfFilename: "savner_f59b02f5.pdf",
  divisions: [
    {
      id: "div-1",
      number: 1,
      nameMr: "बडेगाव",
      nameEn: "Badegaon",
      code: "१-बडेगाव",
      gana: [
        {
          id: "gan-1",
          number: 1,
          nameMr: "बडेगाव",
          nameEn: "Badegaon",
          code: "१-बडेगाव",
          gramPanchayats: [
            {
              id: "gp-1-1",
              serialNo: 1,
              nameMr: "बडेगाव",
              nameEn: "Badegaon",
              villages: [
                { id: "v-1-1-1", serialNo: 1, nameMr: "बडेगाव", nameEn: "Badegaon" },
                { id: "v-1-1-2", serialNo: 2, nameMr: "चारगाव", nameEn: "Chargaon" }
              ]
            },
            {
              id: "gp-1-2",
              serialNo: 2,
              nameMr: "सिंदेवानी (बु.)",
              nameEn: "Sindewani (Bk.)",
              villages: [
                { id: "v-1-2-1", serialNo: 3, nameMr: "सिंदेवानी (बु.)", nameEn: "Sindewani (Bk.)" },
                { id: "v-1-2-2", serialNo: 4, nameMr: "सिंदेवानी (खु.)", nameEn: "Sindewani (Kh.)" },
                { id: "v-1-2-3", serialNo: 5, nameMr: "टेकाडी", nameEn: "Tekadi" }
              ]
            },
            {
              id: "gp-1-3",
              serialNo: 3,
              nameMr: "बिचवा",
              nameEn: "Bichwa",
              villages: [
                { id: "v-1-3-1", serialNo: 6, nameMr: "बिचवा", nameEn: "Bichwa" }
              ]
            },
            {
              id: "gp-1-4",
              serialNo: 4,
              nameMr: "सर्रा",
              nameEn: "Sarra",
              villages: [
                { id: "v-1-4-1", serialNo: 7, nameMr: "सर्रा", nameEn: "Sarra" },
                { id: "v-1-4-2", serialNo: 8, nameMr: "वरपानी", nameEn: "Warpani" },
                { id: "v-1-4-3", serialNo: 9, nameMr: "कोरमेटा", nameEn: "Kormeta" }
              ]
            },
            {
              id: "gp-1-5",
              serialNo: 5,
              nameMr: "नागलवाडी",
              nameEn: "Nagalwadi",
              villages: [
                { id: "v-1-5-1", serialNo: 10, nameMr: "नागलवाडी", nameEn: "Nagalwadi" },
                { id: "v-1-5-2", serialNo: 11, nameMr: "भोंडेताल", nameEn: "Bhondetal" }
              ]
            },
            {
              id: "gp-1-6",
              serialNo: 6,
              nameMr: "सिरोंजी",
              nameEn: "Sironji",
              villages: [
                { id: "v-1-6-1", serialNo: 12, nameMr: "सिरोंजी", nameEn: "Sironji" },
                { id: "v-1-6-2", serialNo: 13, nameMr: "सुरेवानी", nameEn: "Surewani" }
              ]
            },
            {
              id: "gp-1-7",
              serialNo: 7,
              nameMr: "सोनपूर",
              nameEn: "Sonpur",
              villages: [
                { id: "v-1-7-1", serialNo: 14, nameMr: "सोनपूर", nameEn: "Sonpur" },
                { id: "v-1-7-2", serialNo: 15, nameMr: "राजेगाव (पाण्याखाली)", nameEn: "Rajegaon (Submerged)", notes: "पाण्याखाली (Submerged)" }
              ]
            },
            {
              id: "gp-1-8",
              serialNo: 8,
              nameMr: "रायवाडी",
              nameEn: "Raywadi",
              villages: [
                { id: "v-1-8-1", serialNo: 16, nameMr: "रायवाडी", nameEn: "Raywadi" },
                { id: "v-1-8-2", serialNo: 17, nameMr: "चौरखेरी", nameEn: "Chaurkheri" }
              ]
            },
            {
              id: "gp-1-9",
              serialNo: 9,
              nameMr: "टेंभूरडोह",
              nameEn: "Tembhurdoh",
              villages: [
                { id: "v-1-9-1", serialNo: 18, nameMr: "टेंभूरडोह", nameEn: "Tembhurdoh" },
                { id: "v-1-9-2", serialNo: 19, nameMr: "महारकुंड", nameEn: "Maharkund" }
              ]
            },
            {
              id: "gp-1-10",
              serialNo: 10,
              nameMr: "खडूका",
              nameEn: "Khaduka",
              villages: [
                { id: "v-1-10-1", serialNo: 20, nameMr: "खडूका", nameEn: "Khaduka" },
                { id: "v-1-10-2", serialNo: 21, nameMr: "पोपळा (री.)", nameEn: "Popla (Re.)" },
                { id: "v-1-10-3", serialNo: 22, nameMr: "चारगाव (री.)", nameEn: "Chargaon (Re.)" }
              ]
            }
          ]
        },
        {
          id: "gan-2",
          number: 2,
          nameMr: "खुबाळा",
          nameEn: "Khubala",
          code: "२. खुबाळा",
          gramPanchayats: [
            {
              id: "gp-2-1",
              serialNo: 1,
              nameMr: "खुबाळा",
              nameEn: "Khubala",
              villages: [
                { id: "v-2-1-1", serialNo: 1, nameMr: "खुबाळा", nameEn: "Khubala" },
                { id: "v-2-1-2", serialNo: 2, nameMr: "हिंगणा", nameEn: "Hingna" },
                { id: "v-2-1-3", serialNo: 3, nameMr: "रिसाळा", nameEn: "Risala" }
              ]
            },
            {
              id: "gp-2-2",
              serialNo: 2,
              nameMr: "गडमो",
              nameEn: "Gadmo",
              villages: [
                { id: "v-2-2-1", serialNo: 4, nameMr: "गडमो", nameEn: "Gadmo" },
                { id: "v-2-2-2", serialNo: 5, nameMr: "पेंढरी", nameEn: "Pendhari" },
                { id: "v-2-2-3", serialNo: 6, nameMr: "हेटीखेडा", nameEn: "Hetikheda" },
                { id: "v-2-2-4", serialNo: 7, nameMr: "मोहगाव (ज)", nameEn: "Mohgaon (J)" }
              ]
            },
            {
              id: "gp-2-3",
              serialNo: 3,
              nameMr: "निमतलाई",
              nameEn: "Nimtalai",
              villages: [
                { id: "v-2-3-1", serialNo: 8, nameMr: "निमतलाई", nameEn: "Nimtalai" },
                { id: "v-2-3-2", serialNo: 9, nameMr: "कुसुमंबी", nameEn: "Kusumbi" }
              ]
            },
            {
              id: "gp-2-4",
              serialNo: 4,
              nameMr: "खैरी (प)",
              nameEn: "Khairi (P)",
              villages: [
                { id: "v-2-4-1", serialNo: 10, nameMr: "खैरी (प)", nameEn: "Khairi (P)" },
                { id: "v-2-4-2", serialNo: 11, nameMr: "रामडोंगरी", nameEn: "Ramdongari" },
                { id: "v-2-4-3", serialNo: 12, nameMr: "ढकारा", nameEn: "Dhakara" }
              ]
            },
            {
              id: "gp-2-5",
              serialNo: 5,
              nameMr: "उमरी (जा)",
              nameEn: "Umri (Ja)",
              villages: [
                { id: "v-2-5-1", serialNo: 13, nameMr: "उमरी (जा)", nameEn: "Umri (Ja)" },
                { id: "v-2-5-2", serialNo: 14, nameMr: "बावनगाव", nameEn: "Bawangaon" }
              ]
            },
            {
              id: "gp-2-6",
              serialNo: 6,
              nameMr: "कोच्छी",
              nameEn: "Kochhi",
              villages: [
                { id: "v-2-6-1", serialNo: 15, nameMr: "कोच्छी", nameEn: "Kochhi" }
              ]
            },
            {
              id: "gp-2-7",
              serialNo: 7,
              nameMr: "किरणापूर",
              nameEn: "Kiranapur",
              villages: [
                { id: "v-2-6-1", serialNo: 16, nameMr: "किरणापूर", nameEn: "Kiranapur" },
                { id: "v-2-6-2", serialNo: 17, nameMr: "वाघोली", nameEn: "Wagholi" }
              ]
            },
            {
              id: "gp-2-8",
              serialNo: 8,
              nameMr: "कोथुळणा",
              nameEn: "Kothulna",
              villages: [
                { id: "v-2-8-1", serialNo: 18, nameMr: "कोथुळणा", nameEn: "Kothulna" }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "div-2",
      number: 2,
      nameMr: "वाघोडा",
      nameEn: "Waghoda",
      code: "२. वाघोडा",
      gana: [
        {
          id: "gan-3",
          number: 3,
          nameMr: "वाघोडा",
          nameEn: "Waghoda",
          code: "३. वाघोडा",
          gramPanchayats: [
            {
              id: "gp-3-1",
              serialNo: 1,
              nameMr: "वाघोडा",
              nameEn: "Waghoda",
              villages: [
                { id: "v-3-1-1", serialNo: 1, nameMr: "वाघोडा", nameEn: "Waghoda" },
                { id: "v-3-1-2", serialNo: 2, nameMr: "उमरी (री.)", nameEn: "Umri (Re.)" }
              ]
            },
            {
              id: "gp-3-2",
              serialNo: 2,
              nameMr: "बोरूजवाडा",
              nameEn: "Borujwada",
              villages: [
                { id: "v-3-2-1", serialNo: 3, nameMr: "बोरूजवाडा", nameEn: "Borujwada" }
              ]
            },
            {
              id: "gp-3-3",
              serialNo: 3,
              nameMr: "तिवई",
              nameEn: "Tiwai",
              villages: [
                { id: "v-3-3-1", serialNo: 4, nameMr: "तिवई", nameEn: "Tiwai" }
              ]
            },
            {
              id: "gp-3-4",
              serialNo: 4,
              nameMr: "कोदेगाव",
              nameEn: "Kodegaon",
              villages: [
                { id: "v-3-4-1", serialNo: 5, nameMr: "कोदेगाव", nameEn: "Kodegaon" }
              ]
            },
            {
              id: "gp-3-5",
              serialNo: 5,
              nameMr: "आजनी",
              nameEn: "Ajani",
              villages: [
                { id: "v-3-5-1", serialNo: 6, nameMr: "आजनी", nameEn: "Ajani" },
                { id: "v-3-5-2", serialNo: 7, nameMr: "शेरडी", nameEn: "Sherdi" },
                { id: "v-3-5-3", serialNo: 8, nameMr: "खेडी", nameEn: "Khedi" }
              ]
            }
          ]
        },
        {
          id: "gan-4",
          number: 4,
          nameMr: "मंगसा",
          nameEn: "Mangsa",
          code: "४. मंगसा",
          gramPanchayats: [
            {
              id: "gp-4-1",
              serialNo: 1,
              nameMr: "मंगसा",
              nameEn: "Mangsa",
              villages: [
                { id: "v-4-1-1", serialNo: 1, nameMr: "मंगसा", nameEn: "Mangsa" },
                { id: "v-4-1-2", serialNo: 2, nameMr: "नांदा (खुर्द)", nameEn: "Nanda (Khurd)" }
              ]
            },
            {
              id: "gp-4-2",
              serialNo: 2,
              nameMr: "गडेगाव",
              nameEn: "Gadegaon",
              villages: [
                { id: "v-4-2-1", serialNo: 3, nameMr: "गडेगाव", nameEn: "Gadegaon" },
                { id: "v-4-2-2", serialNo: 4, nameMr: "करजघाट", nameEn: "Karajghat" },
                { id: "v-4-2-3", serialNo: 5, nameMr: "दूधबर्डी", nameEn: "Dudhbardi" }
              ]
            },
            {
              id: "gp-4-3",
              serialNo: 3,
              nameMr: "नांदोल",
              nameEn: "Nandoli",
              villages: [
                { id: "v-4-3-1", serialNo: 6, nameMr: "नांदोल", nameEn: "Nandoli" },
                { id: "v-4-3-2", serialNo: 7, nameMr: "नंदापूर", nameEn: "Nandapur" }
              ]
            },
            {
              id: "gp-4-4",
              serialNo: 4,
              nameMr: "खैरी (ढा.)",
              nameEn: "Khairi (Dha.)",
              villages: [
                { id: "v-4-4-1", serialNo: 8, nameMr: "खैरी (ढा.)", nameEn: "Khairi (Dha.)" }
              ]
            },
            {
              id: "gp-4-5",
              serialNo: 5,
              nameMr: "परसोडी",
              nameEn: "Parsodi",
              villages: [
                { id: "v-4-5-1", serialNo: 9, nameMr: "परसोडी", nameEn: "Parsodi" }
              ]
            },
            {
              id: "gp-4-6",
              serialNo: 6,
              nameMr: "खानगाव",
              nameEn: "Khangaon",
              villages: [
                { id: "v-4-6-1", serialNo: 10, nameMr: "खानगाव", nameEn: "Khangaon" }
              ]
            },
            {
              id: "gp-4-7",
              serialNo: 7,
              nameMr: "खुरजगाव",
              nameEn: "Khurajgaon",
              villages: [
                { id: "v-4-7-1", serialNo: 11, nameMr: "खुरजगाव", nameEn: "Khurajgaon" },
                { id: "v-4-7-2", serialNo: 12, nameMr: "पारडी (री)", nameEn: "Pardi (Re.)" }
              ]
            },
            {
              id: "gp-4-8",
              serialNo: 8,
              nameMr: "सावंगी",
              nameEn: "Sawangi",
              villages: [
                { id: "v-4-8-1", serialNo: 13, nameMr: "सावंगी", nameEn: "Sawangi" },
                { id: "v-4-8-2", serialNo: 14, nameMr: "हेटी (सु.)", nameEn: "Heti (Su.)" }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "div-3",
      number: 3,
      nameMr: "केळवद",
      nameEn: "Kelwad",
      code: "३-केळवद",
      gana: [
        {
          id: "gan-5",
          number: 5,
          nameMr: "केळवद",
          nameEn: "Kelwad",
          code: "५-केळवद",
          gramPanchayats: [
            {
              id: "gp-5-1",
              serialNo: 1,
              nameMr: "केळवद",
              nameEn: "Kelwad",
              villages: [
                { id: "v-5-1-1", serialNo: 1, nameMr: "केळवद", nameEn: "Kelwad" }
              ]
            },
            {
              id: "gp-5-2",
              serialNo: 2,
              nameMr: "हत्तीसरा",
              nameEn: "Hattisara",
              villages: [
                { id: "v-5-2-1", serialNo: 2, nameMr: "हत्तीसरा", nameEn: "Hattisara" },
                { id: "v-5-2-2", serialNo: 3, nameMr: "आष्टी (बु.)", nameEn: "Ashti (Bk.)" },
                { id: "v-5-2-3", serialNo: 4, nameMr: "आष्टी (खु.)", nameEn: "Ashti (Kh.)" },
                { id: "v-5-2-4", serialNo: 5, nameMr: "कवठा", nameEn: "Kawatha" },
                { id: "v-5-2-5", serialNo: 6, nameMr: "जैतगड", nameEn: "Jaitgad" }
              ]
            },
            {
              id: "gp-5-3",
              serialNo: 3,
              nameMr: "रामपूरी",
              nameEn: "Rampuri",
              villages: [
                { id: "v-5-3-1", serialNo: 7, nameMr: "रामपूरी", nameEn: "Rampuri" }
              ]
            },
            {
              id: "gp-5-4",
              serialNo: 4,
              nameMr: "जटामखोरा",
              nameEn: "Jatamkhora",
              villages: [
                { id: "v-5-4-1", serialNo: 8, nameMr: "जटामखोरा", nameEn: "Jatamkhora" },
                { id: "v-5-4-2", serialNo: 9, nameMr: "रायबासा", nameEn: "Raybasa" },
                { id: "v-5-4-3", serialNo: 10, nameMr: "बीडजटामखोरा", nameEn: "Bid-Jatamkhora" }
              ]
            },
            {
              id: "gp-5-5",
              serialNo: 5,
              nameMr: "नरसाळा",
              nameEn: "Narsala",
              villages: [
                { id: "v-5-5-1", serialNo: 11, nameMr: "नरसाळा", nameEn: "Narsala" },
                { id: "v-5-5-2", serialNo: 12, nameMr: "भागेमाहेरी", nameEn: "Bhagemaheri" },
                { id: "v-5-5-3", serialNo: 13, nameMr: "भोजापूर (री.)", nameEn: "Bhojapur (Re.)" },
                { id: "v-5-5-4", serialNo: 14, nameMr: "पोहणा (री.)", nameEn: "Pohana (Re.)" }
              ]
            },
            {
              id: "gp-5-6",
              serialNo: 6,
              nameMr: "पंढरी",
              nameEn: "Pandhari",
              villages: [
                { id: "v-5-6-1", serialNo: 15, nameMr: "पंढरी", nameEn: "Pandhari" }
              ]
            },
            {
              id: "gp-5-7",
              serialNo: 7,
              nameMr: "खापा (न.)",
              nameEn: "Khapa (N.)",
              villages: [
                { id: "v-5-7-1", serialNo: 16, nameMr: "खापा (न.)", nameEn: "Khapa (N.)" },
                { id: "v-5-7-2", serialNo: 17, nameMr: "पिपळा (भ.)", nameEn: "Pipla (Bha.)" }
              ]
            }
          ]
        },
        {
          id: "gan-6",
          number: 6,
          nameMr: "नांदागोमुख",
          nameEn: "Nandagomukh",
          code: "६. नांदागोमुख",
          gramPanchayats: [
            {
              id: "gp-6-1",
              serialNo: 1,
              nameMr: "नांदागोमुख",
              nameEn: "Nandagomukh",
              villages: [
                { id: "v-6-1-1", serialNo: 1, nameMr: "नांदागोमुख", nameEn: "Nandagomukh" }
              ]
            },
            {
              id: "gp-6-2",
              serialNo: 2,
              nameMr: "सावळी (मों.)",
              nameEn: "Sawali (Mo.)",
              villages: [
                { id: "v-6-2-1", serialNo: 2, nameMr: "सावळी (मों.)", nameEn: "Sawali (Mo.)" }
              ]
            },
            {
              id: "gp-6-3",
              serialNo: 3,
              nameMr: "खुर्सीपार",
              nameEn: "Khursipar",
              villages: [
                { id: "v-6-3-1", serialNo: 3, nameMr: "खुर्सीपार", nameEn: "Khursipar" }
              ]
            },
            {
              id: "gp-6-4",
              serialNo: 4,
              nameMr: "जोगा",
              nameEn: "Joga",
              villages: [
                { id: "v-6-4-1", serialNo: 4, nameMr: "जोगा", nameEn: "Joga" }
              ]
            },
            {
              id: "gp-6-5",
              serialNo: 5,
              nameMr: "जैतपूर",
              nameEn: "Jaitpur",
              villages: [
                { id: "v-6-5-1", serialNo: 5, nameMr: "जैतपूर", nameEn: "Jaitpur" },
                { id: "v-6-5-2", serialNo: 6, nameMr: "छात्रापूर", nameEn: "Chhatrapur" }
              ]
            },
            {
              id: "gp-6-6",
              serialNo: 6,
              nameMr: "जलालखेडा",
              nameEn: "Jalalkheda",
              villages: [
                { id: "v-6-6-1", serialNo: 7, nameMr: "जलालखेडा", nameEn: "Jalalkheda" },
                { id: "v-6-6-2", serialNo: 8, nameMr: "बोरगाव (ज.)", nameEn: "Borgaon (J.)" },
                { id: "v-6-6-3", serialNo: 9, nameMr: "जाखेवाडा (री.)", nameEn: "Jakhewada (Re.)" }
              ]
            },
            {
              id: "gp-6-7",
              serialNo: 7,
              nameMr: "तेलंगखेडी",
              nameEn: "Telangkhedi",
              villages: [
                { id: "v-6-7-1", serialNo: 10, nameMr: "तेलंगखेडी", nameEn: "Telangkhedi" },
                { id: "v-6-7-2", serialNo: 11, nameMr: "जुनेवानी (पाण्याखाली)", nameEn: "Junewani (Submerged)", notes: "पाण्याखाली (Submerged)" }
              ]
            },
            {
              id: "gp-6-8",
              serialNo: 8,
              nameMr: "उमरी (भ.)",
              nameEn: "Umri (Bha.)",
              villages: [
                { id: "v-6-8-1", serialNo: 12, nameMr: "उमरी (भ.)", nameEn: "Umri (Bha.)" }
              ]
            },
            {
              id: "gp-6-9",
              serialNo: 9,
              nameMr: "सालई",
              nameEn: "Salai",
              villages: [
                { id: "v-6-9-1", serialNo: 13, nameMr: "सालई", nameEn: "Salai" }
              ]
            },
            {
              id: "gp-6-10",
              serialNo: 10,
              nameMr: "माळेगाव (जो.)",
              nameEn: "Malegaon (Jo.)",
              villages: [
                { id: "v-6-10-1", serialNo: 14, nameMr: "माळेगाव (जो.)", nameEn: "Malegaon (Jo.)" },
                { id: "v-6-10-2", serialNo: 15, nameMr: "खापा (जना.)", nameEn: "Khapa (Jana.)" }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "div-4",
      number: 4,
      nameMr: "पाटणसावंगी",
      nameEn: "Patansawangi",
      code: "४-पाटणसावंगी",
      gana: [
        {
          id: "gan-7",
          number: 7,
          nameMr: "पाटणसावंगी",
          nameEn: "Patansawangi",
          code: "७-पाटणसावंगी",
          gramPanchayats: [
            {
              id: "gp-7-1",
              serialNo: 1,
              nameMr: "पाटणसावंगी",
              nameEn: "Patansawangi",
              villages: [
                { id: "v-7-1-1", serialNo: 1, nameMr: "पाटणसावंगी", nameEn: "Patansawangi" },
                { id: "v-7-1-2", serialNo: 2, nameMr: "कवडस", nameEn: "Kawadas" },
                { id: "v-7-1-3", serialNo: 3, nameMr: "भिडकवडस", nameEn: "Bhidkawadas" }
              ]
            }
          ]
        },
        {
          id: "gan-8",
          number: 8,
          nameMr: "टाकळी (भ.)",
          nameEn: "Takli (Bha.)",
          code: "८. टाकळी (भ.)",
          gramPanchayats: [
            {
              id: "gp-8-1",
              serialNo: 1,
              nameMr: "टाकळी (भ.)",
              nameEn: "Takli (Bha.)",
              villages: [
                { id: "v-8-1-1", serialNo: 1, nameMr: "टाकळी (भ.)", nameEn: "Takli (Bha.)" }
              ]
            },
            {
              id: "gp-8-2",
              serialNo: 2,
              nameMr: "मानेगाव",
              nameEn: "Manegaon",
              villages: [
                { id: "v-8-2-1", serialNo: 2, nameMr: "मानेगाव", nameEn: "Manegaon" },
                { id: "v-8-2-2", serialNo: 3, nameMr: "पंधराखेडी", nameEn: "Pandhrakhedi" }
              ]
            },
            {
              id: "gp-8-3",
              serialNo: 3,
              nameMr: "कुसुमंबी",
              nameEn: "Kusumbi",
              villages: [
                { id: "v-8-3-1", serialNo: 4, nameMr: "कुसुमंबी", nameEn: "Kusumbi" }
              ]
            },
            {
              id: "gp-8-4",
              serialNo: 4,
              nameMr: "कोटोडी",
              nameEn: "Kotodi",
              villages: [
                { id: "v-8-4-1", serialNo: 5, nameMr: "कोटोडी", nameEn: "Kotodi" },
                { id: "v-8-4-2", serialNo: 6, nameMr: "एरनगाव", nameEn: "Erangaon" }
              ]
            },
            {
              id: "gp-8-5",
              serialNo: 5,
              nameMr: "पटकाखेडी",
              nameEn: "Patkakhedi",
              villages: [
                { id: "v-8-8-1", serialNo: 7, nameMr: "पटकाखेडी", nameEn: "Patkakhedi" },
                { id: "v-8-8-2", serialNo: 8, nameMr: "आंगेवाडा", nameEn: "Angewada" }
              ]
            },
            {
              id: "gp-8-6",
              serialNo: 6,
              nameMr: "ब्रम्हपूरी",
              nameEn: "Brahmapuri",
              villages: [
                { id: "v-8-6-1", serialNo: 9, nameMr: "ब्रम्हपूरी", nameEn: "Brahmapuri" }
              ]
            },
            {
              id: "gp-8-7",
              serialNo: 7,
              nameMr: "सिल्लौरी",
              nameEn: "Sillori",
              villages: [
                { id: "v-8-7-1", serialNo: 10, nameMr: "सिल्लौरी", nameEn: "Sillori" }
              ]
            },
            {
              id: "gp-8-8",
              serialNo: 8,
              nameMr: "इतनगोटी",
              nameEn: "Itangoti",
              villages: [
                { id: "v-8-8-1", serialNo: 11, nameMr: "इतनगोटी", nameEn: "Itangoti" },
                { id: "v-8-8-2", serialNo: 12, nameMr: "बेल्लोरी (खु.)", nameEn: "Bellori (Kh.)" }
              ]
            },
            {
              id: "gp-8-9",
              serialNo: 9,
              nameMr: "चांपा",
              nameEn: "Champa",
              villages: [
                { id: "v-8-9-1", serialNo: 13, nameMr: "चांपा", nameEn: "Champa" }
              ]
            },
            {
              id: "gp-8-10",
              serialNo: 10,
              nameMr: "सावरमेंढा",
              nameEn: "Sawarmendha",
              villages: [
                { id: "v-8-10-1", serialNo: 14, nameMr: "सावरमेंढा", nameEn: "Sawarmendha" }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "div-5",
      number: 5,
      nameMr: "वलनी",
      nameEn: "Walani",
      code: "५-वलनी",
      gana: [
        {
          id: "gan-9",
          number: 9,
          nameMr: "वलनी",
          nameEn: "Walani",
          code: "९-वलनी",
          gramPanchayats: [
            {
              id: "gp-9-1",
              serialNo: 1,
              nameMr: "वलनी",
              nameEn: "Walani",
              villages: [
                { id: "v-9-1-1", serialNo: 1, nameMr: "वलनी", nameEn: "Walani" }
              ]
            },
            {
              id: "gp-9-2",
              serialNo: 2,
              nameMr: "पिपळा (डा. बं.)",
              nameEn: "Pipla (Da. Ban.)",
              villages: [
                { id: "v-9-2-1", serialNo: 2, nameMr: "पिपळा (डा. बं.)", nameEn: "Pipla (Da. Ban.)" }
              ]
            }
          ]
        },
        {
          id: "gan-10",
          number: 10,
          nameMr: "वाकोडी",
          nameEn: "Wakodi",
          code: "१०. वाकोडी",
          gramPanchayats: [
            {
              id: "gp-10-1",
              serialNo: 1,
              nameMr: "वाकोडी",
              nameEn: "Wakodi",
              villages: [
                { id: "v-10-1-1", serialNo: 1, nameMr: "वाकोडी", nameEn: "Wakodi" },
                { id: "v-10-1-2", serialNo: 2, nameMr: "डोहनघाट", nameEn: "Dohanghat" },
                { id: "v-10-1-3", serialNo: 3, nameMr: "चौघघाट", nameEn: "Chaughghat" },
                { id: "v-10-1-4", serialNo: 4, nameMr: "बिडचौघघाट", nameEn: "Bid-Chaughghat" }
              ]
            },
            {
              id: "gp-10-2",
              serialNo: 2,
              nameMr: "वाकी",
              nameEn: "Waki",
              villages: [
                { id: "v-10-2-1", serialNo: 5, nameMr: "वाकी", nameEn: "Waki" },
                { id: "v-10-2-2", serialNo: 6, nameMr: "कोदाडोंगरी", nameEn: "Kodadongari" }
              ]
            },
            {
              id: "gp-10-3",
              serialNo: 3,
              nameMr: "गोसेवाडी",
              nameEn: "Gosewadi",
              villages: [
                { id: "v-10-3-1", serialNo: 7, nameMr: "गोसेवाडी", nameEn: "Gosewadi" }
              ]
            },
            {
              id: "gp-10-4",
              serialNo: 4,
              nameMr: "वेल्तूर",
              nameEn: "Veltur",
              villages: [
                { id: "v-10-4-1", serialNo: 8, nameMr: "वेल्तूर", nameEn: "Veltur" }
              ]
            },
            {
              id: "gp-10-5",
              serialNo: 5,
              nameMr: "ईसापूर",
              nameEn: "Isapur",
              villages: [
                { id: "v-10-5-1", serialNo: 9, nameMr: "ईसापूर", nameEn: "Isapur" }
              ]
            },
            {
              id: "gp-10-6",
              serialNo: 6,
              nameMr: "गुमगाव",
              nameEn: "Gumgaon",
              villages: [
                { id: "v-10-6-1", serialNo: 10, nameMr: "गुमगाव", nameEn: "Gumgaon" },
                { id: "v-10-6-2", serialNo: 11, nameMr: "राजना (ह.)", nameEn: "Rajna (H.)" }
              ]
            },
            {
              id: "gp-10-7",
              serialNo: 7,
              nameMr: "भेंडाळा",
              nameEn: "Bhendala",
              villages: [
                { id: "v-10-7-1", serialNo: 12, nameMr: "भेंडाळा", nameEn: "Bhendala" }
              ]
            },
            {
              id: "gp-10-8",
              serialNo: 8,
              nameMr: "माळेगाव (टा)",
              nameEn: "Malegaon (Ta)",
              villages: [
                { id: "v-10-8-1", serialNo: 13, nameMr: "माळेगाव (टा)", nameEn: "Malegaon (Ta)" }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "div-6",
      number: 6,
      nameMr: "चनकापूर",
      nameEn: "Chankapur",
      code: "६-चनकापूर",
      gana: [
        {
          id: "gan-11",
          number: 11,
          nameMr: "चनकापूर",
          nameEn: "Chankapur",
          code: "११-चनकापूर",
          gramPanchayats: [
            {
              id: "gp-11-1",
              serialNo: 1,
              nameMr: "पोटा (चनकापूर)",
              nameEn: "Pota (Chankapur)",
              villages: [
                { id: "v-11-1-1", serialNo: 1, nameMr: "चनकापूर", nameEn: "Chankapur" },
                { id: "v-11-1-2", serialNo: 2, nameMr: "पोटा", nameEn: "Pota" }
              ]
            }
          ]
        },
        {
          id: "gan-12",
          number: 12,
          nameMr: "सिल्लेवाडा",
          nameEn: "Sillewada",
          code: "१२. सिल्लेवाडा",
          gramPanchayats: [
            {
              id: "gp-12-1",
              serialNo: 1,
              nameMr: "सिल्लेवाडा",
              nameEn: "Sillewada",
              villages: [
                { id: "v-12-1-1", serialNo: 1, nameMr: "सिल्लेवाडा", nameEn: "Sillewada" }
              ]
            },
            {
              id: "gp-12-2",
              serialNo: 2,
              nameMr: "दहेगाव (रं)",
              nameEn: "Dahegaon (Ran.)",
              villages: [
                { id: "v-12-2-1", serialNo: 2, nameMr: "दहेगाव (रं)", nameEn: "Dahegaon (Ran.)" },
                { id: "v-12-2-2", serialNo: 3, nameMr: "रनाळा", nameEn: "Ranala" }
              ]
            },
            {
              id: "gp-12-3",
              serialNo: 3,
              nameMr: "रोहना",
              nameEn: "Rohana",
              villages: [
                { id: "v-12-3-1", serialNo: 4, nameMr: "रोहना", nameEn: "Rohana" }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "div-7",
      number: 7,
      nameMr: "चिचोली",
      nameEn: "Chicholi",
      code: "७-चिचोली",
      gana: [
        {
          id: "gan-13",
          number: 13,
          nameMr: "चिचोली",
          nameEn: "Chicholi",
          code: "१३-चिचोली",
          gramPanchayats: [
            {
              id: "gp-13-1",
              serialNo: 1,
              nameMr: "चिचोली",
              nameEn: "Chicholi",
              villages: [
                {
                  id: "v-13-1-1",
                  serialNo: 1,
                  nameMr: "चिचोली वार्ड क्रं. १,२,३,४",
                  nameEn: "Chicholi Ward No. 1, 2, 3, 4",
                  notes: "वार्ड क्रं. १,२,३,४"
                }
              ]
            }
          ]
        },
        {
          id: "gan-14",
          number: 14,
          nameMr: "भानेगाव",
          nameEn: "Bhanegaon",
          code: "१४-भानेगाव",
          gramPanchayats: [
            {
              id: "gp-14-1",
              serialNo: 1,
              nameMr: "भानेगाव",
              nameEn: "Bhanegaon",
              villages: [
                { id: "v-14-1-1", serialNo: 1, nameMr: "भानेगाव", nameEn: "Bhanegaon" },
                {
                  id: "v-14-1-2",
                  serialNo: 2,
                  nameMr: "चिचोली वार्ड क्रं. ५,६",
                  nameEn: "Chicholi Ward No. 5, 6",
                  notes: "वार्ड क्रं. ५,६"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

// Flattened representation for data table & export
export interface FlatRecord {
  id: string;
  talukaMr: string;
  talukaEn: string;
  divisionNumber: number;
  divisionCode: string;
  divisionNameMr: string;
  divisionNameEn: string;
  ganNumber: number;
  ganCode: string;
  ganNameMr: string;
  ganNameEn: string;
  gpSerialNo: number;
  gpNameMr: string;
  gpNameEn: string;
  villageSerialNo: number;
  villageNameMr: string;
  villageNameEn: string;
  notes?: string;
}

export const getFlatRecords = (): FlatRecord[] => {
  const records: FlatRecord[] = [];
  SAVNER_HIERARCHY.divisions.forEach((div) => {
    div.gana.forEach((gan) => {
      gan.gramPanchayats.forEach((gp) => {
        gp.villages.forEach((village) => {
          records.push({
            id: village.id,
            talukaMr: SAVNER_HIERARCHY.talukaMr,
            talukaEn: SAVNER_HIERARCHY.talukaEn,
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

export const getHierarchyStats = () => {
  const totalDivisions = SAVNER_HIERARCHY.divisions.length;
  let totalGana = 0;
  let totalGps = 0;
  let totalVillages = 0;

  SAVNER_HIERARCHY.divisions.forEach((div) => {
    totalGana += div.gana.length;
    div.gana.forEach((gan) => {
      totalGps += gan.gramPanchayats.length;
      gan.gramPanchayats.forEach((gp) => {
        totalVillages += gp.villages.length;
      });
    });
  });

  return {
    totalDivisions,
    totalGana,
    totalGps,
    totalVillages,
  };
};
