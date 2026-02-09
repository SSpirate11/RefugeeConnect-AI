import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, Volume2, Info, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

const Advocate: React.FC = () => {
    const [status, setStatus] = useState<string>('Disconnected');
    const [transcript, setTranscript] = useState<Array<{ role: string, text: string }>>([]);
    const [input, setInput] = useState<string>('');
    const ws = useRef<WebSocket | null>(null);
    const clientId = useRef<string>(Math.random().toString(36).substring(7));
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [transcript]);

    useEffect(() => {
        // Connect to WebSocket
        const socket = new WebSocket(`ws://localhost:8001/ws/advocate/${clientId.current}`);

        socket.onopen = () => {
            setStatus('Connected');
            setTranscript(prev => [...prev, { role: 'system', text: 'Secure connection established with Advocate Network.' }]);
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'ai_response') {
                setTranscript(prev => [...prev, { role: 'AI', text: data.text }]);
                // Simple TTS for demo
                speak(data.text);
            }
        };

        socket.onclose = () => {
            setStatus('Disconnected');
        };

        ws.current = socket;

        return () => {
            socket.close();
        };
    }, []);

    const sendMessage = () => {
        if (!input.trim() || !ws.current) return;

        setTranscript(prev => [...prev, { role: 'You', text: input }]);
        ws.current.send(JSON.stringify({ text: input }));
        setInput('');
    };

    const speak = (text: string) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            window.speechSynthesis.speak(utterance);
        }
    };

    // Simple voice input simulation (Web Speech API)
    const startListening = () => {
        if ('webkitSpeechRecognition' in window) {
            const recognition = new (window as any).webkitSpeechRecognition();
            recognition.continuous = false;
            recognition.lang = 'en-US';

            recognition.onstart = () => setStatus('Listening...');

            recognition.onresult = (event: any) => {
                const text = event.results[0][0].transcript;
                setInput(text);
            };

            recognition.onend = () => setStatus('Connected');

            recognition.start();
        } else {
            alert("Speech recognition not supported in this browser.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto h-[700px] flex flex-col bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
            {/* Header */}
            <div className="bg-indigo-600 p-4 px-6 flex justify-between items-center text-white">
                <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                        <Bot className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="font-bold text-lg">The Advocate</h2>
                        <div className="flex items-center gap-2 text-xs opacity-90">
                            <span className={`w-2 h-2 rounded-full ${status === 'Connected' ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></span>
                            <span>{status}</span>
                        </div>
                    </div>
                </div>
                <div className="opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
                    <Info className="w-5 h-5" />
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50 space-y-6">
                <AnimatePresence initial={false}>
                    {transcript.map((msg, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${msg.role === 'You' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`flex items-end gap-2 max-w-[80%] ${msg.role === 'You' ? 'flex-row-reverse' : 'flex-row'}`}>
                                {msg.role !== 'system' && (
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm
                                        ${msg.role === 'You' ? 'bg-indigo-100 text-indigo-600' : 'bg-white text-emerald-600'}`}>
                                        {msg.role === 'You' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                    </div>
                                )}

                                <div className={`px-5 py-3 shadow-sm text-sm leading-relaxed
                                    ${msg.role === 'You'
                                        ? 'bg-indigo-600 text-white rounded-2xl rounded-br-none'
                                        : msg.role === 'system'
                                            ? 'bg-transparent text-slate-400 text-xs w-full text-center py-2'
                                            : 'bg-white text-slate-700 rounded-2xl rounded-bl-none border border-slate-100'
                                    }`}>
                                    <div className="prose prose-sm max-w-none">
                                        <ReactMarkdown>
                                            {msg.text}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-100 text-slate-500">
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-2 focus-within:ring-2 focus-within:ring-indigo-100 transition-shadow">
                    <button
                        onClick={startListening}
                        className={`p-3 rounded-lg transition-all duration-300 ${status === 'Listening...' ? 'bg-red-500 text-white animate-pulse' : 'hover:bg-indigo-50 text-indigo-600'}`}
                        title="Start Voice Input"
                    >
                        <Mic className="w-5 h-5" />
                    </button>

                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Type or speak (e.g., 'What are my rights regarding housing?')"
                        className="flex-1 bg-transparent border-none focus:ring-0 text-slate-800 placeholder:text-slate-400"
                    />

                    <button
                        onClick={sendMessage}
                        disabled={!input.trim()}
                        className="p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors"
                    >
                        {input.trim() ? <Send className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                </div>
                <p className="text-center text-xs text-slate-300 mt-2">
                    AI can make mistakes. Please verify important legal information.
                </p>
            </div>
        </div>
    );
};

export default Advocate;
