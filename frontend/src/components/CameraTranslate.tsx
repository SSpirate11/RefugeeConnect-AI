import React, { useState, useRef, useCallback } from 'react';
import { Camera, X, Loader2, RefreshCw, Download, Languages } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

interface TranslationResult {
  original_text: string;
  translated_text: string;
  target_language: string;
  detected_language?: string;
  contextual_explanation?: string;
  confidence?: number;
}

const LANGUAGES = [
  { code: 'English', name: 'English' },
  { code: 'German', name: 'Deutsch' },
  { code: 'French', name: 'Français' },
  { code: 'Spanish', name: 'Español' },
  { code: 'Arabic', name: 'العربية' },
  { code: 'Ukrainian', name: 'Українська' },
  { code: 'Farsi', name: 'فارسی' },
  { code: 'Turkish', name: 'Türkçe' },
];

const CameraTranslate: React.FC = () => {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [translating, setTranslating] = useState(false);
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [targetLanguage, setTargetLanguage] = useState('English');
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { token } = useAuth();

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' } // Prefer back camera on mobile
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraOn(true);
        setError(null);
      }
    } catch (err) {
      setError('Could not access camera. Please check permissions.');
      console.error('Camera error:', err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraOn(false);
    }
  };

  const captureImage = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageData);
        stopCamera();
      }
    }
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCapturedImage(event.target?.result as string);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const translateImage = async () => {
    if (!capturedImage) return;

    setTranslating(true);
    setError(null);

    try {
      // Convert base64 to blob
      const blob = await fetch(capturedImage).then(r => r.blob());

      const formData = new FormData();
      formData.append('file', blob, 'captured-image.jpg');

      const response = await fetch(
        `http://localhost:8001/api/camera/translate?target_language=${targetLanguage}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Translation failed');
      }

      const data: TranslationResult = await response.json();
      setResult(data);

    } catch (err) {
      setError('Translation failed. Please try again.');
      console.error('Translation error:', err);
    } finally {
      setTranslating(false);
    }
  };

  const reset = () => {
    setCapturedImage(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Camera className="w-8 h-8 text-blue-600" />
          Camera Translator
        </h1>
        <p className="text-gray-600">
          Point your camera at any text to instantly translate it
        </p>
      </div>

      {/* Language Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Languages className="inline w-4 h-4 mr-1" />
          Translate to:
        </label>
        <select
          value={targetLanguage}
          onChange={(e) => setTargetLanguage(e.target.value)}
          className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={translating}
        >
          {LANGUAGES.map(lang => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2"
          >
            <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-red-700">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Camera/Image Capture Section */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
        {!capturedImage ? (
          <div className="p-6">
            {/* Camera View */}
            {isCameraOn ? (
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full rounded-lg"
                />
                <div className="mt-4 flex gap-3 justify-center">
                  <button
                    onClick={captureImage}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium"
                  >
                    <Camera className="w-5 h-5" />
                    Capture
                  </button>
                  <button
                    onClick={stopCamera}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center gap-2 font-medium"
                  >
                    <X className="w-5 h-5" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              /* Camera Off - Show Options */
              <div className="text-center py-12">
                <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Ready to Translate
                </h3>
                <p className="text-gray-600 mb-6">
                  Take a photo or upload an image with text
                </p>

                <div className="flex gap-3 justify-center flex-wrap">
                  <button
                    onClick={startCamera}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium"
                  >
                    <Camera className="w-5 h-5" />
                    Open Camera
                  </button>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center gap-2 font-medium"
                  >
                    <Download className="w-5 h-5" />
                    Upload Image
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            )}
          </div>
        ) : (
          /* Captured Image View */
          <div className="p-6">
            <img
              src={capturedImage}
              alt="Captured"
              className="w-full rounded-lg mb-4"
            />

            {!result && !translating && (
              <div className="flex gap-3 justify-center">
                <button
                  onClick={translateImage}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium"
                >
                  <Languages className="w-5 h-5" />
                  Translate
                </button>
                <button
                  onClick={reset}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center gap-2 font-medium"
                >
                  <RefreshCw className="w-5 h-5" />
                  Retake
                </button>
              </div>
            )}

            {translating && (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
                <p className="text-gray-600">Translating...</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Translation Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Translation Result</h2>

            {result.detected_language && (
              <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
                <Languages className="w-4 h-4" />
                <span>Detected: {result.detected_language}</span>
                {result.confidence && (
                  <span className="text-green-600">
                    ({Math.round(result.confidence * 100)}% confident)
                  </span>
                )}
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              {/* Original Text */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Original Text</h3>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-900 whitespace-pre-wrap">{result.original_text}</p>
                </div>
              </div>

              {/* Translated Text */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Translated to {result.target_language}
                </h3>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-blue-900 font-medium whitespace-pre-wrap">
                    {result.translated_text}
                  </p>
                </div>
              </div>
            </div>

            {/* Contextual Explanation */}
            {result.contextual_explanation && (
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-900">
                  <strong>Context:</strong> {result.contextual_explanation}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={reset}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Translate Another
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden canvas for image capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraTranslate;
