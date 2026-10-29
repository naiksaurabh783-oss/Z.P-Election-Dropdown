import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize Gemini SDK with User-Agent header per gemini-api skill
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Endpoint to extract hierarchical ward structure from any uploaded Maharashtra Panchayat Samiti PDF
app.post('/api/extract-pdf', async (req, res) => {
  try {
    const { pdfBase64, filename } = req.body;
    if (!pdfBase64) {
      return res.status(400).json({ error: 'Missing pdfBase64 in request body' });
    }

    const cleanBase64 = pdfBase64.replace(/^data:application\/pdf;base64,/, '');

    const systemPrompt = `You are an expert administrative document parser for Maharashtra Government Gazettes and Collectorate Notifications.
You specialize in parsing 'परिशिष्ट - ८ (ब) (पंचायत समिती - अंतिम प्रभाग रचनेकरिता) नमुना' schedules under Maharashtra Zilla Parishad and Panchayat Samitis Act, 1961 (कलम ५८(१)(अ)).

Extract the complete hierarchical administrative structure from the attached PDF document:
Columns in the schedule:
Col 1: तालुक्याचे नाव (Taluka Name)
Col 2: निवडणूक विभागाचा क्रमांक व नाव (Electoral Division No. & Name)
Col 3: निर्वाचक गणाचा क्रमांक व नाव (Electoral Gan No. & Name)
Col 4: निर्वाचक गणात समाविष्ट असलेल्या ग्रामपंचायतींची नावे (Gram Panchayat Names)
Col 5: ग्रामपंचायतीच्या मर्यादेत समाविष्ट असलेले क्षेत्र (गावे/वस्त्या/तांडे इत्यादींची नावे) (Villages, Habitations, Wards)

Extract every single Division, Gan, Gram Panchayat, and Village/Area accurately.
Provide both Marathi (original) and English (transliteration / translation) names.
Note any special designations in 'notes' (e.g. 'पाण्याखाली' (submerged), 'री.' (re.), 'वार्ड क्रं.' (ward nos)).`;

    let response;
    let attempts = 0;
    while (attempts < 2) {
      try {
        attempts++;
        response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: [
            {
              parts: [
                {
                  inlineData: {
                    mimeType: 'application/pdf',
                    data: cleanBase64,
                  },
                },
                {
                  text: 'Please extract the entire 6-level administrative hierarchy from this Panchayat Samiti ward gazette into JSON.',
                },
              ],
            },
          ],
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                districtMr: { type: Type.STRING },
                districtEn: { type: Type.STRING },
                talukaMr: { type: Type.STRING },
                talukaEn: { type: Type.STRING },
                notificationNumber: { type: Type.STRING },
                notificationDateMr: { type: Type.STRING },
                orderNumber: { type: Type.STRING },
                orderDateMr: { type: Type.STRING },
                issuingAuthorityMr: { type: Type.STRING },
                issuingAuthorityEn: { type: Type.STRING },
                divisions: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      number: { type: Type.INTEGER },
                      nameMr: { type: Type.STRING },
                      nameEn: { type: Type.STRING },
                      code: { type: Type.STRING },
                      gana: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            id: { type: Type.STRING },
                            number: { type: Type.INTEGER },
                            nameMr: { type: Type.STRING },
                            nameEn: { type: Type.STRING },
                            code: { type: Type.STRING },
                            gramPanchayats: {
                              type: Type.ARRAY,
                              items: {
                                type: Type.OBJECT,
                                properties: {
                                  id: { type: Type.STRING },
                                  serialNo: { type: Type.INTEGER },
                                  nameMr: { type: Type.STRING },
                                  nameEn: { type: Type.STRING },
                                  villages: {
                                    type: Type.ARRAY,
                                    items: {
                                      type: Type.OBJECT,
                                      properties: {
                                        id: { type: Type.STRING },
                                        serialNo: { type: Type.INTEGER },
                                        nameMr: { type: Type.STRING },
                                        nameEn: { type: Type.STRING },
                                        notes: { type: Type.STRING },
                                      },
                                      required: ['id', 'serialNo', 'nameMr', 'nameEn'],
                                    },
                                  },
                                },
                                required: ['id', 'serialNo', 'nameMr', 'nameEn', 'villages'],
                              },
                            },
                          },
                          required: ['id', 'number', 'nameMr', 'nameEn', 'code', 'gramPanchayats'],
                        },
                      },
                    },
                    required: ['id', 'number', 'nameMr', 'nameEn', 'code', 'gana'],
                  },
                },
              },
              required: [
                'districtMr',
                'districtEn',
                'talukaMr',
                'talukaEn',
                'divisions',
              ],
            },
          },
        });
        break;
      } catch (err: any) {
        if (attempts >= 2) throw err;
        console.warn('First attempt failed, retrying in 2 seconds...', err?.message);
        await new Promise((r) => setTimeout(r, 2000));
      }
    }

    const parsedJson = JSON.parse(response?.text || '{}');
    parsedJson.isVerifiedFromPdf = true;
    parsedJson.sourcePdfFilename = filename || 'Uploaded_Gazette.pdf';
    return res.json({ success: true, data: parsedJson });
  } catch (error: any) {
    console.error('Extraction error:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to extract PDF hierarchy',
    });
  }
});

// Setup Vite middleware in development
async function startServer() {
  const http = await import('http');
  const server = http.createServer(app);

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: { server },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
