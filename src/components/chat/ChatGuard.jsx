import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Shield, AlertTriangle, Lock, CheckCircle, XCircle } from 'lucide-react';
import { analyzeMessage } from '../../services/guardAI';

/**
 * ChatGuard - Protected messaging component with Guard AI integration
 * Blocks contact info sharing before payment
 */
const ChatGuard = ({
    recipientId,
    recipientName,
    currentUserId,
    isPaid = false,
    onMessageSent,
    className = ""
}) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [warning, setWarning] = useState(null);
    const [isBlocked, setIsBlocked] = useState(false);
    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Handle send message
    const handleSend = () => {
        if (!message.trim() || isBlocked) return;

        // Analyze message with Guard AI
        const analysis = analyzeMessage(message, currentUserId, isPaid);

        if (analysis.action === 'BLOCK') {
            setWarning({
                type: 'error',
                message: analysis.userMessage
            });
            setIsBlocked(true);
            setTimeout(() => {
                setIsBlocked(false);
            }, 5000);
            return;
        }

        if (analysis.action === 'WARN') {
            setWarning({
                type: 'warning',
                message: analysis.userMessage
            });
            // Still allow but show warning
        }

        // Add message to chat
        const newMessage = {
            id: Date.now(),
            text: message,
            sender: currentUserId,
            timestamp: new Date().toISOString(),
            status: 'sent'
        };

        setMessages(prev => [...prev, newMessage]);
        setMessage('');

        if (onMessageSent) {
            onMessageSent(newMessage, analysis);
        }

        // Clear warning after a bit
        setTimeout(() => setWarning(null), 5000);
    };

    // Handle key press
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className={`flex flex-col h-full glass-card overflow-hidden ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center font-bold">
                        {recipientName?.charAt(0) || '?'}
                    </div>
                    <div>
                        <div className="font-medium">{recipientName}</div>
                        <div className="text-xs text-gray-400">
                            {isPaid ? (
                                <span className="text-emerald-400 flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" />
                                    Contact unlocked
                                </span>
                            ) : (
                                <span className="text-yellow-400 flex items-center gap-1">
                                    <Lock className="w-3 h-3" />
                                    Contact locked
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-neon-purple/10 border border-neon-purple/30 text-xs text-neon-purple">
                    <Shield className="w-3 h-3" />
                    <span>Protected</span>
                </div>
            </div>

            {/* Security Notice */}
            {!isPaid && (
                <div className="px-4 py-2 bg-yellow-500/10 border-b border-yellow-500/30">
                    <div className="flex items-center gap-2 text-xs text-yellow-400">
                        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                        <span>Contact details are hidden until payment is complete. This protects both buyer and seller.</span>
                    </div>
                </div>
            )}

            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 max-h-80">
                {messages.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                        <Shield className="w-12 h-12 mx-auto mb-3 text-gray-600" />
                        <p className="text-sm">Start a secure conversation</p>
                        <p className="text-xs mt-1">Messages are monitored for safety</p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${msg.sender === currentUserId ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[80%] px-4 py-2 rounded-2xl ${msg.sender === currentUserId
                                    ? 'bg-gradient-to-r from-neon-purple to-neon-pink text-white rounded-br-md'
                                    : 'bg-white/10 text-white rounded-bl-md'
                                }`}>
                                <p className="text-sm">{msg.text}</p>
                                <p className="text-[10px] opacity-60 mt-1">
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </motion.div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Warning Banner */}
            <AnimatePresence>
                {warning && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className={`px-4 py-3 ${warning.type === 'error'
                                ? 'bg-red-500/20 border-t border-red-500/30'
                                : 'bg-yellow-500/20 border-t border-yellow-500/30'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            {warning.type === 'error' ? (
                                <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                            ) : (
                                <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                            )}
                            <p className={`text-sm ${warning.type === 'error' ? 'text-red-300' : 'text-yellow-300'}`}>
                                {warning.message}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Input Area */}
            <div className="p-4 border-t border-white/10">
                <div className="flex items-center gap-3">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder={isBlocked ? "Message blocked - wait a moment..." : "Type your message..."}
                        disabled={isBlocked}
                        className={`flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-neon-purple/50 transition-colors ${isBlocked ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                    />
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSend}
                        disabled={isBlocked || !message.trim()}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${isBlocked || !message.trim()
                                ? 'bg-gray-600 cursor-not-allowed'
                                : 'bg-gradient-to-r from-neon-purple to-neon-pink hover:shadow-lg hover:shadow-neon-purple/30'
                            }`}
                    >
                        <Send className="w-5 h-5 text-white" />
                    </motion.button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                    🛡️ Protected by TickSwapr Guard AI
                </p>
            </div>
        </div>
    );
};

export default ChatGuard;
