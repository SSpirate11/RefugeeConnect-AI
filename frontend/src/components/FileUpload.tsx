import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import MappingDisplay from './MappingDisplay';
import { UploadCloud, CheckCircle, AlertCircle, Loader2, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const FileUpload: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [analysis, setAnalysis] = useState<any>(null);
    const [mapping, setMapping] = useState<any>(null);
    const { token } = useAuth();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
            setMessage(null);
            setAnalysis(null);
            setMapping(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setMessage(null);
        setAnalysis(null);
        setMapping(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:8001/api/credentials/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Upload failed');
            }

            const data = await response.json();

            // Artificial delay for UX smootheness if response is too fast
            await new Promise(r => setTimeout(r, 800));

            let analysisData = null;
            if (data.analysis) {
                try {
                    analysisData = typeof data.analysis === 'string' ? JSON.parse(data.analysis) : data.analysis;
                } catch (e) {
                    console.error("Failed to parse analysis:", e);
                    analysisData = { error: typeof data.analysis === 'string' ? data.analysis : "Invalid analysis format" };
                }
            } else {
                analysisData = { error: "No analysis data received from server" };
            }

            setAnalysis(analysisData);

            if (data.mapping) {
                setMapping(data.mapping);
            }

            if (analysisData?.error) {
                setMessage(analysisData.error.startsWith("Error") ? analysisData.error : `Error: ${analysisData.error}`);
            } else {
                setMessage('Analysis Complete');
            }

        } catch (error: any) {
            setMessage(`Error: ${error.message}`);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100"
            >
                <div className="p-8 bg-gradient-to-br from-indigo-50/50 to-white">
                    <h2 className="text-3xl font-bold text-slate-800 mb-2">Credential Analysis</h2>
                    <p className="text-slate-500 mb-8 max-w-2xl">
                        Upload your academic credentials, transcripts, or certificates. Our Gemini 3 powered AI will extract details, analyze validity, and map them to local standards.
                    </p>

                    <div className="grid md:grid-cols-2 gap-8 items-start">
                        {/* Upload Zone */}
                        <div className="space-y-4">
                            <label className={`
                                relative block w-full border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300
                                ${file ? 'border-indigo-400 bg-indigo-50/50' : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'}
                            `}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                <div className="space-y-4">
                                    <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center transition-colors ${file ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                                        {file ? <FileText className="w-8 h-8" /> : <UploadCloud className="w-8 h-8" />}
                                    </div>
                                    <div>
                                        {file ? (
                                            <p className="font-semibold text-indigo-900">{file.name}</p>
                                        ) : (
                                            <>
                                                <p className="font-semibold text-slate-700">Click to upload or drag & drop</p>
                                                <p className="text-sm text-slate-500 mt-1">Supports PNG, JPG, JPEG</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </label>

                            <button
                                onClick={handleUpload}
                                disabled={!file || uploading}
                                className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors shadow-lg shadow-indigo-200 flex items-center justify-center space-x-2"
                            >
                                {uploading ? (
                                    <>
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                        <span>Analyzing Document...</span>
                                    </>
                                ) : (
                                    <>
                                        <UploadCloud className="w-6 h-6" />
                                        <span>Analyze Credential</span>
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Status / Instructions */}
                        <div className="space-y-4">
                            {!analysis && !message && (
                                <div className="bg-slate-50 rounded-xl p-6 text-sm text-slate-600 space-y-3">
                                    <p className="font-semibold text-slate-800 flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-500" /> How it works:
                                    </p>
                                    <ul className="space-y-2 pl-6 list-disc marker:text-slate-300">
                                        <li>AI scans the document structure and text.</li>
                                        <li>Extracts institution, degree, and grades.</li>
                                        <li>Detects any physical damage or tampering.</li>
                                        <li>Maps the curriculum to European standards.</li>
                                    </ul>
                                </div>
                            )}

                            {message && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className={`p-6 rounded-xl border flex items-start gap-3 ${message.startsWith('Error')
                                        ? 'bg-red-50 border-red-100 text-red-700'
                                        : 'bg-green-50 border-green-100 text-green-700'
                                        }`}
                                >
                                    {message.startsWith('Error') ? <AlertCircle className="w-5 h-5 shrink-0" /> : <CheckCircle className="w-5 h-5 shrink-0" />}
                                    <div>
                                        <p className="font-semibold">{message.startsWith('Error') ? 'Upload Failed' : 'Success'}</p>
                                        <p className="text-sm opacity-90">{message}</p>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Results Section */}
                {analysis && analysis.error && (
                    <div className="p-8 bg-red-50 border-t border-red-100">
                        <div className="flex items-start gap-4 text-red-700">
                            <AlertCircle className="w-6 h-6 shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-bold text-lg mb-1">Analysis Failed</h3>
                                <p>{analysis.error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {analysis && !analysis.error && (
                    <div className="border-t border-slate-200 p-8 bg-white">
                        <div className="mb-6 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                                <FileText className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-xl text-slate-800">Document Analysis</h3>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6 mb-8">
                            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Document Type</p>
                                <p className="font-medium text-slate-900">{analysis.document_type || 'Unknown'}</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Institution</p>
                                <p className="font-medium text-slate-900">{analysis.institution || 'Not detected'}</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Country</p>
                                <p className="font-medium text-slate-900">{analysis.country || 'Not detected'}</p>
                            </div>
                        </div>

                        {analysis.is_damaged && (
                            <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-3 text-amber-800">
                                <AlertCircle className="w-5 h-5" />
                                <div>
                                    <p className="font-bold text-sm">Damage Detected</p>
                                    <p className="text-sm">The document appears to have physical damage which might affect verification.</p>
                                </div>
                            </div>
                        )}

                        <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Extracted Text Preview</p>
                            <p className="text-sm text-slate-600 italic leading-relaxed line-clamp-3">
                                "{analysis.extracted_text}"
                            </p>
                        </div>
                    </div>
                )}
            </motion.div>

            {mapping && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <MappingDisplay mapping={mapping} analysis={analysis} />
                </motion.div>
            )}
        </div>
    );
};

export default FileUpload;
