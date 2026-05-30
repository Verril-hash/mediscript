import { useState, useRef, useEffect } from 'react';
import {
  CheckCircle2, Sparkles, Clock, UploadCloud,
  AlertCircle, Sun, Moon, ArrowUpRight, Camera, Share2,
  User, AlertTriangle, RefreshCw, MousePointer,
  Shield, Globe, Menu, X, Volume2, VolumeX, Bell
} from 'lucide-react';

type Page = 'landing' | 'upload' | 'results' | 'features' | 'how-it-works' | 'about';
type Language = 'en' | 'hi' | 'kn';

interface TranslatedDetails {
  purpose: string;
  dosage: string;
  duration: string;
  sideEffects: string[];
  interactionWarning: string;
}

interface Medication {
  id: string;
  name: string; // Brand (Generic)
  confidence: number;
  translations: {
    en: TranslatedDetails;
    hi: TranslatedDetails;
    kn: TranslatedDetails;
  };
}

interface Prescription {
  id: string;
  name: string;
  date: string;
  patient: string;
  clinic: string;
  medications: Medication[];
  interactionAlert: {
    en: string;
    hi: string;
    kn: string;
  };
}

const SEED_PRESCRIPTIONS: Prescription[] = [
  {
    id: 'rx_pantocid_dol_920',
    name: 'rx_pantocid_dol_verma.jpg',
    date: 'Today, 10:30 AM',
    patient: 'Amit Sharma',
    clinic: "Dr. Verma's Family Clinic, New Delhi",
    interactionAlert: {
      en: 'No dangerous drug interactions found. Pantocid is safe to take alongside Dolo 650.',
      hi: 'दवाइयों के बीच कोई खतरनाक परस्पर प्रभाव (interaction) नहीं पाया गया। पैनटोसिड को डोलो ६५० के साथ लेना सुरक्षित है।',
      kn: 'ಯಾವುದೇ ಅಪಾಯಕಾರಿ ಔಷಧಗಳ ಪರಸ್ಪರ ಕ್ರಿಯೆ ಕಂಡುಬಂದಿಲ್ಲ. ಪ್ಯಾಂಟೊಸಿಡ್ ಅನ್ನು ಡೋಲೋ ೬೫೦ ರೊಂದಿಗೆ ತೆಗೆದುಕೊಳ್ಳುವುದು ಸುರಕ್ಷಿತವಾಗಿದೆ.'
    },
    medications: [
      {
        id: 'med_1',
        name: 'Pantocid 40mg (Pantoprazole)',
        confidence: 98,
        translations: {
          en: {
            purpose: 'Used for reducing stomach acid, preventing heartburn, and treating acidity.',
            dosage: '1 tablet daily in the morning, 30 minutes before breakfast.',
            duration: 'Take for 5 days.',
            sideEffects: ['Headache', 'Mild stomach discomfort', 'Nausea'],
            interactionWarning: 'Take on an empty stomach. Do not take with heavy meals.'
          },
          hi: {
            purpose: 'पेट में एसिड (गैस) को कम करने, सीने में जलन से बचने और एसिडिटी के इलाज के लिए।',
            dosage: 'रोजाना सुबह 1 गोली, नाश्ते से 30 मिनट पहले खाली पेट लें।',
            duration: '5 दिनों तक लें।',
            sideEffects: ['सिरदर्द', 'पेट में हल्का दर्द', 'जी मिचलाना'],
            interactionWarning: 'खाली पेट लें। भारी भोजन के साथ न लें।'
          },
          kn: {
            purpose: 'ಹೊಟ್ಟೆಯ ಆಮ್ಲೀಯತೆ ಮತ್ತು ಎದೆಯುರಿ ಕಡಿಮೆ ಮಾಡಲು ಬಳಸಲಾಗುತ್ತದೆ.',
            dosage: 'ಪ್ರತಿದಿನ ಬೆಳಿಗ್ಗೆ ಉಪಹಾರಕ್ಕಿಂತ 30 ನಿಮಿಷಗಳ ಮೊದಲು 1 ಮಾತ್ರೆ ತೆಗೆದುಕೊಳ್ಳಿ.',
            duration: '5 ದಿನಗಳವರೆಗೆ ತೆಗೆದುಕೊಳ್ಳಿ.',
            sideEffects: ['ತಲೆನೋವು', 'ಲಘು ಹೊಟ್ಟೆ ನೋವು', 'ವಾಕರಿಕೆ'],
            interactionWarning: 'ಖಾಲಿ ಹೊಟ್ಟೆಯಲ್ಲಿ ತೆಗೆದುಕೊಳ್ಳಿ. ಭಾರಿ ಆಹಾರದೊಂದಿಗೆ ತೆಗೆದುಕೊಳ್ಳಬೇಡಿ.'
          }
        }
      },
      {
        id: 'med_2',
        name: 'Dolo 650 (Paracetamol)',
        confidence: 97,
        translations: {
          en: {
            purpose: 'Used for lowering fever and relieving body pain or headache.',
            dosage: '1 tablet after meals, only if you have fever or pain (maximum 3 times a day).',
            duration: 'Take for 3 days or as needed.',
            sideEffects: ['Sweating', 'Sleepiness', 'Mild skin itching (rare)'],
            interactionWarning: 'Do not take on an empty stomach. Avoid taking other paracetamol medicines at the same time.'
          },
          hi: {
            purpose: 'बुखार को कम करने और बदन दर्द या सिरदर्द से राहत पाने के लिए।',
            dosage: 'खाना खाने के बाद 1 गोली लें, केवल बुखार या दर्द होने पर (दिन में अधिकतम 3 बार)।',
            duration: '3 दिनों तक या आवश्यकतानुसार लें।',
            sideEffects: ['पसीना आना', 'नींद आना', 'हल्की खुजली (दुर्लभ)'],
            interactionWarning: 'खाली पेट न लें। इसके साथ कोई अन्य पैरासिटामोल दवा न लें।'
          },
          kn: {
            purpose: 'ಜ್ವರವನ್ನು ಕಡಿಮೆ ಮಾಡಲು ಮತ್ತು ಮೈಕೈ ನೋವು ಅಥವಾ ತಲೆನೋವು ನಿವಾರಿಸಲು ಬಳಸಲಾಗುತ್ತದೆ.',
            dosage: 'ಊಟದ ನಂತರ 1 ಮಾತ್ರೆ ತಗೋಬೇಕು, ಜ್ವರ ಅಥವಾ ನೋವು ಇದ್ದಾಗ ಮಾತ್ರ (ದಿನಕ್ಕೆ ಗರಿಷ್ಠ 3 ಬಾರಿ).',
            duration: '3 ದಿನಗಳವರೆಗೆ ಅಥವಾ ಅಗತ್ಯವಿದ್ದಾಗ ತೆಗೆದುಕೊಳ್ಳಿ.',
            sideEffects: ['ಬೆವರುವುದು', 'ನಿದ್ದೆ ಬರುವುದು', 'ಚರ್ಮದ ತುರಿಕೆ (ಅಪರೂಪ)'],
            interactionWarning: 'ಖಾಲಿ ಹೊಟ್ಟೆಯಲ್ಲಿ ತೆಗೆದುಕೊಳ್ಳಬೇಡಿ. ಇದರೊಂದಿಗೆ ಇತರ ಪ್ಯಾರಸಿಟಮಾಲ್ ಔಷಧಗಳನ್ನು ತೆಗೆದುಕೊಳ್ಳಬೇಡಿ.'
          }
        }
      }
    ]
  },
  {
    id: 'rx_cough_cold_919',
    name: 'rx_cough_cold_narayana.png',
    date: 'Yesterday, 4:15 PM',
    patient: 'Meera Gowda',
    clinic: 'Narayana Health, Bengaluru',
    interactionAlert: {
      en: 'Warning: Alex Syrup can cause drowsiness. Do not drive or operate machinery after consumption.',
      hi: 'चेतावनी: एलेक्स सिरप से नींद आ सकती है। इसके सेवन के बाद वाहन न चलाएं या मशीनरी पर काम न करें।',
      kn: 'ಎಚ್ಚರಿಕೆ: ಅಲೆಕ್ಸ್ ಸಿರಪ್ ತೂಕಡಿಕೆಯನ್ನು ಉಂಟುಮಾಡಬಹುದು. ಇದರ ಸೇವನೆಯ ನಂತರ ವಾಹನ ಚಾಲನೆ ಮಾಡಬೇಡಿ.'
    },
    medications: [
      {
        id: 'med_3',
        name: 'Azithromycin 500mg',
        confidence: 94,
        translations: {
          en: {
            purpose: 'An antibiotic used to treat bacterial throat, nose, and lung infections.',
            dosage: '1 tablet once daily, 1 hour before food or 2 hours after food.',
            duration: 'Take for 3 days.',
            sideEffects: ['Diarrhea', 'Stomach ache', 'Loss of appetite'],
            interactionWarning: 'Finish the full 3-day course even if you feel better.'
          },
          hi: {
            purpose: 'गले, नाक और फेफड़ों के बैक्टीरियल संक्रमण के इलाज के लिए एक एंटीबायोटिक।',
            dosage: 'रोजाना एक बार 1 गोली, भोजन से 1 घंटे पहले या भोजन के 2 घंटे बाद लें।',
            duration: '3 दिनों तक लें।',
            sideEffects: ['दस्त होना', 'पेट दर्द', 'भूख न लगना'],
            interactionWarning: 'बेहतर महसूस होने पर भी 3 दिन का पूरा कोर्स खत्म करें।'
          },
          kn: {
            purpose: 'ಗಂಟಲು, ಮೂಗು ಮತ್ತು ಶ್ವಾಸಕೋಶದ ಬ್ಯಾಕ್ಟೀರಿಯಾದ ಸೋಂಕನ್ನು ಗುಣಪಡಿಸಲು ಬಳಸುವ ಆಂಟಿಬಯೋಟಿಕ್.',
            dosage: 'ದಿನಕ್ಕೆ ಒಂದು ಬಾರಿ 1 ಮಾತ್ರೆ, ಊಟಕ್ಕೆ 1 ಗಂಟೆ ಮೊದಲು ಅಥವಾ ಊಟದ 2 ಗಂಟೆ ನಂತರ ತೆಗೆದುಕೊಳ್ಳಿ.',
            duration: '3 ದಿನಗಳವರೆಗೆ ತೆಗೆದುಕೊಳ್ಳಿ.',
            sideEffects: ['ಅತಿಸಾರ', 'ಹೊಟ್ಟೆ ನೋವು', 'ಹಸಿವು ಕಡಿಮೆಯಾಗುವುದು'],
            interactionWarning: 'ಗುಣಮುಖರಾದಂತೆ ಅನಿಸಿದರೂ 3 ದಿನಗಳ ಪೂರ್ಣ ಕೋರ್ಸ್ ಮುಗಿಸಿ.'
          }
        }
      },
      {
        id: 'med_4',
        name: 'Alex Syrup (Cough Relief)',
        confidence: 92,
        translations: {
          en: {
            purpose: 'Used for relieving dry cough and throat irritation.',
            dosage: '10ml (2 teaspoons) before going to sleep.',
            duration: 'Take for 5 days or until dry cough stops.',
            sideEffects: ['Drowsiness', 'Dry mouth', 'Lightheadedness'],
            interactionWarning: 'Avoid drinking water immediately after taking the syrup. Do not consume alcohol.'
          },
          hi: {
            purpose: 'सूखी खांसी और गले की खराश से राहत के लिए।',
            dosage: 'सोने से पहले 10 मिली (2 चम्मच) लें।',
            duration: '5 दिनों तक या सूखी खांसी बंद होने तक लें।',
            sideEffects: ['नींद आना', 'मुंह सूखना', 'चक्कर आना'],
            interactionWarning: 'सिरप लेने के तुरंत बाद पानी न पिएं। शराब का सेवन न करें।'
          },
          kn: {
            purpose: 'ಒಣ ಕೆಮ್ಮು ಮತ್ತು ಗಂಟಲಿನ ಕಿರಿಕಿರಿಯನ್ನು ನಿವಾರಿಸಲು ಬಳಸಲಾಗುತ್ತದೆ.',
            dosage: 'ಮಲಗುವ ಮುನ್ನ 10 ಮಿಲಿ (2 ಚಮಚ) ತೆಗೆದುಕೊಳ್ಳಿ.',
            duration: '5 ದಿನಗಳವರೆಗೆ ಅಥವಾ ಒಣ ಕೆಮ್ಮು ನಿಲ್ಲುವವರೆಗೆ ತೆಗೆದುಕೊಳ್ಳಿ.',
            sideEffects: ['ತೂಕಡಿಕೆ', 'ಬಾಯಿ ಒಣಗುವುದು', 'ತಲೆತಿರುಗುವಿಕೆ'],
            interactionWarning: 'ಸಿರಪ್ ತೆಗೆದುಕೊಂಡ ತಕ್ಷಣ ನೀರು ಕುಡಿಯಬೇಡಿ. ಆಲ್ಕೋಹಾಲ್ ಸೇವಿಸಬೇಡಿ.'
          }
        }
      }
    ]
  }
];

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [activeLanguage, setActiveLanguage] = useState<Language>('en');

  // B2C interactive visual enrichment states
  const [hoveredScribble, setHoveredScribble] = useState<'pantocid' | 'dolo' | null>(null);
  const [playgroundLanguage, setPlaygroundLanguage] = useState<Language>('en');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const [prescriptions, setPrescriptions] = useState<Prescription[]>(() => {
    try {
      const saved = localStorage.getItem('mediscript_rx');
      if (saved) {
        const parsed: Prescription[] = JSON.parse(saved);
        const savedIds = new Set(parsed.map((p) => p.id));
        const seedOnly = SEED_PRESCRIPTIONS.filter((p) => !savedIds.has(p.id));
        return [...parsed, ...seedOnly];
      }
    } catch {}
    return SEED_PRESCRIPTIONS;
  });
  const [selectedRxId, setSelectedRxId] = useState<string>('rx_pantocid_dol_920');

  // Voice readout state
  const [speakingMedId, setSpeakingMedId] = useState<string | null>(null);

  // Ask AI state
  const [askQuery, setAskQuery] = useState('');
  const [askAnswer, setAskAnswer] = useState<string | null>(null);
  const [isAsking, setIsAsking] = useState(false);

  // Remind Me state: medId -> scheduled time label
  const [reminders, setReminders] = useState<Record<string, string>>({});

  // Real camera refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);

  // Scanning simulation states
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadStage, setUploadStage] = useState<'idle' | 'uploading' | 'decoding' | 'translating'>('idle');
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isLaserScanning, setIsLaserScanning] = useState<boolean>(false);

  // Mock Camera Modal
  const [showCameraModal, setShowCameraModal] = useState<boolean>(false);
  const [isShutterFlashing, setIsShutterFlashing] = useState<boolean>(false);

  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Persist prescriptions to localStorage whenever they change
  useEffect(() => {
    try {
      // Only persist AI-decoded ones (skip seed data to avoid bloat)
      const toSave = prescriptions.filter((p) => !p.id.startsWith('rx_pantocid') && !p.id.startsWith('rx_cough'));
      localStorage.setItem('mediscript_rx', JSON.stringify(toSave));
    } catch {}
  }, [prescriptions]);

  // Global toast system
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'info'>('success');

  const triggerToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Trigger laser scanner sweep animation on results load
  useEffect(() => {
    if (currentPage === 'results') {
      setIsLaserScanning(true);
      const timer = setTimeout(() => {
        setIsLaserScanning(false);
      }, 2200);
      return () => clearTimeout(timer);
    }
  }, [currentPage, selectedRxId]);

  // Read a File as a base64 string (data portion only)
  const readFileAsBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]); // strip "data:...;base64," prefix
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  // Real AI decode pipeline — calls /api/decode with the actual image
  const processRealPrescription = async (file: File) => {
    setUploadedFileName(file.name);
    setIsUploading(true);
    setUploadProgress(0);
    setUploadStage('uploading');

    try {
      // Stage 1: read file
      const base64 = await readFileAsBase64(file);
      setUploadProgress(30);
      setUploadStage('decoding');

      // Stage 2: call OpenAI via our serverless API
      const response = await fetch('/api/decode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: base64,
          mimeType: file.type || 'image/jpeg',
          fileName: file.name,
        }),
      });

      setUploadProgress(80);
      setUploadStage('translating');

      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(err.error || `Server error ${response.status}`);
      }

      const prescription: Prescription = await response.json();
      setUploadProgress(100);

      setTimeout(() => {
        setPrescriptions((prev) => [prescription, ...prev]);
        setSelectedRxId(prescription.id);
        setIsUploading(false);
        setUploadStage('idle');
        triggerToast('Prescription decoded successfully!', 'success');
        setCurrentPage('results');
      }, 400);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('Upload error:', message);
      setIsUploading(false);
      setUploadStage('idle');
      setUploadProgress(0);
      triggerToast(`Could not decode prescription: ${message}`, 'info');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processRealPrescription(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processRealPrescription(e.dataTransfer.files[0]);
    }
  };

  // ── Real Camera ──
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
      });
      cameraStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      triggerToast('Camera access denied. Please allow camera permission.', 'info');
      setShowCameraModal(false);
    }
  };

  const stopCamera = () => {
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach((t) => t.stop());
      cameraStreamRef.current = null;
    }
  };

  const captureFromCamera = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    setIsShutterFlashing(true);
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], 'camera_prescription.jpg', { type: 'image/jpeg' });
          setTimeout(() => {
            setIsShutterFlashing(false);
            stopCamera();
            setShowCameraModal(false);
            processRealPrescription(file);
          }, 200);
        }
      },
      'image/jpeg',
      0.92,
    );
  };

  // Start/stop camera stream with modal visibility
  useEffect(() => {
    if (showCameraModal) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showCameraModal]);

  // ── Voice Readout ──
  const speakMedicine = (med: Medication, lang: Language) => {
    if (!('speechSynthesis' in window)) {
      triggerToast('Voice not supported in this browser.', 'info');
      return;
    }
    if (speakingMedId === med.id) {
      window.speechSynthesis.cancel();
      setSpeakingMedId(null);
      return;
    }
    window.speechSynthesis.cancel();
    const t = med.translations[lang];
    const langCode = lang === 'hi' ? 'hi-IN' : lang === 'kn' ? 'kn-IN' : 'en-IN';
    const text = `${med.name}. ${t.purpose}. ${t.dosage}. ${t.duration}.`;
    const utterance = new SpeechSynthesisUtterance(text);

    // Check if a voice for the requested language is available
    const voices = window.speechSynthesis.getVoices();
    const matchedVoice =
      voices.find((v) => v.lang === langCode) ||
      voices.find((v) => v.lang.startsWith(lang));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
      utterance.lang = matchedVoice.lang;
    } else if (lang === 'kn') {
      // kn-IN voice not installed — fall back to English so audio still plays
      triggerToast('Kannada voice not found on this device — reading in English.', 'info');
      const enVoice = voices.find((v) => v.lang === 'en-IN') || voices.find((v) => v.lang.startsWith('en')) || null;
      if (enVoice) utterance.voice = enVoice;
      utterance.lang = 'en-IN';
    } else {
      utterance.lang = langCode;
    }

    utterance.rate = 0.88;
    utterance.onend = () => setSpeakingMedId(null);
    utterance.onerror = () => setSpeakingMedId(null);
    setSpeakingMedId(med.id);
    window.speechSynthesis.speak(utterance);
  };

  // PDF export via browser print
  const handleSavePDF = () => {
    const rx = prescriptions.find((p) => p.id === selectedRxId) || prescriptions[0];
    const lang = activeLanguage;
    const langLabel = lang === 'hi' ? 'Hindi' : lang === 'kn' ? 'Kannada' : 'English';

    const rows = rx.medications.map((med, idx) => {
      const d = med.translations[lang];
      return `
        <tr>
          <td>${idx + 1}. <strong>${med.name}</strong></td>
          <td>${d.purpose}</td>
          <td>${d.dosage}</td>
          <td>${d.duration}</td>
          <td>${d.interactionWarning || '—'}</td>
        </tr>`;
    }).join('');

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>MediScript Report — ${rx.patient}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Inter, sans-serif; color: #111; padding: 40px; font-size: 13px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #8E6878; padding-bottom: 16px; margin-bottom: 24px; }
    .brand { font-size: 22px; font-weight: 700; color: #8E6878; letter-spacing: -0.5px; }
    .brand span { font-size: 11px; font-weight: 400; color: #888; display: block; margin-top: 2px; }
    .meta { text-align: right; font-size: 12px; color: #555; line-height: 1.7; }
    table { width: 100%; border-collapse: collapse; margin-top: 8px; }
    th { background: #8E6878; color: white; text-align: left; padding: 9px 12px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
    td { padding: 9px 12px; border-bottom: 1px solid #eee; vertical-align: top; line-height: 1.5; }
    tr:nth-child(even) td { background: #fafafa; }
    .footer { margin-top: 32px; padding-top: 14px; border-top: 1px solid #ddd; font-size: 11px; color: #999; display: flex; justify-content: space-between; }
    @media print { body { padding: 24px; } }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">MediScript<span>AI Prescription Decoder</span></div>
    </div>
    <div class="meta">
      <strong>${rx.clinic}</strong><br/>
      Patient: ${rx.patient}${rx.date ? '<br/>Date: ' + rx.date : ''}<br/>
      Language: ${langLabel}
    </div>
  </div>
  <table>
    <thead>
      <tr>
        <th>Medicine</th><th>Purpose</th><th>Dosage</th><th>Duration</th><th>Warnings</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
  <div class="footer">
    <span>This report is for informational purposes only. Always follow your doctor's instructions.</span>
    <span>mediscript.vercel.app</span>
  </div>
</body>
</html>`;

    const win = window.open('', '_blank');
    if (!win) {
      triggerToast('Allow pop-ups to save the PDF.', 'info');
      return;
    }
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); }, 600);
    triggerToast('Print dialog opened — save as PDF.', 'success');
  };

  // Ask AI
  const handleAskAI = async () => {
    if (!askQuery.trim()) return;
    setIsAsking(true);
    setAskAnswer(null);
    const rx = prescriptions.find((p) => p.id === selectedRxId) || prescriptions[0];
    const lang = activeLanguage;
    const context = rx.medications.map((m) => {
      const d = m.translations[lang];
      return `${m.name}: ${d.purpose}. Dosage: ${d.dosage}. Duration: ${d.duration}. Warning: ${d.interactionWarning}`;
    }).join('\n');
    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: askQuery, context }),
      });
      const data = await res.json();
      setAskAnswer(data.answer || 'Sorry, could not get an answer.');
    } catch {
      setAskAnswer('Network error. Please try again.');
    } finally {
      setIsAsking(false);
    }
  };

  // Remind Me
  const handleRemindMe = (med: Medication, hoursFromNow: number) => {
    if (!('Notification' in window)) {
      triggerToast('Notifications not supported in this browser.', 'info');
      return;
    }
    const scheduleNotification = () => {
      const label = hoursFromNow < 1
        ? `${hoursFromNow * 60} min`
        : `${hoursFromNow}h`;
      setTimeout(() => {
        new Notification('MediScript Reminder 💊', {
          body: `Time to take ${med.name} — ${med.translations['en'].dosage}`,
          icon: '/logo.jpeg',
        });
      }, hoursFromNow * 60 * 60 * 1000);
      setReminders((r) => ({ ...r, [med.id]: `In ${label}` }));
      triggerToast(`Reminder set for ${med.name} in ${label}`, 'success');
    };
    if (Notification.permission === 'granted') {
      scheduleNotification();
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then((perm) => {
        if (perm === 'granted') scheduleNotification();
        else triggerToast('Please allow notifications to set reminders.', 'info');
      });
    } else {
      triggerToast('Notifications blocked. Enable them in browser settings.', 'info');
    }
  };

  // WhatsApp share
  const handleShareResult = () => {
    const rx = prescriptions.find((p) => p.id === selectedRxId) || prescriptions[0];
    const lang = activeLanguage;

    const date = rx.date ? `  Date: ${rx.date}\n` : '';
    let shareText = `*MEDISCRIPT — Prescription Breakdown*\n`;
    shareText += `${'─'.repeat(32)}\n`;
    shareText += `  Clinic:   ${rx.clinic}\n`;
    shareText += `  Patient:  ${rx.patient}\n`;
    shareText += date;
    shareText += `${'─'.repeat(32)}\n\n`;

    rx.medications.forEach((med, idx) => {
      const details = med.translations[lang];
      shareText += `*${idx + 1}. ${med.name.toUpperCase()}*\n`;
      shareText += `  Purpose:  ${details.purpose}\n`;
      shareText += `  Dosage:   ${details.dosage}\n`;
      shareText += `  Duration: ${details.duration}\n`;
      if (details.interactionWarning) {
        shareText += `  Note:     ${details.interactionWarning}\n`;
      }
      shareText += `\n`;
    });

    shareText += `${'─'.repeat(32)}\n`;
    shareText += `_This is an AI-decoded summary for informational purposes only. Always follow your doctor's instructions._\n\n`;
    shareText += `Decoded by MediScript · mediscript.vercel.app`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    triggerToast('Opening WhatsApp to share breakdown!', 'success');
  };

  const activeRx = prescriptions.find((p) => p.id === selectedRxId) || prescriptions[0];

  return (
    <div className={`min-h-screen font-sans antialiased selection:bg-[#8E6878]/15 selection:text-[#8E6878] relative flex flex-col justify-between overflow-x-hidden transition-colors duration-400 ${
      theme === 'dark' ? 'dark bg-[#0A0A0A] text-[#EDEDED]' : 'bg-[#FAFAFA] text-[#111111]'
    }`}>
      
      {/* Subtle dot grid background */}
      <div 
        className="fixed inset-0 dot-grid z-0 pointer-events-none" 
        style={{ 
          maskImage: 'radial-gradient(ellipse at 50% 30%, black 20%, transparent 70%)', 
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 30%, black 20%, transparent 70%)' 
        }} 
      />

      {/* Single restrained ambient glow */}
      <div className="fixed top-[-15%] left-[50%] -translate-x-1/2 w-[60vw] h-[40vw] bg-[#8E6878]/[0.04] dark:bg-[#8E6878]/[0.03] rounded-full blur-[100px] pointer-events-none z-0" />

      {/* Toast Notifications */}
      {toastMessage && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 sm:bottom-auto sm:top-20 sm:right-4 sm:left-auto sm:translate-x-0 z-[200] pointer-events-none">
          <div className="py-2.5 px-4 rounded-xl shadow-xl flex items-center gap-2 bg-[#111111] dark:bg-[#EDEDED] text-white dark:text-[#111111] text-[12.5px] font-semibold whitespace-nowrap max-w-[90vw] sm:max-w-xs">
            <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${toastType === 'success' ? 'bg-[#10B981]' : 'bg-[#8E6878]'}`} />
            <span className="truncate">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <header className="fixed top-0 inset-x-0 z-50 pointer-events-none">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-3 sm:pt-4">
          <div className="glass-nav border border-black/[0.06] dark:border-white/[0.06] rounded-2xl px-4 sm:px-5 h-14 flex items-center justify-between pointer-events-auto">
            
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setCurrentPage('landing'); setMobileMenuOpen(false); }}>
              <img src="/logo.jpeg" alt="MediScript" className="w-8 h-8 rounded-lg object-cover shadow-sm" />
              <span className="font-extrabold text-[16px] text-[#111111] dark:text-white tracking-tight">MediScript</span>
              <span className="text-[9px] font-bold text-[#8E6878] bg-[#8E6878]/[0.08] px-1.5 py-0.5 rounded-full uppercase tracking-widest hidden sm:inline-block">AI</span>
            </div>

            <nav className="hidden md:flex items-center gap-6 text-[13px] font-semibold text-[#666666] dark:text-[#999999]">
              <span onClick={() => { setCurrentPage('features'); window.scrollTo(0,0); }} className="hover:text-[#111111] dark:hover:text-white cursor-pointer transition-colors">Features</span>
              <span onClick={() => { setCurrentPage('how-it-works'); window.scrollTo(0,0); }} className="hover:text-[#111111] dark:hover:text-white cursor-pointer transition-colors">How it works</span>
              <span onClick={() => { setCurrentPage('about'); window.scrollTo(0,0); }} className="hover:text-[#111111] dark:hover:text-white cursor-pointer transition-colors">About</span>
            </nav>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="w-8 h-8 rounded-lg hover:bg-black/[0.04] dark:hover:bg-white/[0.06] flex items-center justify-center transition-colors text-neutral-500 dark:text-neutral-400"
                title="Toggle theme"
              >
                {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
              </button>
              <button
                onClick={() => setCurrentPage('upload')}
                className="bg-gradient-to-r from-[#8E6878] to-[#6E4F5C] text-white text-[13px] font-bold px-4 sm:px-5 py-2 rounded-lg hover:shadow-lg hover:shadow-[#8E6878]/20 transition-all active:scale-[0.97] hidden sm:block"
              >
                Upload Rx
              </button>
              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden w-8 h-8 rounded-lg hover:bg-black/[0.04] dark:hover:bg-white/[0.06] flex items-center justify-center transition-colors text-neutral-600 dark:text-neutral-400"
              >
                {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>

          {/* Mobile menu drawer */}
          {mobileMenuOpen && (
            <div className="md:hidden pointer-events-auto mt-2 glass-nav border border-black/[0.06] dark:border-white/[0.06] rounded-2xl p-5 space-y-4 animate-fade-in-up" style={{ animationDuration: '0.25s' }}>
              <nav className="flex flex-col gap-3 text-[15px] font-semibold text-[#555555] dark:text-[#999999]">
                <span onClick={() => { setCurrentPage('features'); window.scrollTo(0,0); setMobileMenuOpen(false); }} className="hover:text-[#111111] dark:hover:text-white cursor-pointer transition-colors py-2 border-b border-black/[0.04] dark:border-white/[0.04]">Features</span>
                <span onClick={() => { setCurrentPage('how-it-works'); window.scrollTo(0,0); setMobileMenuOpen(false); }} className="hover:text-[#111111] dark:hover:text-white cursor-pointer transition-colors py-2 border-b border-black/[0.04] dark:border-white/[0.04]">How it works</span>
                <span onClick={() => { setCurrentPage('about'); window.scrollTo(0,0); setMobileMenuOpen(false); }} className="hover:text-[#111111] dark:hover:text-white cursor-pointer transition-colors py-2 border-b border-black/[0.04] dark:border-white/[0.04]">About</span>
              </nav>
              <button
                onClick={() => { setCurrentPage('upload'); setMobileMenuOpen(false); }}
                className="w-full bg-gradient-to-r from-[#8E6878] to-[#6E4F5C] text-white text-[14px] font-bold px-5 py-3 rounded-xl hover:shadow-lg hover:shadow-[#8E6878]/20 transition-all active:scale-[0.97]"
              >
                Upload Rx
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Camera Capture Simulated Modal View */}
      {/* Hidden canvas for camera capture */}
      <canvas ref={canvasRef} className="hidden" />

      {showCameraModal && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-lg z-[100] flex flex-col items-center justify-center p-4">
          <div className={`relative bg-black rounded-[2.5rem] overflow-hidden max-w-md w-full aspect-[3/4] flex flex-col justify-between shadow-2xl border border-white/10 ${
            isShutterFlashing ? 'brightness-[3] duration-75' : 'transition-all'
          }`}>
            {/* Live video feed */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Overlay UI */}
            <div className="relative z-10 flex justify-between items-center p-5">
              <span className="text-[11px] font-extrabold bg-black/50 text-neutral-200 px-3 py-1.5 rounded-full flex items-center gap-1.5 uppercase tracking-widest backdrop-blur-md">
                <Camera size={12} className="text-[#10B981]" /> Live Camera
              </span>
              <button
                onClick={() => setShowCameraModal(false)}
                className="text-neutral-400 hover:text-white font-extrabold text-[12px] bg-black/50 hover:bg-black/70 px-3.5 py-1.5 rounded-full transition-colors uppercase tracking-wider backdrop-blur-md"
              >
                Cancel
              </button>
            </div>

            {/* Corner brackets */}
            <div className="absolute inset-x-10 top-20 bottom-28 pointer-events-none">
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#10B981]" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#10B981]" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#10B981]" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#10B981]" />
              <div className="absolute inset-x-0 top-1/2 h-0.5 bg-gradient-to-r from-transparent via-[#10B981]/60 to-transparent animate-laser" />
            </div>

            {/* Capture button */}
            <div className="relative z-10 w-full flex flex-col items-center justify-center gap-3 pb-6">
              <span className="text-[11px] font-extrabold text-[#10B981] uppercase tracking-widest">Align prescription in frame</span>
              <button
                onClick={captureFromCamera}
                className="w-16 h-16 bg-white border-4 border-neutral-600 rounded-full hover:scale-105 active:scale-95 transition-all flex items-center justify-center shadow-2xl"
              >
                <div className="w-10 h-10 bg-white rounded-full border border-neutral-300" />
              </button>
            </div>
          </div>
        </div>
      )}

      {currentPage === 'landing' ? (
        // ── LANDING VIEW ──
        <main className="flex-1 w-full pt-16 sm:pt-20 flex flex-col items-center z-10 relative">

          {/* ══ HERO SECTION with gradient mesh ══ */}
          <section className="relative w-full overflow-hidden">
            <div className="hero-gradient-mesh absolute inset-0 z-0" />
            
            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-10 sm:pb-16 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left: Copy */}
              <div className="max-w-xl">
                <p className="text-[12px] sm:text-[13px] font-semibold text-[#8E6878] dark:text-[#C4ABB3] mb-4 sm:mb-6 tracking-wide">
                  Available in English, Hindi &amp; Kannada
                </p>

                <h1 className="text-[2rem] sm:text-[3.4rem] lg:text-[4rem] font-extrabold tracking-[-0.03em] leading-[1.1] sm:leading-[1.06] text-[#111111] dark:text-white mb-4 sm:mb-6">
                  Decode any{' '}
                  <span className="bg-gradient-to-r from-[#8E6878] to-[#6B5E65] bg-clip-text text-transparent">doctor's handwriting</span>
                  {' '}in seconds.
                </h1>

                <p className="text-[14px] sm:text-[17px] text-[#555555] dark:text-[#999999] font-normal leading-[1.6] sm:leading-[1.65] mb-6 sm:mb-8 max-w-lg">
                  Snap a photo of your prescription. MediScript reads the handwriting, identifies each medicine, and explains dosage, side effects, and safety warnings — in plain language.
                </p>

                <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 mb-6 sm:mb-8">
                  <button
                    onClick={() => setCurrentPage('upload')}
                    className="bg-gradient-to-r from-[#8E6878] to-[#6E4F5C] text-white text-[14px] font-bold px-7 py-3.5 rounded-xl hover:shadow-xl hover:shadow-[#8E6878]/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    Upload prescription <ArrowUpRight size={15} />
                  </button>
                  <button
                    onClick={() => setShowCameraModal(true)}
                    className="bg-white/80 dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.08] text-[14px] font-semibold text-[#555555] dark:text-[#CCCCCC] hover:text-[#111111] dark:hover:text-white transition-all flex items-center justify-center gap-1.5 px-5 py-3.5 rounded-xl backdrop-blur-sm hover:shadow-md"
                  >
                    <Camera size={15} /> Take a photo
                  </button>
                </div>

                {/* Trust badges */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[11px] sm:text-[12px] text-[#888888] dark:text-[#666666] font-medium pt-4 sm:pt-5 border-t border-black/[0.04] dark:border-white/[0.04]">
                  <span className="flex items-center gap-1.5"><Shield size={13} className="text-[#8E6878]" /> HIPAA Compliant</span>
                  <span className="w-1 h-1 bg-[#CCCCCC] dark:bg-[#444444] rounded-full hidden sm:block" />
                  <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-[#10B981]" /> 500+ drug brands</span>
                  <span className="w-1 h-1 bg-[#CCCCCC] dark:bg-[#444444] rounded-full hidden sm:block" />
                  <span className="flex items-center gap-1.5"><Globe size={13} className="text-[#6B5E65]" /> 3 languages</span>
                </div>
              </div>

              {/* Right: Prescription desk background — faded editorial */}
              <div className="hidden lg:block relative">
                <div 
                  className="w-full h-[480px] bg-[url('/prescription_desk_bg.png')] bg-cover bg-center rounded-3xl overflow-hidden"
                  style={{
                    maskImage: 'linear-gradient(to left, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)'
                  }}
                />
                {/* Warm overlay tint */}
                <div className="absolute inset-0 bg-gradient-to-l from-[#8E6878]/[0.06] to-transparent rounded-3xl pointer-events-none" />
              </div>
            </div>
          </section>

          {/* ══ THE PROBLEM — Visual Story (unique, not a template section) ══ */}
          <section className="w-full max-w-5xl px-4 sm:px-6 py-12 sm:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              {/* Left — The visual prescription problem */}
              <div className="relative">
                <div className="bg-[#FDFBF7] dark:bg-[#141210] border border-[#E8E4DC]/60 dark:border-white/[0.06] rounded-2xl p-5 sm:p-8 relative overflow-hidden">
                  {/* Messy prescription mockup */}
                  <div className="space-y-1 mb-6">
                    <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Patient copy</div>
                    <div className="h-px bg-neutral-200 dark:bg-neutral-700" />
                  </div>
                  
                  <div className="space-y-4 font-[Georgia] italic text-neutral-500 dark:text-neutral-500">
                    <div className="flex items-center gap-3">
                      <span className="text-[16px] sm:text-[22px] leading-none opacity-60 blur-[0.5px]">T. Pcid 40 (1-0-0)</span>
                      <span className="text-[10px] font-sans not-italic font-bold text-red-400 bg-red-50 dark:bg-red-500/10 px-2 py-0.5 rounded-full">Can't read</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[16px] sm:text-[22px] leading-none opacity-60 blur-[0.5px]">T. Dlo 650 (t.i.d)</span>
                      <span className="text-[10px] font-sans not-italic font-bold text-red-400 bg-red-50 dark:bg-red-500/10 px-2 py-0.5 rounded-full">Illegible</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[16px] sm:text-[22px] leading-none opacity-60 blur-[0.5px]">T. Lmce (1-1-1)</span>
                      <span className="text-[10px] font-sans not-italic font-bold text-red-400 bg-red-50 dark:bg-red-500/10 px-2 py-0.5 rounded-full">Unknown</span>
                    </div>
                  </div>

                  {/* Hand-drawn circle annotation — SVG */}
                  <svg className="absolute top-6 right-4 w-24 h-24 text-[#8E6878]/30" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M50 10 C80 10, 95 30, 92 55 C89 80, 65 95, 40 90 C15 85, 5 60, 10 35 C15 15, 35 8, 50 10" strokeDasharray="4 3" />
                  </svg>
                  
                  <div className="mt-8 pt-4 border-t border-dashed border-neutral-200 dark:border-neutral-700">
                    <p className="text-[12px] text-neutral-400 dark:text-neutral-500 font-medium italic">
                      "I stood at the pharmacy for 10 minutes trying to read this."
                    </p>
                  </div>
                </div>

                {/* Hand-drawn arrow SVG */}
                <svg className="absolute -bottom-8 right-8 w-16 h-16 text-[#8E6878]/40 hidden lg:block" viewBox="0 0 60 60" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M5 5 C15 25, 30 35, 50 50" />
                  <path d="M38 48 L50 50 L48 38" />
                </svg>
              </div>

              {/* Right — The human story */}
              <div className="space-y-6">
                <div>
                  <span className="text-[11px] font-extrabold text-[#8E6878] uppercase tracking-[0.2em] block mb-3">The problem we solve</span>
                  <h2 className="text-[24px] sm:text-[32px] font-extrabold text-[#111111] dark:text-white tracking-tight leading-[1.15]">
                    67% of patients leave the clinic{' '}
                    <span className="relative inline-block">
                      confused
                      {/* Hand-drawn underline SVG */}
                      <svg className="absolute -bottom-1 left-0 w-full h-3 text-[#8E6878]/40" viewBox="0 0 120 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M2 8 C20 4, 40 10, 60 6 C80 2, 100 9, 118 5" />
                      </svg>
                    </span>{' '}
                    about their medicines.
                  </h2>
                </div>
                
                <p className="text-[13px] sm:text-[15px] text-[#555555] dark:text-[#999999] leading-relaxed max-w-md">
                  Doctors write fast. Patients can't read it. The pharmacist guesses. Your grandmother takes the wrong dose. This isn't a technology problem — it's a communication gap we can close.
                </p>

                {/* Inline organic stats — not a boring grid */}
                <div className="flex flex-wrap gap-x-6 sm:gap-x-8 gap-y-3 pt-4">
                  <div>
                    <span className="text-[22px] sm:text-[28px] font-extrabold text-[#111111] dark:text-white tracking-tight">52K+</span>
                    <span className="text-[11px] sm:text-[12px] text-[#888888] font-medium block">prescriptions decoded</span>
                  </div>
                  <div className="w-px h-12 bg-neutral-200 dark:bg-neutral-700 hidden sm:block" />
                  <div>
                    <span className="text-[22px] sm:text-[28px] font-extrabold text-[#111111] dark:text-white tracking-tight">~8s</span>
                    <span className="text-[11px] sm:text-[12px] text-[#888888] font-medium block">average decode time</span>
                  </div>
                  <div className="w-px h-12 bg-neutral-200 dark:bg-neutral-700 hidden sm:block" />
                  <div>
                    <span className="text-[22px] sm:text-[28px] font-extrabold text-[#111111] dark:text-white tracking-tight">500+</span>
                    <span className="text-[11px] sm:text-[12px] text-[#888888] font-medium block">Indian drug brands</span>
                  </div>
                </div>

                <button
                  onClick={() => setCurrentPage('upload')}
                  className="mt-2 text-[13px] font-bold text-[#8E6878] hover:text-[#6E4F5C] transition-colors inline-flex items-center gap-1.5 group"
                >
                  Try it yourself <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </section>

            {/* ══ Interactive Demo ══ */}
            <div className="w-full max-w-5xl px-4 sm:px-6 pb-12 sm:pb-24">
            <div className="bg-white dark:bg-[#141414] border border-black/[0.06] dark:border-white/[0.06] rounded-2xl p-6 sm:p-8 text-left relative overflow-hidden shadow-sm">
              {/* Subtle shimmer effect on the card */}
              <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#8E6878]/[0.02] to-transparent pointer-events-none" />
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 mb-5 border-b border-black/[0.04] dark:border-white/[0.04]">
                <div>
                  <h3 className="text-[15px] sm:text-[17px] font-bold text-[#111111] dark:text-white">
                    Try it — tap the handwriting
                  </h3>
                  <p className="text-[12px] sm:text-[13px] text-[#888888] dark:text-[#666666] mt-0.5">See how MediScript decodes each line in real time</p>
                </div>

                <div className="flex bg-[#F3F3F3] dark:bg-[#1C1C1C] p-0.5 rounded-lg gap-0.5 self-start">
                  {['en', 'hi', 'kn'].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setPlaygroundLanguage(lang as Language)}
                      className={`text-[12px] font-medium px-3 py-1 rounded-md transition-all ${
                        playgroundLanguage === lang
                          ? 'bg-white dark:bg-[#2A2A2A] text-[#111111] dark:text-white shadow-sm'
                          : 'text-[#888888] hover:text-[#111111] dark:hover:text-white'
                      }`}
                    >
                      {lang === 'en' && 'EN'}
                      {lang === 'hi' && 'HI'}
                      {lang === 'kn' && 'KN'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
                {/* Left Panel: Handwritten prescription replica */}
                <div className="bg-[#FAFAF8] dark:bg-[#1A1A18] border border-[#E8E4DC] dark:border-white/[0.06] rounded-xl p-4 sm:p-5 relative overflow-hidden flex flex-col justify-between aspect-auto sm:aspect-[4/3]">

                  {/* Doctor heading pad */}
                  <div className="flex justify-between items-start border-b border-[#E9E4DC]/60 pb-3">
                    <div>
                      <div className="text-[11px] sm:text-[12px] font-bold text-neutral-700 dark:text-neutral-300 tracking-tight">DR. VERMA'S CLINIC</div>
                      <div className="text-[8px] sm:text-[9px] text-neutral-400 font-bold uppercase tracking-wider">New Delhi | Reg 49201</div>
                    </div>
                    <span className="text-[18px] sm:text-[20px] font-serif text-[#C93B2B] font-bold">Rx</span>
                  </div>

                  {/* Scribble block */}
                  <div className="flex-1 flex flex-col justify-center gap-4 sm:gap-6 py-3 sm:py-4">
                    {/* Hotspot 1 */}
                    <div 
                      onMouseEnter={() => setHoveredScribble('pantocid')}
                      onMouseLeave={() => setHoveredScribble(null)}
                      onClick={() => setHoveredScribble(hoveredScribble === 'pantocid' ? null : 'pantocid')}
                      className={`cursor-pointer p-2 sm:p-3 rounded-xl transition-all relative ${
                        hoveredScribble === 'pantocid' 
                          ? 'bg-[#8E6878]/5 border border-[#8E6878]/20' 
                          : 'border border-transparent'
                      }`}
                    >
                      <span className="font-[Georgia] italic text-[17px] sm:text-[24px] tracking-wide text-neutral-600 dark:text-neutral-400 select-none block">
                        1. P-c-i-d  40mg  (1-0-0)
                      </span>
                      {hoveredScribble === 'pantocid' && (
                        <div className="absolute inset-0 bg-[#8E6878]/10 border-2 border-[#8E6878] rounded-xl pointer-events-none animate-pulse" />
                      )}
                    </div>

                    {/* Hotspot 2 */}
                    <div 
                      onMouseEnter={() => setHoveredScribble('dolo')}
                      onMouseLeave={() => setHoveredScribble(null)}
                      onClick={() => setHoveredScribble(hoveredScribble === 'dolo' ? null : 'dolo')}
                      className={`cursor-pointer p-2 sm:p-3 rounded-xl transition-all relative ${
                        hoveredScribble === 'dolo' 
                          ? 'bg-[#8E6878]/5 border border-[#8E6878]/20' 
                          : 'border border-transparent'
                      }`}
                    >
                      <span className="font-[Georgia] italic text-[17px] sm:text-[24px] tracking-wide text-neutral-600 dark:text-neutral-400 select-none block">
                        2. D-o-l-o  650  (t.i.d)
                      </span>
                      {hoveredScribble === 'dolo' && (
                        <div className="absolute inset-0 bg-[#8E6878]/10 border-2 border-[#8E6878] rounded-xl pointer-events-none animate-pulse" />
                      )}
                    </div>
                  </div>

                  <div className="text-[10px] sm:text-[11px] text-[#888888] font-medium text-center pt-3 border-t border-[#E8E4DC]/40 flex items-center justify-center gap-1.5">
                    <MousePointer size={11} /> Tap or hover to decode
                  </div>
                </div>

                {/* Right Panel: AI translation live preview */}
                <div className="bg-[#F7F7F7] dark:bg-[#1A1A1A] border border-black/[0.04] dark:border-white/[0.06] rounded-xl p-4 sm:p-5 flex flex-col justify-center min-h-[200px] sm:aspect-[4/3]">
                  {hoveredScribble === 'pantocid' ? (
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-[15px] font-bold text-[#111111] dark:text-white">Pantocid 40mg (Pantoprazole)</h4>
                          <span className="text-[10px] font-medium text-[#8E6878]">Decoded active molecule</span>
                        </div>
                        <span className="text-[10px] font-medium text-neutral-400 shrink-0">98% match</span>
                      </div>
                      <div className="w-8 h-px bg-neutral-100 dark:bg-neutral-800" />
                      <div className="space-y-2">
                        <div>
                          <span className="text-[8.5px] font-extrabold text-neutral-400 uppercase tracking-wide block">
                            {playgroundLanguage === 'en' && 'What is it for?'}
                            {playgroundLanguage === 'hi' && 'किस लिए है?'}
                            {playgroundLanguage === 'kn' && 'ಯಾವುದಕ್ಕಾಗಿ ಬಳಸಲಾಗುತ್ತದೆ?'}
                          </span>
                          <p className="text-[13px] text-neutral-750 dark:text-neutral-300 font-semibold leading-snug">
                            {playgroundLanguage === 'en' && 'Reduces stomach acid, prevents acidity and gas.'}
                            {playgroundLanguage === 'hi' && 'पेट में गैस और एसिडिटी को कम करता है।'}
                            {playgroundLanguage === 'kn' && 'ಹೊಟ್ಟೆಯ ಆಮ್ಲೀಯತೆ ಮತ್ತು ಗ್ಯಾಸ್ ಕಡಿಮೆ ಮಾಡುತ್ತದೆ.'}
                          </p>
                        </div>
                        <div>
                          <span className="text-[8.5px] font-extrabold text-neutral-400 uppercase tracking-wide block">
                            {playgroundLanguage === 'en' && 'Dosage & Food Instructions'}
                            {playgroundLanguage === 'hi' && 'खुराक और भोजन के निर्देश'}
                            {playgroundLanguage === 'kn' && 'ಖುರಾಕ್ ಮತ್ತು ಭೋಜನದ ಸೂಚನೆಗಳು'}
                          </span>
                          <p className="text-[13px] text-neutral-750 dark:text-neutral-300 font-semibold leading-snug">
                            {playgroundLanguage === 'en' && '1 tablet in the morning, 30 minutes before breakfast.'}
                            {playgroundLanguage === 'hi' && 'सुबह 1 गोली, नाश्ते से 30 मिनट पहले खाली पेट।'}
                            {playgroundLanguage === 'kn' && 'ಬೆಳಿಗ್ಗೆ 1 ಮಾತ್ರೆ, ಉಪಹಾರಕ್ಕಿಂತ 30 ನಿಮಿಷಗಳ ಮೊದಲು.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : hoveredScribble === 'dolo' ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-[16px] font-extrabold text-neutral-855 dark:text-neutral-100">Dolo 650 (Paracetamol)</h4>
                          <span className="text-[9.5px] font-extrabold text-[#8E6878] uppercase tracking-widest">DECODED ACTIVE MOLECULE</span>
                        </div>
                        <span className="text-[10px] font-medium text-neutral-400 shrink-0">97% match</span>
                      </div>
                      <div className="w-8 h-px bg-neutral-100 dark:bg-neutral-800" />
                      <div className="space-y-2">
                        <div>
                          <span className="text-[8.5px] font-extrabold text-neutral-400 uppercase tracking-wide block">
                            {playgroundLanguage === 'en' && 'What is it for?'}
                            {playgroundLanguage === 'hi' && 'किस लिए है?'}
                            {playgroundLanguage === 'kn' && 'ಯಾವುದಕ್ಕಾಗಿ ಬಳಸಲಾಗುತ್ತದೆ?'}
                          </span>
                          <p className="text-[13px] text-neutral-750 dark:text-neutral-300 font-semibold leading-snug">
                            {playgroundLanguage === 'en' && 'Lowers body fever and relieves mild-to-moderate physical pain.'}
                            {playgroundLanguage === 'hi' && 'बुखार को कम करता है और बदन दर्द से राहत देता है।'}
                            {playgroundLanguage === 'kn' && 'ಜ್ವರ ಮತ್ತು ಮೈಕೈ ನೋವನ್ನು ಕಡಿಮೆ ಮಾಡುತ್ತದೆ.'}
                          </p>
                        </div>
                        <div>
                          <span className="text-[8.5px] font-extrabold text-neutral-400 uppercase tracking-wide block">
                            {playgroundLanguage === 'en' && 'Dosage & Food Instructions'}
                            {playgroundLanguage === 'hi' && 'खुराक और भोजन के निर्देश'}
                            {playgroundLanguage === 'kn' && 'ಖುರಾಕ್ और भोजना की निर्देश'}
                          </span>
                          <p className="text-[13px] text-neutral-750 dark:text-neutral-300 font-semibold leading-snug">
                            {playgroundLanguage === 'en' && '1 tablet after food, only if you have fever or pain.'}
                            {playgroundLanguage === 'hi' && 'खाना खाने के बाद 1 गोली लें, केवल बुखार या दर्द होने पर।'}
                            {playgroundLanguage === 'kn' && 'ಊಟದ ನಂತರ 1 ಮಾತ್ರೆ ತೆಗೆದುಕೊಳ್ಳಿ, ಜ್ವರ ಅಥವಾ ನೋವು ಇದ್ದಾಗ ಮಾತ್ರ.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6 space-y-3">
                      <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-800/80 rounded-full flex items-center justify-center mx-auto text-neutral-400 animate-pulse">
                        <Sparkles size={18} />
                      </div>
                      <p className="text-[12.5px] text-neutral-500 dark:text-neutral-400 font-bold max-w-[200px] mx-auto leading-relaxed">
                        Hover over any prescription line on the left slip to test live AI translations.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            </div>

            {/* ══ Section Divider ══ */}
            <div className="w-full max-w-5xl px-6"><div className="section-divider-band w-full" /></div>

            {/* ══ How it works — vertical visual journey (unique flow, not grid) ══ */}
            <section id="how-it-works" className="w-full max-w-4xl px-4 sm:px-6 py-12 sm:py-24 mx-auto watercolor-wash-1">
              <div className="text-center mb-10 sm:mb-16">
                <span className="text-[11px] font-extrabold text-[#8E6878] uppercase tracking-[0.2em] block mb-2">The journey</span>
                <h2 className="text-[24px] sm:text-[32px] font-extrabold text-[#111111] dark:text-white tracking-tight">From scribble to clarity</h2>
              </div>
              
              {/* Step 1 */}
              <div className="relative flex flex-col md:flex-row items-center gap-5 sm:gap-8 mb-10 sm:mb-16">
                <div className="w-full md:w-1/2 relative">
                  <div className="bg-[#FDFBF7] dark:bg-[#141210] border border-[#E8E4DC]/60 dark:border-white/[0.06] rounded-2xl p-6 relative">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-[#8E6878]/10 flex items-center justify-center text-[#8E6878] font-extrabold text-[13px]">1</div>
                      <Camera size={18} className="text-neutral-400" />
                    </div>
                    <div className="font-[Georgia] italic text-[20px] text-neutral-400 blur-[0.3px] leading-relaxed">
                      T. Pcid 40mg...<br/>T. Dlo 650...
                    </div>
                    {/* Annotation */}
                    <div className="absolute -top-3 -right-3 bg-[#8E6878] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                      📸 snap!
                    </div>
                  </div>
                </div>
                <div className="md:w-1/2 space-y-2">
                  <h3 className="text-[20px] font-extrabold text-[#111111] dark:text-white">You snap a photo</h3>
                  <p className="text-[14px] text-[#666666] dark:text-[#888888] leading-relaxed">At the pharmacy, right after the doctor visit. Just pull out your phone and take a picture of the prescription. That's all you do.</p>
                </div>
                {/* Connecting hand-drawn line */}
                <svg className="absolute left-1/2 -bottom-12 w-px h-10 hidden md:block" viewBox="0 0 2 40" stroke="#8E6878" strokeWidth="1" strokeDasharray="3 4" opacity="0.3">
                  <line x1="1" y1="0" x2="1" y2="40" />
                </svg>
              </div>

              {/* Step 2 */}
              <div className="relative flex flex-col md:flex-row-reverse items-center gap-5 sm:gap-8 mb-10 sm:mb-16">
                <div className="w-full md:w-1/2 relative">
                  <div className="bg-white dark:bg-[#141414] border border-black/[0.06] dark:border-white/[0.06] rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-[#10B981]/10 flex items-center justify-center text-[#10B981] font-extrabold text-[13px]">2</div>
                      <Sparkles size={18} className="text-[#10B981]" />
                    </div>
                    {/* Mini decoded output mockup */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-medium text-neutral-400">98%</span>
                        <span className="text-[13px] font-semibold text-[#111111] dark:text-white">Pantocid 40mg</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-medium text-neutral-400">97%</span>
                        <span className="text-[13px] font-semibold text-[#111111] dark:text-white">Dolo 650</span>
                      </div>
                    </div>
                    <div className="mt-3 text-[10px] font-bold text-[#10B981] flex items-center gap-1">
                      <CheckCircle2 size={11} /> No interactions found
                    </div>
                  </div>
                </div>
                <div className="md:w-1/2 space-y-2 md:text-right">
                  <h3 className="text-[20px] font-extrabold text-[#111111] dark:text-white">AI decodes the scribbles</h3>
                  <p className="text-[14px] text-[#666666] dark:text-[#888888] leading-relaxed">In under 8 seconds, our model matches each scribble against 500+ Indian drug brands. It identifies the exact medicine, dosage, and checks for dangerous interactions.</p>
                </div>
                <svg className="absolute left-1/2 -bottom-12 w-px h-10 hidden md:block" viewBox="0 0 2 40" stroke="#8E6878" strokeWidth="1" strokeDasharray="3 4" opacity="0.3">
                  <line x1="1" y1="0" x2="1" y2="40" />
                </svg>
              </div>

              {/* Step 3 */}
              <div className="relative flex flex-col md:flex-row items-center gap-5 sm:gap-8">
                <div className="w-full md:w-1/2 relative">
                  <div className="bg-white dark:bg-[#141414] border border-black/[0.06] dark:border-white/[0.06] rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-[#6B5E65]/10 flex items-center justify-center text-[#6B5E65] font-extrabold text-[13px]">3</div>
                      <Share2 size={18} className="text-[#6B5E65]" />
                    </div>
                    {/* Language toggle mockup */}
                    <div className="flex gap-1.5 mb-3">
                      <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-[#8E6878]/10 text-[#8E6878]">English</span>
                      <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-400">हिंदी</span>
                      <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-400">ಕನ್ನಡ</span>
                    </div>
                    <p className="text-[12px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      "Take 1 tablet in the morning, 30 minutes before breakfast. Reduces stomach acid."
                    </p>
                  </div>
                </div>
                <div className="md:w-1/2 space-y-2">
                  <h3 className="text-[20px] font-extrabold text-[#111111] dark:text-white">Share with your family</h3>
                  <p className="text-[14px] text-[#666666] dark:text-[#888888] leading-relaxed">Translate the breakdown to Hindi or Kannada. Forward it to your parents on WhatsApp. Now everyone in the family understands the medicines.</p>
                </div>
              </div>
            </section>

            {/* ══ Section Divider ══ */}
            <div className="w-full max-w-5xl px-6"><div className="section-divider-band w-full" /></div>

            {/* ══ Features — Editorial alternating layout (not bento grid) ══ */}
            <section id="features" className="w-full max-w-5xl px-4 sm:px-6 py-12 sm:py-24 watercolor-wash-2">
              <div className="mb-10 sm:mb-16">
                <span className="text-[11px] font-extrabold text-[#8E6878] uppercase tracking-[0.2em] block mb-3">What makes this different</span>
                <h2 className="text-[24px] sm:text-[32px] font-extrabold text-[#111111] dark:text-white tracking-tight leading-tight max-w-lg">
                  Three things your pharmacy
                  <br />can't tell you.
                </h2>
              </div>
              
              {/* Feature 1: Drug interaction — full width editorial row */}
              <div className="flex flex-col md:flex-row gap-6 sm:gap-10 items-center mb-12 sm:mb-20 pb-12 sm:pb-20 border-b border-dashed border-neutral-200 dark:border-neutral-800">
                <div className="md:w-1/2 space-y-4">
                  <div className="inline-flex items-center gap-2 text-[11px] font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                    <AlertTriangle size={14} /> Drug Safety
                  </div>
                  <h3 className="text-[22px] font-extrabold text-[#111111] dark:text-white tracking-tight leading-tight">
                    "Is it safe to take these together?"
                  </h3>
                  <p className="text-[14px] text-[#666666] dark:text-[#888888] leading-relaxed">
                    Every prescription is auto-checked for dangerous drug combinations. You'll know before you take them — not after you feel sick. We cross-reference against known interaction databases used by pharmacists.
                  </p>
                </div>
                <div className="md:w-1/2">
                  {/* Interaction check mockup */}
                  <div className="bg-[#FDFBF7] dark:bg-[#141210] border border-[#E8E4DC]/60 dark:border-white/[0.06] rounded-2xl p-5 space-y-3">
                    <div className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Interaction check</div>
                    <div className="flex items-center gap-3 p-3 bg-white dark:bg-[#1A1A1A] rounded-xl border border-black/[0.04] dark:border-white/[0.04]">
                      <span className="text-[13px] font-semibold text-[#111111] dark:text-white">Pantocid 40mg</span>
                      <span className="text-[11px] text-neutral-400">×</span>
                      <span className="text-[13px] font-semibold text-[#111111] dark:text-white">Dolo 650</span>
                    </div>
                    <p className="text-[12px] text-neutral-500 dark:text-neutral-400 pl-1">— No known interactions. Safe to take together.</p>
                    <p className="text-[12px] text-neutral-500 dark:text-neutral-400 pl-1">— Metformin + Alcohol: avoid. Risk of lactic acidosis.</p>
                  </div>
                </div>
              </div>

              {/* Feature 2: Multilingual — reversed layout */}
              <div className="flex flex-col md:flex-row-reverse gap-6 sm:gap-10 items-center mb-12 sm:mb-20 pb-12 sm:pb-20 border-b border-dashed border-neutral-200 dark:border-neutral-800">
                <div className="md:w-1/2 space-y-4">
                  <div className="inline-flex items-center gap-2 text-[11px] font-extrabold text-[#10B981] uppercase tracking-wider">
                    <Globe size={14} /> Language Access
                  </div>
                  <h3 className="text-[22px] font-extrabold text-[#111111] dark:text-white tracking-tight leading-tight">
                    "My amma can't read English."
                  </h3>
                  <p className="text-[14px] text-[#666666] dark:text-[#888888] leading-relaxed">
                    One tap to translate the entire breakdown to Hindi or Kannada. Forward it on WhatsApp. Your grandmother reads her own medicine instructions for the first time.
                  </p>
                </div>
                <div className="md:w-1/2">
                  {/* Language switch mockup */}
                  <div className="bg-white dark:bg-[#141414] border border-black/[0.06] dark:border-white/[0.06] rounded-2xl p-5 space-y-4">
                    <div className="flex gap-1.5">
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-[#8E6878]/10 text-[#8E6878]">EN</span>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-400">HI</span>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-400">KN</span>
                    </div>
                    <div className="space-y-2 text-[13px]">
                      <p className="text-neutral-700 dark:text-neutral-300 font-medium">Take 1 tablet in the morning, 30 minutes before breakfast.</p>
                      <div className="h-px bg-neutral-100 dark:bg-neutral-800" />
                      <p className="text-neutral-400 font-medium font-[Georgia] italic">↓ हिंदी</p>
                      <p className="text-neutral-700 dark:text-neutral-300 font-medium">सुबह 1 गोली, नाश्ते से 30 मिनट पहले खाली पेट लें।</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature 3: Privacy — normal layout */}
              <div className="flex flex-col md:flex-row gap-6 sm:gap-10 items-center">
                <div className="md:w-1/2 space-y-4">
                  <div className="inline-flex items-center gap-2 text-[11px] font-extrabold text-[#6B5E65] uppercase tracking-wider">
                    <Shield size={14} /> Privacy First
                  </div>
                  <h3 className="text-[22px] font-extrabold text-[#111111] dark:text-white tracking-tight leading-tight">
                    "I don't want my data stored anywhere."
                  </h3>
                  <p className="text-[14px] text-[#666666] dark:text-[#888888] leading-relaxed">
                    Your prescription image is processed in-session and immediately discarded. No accounts. No sign-ups. No health data stored. We physically cannot look at your prescription later even if we wanted to.
                  </p>
                </div>
                <div className="md:w-1/2">
                  {/* Privacy visual */}
                  <div className="bg-[#FDFBF7] dark:bg-[#141210] border border-[#E8E4DC]/60 dark:border-white/[0.06] rounded-2xl p-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider">Data lifecycle</span>
                      <Shield size={14} className="text-[#6B5E65]" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-[#8E6878]/10 flex items-center justify-center text-[10px] font-bold text-[#8E6878]">1</div>
                        <span className="text-[12px] font-medium text-neutral-600 dark:text-neutral-400">Image uploaded → processed in memory</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-[#8E6878]/10 flex items-center justify-center text-[10px] font-bold text-[#8E6878]">2</div>
                        <span className="text-[12px] font-medium text-neutral-600 dark:text-neutral-400">AI decodes → results shown to you</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-500/10 flex items-center justify-center text-[10px] font-bold text-red-500">✕</div>
                        <span className="text-[12px] font-medium text-neutral-600 dark:text-neutral-400">Image permanently deleted. Zero retained.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ══ Knowledge strip ══ */}
            <div className="w-full my-12 border-y border-black/[0.04] dark:border-white/[0.04] overflow-hidden">
              <div className="flex items-center">
                <div className="shrink-0 px-5 py-4 border-r border-black/[0.04] dark:border-white/[0.04]">
                  <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Did you know</span>
                </div>
                <div className="marquee-track py-4">
                  {[...Array(2)].map((_, setIdx) => (
                    <div key={setIdx} className="flex items-center gap-3 shrink-0">
                      {[
                        'Pantocid should be taken 30 min before meals, not after',
                        'Never take Dolo 650 with alcohol — liver risk increases 3x',
                        '"1-0-1" means one in the morning, skip afternoon, one at night',
                        'Drink a full glass of water with Azithromycin',
                        'Always tell your doctor if you are pregnant before any prescription',
                        '"t.i.d" on prescriptions means three times a day',
                      ].map((fact, idx) => (
                        <span key={`${setIdx}-${idx}`} className="flex items-center gap-3 whitespace-nowrap shrink-0">
                          <span className="text-[12px] text-neutral-400 dark:text-neutral-500">{fact}</span>
                          <span className="text-neutral-200 dark:text-neutral-700">·</span>
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ══ REAL TALK — honest conversational section (unique, not corporate) ══ */}
            <section id="about" className="w-full max-w-3xl px-4 sm:px-6 py-12 sm:py-20 mx-auto">
              <div className="bg-[#FDFBF7] dark:bg-[#141210] border border-[#E8E4DC]/60 dark:border-white/[0.06] rounded-2xl p-6 sm:p-8 md:p-12 relative overflow-hidden">
                {/* Hand-drawn quote mark */}
                <svg className="absolute top-4 left-6 w-10 h-10 text-[#8E6878]/10" viewBox="0 0 40 40" fill="currentColor">
                  <path d="M10 25 C10 20, 12 15, 18 12 L16 10 C8 14, 5 20, 5 28 C5 33, 8 36, 12 36 C16 36, 18 33, 18 30 C18 27, 16 25, 12 25 Z M28 25 C28 20, 30 15, 36 12 L34 10 C26 14, 23 20, 23 28 C23 33, 26 36, 30 36 C34 36, 36 33, 36 30 C36 27, 34 25, 30 25 Z" />
                </svg>
                
                <div className="relative z-10 space-y-5">
                  <span className="text-[11px] font-extrabold text-[#8E6878] uppercase tracking-[0.2em]">A note from us</span>
                  
                  <p className="text-[14px] sm:text-[16px] text-[#333333] dark:text-[#CCCCCC] leading-[1.7] sm:leading-[1.8] font-medium">
                    We built MediScript because one of our founders watched his mother take the wrong dosage for 3 weeks — because she couldn't read the doctor's handwriting and was too embarrassed to call back and ask.
                  </p>
                  <p className="text-[14px] sm:text-[16px] text-[#333333] dark:text-[#CCCCCC] leading-[1.7] sm:leading-[1.8] font-medium">
                    This isn't a flashy AI demo. It's a tool that exists because <span className="relative inline-block font-bold text-[#111111] dark:text-white">no one should guess what medicine they're putting in their body.
                      <svg className="absolute -bottom-0.5 left-0 w-full h-2 text-[#8E6878]/25" viewBox="0 0 200 8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                        <path d="M2 5 C40 2, 80 7, 120 4 C160 1, 180 6, 198 3" />
                      </svg>
                    </span>
                  </p>
                  
                  <div className="pt-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#8E6878]/10 flex items-center justify-center text-[#8E6878] font-extrabold text-[12px]">M</div>
                    <div>
                      <div className="text-[13px] font-bold text-[#111111] dark:text-white">The MediScript Team</div>
                      <div className="text-[11px] text-[#999999]">Bengaluru, India</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ══ Section Divider ══ */}
            <div className="w-full max-w-5xl px-6"><div className="section-divider-band w-full" /></div>

            {/* ══ Voices — unique testimonial layout (not 3-card grid) ══ */}
            <section className="w-full max-w-5xl px-4 sm:px-6 py-12 sm:py-24 watercolor-wash-3">
              <div className="mb-8 sm:mb-14">
                <span className="text-[11px] font-extrabold text-[#6B5E65] uppercase tracking-[0.2em] block mb-3">From real patients</span>
                <h2 className="text-[24px] sm:text-[32px] font-extrabold text-[#111111] dark:text-white tracking-tight">
                  People talk about this.
                </h2>
              </div>

              {/* Featured large quote */}
              <div className="mb-10 relative">
                <div className="bg-[#FDFBF7] dark:bg-[#141210] border border-[#E8E4DC]/60 dark:border-white/[0.06] rounded-2xl p-6 sm:p-8 md:p-12 relative overflow-hidden">
                  {/* Large decorative quote */}
                  <span className="absolute top-4 right-6 text-[72px] font-serif text-[#8E6878]/[0.06] leading-none select-none">"</span>
                  
                  <p className="text-[15px] sm:text-[18px] md:text-[22px] text-[#333333] dark:text-[#CCCCCC] font-medium leading-[1.6] sm:leading-[1.7] max-w-2xl relative z-10">
                    My father gets prescriptions from his cardiologist in such illegible handwriting. This app finally let us understand what he's <span className="relative inline-block font-bold text-[#111111] dark:text-white">actually taking every day.
                      <svg className="absolute -bottom-0.5 left-0 w-full h-2 text-[#8E6878]/25" viewBox="0 0 200 8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                        <path d="M2 5 C40 2, 80 7, 120 4 C160 1, 180 6, 198 3" />
                      </svg>
                    </span>
                  </p>
                  
                  <div className="flex items-center gap-3 mt-8 pt-6 border-t border-dashed border-neutral-200 dark:border-neutral-700">
                    <div className="w-10 h-10 rounded-full bg-[#8E6878]/10 flex items-center justify-center text-[#8E6878] font-extrabold text-[14px]">P</div>
                    <div>
                      <div className="text-[14px] font-bold text-[#111111] dark:text-white">Priya Menon</div>
                      <div className="text-[12px] text-[#999999]">Kochi, Kerala · Caregiver</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Two smaller quotes — side by side, message style */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-[#141414] border border-black/[0.06] dark:border-white/[0.06] rounded-2xl p-6 relative">
                  {/* Chat bubble tail */}
                  <div className="absolute -top-2 left-8 w-4 h-4 bg-white dark:bg-[#141414] border-l border-t border-black/[0.06] dark:border-white/[0.06] transform rotate-45" />
                  
                  <p className="text-[14px] text-[#444444] dark:text-[#BBBBBB] leading-relaxed mb-5">
                    "I used it for my mother's prescription after her eye surgery. The Hindi translation was surprisingly natural and she could read it herself on my phone."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#10B981]/10 flex items-center justify-center text-[#10B981] font-extrabold text-[12px]">V</div>
                    <div>
                      <div className="text-[13px] font-bold text-[#111111] dark:text-white">Vikram Joshi</div>
                      <div className="text-[11px] text-[#999999]">Pune, Maharashtra</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-[#141414] border border-black/[0.06] dark:border-white/[0.06] rounded-2xl p-6 relative">
                  <div className="absolute -top-2 left-8 w-4 h-4 bg-white dark:bg-[#141414] border-l border-t border-black/[0.06] dark:border-white/[0.06] transform rotate-45" />
                  
                  <p className="text-[14px] text-[#444444] dark:text-[#BBBBBB] leading-relaxed mb-5">
                    "As a pharmacist, I see patients confused about their prescriptions daily. I recommend MediScript as a second verification step. The interaction alerts are genuinely useful."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#6B5E65]/10 flex items-center justify-center text-[#6B5E65] font-extrabold text-[12px]">L</div>
                    <div>
                      <div className="text-[13px] font-bold text-[#111111] dark:text-white">Dr. Lakshmi N.</div>
                      <div className="text-[11px] text-[#999999]">Bengaluru · Pharmacist</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ══ FAQ ══ */}
            <section className="w-full max-w-3xl px-4 sm:px-6 py-10 sm:py-16 text-left mx-auto">
              <div className="text-center mb-8 sm:mb-10">
                <span className="text-[11px] font-extrabold text-[#6B5E65] uppercase tracking-[0.2em] block mb-2">FAQ</span>
                <h2 className="text-[22px] sm:text-[28px] font-extrabold text-[#111111] dark:text-white tracking-tight">Common questions</h2>
              </div>

              <div className="space-y-3">
                {[
                  {
                    q: 'How accurate is the handwriting scan?',
                    a: 'MediScript matches hand scribbles against common local brands (Pantocid, Dolo, Limcee, etc.). While highly accurate for verification, it is strictly educational. Always review doses with your pharmacist.'
                  },
                  {
                    q: 'Which languages can I translate results into?',
                    a: 'We support full patient-friendly translations in English, Hindi (हिंदी), and Kannada (ಕನ್ನಡ) to make medical instructions accessible for family members at home.'
                  },
                  {
                    q: 'Is my health data saved or shared?',
                    a: 'No. MediScript AI operates under secure HIPAA compliance. We process scans on active sessions and do not permanently store or share prescription documents.'
                  },
                  {
                    q: 'Does this cost anything?',
                    a: 'No, MediScript AI is a public educational resource built to support Indian healthcare consumer safety.'
                  }
                ].map((faq, idx) => (
                  <div 
                    key={idx}
                    className="border border-black/[0.06] dark:border-white/[0.06] rounded-xl overflow-hidden transition-all duration-300"
                  >
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                      className="w-full py-3 sm:py-4 px-4 sm:px-5 flex justify-between items-center text-left text-[13px] sm:text-[14px] font-semibold text-[#111111] dark:text-[#EDEDED] hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
                    >
                      <span>{faq.q}</span>
                      <span className="text-[#999999] text-[18px] select-none font-light">
                        {expandedFaq === idx ? '−' : '+'}
                      </span>
                    </button>
                    {expandedFaq === idx && (
                      <div className="px-5 pb-4 pt-1 border-t border-black/[0.04] dark:border-white/[0.04] text-[13px] text-[#666666] dark:text-[#888888] leading-relaxed">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* ══ Bottom CTA Banner ══ */}
            <section className="w-full max-w-5xl px-4 sm:px-6 pb-12 sm:pb-24">
              <div className="bg-gradient-to-br from-[#8E6878] via-[#6E4F5C] to-[#5A3F4B] dark:from-[#5A3F4B] dark:via-[#6E4F5C] dark:to-[#8E6878] rounded-2xl sm:rounded-3xl p-8 sm:p-16 text-center relative overflow-hidden shadow-2xl shadow-[#8E6878]/20">
                {/* Decorative orbs */}
                <div className="absolute top-[-30%] left-[-10%] w-64 h-64 bg-white/[0.06] rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-[-20%] right-[-5%] w-48 h-48 bg-[#10B981]/[0.1] rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-[20%] right-[15%] w-32 h-32 bg-[#6B5E65]/[0.08] rounded-full blur-2xl pointer-events-none" />
                
                {/* Subtle noise texture */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} />
                
                <div className="relative z-10">
                  <span className="text-[11px] font-extrabold text-white/50 uppercase tracking-[0.25em] block mb-4">Get Started Free</span>
                  <h2 className="text-[22px] sm:text-[34px] font-extrabold text-white tracking-tight mb-4 leading-tight">
                    Stop guessing what's on<br className="hidden sm:block" /> your prescription.
                  </h2>
                  <p className="text-[13px] sm:text-[15px] text-white/60 mb-6 sm:mb-8 max-w-md mx-auto">
                    Upload a photo and get a clear, verified breakdown in under 10 seconds. Free, private, and in your language.
                  </p>
                  <button
                    onClick={() => setCurrentPage('upload')}
                    className="bg-white text-[#8E6878] text-[14px] font-bold px-8 py-3.5 rounded-xl hover:bg-white/90 active:scale-[0.98] transition-all inline-flex items-center gap-2 shadow-lg"
                  >
                    Get started <ArrowUpRight size={15} />
                  </button>
                </div>
              </div>
            </section>

          </main>
        ) : currentPage === 'features' ? (
        <main className="flex-1 w-full pt-20 sm:pt-28 pb-12 sm:pb-20 flex flex-col items-center z-10 relative">
          <div className="max-w-4xl w-full px-4 sm:px-6">
            <span className="text-[11px] font-extrabold text-[#8E6878] uppercase tracking-[0.2em] block mb-3">Features</span>
            <h1 className="text-[26px] sm:text-[36px] font-extrabold text-[#111111] dark:text-white tracking-tight leading-tight mb-4">Three things your pharmacy<br/>can't tell you.</h1>
            <p className="text-[13px] sm:text-[15px] text-[#666666] dark:text-[#888888] leading-relaxed max-w-xl mb-10 sm:mb-16">Every feature exists because a real patient needed it. Not because a product roadmap said so.</p>

            {/* Drug Interaction */}
            <div className="flex flex-col md:flex-row gap-10 items-center mb-20 pb-20 border-b border-dashed border-neutral-200 dark:border-neutral-800">
              <div className="md:w-1/2 space-y-4">
                <div className="inline-flex items-center gap-2 text-[11px] font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-wider"><AlertTriangle size={14} /> Drug Safety</div>
                <h2 className="text-[24px] font-extrabold text-[#111111] dark:text-white tracking-tight leading-tight">"Is it safe to take these together?"</h2>
                <p className="text-[14px] text-[#666666] dark:text-[#888888] leading-relaxed">Every prescription is auto-checked for dangerous drug combinations. We cross-reference against known interaction databases used by pharmacists. You'll know before you take them — not after you feel sick.</p>
                <ul className="space-y-1.5 text-[13px] text-[#555555] dark:text-[#999999] pl-1">
                  <li>— Checks all drugs on the same prescription against each other</li>
                  <li>— Flags dangerous combinations with severity level</li>
                  <li>— Shows confirmation when no issues found</li>
                </ul>
              </div>
              <div className="md:w-1/2">
                <div className="bg-[#FDFBF7] dark:bg-[#141210] border border-[#E8E4DC]/60 dark:border-white/[0.06] rounded-2xl p-5 space-y-3">
                  <div className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Interaction check</div>
                  <div className="flex items-center gap-3 p-3 bg-white dark:bg-[#1A1A1A] rounded-xl border border-black/[0.04] dark:border-white/[0.04]">
                    <span className="text-[13px] font-semibold text-[#111111] dark:text-white">Pantocid 40mg</span>
                    <span className="text-[11px] text-neutral-400">×</span>
                    <span className="text-[13px] font-semibold text-[#111111] dark:text-white">Dolo 650</span>
                  </div>
                  <p className="text-[12px] text-neutral-500 dark:text-neutral-400 pl-1">— No known interactions. Safe to take together.</p>
                  <p className="text-[12px] text-neutral-500 dark:text-neutral-400 pl-1">— Metformin + Alcohol: avoid. Risk of lactic acidosis.</p>
                </div>
              </div>
            </div>

            {/* Multilingual */}
            <div className="flex flex-col md:flex-row-reverse gap-10 items-center mb-20 pb-20 border-b border-dashed border-neutral-200 dark:border-neutral-800">
              <div className="md:w-1/2 space-y-4">
                <div className="inline-flex items-center gap-2 text-[11px] font-extrabold text-[#10B981] uppercase tracking-wider"><Globe size={14} /> Language Access</div>
                <h2 className="text-[24px] font-extrabold text-[#111111] dark:text-white tracking-tight leading-tight">"My amma can't read English."</h2>
                <p className="text-[14px] text-[#666666] dark:text-[#888888] leading-relaxed">One tap to translate the entire medicine breakdown to Hindi or Kannada. Share it on WhatsApp. Your grandmother reads her own medicine instructions for the first time.</p>
                <ul className="space-y-1.5 text-[13px] text-[#555555] dark:text-[#999999] pl-1">
                  <li>— English, Hindi, and Kannada supported</li>
                  <li>— Natural translations, not robotic Google Translate</li>
                  <li>— One-tap language switch on results page</li>
                </ul>
              </div>
              <div className="md:w-1/2">
                <div className="bg-white dark:bg-[#141414] border border-black/[0.06] dark:border-white/[0.06] rounded-2xl p-5 space-y-4">
                  <div className="flex gap-1.5">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-[#8E6878]/10 text-[#8E6878]">EN</span>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-400">HI</span>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-400">KN</span>
                  </div>
                  <div className="space-y-2 text-[13px]">
                    <p className="text-neutral-700 dark:text-neutral-300 font-medium">Take 1 tablet in the morning, 30 min before breakfast.</p>
                    <div className="h-px bg-neutral-100 dark:bg-neutral-800" />
                    <p className="text-neutral-400 font-medium italic">↓ हिंदी</p>
                    <p className="text-neutral-700 dark:text-neutral-300 font-medium">सुबह 1 गोली, नाश्ते से 30 मिनट पहले खाली पेट लें।</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy */}
            <div className="flex flex-col md:flex-row gap-10 items-center mb-16">
              <div className="md:w-1/2 space-y-4">
                <div className="inline-flex items-center gap-2 text-[11px] font-extrabold text-[#6B5E65] uppercase tracking-wider"><Shield size={14} /> Privacy First</div>
                <h2 className="text-[24px] font-extrabold text-[#111111] dark:text-white tracking-tight leading-tight">"I don't want my data stored."</h2>
                <p className="text-[14px] text-[#666666] dark:text-[#888888] leading-relaxed">Your prescription image is processed in-session and immediately discarded. No accounts, no sign-ups. We physically cannot retrieve your data later.</p>
              </div>
              <div className="md:w-1/2">
                <div className="bg-[#FDFBF7] dark:bg-[#141210] border border-[#E8E4DC]/60 dark:border-white/[0.06] rounded-2xl p-6 space-y-2">
                  {[['1', 'Image uploaded → processed in memory'], ['2', 'AI decodes → results shown'], ['✕', 'Image permanently deleted']].map(([n, t]) => (
                    <div key={n} className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${n === '✕' ? 'bg-red-100 dark:bg-red-500/10 text-red-500' : 'bg-[#8E6878]/10 text-[#8E6878]'}`}>{n}</div>
                      <span className="text-[12px] font-medium text-neutral-600 dark:text-neutral-400">{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-center pt-8 border-t border-dashed border-neutral-200 dark:border-neutral-800">
              <button onClick={() => setCurrentPage('upload')} className="bg-gradient-to-r from-[#8E6878] to-[#6E4F5C] text-white font-bold px-8 py-3 rounded-xl hover:shadow-lg hover:shadow-[#8E6878]/20 transition-all active:scale-[0.97]">
                Try it now — Upload Rx
              </button>
            </div>
          </div>
        </main>

        ) : currentPage === 'how-it-works' ? (
        <main className="flex-1 w-full pt-20 sm:pt-28 pb-12 sm:pb-20 flex flex-col items-center z-10 relative">
          <div className="max-w-3xl w-full px-4 sm:px-6">
            <span className="text-[11px] font-extrabold text-[#8E6878] uppercase tracking-[0.2em] block mb-3">How it works</span>
            <h1 className="text-[26px] sm:text-[36px] font-extrabold text-[#111111] dark:text-white tracking-tight leading-tight mb-4">From scribble to clarity.</h1>
            <p className="text-[13px] sm:text-[15px] text-[#666666] dark:text-[#888888] leading-relaxed max-w-xl mb-10 sm:mb-16">Three steps. Under 10 seconds. No sign-up needed.</p>

            {/* Step 1 */}
            <div className="relative flex flex-col md:flex-row items-start gap-8 mb-16">
              <div className="w-14 h-14 rounded-2xl bg-[#8E6878]/10 flex items-center justify-center text-[#8E6878] font-extrabold text-[20px] shrink-0">1</div>
              <div className="space-y-3 flex-1">
                <h2 className="text-[22px] font-extrabold text-[#111111] dark:text-white">Snap or upload your prescription</h2>
                <p className="text-[14px] text-[#666666] dark:text-[#888888] leading-relaxed">At the pharmacy counter, right after the doctor visit. Open MediScript, tap upload, and either take a photo with your camera or pick an existing image. We accept JPG, PNG, and PDF.</p>
                <div className="bg-[#FDFBF7] dark:bg-[#141210] border border-[#E8E4DC]/60 dark:border-white/[0.06] rounded-xl p-4">
                  <div className="font-[Georgia] italic text-[18px] text-neutral-400 blur-[0.3px]">T. Pcid 40mg...<br/>T. Dlo 650...</div>
                  <div className="absolute -top-2 -right-2 bg-[#8E6878] text-white text-[9px] font-bold px-2 py-0.5 rounded-full">📸 snap!</div>
                </div>
              </div>
            </div>

            <svg className="mx-auto w-px h-8 mb-8" viewBox="0 0 2 32" stroke="#8E6878" strokeWidth="1" strokeDasharray="3 4" opacity="0.3"><line x1="1" y1="0" x2="1" y2="32" /></svg>

            {/* Step 2 */}
            <div className="relative flex flex-col md:flex-row items-start gap-8 mb-16">
              <div className="w-14 h-14 rounded-2xl bg-[#10B981]/10 flex items-center justify-center text-[#10B981] font-extrabold text-[20px] shrink-0">2</div>
              <div className="space-y-3 flex-1">
                <h2 className="text-[22px] font-extrabold text-[#111111] dark:text-white">AI decodes every scribble</h2>
                <p className="text-[14px] text-[#666666] dark:text-[#888888] leading-relaxed">In under 8 seconds, our AI model matches each scribble against 500+ Indian drug brands. It identifies the exact medicine, dosage, duration, and checks for dangerous interactions between drugs on the same prescription.</p>
                <div className="flex flex-wrap gap-2">
                  {[['98%', 'Pantocid 40mg'], ['97%', 'Dolo 650']].map(([pct, name]) => (
                    <div key={name} className="flex items-center gap-2 bg-white dark:bg-[#141414] border border-black/[0.04] dark:border-white/[0.04] rounded-lg px-3 py-2">
                      <span className="text-[10px] font-medium text-neutral-400">{pct}</span>
                      <span className="text-[13px] font-semibold text-[#111111] dark:text-white">{name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <svg className="mx-auto w-px h-8 mb-8" viewBox="0 0 2 32" stroke="#8E6878" strokeWidth="1" strokeDasharray="3 4" opacity="0.3"><line x1="1" y1="0" x2="1" y2="32" /></svg>

            {/* Step 3 */}
            <div className="relative flex flex-col md:flex-row items-start gap-8 mb-16">
              <div className="w-14 h-14 rounded-2xl bg-[#6B5E65]/10 flex items-center justify-center text-[#6B5E65] font-extrabold text-[20px] shrink-0">3</div>
              <div className="space-y-3 flex-1">
                <h2 className="text-[22px] font-extrabold text-[#111111] dark:text-white">Read, translate, and share</h2>
                <p className="text-[14px] text-[#666666] dark:text-[#888888] leading-relaxed">Get a plain-language card for each medicine — what it does, when to take it, side effects, and warnings. Switch the output to Hindi or Kannada and forward it to your parents on WhatsApp. Everyone in the family understands.</p>
                <div className="flex gap-1.5">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-[#8E6878]/10 text-[#8E6878]">English</span>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-400">हिंदी</span>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-400">ಕನ್ನಡ</span>
                </div>
              </div>
            </div>

            <div className="text-center pt-8 border-t border-dashed border-neutral-200 dark:border-neutral-800">
              <button onClick={() => setCurrentPage('upload')} className="bg-gradient-to-r from-[#8E6878] to-[#6E4F5C] text-white font-bold px-8 py-3 rounded-xl hover:shadow-lg hover:shadow-[#8E6878]/20 transition-all active:scale-[0.97]">
                Upload your prescription
              </button>
            </div>
          </div>
        </main>

        ) : currentPage === 'about' ? (
        <main className="flex-1 w-full pt-20 sm:pt-28 pb-12 sm:pb-20 flex flex-col items-center z-10 relative">
          <div className="max-w-3xl w-full px-4 sm:px-6">
            <span className="text-[11px] font-extrabold text-[#8E6878] uppercase tracking-[0.2em] block mb-3">About MediScript</span>
            <h1 className="text-[26px] sm:text-[36px] font-extrabold text-[#111111] dark:text-white tracking-tight leading-tight mb-6">We built this because<br/>someone we love needed it.</h1>

            <div className="bg-[#FDFBF7] dark:bg-[#141210] border border-[#E8E4DC]/60 dark:border-white/[0.06] rounded-2xl p-8 md:p-12 relative overflow-hidden mb-12">
              <svg className="absolute top-4 left-6 w-10 h-10 text-[#8E6878]/10" viewBox="0 0 40 40" fill="currentColor">
                <path d="M10 25 C10 20, 12 15, 18 12 L16 10 C8 14, 5 20, 5 28 C5 33, 8 36, 12 36 C16 36, 18 33, 18 30 C18 27, 16 25, 12 25 Z M28 25 C28 20, 30 15, 36 12 L34 10 C26 14, 23 20, 23 28 C23 33, 26 36, 30 36 C34 36, 36 33, 36 30 C36 27, 34 25, 30 25 Z" />
              </svg>
              <div className="relative z-10 space-y-5">
                <p className="text-[16px] text-[#333333] dark:text-[#CCCCCC] leading-[1.8] font-medium">One of our founders watched his mother take the wrong dosage for 3 weeks — because she couldn't read the doctor's handwriting and was too embarrassed to call back and ask.</p>
                <p className="text-[16px] text-[#333333] dark:text-[#CCCCCC] leading-[1.8] font-medium">That's when we realized: this isn't a technology problem. It's a <span className="font-bold text-[#111111] dark:text-white">communication gap</span> between doctors who write fast and patients who deserve to know what they're taking.</p>
                <p className="text-[16px] text-[#333333] dark:text-[#CCCCCC] leading-[1.8] font-medium">MediScript isn't a flashy AI demo. It's a tool that exists because <span className="relative inline-block font-bold text-[#111111] dark:text-white">no one should guess what medicine they're putting in their body.
                  <svg className="absolute -bottom-0.5 left-0 w-full h-2 text-[#8E6878]/25" viewBox="0 0 200 8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M2 5 C40 2, 80 7, 120 4 C160 1, 180 6, 198 3" /></svg>
                </span></p>
              </div>
            </div>

            <h2 className="text-[22px] font-extrabold text-[#111111] dark:text-white mb-6">What MediScript does</h2>
            <div className="space-y-4 mb-12">
              {[
                ['Upload a prescription photo', 'Take a picture of any handwritten prescription — we handle the rest.'],
                ['Get every medicine decoded', 'Drug name, purpose, dosage, duration, side effects — all in plain language.'],
                ['Check drug interactions', 'Automatically flag dangerous combinations between medicines on the same prescription.'],
                ['Translate to Hindi or Kannada', 'Share the breakdown with elderly family members in their language.'],
                ['Zero data stored', 'Your prescription is processed in-session and immediately deleted. No accounts needed.'],
              ].map(([title, desc]) => (
                <div key={title} className="flex gap-4 items-start">
                  <CheckCircle2 size={18} className="text-[#8E6878] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[14px] font-bold text-[#111111] dark:text-white">{title}</div>
                    <div className="text-[13px] text-[#666666] dark:text-[#888888]">{desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-[#8E6878]/10 flex items-center justify-center text-[#8E6878] font-extrabold text-[14px]">M</div>
              <div>
                <div className="text-[14px] font-bold text-[#111111] dark:text-white">The MediScript Team</div>
                <div className="text-[12px] text-[#999999]">Bengaluru, India</div>
              </div>
            </div>

            <div className="text-center pt-8 border-t border-dashed border-neutral-200 dark:border-neutral-800">
              <button onClick={() => setCurrentPage('upload')} className="bg-gradient-to-r from-[#8E6878] to-[#6E4F5C] text-white font-bold px-8 py-3 rounded-xl hover:shadow-lg hover:shadow-[#8E6878]/20 transition-all active:scale-[0.97]">
                Try MediScript now
              </button>
            </div>
          </div>
        </main>

        ) : currentPage === 'upload' ? (
        // ── UPLOAD VIEW ──
        <main className="flex-1 w-full pt-20 sm:pt-28 flex flex-col items-center justify-center z-10 relative">
          <div className="max-w-xl w-full px-4 sm:px-6 flex flex-col gap-5 sm:gap-6">
            
            <div className="text-center space-y-1">
              <h2 className="text-[18px] sm:text-[22px] font-bold text-[#111111] dark:text-white">Upload your prescription</h2>
              <p className="text-[13px] text-[#888888] dark:text-[#666666]">Select a clear image or take a photo with your camera.</p>
            </div>

            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className="relative group cursor-pointer"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                accept=".pdf,.png,.jpg,.jpeg"
              />

              <div className="absolute inset-0 bg-gradient-to-r from-[#8E6878]/5 to-[#6B5E65]/5 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <div
                onClick={() => {
                  if (!isUploading) fileInputRef.current?.click();
                }}
                className={`w-full relative bg-white dark:bg-[#111114] border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] py-14 px-6 border-neutral-200/80 dark:border-white/[0.08] ${
                  isDragging 
                    ? 'border-[#8E6878] bg-[#8E6878]/5 scale-[0.98]' 
                    : 'hover:border-[#8E6878]/40 hover:bg-[#8E6878]/[0.01] hover:scale-[1.005]'
                }`}
              >
                {isUploading ? (
                  <div className="flex flex-col items-center gap-5">
                    <div className="w-14 h-14 bg-white dark:bg-neutral-800 rounded-full flex items-center justify-center shadow-md relative z-10 border dark:border-white/[0.06]">
                      <RefreshCw size={24} className="text-[#8E6878] animate-spin" />
                    </div>
                    <div className="text-center space-y-1.5 max-w-sm">
                      <div className="text-[15px] font-extrabold text-neutral-800 dark:text-neutral-100">
                        {uploadStage === 'uploading' && 'Uploading image details...'}
                        {uploadStage === 'decoding' && 'Scanning handwriting scripts...'}
                        {uploadStage === 'translating' && 'Translating side effects and notes...'}
                      </div>
                      <p className="text-[12.5px] text-neutral-500 font-semibold">{uploadedFileName}</p>
                      <div className="w-48 h-1 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden mx-auto mt-2">
                        <div 
                          className="h-full bg-[#8E6878] rounded-full transition-all duration-100"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4 text-center">
                    <div className="w-14 h-14 bg-neutral-100 dark:bg-neutral-800/80 rounded-full flex items-center justify-center text-neutral-450 dark:text-neutral-500 group-hover:bg-[#8E6878] group-hover:text-white transition-colors duration-500 shadow-inner">
                      <UploadCloud size={24} />
                    </div>
                    <div>
                      <div className="text-[15.5px] font-extrabold text-neutral-800 dark:text-neutral-100">Drag prescription photo here</div>
                      <div className="text-[12.5px] text-neutral-500 dark:text-neutral-400 font-semibold mt-1">Or click to browse files</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Camera Capture simulator CTA */}
            {!isUploading && (
              <div className="flex flex-col gap-3">
                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-black/[0.04] dark:border-white/[0.04]"></div>
                  <span className="flex-shrink mx-4 text-neutral-450 text-[10.5px] font-extrabold uppercase tracking-widest">Or take a picture</span>
                  <div className="flex-grow border-t border-black/[0.04] dark:border-white/[0.04]"></div>
                </div>

                <button
                  onClick={() => setShowCameraModal(true)}
                  className="bg-white dark:bg-neutral-800/40 border border-neutral-200 dark:border-white/[0.05] text-neutral-700 dark:text-neutral-300 font-bold text-[14px] py-3.5 rounded-full hover:bg-neutral-55 hover:text-black dark:hover:text-white active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Camera size={16} /> Capture via Phone Camera
                </button>

                <div className="text-center mt-3">
                  <p className="text-[11px] text-neutral-400 font-medium">Supported formats: PDF, PNG, JPG, JPEG (Max 15MB)</p>
                </div>
              </div>
            )}

          </div>
        </main>
      ) : (
        // ── RESULTS VIEW ──
        <main className="flex-1 w-full pt-24 sm:pt-32 pb-10 sm:pb-16 flex flex-col items-center z-10 relative">
          <div className="max-w-4xl w-full px-4 sm:px-6 space-y-4 sm:space-y-6">
            
            {/* Clinical Verification Dossier Header Card */}
            <div className="bg-white/50 dark:bg-[#121216]/50 backdrop-blur-xl border border-black/[0.04] dark:border-white/[0.04] rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6">
              <div className="space-y-4 w-full md:w-auto">
                <div>
                  <span className="text-[9px] font-extrabold text-[#8E6878] dark:text-[#C4ABB3] uppercase tracking-widest block mb-1">CLINICAL VERIFICATION DOSSIER</span>
                  <h2 className="text-[20px] sm:text-[24px] font-extrabold text-[#111118] dark:text-white tracking-tight leading-tight">{activeRx.patient}</h2>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 sm:gap-x-6 gap-y-2 border-t border-black/[0.03] dark:border-white/[0.03] pt-3 sm:pt-4">
                  <div>
                    <span className="text-[8.5px] font-extrabold text-neutral-400 uppercase tracking-wide block">Scan Time</span>
                    <span className="text-[11px] sm:text-[12px] font-bold text-neutral-600 dark:text-neutral-300 flex items-center gap-1 mt-0.5"><Clock size={11} /> {activeRx.date}</span>
                  </div>
                  <div>
                    <span className="text-[8.5px] font-extrabold text-neutral-400 uppercase tracking-wide block">Prescribing Clinic</span>
                    <span className="text-[11px] sm:text-[12px] font-bold text-neutral-600 dark:text-neutral-300 block mt-0.5">{activeRx.clinic}</span>
                  </div>
                  <div>
                    <span className="text-[8.5px] font-extrabold text-neutral-400 uppercase tracking-wide block">Licensing Reg No</span>
                    <span className="text-[12px] font-bold text-neutral-600 dark:text-neutral-300 block mt-0.5">REG-49201</span>
                  </div>
                </div>
              </div>

              {/* Language switcher tabs */}
              <div className="flex bg-neutral-100 dark:bg-neutral-800/80 p-1 rounded-full gap-0.5 shrink-0 self-stretch md:self-auto justify-center">
                <button
                  onClick={() => {
                    setActiveLanguage('en');
                    triggerToast('Switched to English', 'info');
                  }}
                  className={`text-[11.5px] font-extrabold px-3.5 py-1.5 rounded-full transition-all ${
                    activeLanguage === 'en'
                      ? 'bg-white dark:bg-[#121216] text-[#8E6878] shadow-sm'
                      : 'text-neutral-500 hover:text-neutral-800'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => {
                    setActiveLanguage('hi');
                    triggerToast('भाषा हिंदी में बदली गई', 'info');
                  }}
                  className={`text-[11.5px] font-extrabold px-3.5 py-1.5 rounded-full transition-all ${
                    activeLanguage === 'hi'
                      ? 'bg-white dark:bg-[#121216] text-[#8E6878] shadow-sm'
                      : 'text-neutral-500 hover:text-neutral-800'
                  }`}
                >
                  हिंदी
                </button>
                <button
                  onClick={() => {
                    setActiveLanguage('kn');
                    triggerToast('ಕನ್ನಡ ಭಾಷೆಗೆ ಬದಲಾಯಿಸಲಾಗಿದೆ', 'info');
                  }}
                  className={`text-[11.5px] font-extrabold px-3.5 py-1.5 rounded-full transition-all ${
                    activeLanguage === 'kn'
                      ? 'bg-white dark:bg-[#121216] text-[#8E6878] shadow-sm'
                      : 'text-neutral-500 hover:text-neutral-800'
                  }`}
                >
                  ಕನ್ನಡ
                </button>
              </div>
            </div>

            {/* Laser scanning visual sweep line representation */}
            {isLaserScanning && (
              <div className="w-full border border-black/[0.04] dark:border-white/[0.04] rounded-2xl p-4 flex items-center justify-between">
                <span className="text-[12.5px] font-medium text-neutral-500 flex items-center gap-2">
                  <RefreshCw size={14} className="animate-spin text-neutral-400" /> Decoding prescription...
                </span>
                <span className="text-[11px] text-neutral-400">Scanning</span>
              </div>
            )}

            {/* Interaction alerts box */}
            <div className="bg-white dark:bg-[#111114] border border-black/5 dark:border-white/[0.05] rounded-2xl p-4">
              <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block mb-1">Interaction check</span>
              <p className="text-[13px] text-neutral-600 dark:text-neutral-300 leading-relaxed">
                {activeRx.interactionAlert[activeLanguage]}
              </p>
            </div>

            {/* List of Decoded Medicine Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {activeRx.medications.map((med) => {
                const translation = med.translations[activeLanguage];
                return (
                  <div 
                    key={med.id}
                    className="bg-white dark:bg-[#111114] border border-black/5 dark:border-white/[0.05] rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 shadow-sm flex flex-col justify-between gap-4 sm:gap-5 relative hover:scale-[1.01] transition-transform duration-300"
                  >
                    <div className="space-y-4">
                      {/* Name / confidence header */}
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-1">
                          <h4 className="text-[16px] font-extrabold text-neutral-800 dark:text-neutral-200 tracking-tight leading-snug">
                            {med.name}
                          </h4>
                          <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest">Decoded Medicine</span>
                        </div>
                        <span className="text-[10.5px] font-medium text-neutral-400 dark:text-neutral-500 shrink-0">
                          {med.confidence}% match
                        </span>
                      </div>

                      <div className="w-12 h-px bg-neutral-100 dark:bg-neutral-800" />

                      <div className="space-y-3">
                        {/* Purpose */}
                        <div className="flex gap-2">
                          <User size={14} className="text-neutral-400 mt-0.5 shrink-0" />
                          <div className="space-y-0.5">
                            <span className="text-[9px] font-extrabold text-neutral-400 uppercase tracking-wider block">What is it for?</span>
                            <p className="text-[13px] text-neutral-700 dark:text-neutral-300 font-semibold leading-normal">{translation.purpose}</p>
                          </div>
                        </div>

                        {/* Dosage */}
                        <div className="flex gap-2">
                          <Clock size={14} className="text-neutral-400 mt-0.5 shrink-0" />
                          <div className="space-y-0.5">
                            <span className="text-[9px] font-extrabold text-neutral-400 uppercase tracking-wider block">How to take it?</span>
                            <p className="text-[13px] text-neutral-700 dark:text-neutral-300 font-semibold leading-normal">{translation.dosage}</p>
                          </div>
                        </div>

                        {/* Duration */}
                        <div className="flex gap-2">
                          <Clock size={14} className="text-[#8E6878] mt-0.5 shrink-0" />
                          <div className="space-y-0.5">
                            <span className="text-[9px] font-extrabold text-neutral-400 uppercase tracking-wider block">Duration</span>
                            <p className="text-[13px] text-neutral-700 dark:text-neutral-300 font-semibold leading-normal">{translation.duration}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 pt-3 border-t border-black/[0.03] dark:border-white/[0.03]">
                      {/* Side Effects pills */}
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-extrabold text-neutral-400 uppercase tracking-wider block">Common Side Effects</span>
                        <div className="flex flex-wrap gap-1.5">
                          {translation.sideEffects.map((side, idx) => (
                            <span key={idx} className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-450 border dark:border-white/[0.04]">
                              {side}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Warning alerts */}
                      <div className="flex gap-2 p-2.5 bg-neutral-50 dark:bg-neutral-800/20 border dark:border-white/[0.03] rounded-xl">
                        <AlertCircle size={13} className="text-[#8E6878] shrink-0 mt-0.5" />
                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-bold leading-normal">
                          {translation.interactionWarning}
                        </p>
                      </div>

                      {/* Voice Readout — prominent listen button */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => speakMedicine(med, activeLanguage)}
                          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-extrabold text-[12px] uppercase tracking-wider transition-all active:scale-95 ${
                            speakingMedId === med.id
                              ? 'bg-[#8E6878] text-white shadow-md shadow-[#8E6878]/25 animate-pulse'
                              : 'bg-[#8E6878]/10 dark:bg-[#8E6878]/15 text-[#8E6878] hover:bg-[#8E6878]/20 border border-[#8E6878]/20'
                          }`}
                        >
                          {speakingMedId === med.id
                            ? <><VolumeX size={14} /> {activeLanguage === 'hi' ? 'रोकें' : activeLanguage === 'kn' ? 'ನಿಲ್ಲಿಸಿ' : 'Stop'}</>
                            : <><Volume2 size={14} /> {activeLanguage === 'hi' ? 'हिंदी में सुनें' : activeLanguage === 'kn' ? 'ಕನ್ನಡದಲ್ಲಿ ಕೇಳಿ' : 'Listen'}</>}
                        </button>
                        <button
                          onClick={() => {
                            const hours = window.prompt(`Set reminder for ${med.name}\nIn how many hours? (e.g. 1, 4, 8)`);
                            const n = parseFloat(hours || '');
                            if (!isNaN(n) && n > 0) handleRemindMe(med, n);
                          }}
                          className={`flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl font-extrabold text-[11px] uppercase tracking-wider transition-all active:scale-95 border ${
                            reminders[med.id]
                              ? 'bg-green-50 dark:bg-green-900/20 text-green-600 border-green-200 dark:border-green-700/30'
                              : 'bg-neutral-50 dark:bg-neutral-800/40 text-neutral-500 border-neutral-200 dark:border-white/[0.06] hover:border-[#8E6878]/30 hover:text-[#8E6878]'
                          }`}
                        >
                          <Bell size={13} />
                          {reminders[med.id] ? reminders[med.id] : 'Remind'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Ask AI */}
            <div className="rounded-2xl border border-[#8E6878]/20 dark:border-[#8E6878]/15 bg-[#8E6878]/[0.04] dark:bg-[#8E6878]/[0.06] p-4 sm:p-5 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold text-[#8E6878] uppercase tracking-widest">Ask AI</span>
                <span className="text-[10px] text-neutral-400">— ask anything about this prescription</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={askQuery}
                  onChange={(e) => setAskQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAskAI()}
                  placeholder={activeLanguage === 'hi' ? 'जैसे: क्या मैं इसे खाली पेट ले सकता हूँ?' : activeLanguage === 'kn' ? 'ಉದಾ: ಇದನ್ನು ಖಾಲಿ ಹೊಟ್ಟೆಯಲ್ಲಿ ತೆಗೆದುಕೊಳ್ಳಬಹುದೇ?' : 'e.g. Can I take this on an empty stomach?'}
                  className="flex-1 text-[12px] px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-white/[0.07] bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#8E6878]/30"
                />
                <button
                  onClick={handleAskAI}
                  disabled={isAsking || !askQuery.trim()}
                  className="px-4 py-2.5 rounded-xl bg-[#8E6878] text-white font-extrabold text-[11px] uppercase tracking-wider disabled:opacity-50 active:scale-95 transition-all whitespace-nowrap"
                >
                  {isAsking ? '...' : 'Ask'}
                </button>
              </div>
              {askAnswer && (
                <div className="text-[12px] text-neutral-700 dark:text-neutral-300 leading-relaxed p-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-white/[0.05]">
                  {askAnswer}
                </div>
              )}
            </div>

            {/* Bottom action controls */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6 sm:pt-8 border-t border-black/[0.03] dark:border-white/[0.03]">
              <button
                onClick={handleShareResult}
                className="flex-1 bg-[#25D366] text-white font-extrabold text-[12px] sm:text-[13px] py-3.5 sm:py-4 rounded-full hover:bg-[#1DA851] active:scale-95 transition-all shadow-[0_4px_15px_rgba(37,211,102,0.25)] flex items-center justify-center gap-2 uppercase tracking-wider"
              >
                <Share2 size={15} /> Share on WhatsApp
              </button>
              <button
                onClick={handleSavePDF}
                className="flex-1 bg-white dark:bg-[#121216]/50 border border-neutral-200 dark:border-white/[0.05] text-neutral-700 dark:text-neutral-300 font-extrabold text-[12px] sm:text-[13px] py-3.5 sm:py-4 rounded-full hover:bg-neutral-50 dark:hover:bg-neutral-800 active:scale-95 transition-all flex items-center justify-center gap-2 uppercase tracking-wider"
              >
                <ArrowUpRight size={15} /> Save report PDF
              </button>
              <button
                onClick={() => {
                  setCurrentPage('upload');
                  triggerToast('Ready for new scan', 'success');
                }}
                className="bg-neutral-150 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-755 text-[#111118] dark:text-neutral-300 font-extrabold text-[12px] sm:text-[13px] px-6 sm:px-8 py-3.5 sm:py-4 rounded-full active:scale-95 transition-all uppercase tracking-wider border border-transparent dark:border-white/[0.03]"
              >
                Upload another
              </button>
            </div>

          </div>
        </main>
      )}

      {/* ══ FOOTER ══ */}
      <footer className="w-full border-t border-black/[0.06] dark:border-white/[0.06] shrink-0 z-10 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="flex flex-col sm:flex-row justify-between gap-8 sm:gap-10 mb-8 sm:mb-10">
            {/* Brand */}
            <div className="max-w-xs">
              <div className="flex items-center gap-2 mb-3">
                <img src="/logo.jpeg" alt="MediScript" className="w-7 h-7 rounded-lg object-cover" />
                <span className="font-extrabold text-[15px] text-[#111111] dark:text-white tracking-tight">MediScript</span>
              </div>
              <p className="text-[12px] text-[#999999] dark:text-[#666666] leading-relaxed">
                Prescription decoder for Indian patients. Upload a photo, get a plain-language breakdown in English, Hindi, or Kannada.
              </p>
            </div>

            {/* Links */}
            <div className="flex flex-wrap gap-8 sm:gap-16">
              <div>
                <h4 className="text-[11px] font-semibold text-[#111111] dark:text-[#999999] uppercase tracking-wider mb-3">Product</h4>
                <div className="space-y-2">
                  <span onClick={() => { setCurrentPage('features'); window.scrollTo(0,0); }} className="text-[13px] text-[#888888] dark:text-[#555555] hover:text-[#111111] dark:hover:text-white cursor-pointer transition-colors block">Features</span>
                  <span onClick={() => { setCurrentPage('how-it-works'); window.scrollTo(0,0); }} className="text-[13px] text-[#888888] dark:text-[#555555] hover:text-[#111111] dark:hover:text-white cursor-pointer transition-colors block">How it works</span>
                  <span onClick={() => { setCurrentPage('about'); window.scrollTo(0,0); }} className="text-[13px] text-[#888888] dark:text-[#555555] hover:text-[#111111] dark:hover:text-white cursor-pointer transition-colors block">About</span>
                  <span onClick={() => setCurrentPage('upload')} className="text-[13px] text-[#888888] dark:text-[#555555] hover:text-[#111111] dark:hover:text-white cursor-pointer transition-colors block">Upload prescription</span>
                </div>
              </div>
              <div>
                <h4 className="text-[11px] font-semibold text-[#111111] dark:text-[#999999] uppercase tracking-wider mb-3">Legal</h4>
                <div className="space-y-2">
                  <span className="text-[13px] text-[#888888] dark:text-[#555555] hover:text-[#111111] dark:hover:text-white cursor-pointer transition-colors block">Privacy Policy</span>
                  <span className="text-[13px] text-[#888888] dark:text-[#555555] hover:text-[#111111] dark:hover:text-white cursor-pointer transition-colors block">Terms of Service</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom — plain text, no boxes */}
          <div className="pt-6 border-t border-black/[0.04] dark:border-white/[0.04]">
            <p className="text-[11px] text-[#BBBBBB] dark:text-[#444444] leading-relaxed mb-2">
              MediScript is for informational purposes only and is not a substitute for professional medical advice. Always consult your doctor or pharmacist.
            </p>
            <p className="text-[11px] text-[#CCCCCC] dark:text-[#333333]">
              © 2026 MediScript AI Technologies Pvt. Ltd. · Bengaluru, India
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
