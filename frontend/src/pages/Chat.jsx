import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { Send, Search, Image as ImageIcon, Paperclip, MoreVertical, Hash, X } from 'lucide-react';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

const Chat = () => {
    const { user } = useAuth();
    const socketRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [attachment, setAttachment] = useState(null);
    const [activeChannel, setActiveChannel] = useState('general');
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        // Connect to socket
        const newSocket = io(SOCKET_URL);
        socketRef.current = newSocket;

        newSocket.on('connect', () => {
            newSocket.emit('join_room', activeChannel);
            if (user?._id) {
                newSocket.emit('join_room', user._id);
            }
        });

        // Listen for incoming messages
        newSocket.on('receive_message', (data) => {
            setMessages((prev) => {
                if (prev.some(m => m.id === data.id || m._id === data._id)) return prev;
                
                // If it's a DM sent to us, only show if we are viewing the sender
                if (data.room === user?._id) {
                    if (data.senderId === activeChannel) return [...prev, data];
                    return prev;
                }

                // If it's a group message, only show if we are viewing that group
                if (data.room === activeChannel) return [...prev, data];
                
                return prev;
            });
        });

        return () => newSocket.close();
    }, [activeChannel, user]);

    useEffect(() => {
        window.currentChatChannel = activeChannel;
        return () => { window.currentChatChannel = null; };
    }, [activeChannel]);

    useEffect(() => {
        // Fetch DB history
        import('../services/api').then(({ default: api }) => {
            api.get(`/chat/${activeChannel}/messages`)
                .then(res => {
                    const dataArray = Array.isArray(res.data) ? res.data : [];
                    const mapped = dataArray.map(m => ({
                        id: m._id,
                        _id: m._id,
                        room: activeChannel,
                        text: m.text,
                        senderId: m.sender?._id || m.sender,
                        senderName: m.sender?.name?.split(' ')[0] || 'Unknown',
                        time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    }));
                    setMessages(mapped);
                })
                .catch(err => {
                    console.error('Failed fetching chat history:', err);
                    setMessages([]);
                });
        });
    }, [activeChannel]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (newMessage.trim() === '' && !attachment) return;

        let uploadedFilePath = null;
        if (attachment) {
            const formData = new FormData();
            formData.append('file', attachment);
            try {
                const { default: api } = await import('../services/api');
                const uploadRes = await api.post('/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                uploadedFilePath = uploadRes.data.filePath;
            } catch (err) {
                console.error("File upload failed", err);
                alert("Attachment upload failed. Ensure the server accepts it and it is <5MB and is an image or pdf.");
                return;
            }
        }

        const textToSend = newMessage;
        setNewMessage(''); // optimistic clear
        setAttachment(null);
        
        try {
            const { default: api } = await import('../services/api');
            const res = await api.post(`/chat/${activeChannel}/messages`, { 
                text: textToSend || 'Sent an attachment',
                attachments: uploadedFilePath ? [uploadedFilePath] : []
            });
            
            const msgData = {
                id: res.data._id,
                _id: res.data._id,
                room: activeChannel,
                text: res.data.text,
                attachments: res.data.attachments,
                senderId: user?._id || '1',
                senderName: user?.name?.split(' ')[0] || 'Me',
                time: new Date(res.data.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };

            // Emit socket event to notify others
            socketRef.current?.emit('send_message', msgData);

            // Add locally immediately
            setMessages((prev) => [...prev, msgData]);
        } catch(err) {
            console.error('Failed sending message:', err);
        }
    };

    const channels = [
        { id: 'general', name: 'General', unread: 0 },
        { id: 'engineering', name: 'Engineering', unread: 0 },
        { id: 'design', name: 'Design', unread: 0 },
        { id: 'announcements', name: 'Announcements', unread: 0 },
    ];

    const [onlineUsers, setOnlineUsers] = useState([]);

    useEffect(() => {
        import('../services/api').then(({ default: api }) => {
            api.get('/users?chat=true').then(res => {
                // Filter out the current user, map them to chat format
                setOnlineUsers(res.data.filter(u => u._id !== user?._id).map(u => ({
                    id: u._id,
                    name: u.name,
                    status: 'online' // Simulated online for now
                })));
            }).catch(console.error);
        });
    }, [user]);

    const activeChatName = channels.find(c => c.id === activeChannel)?.name || onlineUsers.find(u => u.id === activeChannel)?.name || activeChannel;
    const isDirectMessage = !channels.some(c => c.id === activeChannel);

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
                                        onClick={() => setActiveChannel(u.id)}
                                        className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors ${activeChannel === u.id
                                            ? 'bg-indigo-500/20 text-indigo-300'
                                            : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                                            }`}
                                    >
                                        <div className="relative">
                                            <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center font-bold text-xs text-white uppercase shadow-md">
                                                {u.name.substring(0, 2)}
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
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center drop-shadow-md border border-indigo-500/30 font-bold uppercase">
                            {isDirectMessage ? activeChatName.substring(0, 2) : <Hash size={20} />}
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-lg capitalize">{activeChatName}</h3>
                            <p className="text-xs text-slate-400 flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-emerald-500" /> {isDirectMessage ? 'Online' : 'Active Channel'}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button className="p-2 text-slate-400 hover:text-white transition-colors"><Search size={20} /></button>
                        <button className="p-2 text-slate-400 hover:text-white transition-colors"><MoreVertical size={20} /></button>
                    </div>
                </div>

                {/* Messages List - Microsoft Teams Style Flat Layout */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-1 custom-scrollbar bg-[#1f1f1f]">
                    {messages.map((msg, idx) => {
                        const isMe = msg.senderId === (user?._id || '1');
                        const showHeader = idx === 0 || messages[idx - 1].senderId !== msg.senderId;

                        const senderName = msg.senderName || 'Unknown';
                        return (
                            <div
                                key={msg.id || idx}
                                className={`flex flex-col animate-in fade-in duration-200 hover:bg-white/5 py-1 px-2 rounded-md ${!showHeader ? 'mt-0' : 'mt-4'}`}
                            >
                                <div className="flex items-start gap-3 w-full">
                                    {/* Avatar Column */}
                                    <div className="w-10 shrink-0 flex justify-center">
                                        {showHeader ? (
                                            <div className="w-9 h-9 rounded-full bg-indigo-600 shrink-0 text-white font-bold text-sm flex items-center justify-center shadow-sm">
                                                {senderName.charAt(0).toUpperCase()}
                                            </div>
                                        ) : (
                                            <div className="w-9 h-9" /> /* Spacer for grouped messages */
                                        )}
                                    </div>
                                    
                                    {/* Content Column */}
                                    <div className="flex-1 min-w-0 pr-4">
                                        {showHeader && (
                                            <div className="flex items-baseline gap-2 mb-0.5">
                                                <span className="text-[14px] font-semibold text-slate-100">{isMe ? 'You' : senderName}</span>
                                                <span className="text-[11px] text-slate-400">{msg.time}</span>
                                            </div>
                                        )}
                                        <div className="text-[14px] text-slate-300 leading-[1.4] whitespace-pre-wrap break-words">
                                            {msg.text}
                                            {msg.attachments && msg.attachments.length > 0 && (
                                                <div className="mt-2 space-y-2">
                                                    {msg.attachments.map((att, i) => (
                                                        <div key={i}>
                                                            {att.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                                                                <img src={`${SOCKET_URL}${att}`} alt="attachment" className="max-w-[240px] max-h-[240px] rounded border border-slate-700 shadow-sm object-contain bg-slate-900" />
                                                            ) : (
                                                                <a href={`${SOCKET_URL}${att}`} download target="_blank" rel="noreferrer" className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 text-xs bg-slate-800 w-fit px-3 py-1.5 rounded-lg border border-slate-700/50">
                                                                    <Paperclip size={14} /> View Document
                                                                </a>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} className="h-4" />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-slate-700/50 bg-slate-800/40 shrink-0 relative">
                    {/* Minimal Attachment Preview */}
                    {attachment && (
                        <div className="absolute top-[-44px] left-6 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-t-lg bg-opacity-95 flex items-center gap-3 shadow-[0_-4px_10px_rgba(0,0,0,0.1)]">
                            <span className="text-xs text-indigo-300 font-medium tracking-wide truncate max-w-[150px]">{attachment.name}</span>
                            <button type="button" onClick={() => setAttachment(null)} className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-full p-0.5 transition-colors">
                                <X size={14} />
                            </button>
                        </div>
                    )}
                    
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
                                placeholder={`Message #${activeChatName}...`}
                                className="w-full bg-slate-900/60 border border-slate-700/60 rounded-xl py-3 pl-4 pr-[104px] text-white focus:outline-none focus:ring-2 focus:border-indigo-500 transition-all resize-none h-[52px] min-h-[52px] max-h-32 custom-scrollbar placeholder-slate-500"
                                rows="1"
                            />
                            
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                style={{ display: 'none' }} 
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        if (e.target.files[0].size > 5242880) return alert("File max size is 5MB.");
                                        setAttachment(e.target.files[0]);
                                    }
                                    e.target.value = '';
                                }} 
                                accept="image/jpeg,image/png,image/gif,application/pdf"
                            />

                            <div className="absolute right-2 bottom-2.5 flex gap-1">
                                <button type="button" onClick={() => fileInputRef.current?.click()} className="p-1.5 text-slate-400 hover:text-indigo-400 transition-colors rounded-lg hover:bg-slate-800">
                                    <Paperclip size={18} />
                                </button>
                                <button type="button" onClick={() => fileInputRef.current?.click()} className="p-1.5 text-slate-400 hover:text-indigo-400 transition-colors rounded-lg hover:bg-slate-800">
                                    <ImageIcon size={18} />
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={newMessage.trim() === '' && !attachment}
                            className={`bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white p-3.5 rounded-xl transition-colors shadow-lg shadow-indigo-500/20 shrink-0 ${attachment ? 'animate-pulse' : ''}`}
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
