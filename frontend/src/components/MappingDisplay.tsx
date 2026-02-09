import React from 'react';
import { Download, GraduationCap, Percent, AlertTriangle, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';

interface MappingResult {
    equivalency_score: number;
    target_degree: string;
    missing_modules: string[];
    recommendations: string[];
    error?: string;
}

interface Props {
    mapping: MappingResult | string;
    analysis: any;
}

const MappingDisplay: React.FC<Props> = ({ mapping, analysis }) => {
    let data: MappingResult;

    try {
        if (typeof mapping === 'string') {
            // Try to extract JSON from string (Gemini sometimes adds extra text)
            const jsonMatch = mapping.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                data = JSON.parse(jsonMatch[0]);
            } else {
                data = JSON.parse(mapping);
            }
        } else {
            data = mapping;
        }
    } catch (e) {
        console.error('Mapping parse error:', e);
        console.error('Raw mapping:', mapping);
        return (
            <div className="bg-red-50 rounded-xl p-6 border border-red-100">
                <div className="flex items-start gap-3 text-red-700">
                    <AlertTriangle className="w-5 h-5 shrink-0" />
                    <div>
                        <h3 className="font-bold">Error parsing mapping data</h3>
                        <p className="text-sm mt-1">The credential mapping could not be processed. Please try again.</p>
                    </div>
                </div>
            </div>
        );
    }

    const handleDownload = async () => {
        try {
            const response = await fetch('http://localhost:8001/api/credentials/portfolio', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    analysis: analysis,
                    mapping: data
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'RefugeeConnect_Portfolio.pdf';
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);

        } catch (e) {
            console.error(e);
            alert("Failed to download portfolio.");
        }
    }

    if (!data || data.error) {
        if (data?.error) {
            return (
                <div className="bg-amber-50 rounded-xl p-6 border border-amber-100 text-amber-800">
                    <h3 className="font-bold flex items-center gap-2"><AlertTriangle className="w-5 h-5" /> Curriculum Mapping Unavailable</h3>
                    <p className="text-sm mt-1">{data.error}</p>
                </div>
            );
        }
        return null;
    }

    const score = (data.equivalency_score * 100);
    const scoreColor = score > 80 ? 'text-green-600 bg-green-50' :
        score > 50 ? 'text-amber-600 bg-amber-50' : 'text-red-600 bg-red-50';
    const progressBarColor = score > 80 ? 'bg-green-500' :
        score > 50 ? 'bg-amber-500' : 'bg-red-500';

    return (
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 flex justify-between items-center text-white">
                <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                        <GraduationCap className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-xl">Curriculum Equity Map</h3>
                        <p className="text-indigo-100 text-sm opacity-90">Analysis based on European Standards</p>
                    </div>
                </div>

                <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white text-indigo-700 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors shadow-sm"
                >
                    <Download className="w-4 h-4" />
                    Download Portfolio
                </button>
            </div>

            <div className="p-8 space-y-8">
                {/* Score & Degree */}
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-slate-700 flex items-center gap-2">
                                <Percent className="w-4 h-4 text-slate-400" /> Equivalency Score
                            </h4>
                            <span className={`px-3 py-1 rounded-full font-bold text-sm ${scoreColor}`}>
                                {score.toFixed(0)}% Match
                            </span>
                        </div>
                        <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${score}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className={`h-full ${progressBarColor}`}
                            />
                        </div>
                        <p className="text-xs text-slate-500">
                            Based on credit hours, course content, and institution accreditation.
                        </p>
                    </div>

                    <div className="p-5 border border-slate-200 rounded-xl bg-slate-50">
                        <h4 className="font-semibold text-slate-500 text-xs uppercase tracking-wider mb-2">Target Equivalent Degree</h4>
                        <p className="font-bold text-xl text-slate-800">{data.target_degree}</p>
                    </div>
                </div>

                {/* Gaps & Recommendations */}
                <div className="grid md:grid-cols-2 gap-8">
                    <div>
                        <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-amber-500" /> Identified Gaps
                        </h4>
                        <ul className="space-y-3">
                            {data.missing_modules?.map((gap, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                                    {gap}
                                </li>
                            ))}
                            {(!data.missing_modules || data.missing_modules.length === 0) && (
                                <li className="text-sm text-green-600 font-medium bg-green-50 p-3 rounded-lg border border-green-100">
                                    No significant gaps identified. You are fully qualified!
                                </li>
                            )}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Lightbulb className="w-5 h-5 text-indigo-500" /> Recommendations
                        </h4>
                        <ul className="space-y-3">
                            {data.recommendations?.map((rec, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-indigo-900 bg-indigo-50/50 p-3 rounded-lg border border-indigo-100">
                                    <span className="w-5 h-5 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                                        {i + 1}
                                    </span>
                                    {rec}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MappingDisplay;
