import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Compass, User, Briefcase, MapPin, Heart, Send, Sparkles, Loader2, ArrowRight } from 'lucide-react';

const Navigator: React.FC = () => {
    const [stage, setStage] = useState<'onboarding' | 'ready'>('onboarding');
    const [userId, setUserId] = useState<string>('');
    const [profile, setProfile] = useState<any>(null);
    const [conversation, setConversation] = useState<string>('');
    const [query, setQuery] = useState<string>('');
    const [guidance, setGuidance] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const { token } = useAuth();

    useEffect(() => {
        const storedUserId = localStorage.getItem('navigator-userid');
        const storedProfile = localStorage.getItem('navigator-profile');
        if (storedUserId && storedProfile) {
            setUserId(storedUserId);
            setProfile(JSON.parse(storedProfile));
            setStage('ready');
        }
    }, [token]);

    const handleOnboard = async () => {
        if (!conversation.trim()) return;

        setLoading(true);
        try {
            const response = await fetch('http://localhost:8001/api/navigator/onboard', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ conversation })
            });

            const data = await response.json();
            setUserId(data.user_id);
            setProfile(data.profile);
            localStorage.setItem('navigator-userid', data.user_id);
            localStorage.setItem('navigator-profile', JSON.stringify(data.profile));
            setStage('ready');
        } catch (error) {
            console.error('Onboarding failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAsk = async () => {
        if (!query.trim()) return;

        setLoading(true);
        try {
            const response = await fetch('http://localhost:8001/api/navigator/ask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ query, user_id: userId })
            });

            const data = await response.json();
            setGuidance(data.guidance);
        } catch (error) {
            console.error('Query failed:', error);
        } finally {
            setLoading(false);
        }
    };

    if (stage === 'onboarding') {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100"
            >
                <div className="bg-indigo-600 p-8 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold mb-2">Tell Your Story Once</h2>
                        <p className="text-indigo-100 text-lg">
                            Share your background, and we'll remember it to help you navigate every bureaucratic hurdle ahead.
                        </p>
                    </div>
                    <Compass className="absolute -right-6 -bottom-6 w-40 h-40 text-indigo-500/30" />
                </div>

                <div className="p-8 space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide">
                            Your Profile Information
                        </label>
                        <textarea
                            value={conversation}
                            onChange={(e) => setConversation(e.target.value)}
                            rows={6}
                            className="w-full border border-slate-200 rounded-xl p-4 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-slate-400 bg-slate-50"
                            placeholder="Example: My name is Amira, I'm a 38-year-old cardiologist from Syria. I fled to Germany in 2024 with my two children..."
                        />
                    </div>

                    <button
                        onClick={handleOnboard}
                        disabled={loading || !conversation.trim()}
                        className="w-full px-6 py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed font-bold text-lg transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Create Profile</span>}
                        {!loading && <ArrowRight className="w-5 h-5" />}
                    </button>

                    <p className="text-xs text-center text-slate-400">
                        Your data is processed securely and used only to assist you.
                    </p>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Profile Card */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden"
            >
                <div className="bg-slate-50 border-b border-slate-100 p-4 px-6 flex items-center gap-3">
                    <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                        <User className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">Your Digital Profile</h3>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {profile && Object.entries(profile).map(([key, value]) => (
                        <div key={key} className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors">
                            <div className="mt-1 text-slate-400">
                                {key === 'profession' && <Briefcase className="w-5 h-5" />}
                                {key === 'origin' && <MapPin className="w-5 h-5" />}
                                {['family', 'children'].some(k => key.includes(k)) && <Heart className="w-5 h-5" />}
                                {!['profession', 'origin'].some(k => key.includes(k)) && <User className="w-5 h-5" />}
                            </div>
                            <div>
                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                                    {key.replace(/_/g, ' ')}
                                </span>
                                <span className="text-slate-800 font-medium text-lg">
                                    {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Query Interface */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden"
            >
                <div className="p-8">
                    <h3 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-indigo-500" />
                        Ask for Assistance
                    </h3>
                    <p className="text-slate-500 mb-6">
                        I know your context. Ask me anything about forms, bureaucracy, or next steps.
                    </p>

                    <div className="relative">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
                            placeholder="e.g., How do I apply for housing benefits with my current status?"
                            className="w-full border-2 border-slate-200 rounded-xl py-4 pl-4 pr-32 text-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-0 transition-all placeholder:text-slate-400"
                        />
                        <button
                            onClick={handleAsk}
                            disabled={loading || !query.trim()}
                            className="absolute right-2 top-2 bottom-2 px-6 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed font-semibold transition-colors flex items-center gap-2"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Ask</span>}
                            {!loading && <Send className="w-4 h-4" />}
                        </button>
                    </div>

                    {guidance && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="mt-8 p-6 bg-indigo-50/50 rounded-xl border border-indigo-100"
                        >
                            <h4 className="font-bold text-indigo-900 mb-3 flex items-center gap-2">
                                <Compass className="w-5 h-5" /> Your Personal Guidance:
                            </h4>

                            <div className="text-slate-700 leading-relaxed whitespace-pre-wrap prose prose-indigo max-w-none">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {guidance}
                                </ReactMarkdown>
                            </div>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default Navigator;
