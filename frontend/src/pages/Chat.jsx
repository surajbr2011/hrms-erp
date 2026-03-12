import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { Send, Search, Image as ImageIcon, Paperclip, MoreVertical, Hash } from 'lucide-react';
import { motion } from 'framer-motion';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

const Chat = () => {
    const { user } = useAuth();
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [activeChannel, setActiveChannel] = useState('general');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        // Connect to socket when component mounts
        const newSocket = io(SOCKET_URL);
        setSocket(newSocket);

        // Initial setup
        newSocket.on('connect', () => {
            console.log('Connected to chat server');
            newSocket.emit('join_room', activeChannel);
        });

        // Listen for incoming messages
        newSocket.on('receive_message', (data) => {
            setMessages((prev) => [...prev, data]);
        });

        return () => newSocket.close();
    }, [activeChannel]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;

        const msgData = {
            id: Date.now(),
            room: activeChannel,
            text: newMessage,
            senderId: user?._id || '1',
            senderName: user?.name?.split(' ')[0] || 'Me',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        // Emit socket event
        socket?.emit('send_message', msgData);

        // Add locally immediately
        setMessages((prev) => [...prev, msgData]);
        setNewMessage('');
    };

    const channels = [
        { id: 'general', name: 'General', unread: 0 },
        { id: 'engineering', name: 'Engineering', unread: 0 },
        { id: 'design', name: 'Design', unread: 0 },
        { id: 'announcements', name: 'Announcements', unread: 0 },
    ];

    const onlineUsers = [];

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col md:flex-row gap-6 animate-in fade-in duration-500">

            {/* Sidebar - Channels & Users */}
            <div className="w-full md:w-80 flex flex-col gap-6 shrink-0 h-[30vh] md:h-full">
                <div className="glass-panel p-4 flex-1 flex flex-col min-h-0">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Team</span>Chat
                    </h2>

                    <div className="relative mb-6">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search chats..."
                            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all placeholder-slate-500"
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        <div className="mb-6">
                            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Channels</h3>
                            <div className="space-y-1">
                                {channels.map(channel => (
                                    <button
                                        key={channel.id}
                                        onClick={() => setActiveChannel(channel.id)}
                                        className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors ${activeChannel === channel.id
                                            ? 'bg-indigo-500/20 text-indigo-300'
                                            : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                                            }`}
                                    >
                                        <div className="flex items-center gap-2 font-medium">
                                            <Hash size={16} className={activeChannel === channel.id ? 'text-indigo-400' : 'text-slate-500'} />
                                            {channel.name}
                                        </div>
                                        {channel.unread > 0 && (
                                            <span className="bg-indigo-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md min-w-[20px] text-center">
                                                {channel.unread}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex justify-between">
                                Direct Messages <span className="text-indigo-400">+</span>
                            </h3>
                            <div className="space-y-1">
                                {onlineUsers.map(u => (
                                    <button
                                        key={u.id}
                                        className="w-full flex items-center gap-3 p-2 rounded-lg transition-colors text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                                    >
                                        <div className="relative">
                                            <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center font-bold text-xs text-white">
                                                {u.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <span className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-slate-800 ${u.status === 'online' ? 'bg-emerald-500' : 'bg-amber-500'
                                                }`} />
                                        </div>
                                        <span className="font-medium text-sm truncate">{u.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 glass-panel flex flex-col overflow-hidden h-full">
                {/* Chat Header */}
                <div className="p-4 border-b border-slate-700/50 flex justify-between items-center bg-slate-800/40 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center drop-shadow-md border border-indigo-500/30">
                            <Hash size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-lg capitalize">{activeChannel}</h3>
                            <p className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" /> 12 online
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button className="p-2 text-slate-400 hover:text-white transition-colors"><Search size={20} /></button>
                        <button className="p-2 text-slate-400 hover:text-white transition-colors"><MoreVertical size={20} /></button>
                    </div>
                </div>

                {/* Messages List */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 custom-scrollbar bg-slate-900/20">
                    {messages.map((msg, idx) => {
                        const isMe = msg.senderId === (user?._id || '1');
                        const showHeader = idx === 0 || messages[idx - 1].senderId !== msg.senderId;

                        return (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={msg.id}
                                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                            >
                                {showHeader && !isMe && (
                                    <span className="text-xs text-slate-500 font-medium mb-1 ml-1">{msg.senderName}</span>
                                )}

                                <div className={`relative max-w-[80%] md:max-w-[70%] group flex items-end gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>

                                    {/* Avatar for others */}
                                    {showHeader && !isMe && (
                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-500 to-indigo-500 shrink-0 text-white font-bold text-xs flex items-center justify-center self-end mb-1">
                                            {msg.senderName.charAt(0)}
                                        </div>
                                    )}
                                    {!showHeader && !isMe && <div className="w-8 shrink-0" />}

                                    <div className={`px-4 py-3 rounded-2xl shadow-sm relative ${isMe
                                        ? 'bg-indigo-600 text-white rounded-br-sm'
                                        : 'bg-slate-800 text-slate-200 border border-slate-700/50 rounded-bl-sm'
                                        }`}>
                                        <p className="text-sm leading-relaxed">{msg.text}</p>

                                        {/* Timestamp */}
                                        <span className={`text-[10px] block mt-1 opacity-70 ${isMe ? 'text-indigo-200 text-right' : 'text-slate-400'}`}>
                                            {msg.time}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-slate-700/50 bg-slate-800/40 shrink-0">
                    <form onSubmit={handleSendMessage} className="flex relative items-end gap-2">
                        <div className="flex-1 relative">
                            <textarea
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage(e);
                                    }
                                }}
                                placeholder={`Message #${activeChannel}...`}
                                className="w-full bg-slate-900/60 border border-slate-700/60 rounded-xl py-3 pl-4 pr-24 text-white focus:outline-none focus:ring-2 focus:border-indigo-500 transition-all resize-none h-[52px] min-h-[52px] max-h-32 custom-scrollbar placeholder-slate-500"
                                rows="1"
                            />
                            <div className="absolute right-2 bottom-3 flex gap-1">
                                <button type="button" className="p-1.5 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-700">
                                    <Paperclip size={18} />
                                </button>
                                <button type="button" className="p-1.5 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-700">
                                    <ImageIcon size={18} />
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={newMessage.trim() === ''}
                            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white p-3.5 rounded-xl transition-colors shadow-lg shadow-indigo-500/20 shrink-0"
                        >
                            <Send size={18} className="translate-x-0.5" />
                        </button>
                    </form>
                    <p className="text-[10px] text-slate-500 text-center mt-2 capitalize">
                        <strong>Enter</strong> to send, <strong>Shift + Enter</strong> for new line
                    </p>
                </div>
            </div>

        </div>
    );
};

export default Chat;
