import React, { useEffect, useState, useRef } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import '../App.css';
import { TypeAnimation } from 'react-type-animation';
import farmer from "../assets/farmer.gif"


const Chat = ({ loggedInUser }) => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    // Setup real-time listener for messages
    const q = query(collection(db, "messages"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map(doc => ({
        _id: doc.id,
        ...doc.data()
      }));
      setMessages(fetchedMessages);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;

    try {
      const payload = {
        Name: loggedInUser.name || 'Anonymous',
        mssg: messageInput,
        user: loggedInUser._id || 'unknown',
        role: loggedInUser.role || 'farmer',
        createdAt: serverTimestamp()
      };
      
      if (replyTo) {
        payload.replyTo = replyTo._id;
        payload.replyToName = replyTo.Name;
        payload.replyToMssg = replyTo.mssg;
      }

      await addDoc(collection(db, "messages"), payload);
      
      setMessageInput('');
      setReplyTo(null);
    } catch (error) {
      console.error('Error sending message', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleDoubleClick = (message) => {
    setReplyTo(message);
  };

  const handleCancelReply = () => {
    setReplyTo(null);
    setMessageInput('');
  };

  const getAvatarColor = (name) => {
    if (!name) return '#f97316';
    const colors = ['#22c55e', '#3b82f6', '#f97316', '#ef4444', '#a855f7', '#14b8a6', '#eab308', '#ec4899', '#6366f1', '#06b6d4'];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp._seconds
      ? new Date(timestamp._seconds * 1000)
      : timestamp.toDate
        ? timestamp.toDate()
        : new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const sortedMessages = [...messages].reverse();

  return (
    <div
      className="w-full py-20 md:py-40 mx-auto flex justify-center items-center px-4 md:px-40 relative animation-backgroundAnimation2"
      style={{ backgroundSize: 'cover' }}
    >
      <div className="p-6 md:p-10 min-h-[550px] w-full rounded-2xl bg-gradient-to-br from-gray-900 via-black to-gray-900 flex flex-col md:flex-row shadow-2xl border border-green-900/30">

        {/* Left Panel - Farmer GIF & Animated Text */}
        <div className="w-full md:w-[30%] px-4 flex flex-col mb-6 md:mb-0">
          <div className="h-[50%] w-full">
            <div className="mb-3 inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 px-3 py-1 rounded-full">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-green-400 text-[10px] font-bold uppercase tracking-widest">Live Forum</span>
            </div>
            <h1 className="text-white font-semibold font-serif text-[24px] md:text-[30px] mb-4 leading-snug">
              <TypeAnimation
                sequence={[
                  'Looking for advice on sustainable farming practices? Ask your questions',
                  2000,
                  'Have questions about modern or organic farming? Share your doubts',
                  1000,
                  'Connect with fellow farmers and share your knowledge 🌾',
                  1500,
                ]}
                wrapper="span"
                speed={50}
                style={{ display: 'inline-block' }}
                repeat={Infinity}
              />
            </h1>
          </div>

          <div className="h-[50%] w-full flex justify-center items-center">
            <img loading="lazy" src={farmer} className="w-[250px] h-[250px] md:w-[300px] md:h-[300px] flip-vertical drop-shadow-[0_0_30px_rgba(34,197,94,0.3)]" />
          </div>
        </div>

        {/* Right Panel - Chat Area */}
        <div className='w-full md:w-[70%] flex flex-col justify-center'>

          {/* Online Users / Group Header */}
          <div className="flex items-center justify-between mb-3 px-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white text-lg">
                🌾
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">Kisan Community Group</h3>
                <p className="text-green-400 text-[11px] font-medium">
                  <span className="inline-block w-1.5 h-1.5 bg-green-400 rounded-full mr-1 animate-pulse"></span>
                  {sortedMessages.length > 0
                    ? `${[...new Set(sortedMessages.map(m => m.Name))].length} members active`
                    : 'Be the first to chat!'
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center -space-x-2">
              {[...new Set(sortedMessages.map(m => m.Name))].slice(0, 5).map((name, i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-full border-2 border-black flex items-center justify-center text-white text-[10px] font-bold shadow-md"
                  style={{ backgroundColor: getAvatarColor(name) }}
                  title={name}
                >
                  {name.charAt(0).toUpperCase()}
                </div>
              ))}
              {[...new Set(sortedMessages.map(m => m.Name))].length > 5 && (
                <div className="w-7 h-7 rounded-full border-2 border-black bg-gray-700 flex items-center justify-center text-white text-[9px] font-bold">
                  +{[...new Set(sortedMessages.map(m => m.Name))].length - 5}
                </div>
              )}
            </div>
          </div>

          <div
            ref={chatContainerRef}
            className="h-96 overflow-y-auto border-2 border-green-500/40 rounded-xl p-4 mb-3 backdrop-blur-sm"
            style={{
              backgroundImage: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url("https://www.agdaily.com/wp-content/uploads/2018/09/bg-corn_field-001-naramit.jpg")',
              backgroundSize: 'cover'
            }}
          >
            {sortedMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <span className="text-4xl mb-3">💬</span>
                <p className="text-white/60 font-bold text-sm">No messages yet</p>
                <p className="text-white/40 text-xs">Start the conversation!</p>
              </div>
            ) : (
              sortedMessages.map((message) => {
                const isOwn = message.user === loggedInUser._id;
                return (
                  <div
                    key={message._id}
                    className={`flex fadeIn ${isOwn ? 'justify-end' : 'justify-start'} mb-3`}
                    onDoubleClick={() => handleDoubleClick(message)}
                    title="Double-click to reply"
                  >
                    <div className={`flex items-start gap-2 max-w-[80%] ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                      {/* Avatar */}
                      {!isOwn && (
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg shrink-0 mt-1"
                          style={{ backgroundColor: getAvatarColor(message.Name) }}
                        >
                          {message.Name.charAt(0).toUpperCase()}
                        </div>
                      )}

                      {/* Message Bubble */}
                      <div
                        className={`px-4 py-2.5 rounded-2xl shadow-md ${isOwn
                          ? 'bg-green-600 text-white rounded-tr-sm'
                          : 'bg-white/95 text-gray-900 rounded-tl-sm'
                          }`}
                      >
                        {/* Sender Name - always shown for others (group style) */}
                        {!isOwn && (
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <p className="text-[11px] font-bold" style={{ color: getAvatarColor(message.Name) }}>
                              {message.Name}{message.role ? `(${message.role === 'government' ? 'G' : message.role === 'retailer' ? 'R' : 'F'})` : ''}
                            </p>
                          </div>
                        )}

                        {/* Reply Reference */}
                        {message.replyTo && (
                          <div className={`mb-1.5 pl-2 py-1 border-l-2 rounded-r ${isOwn ? 'border-white/40 bg-green-700/50' : 'border-green-400 bg-green-50'}`}>
                            <p className={`text-[10px] italic ${isOwn ? 'text-white/70' : 'text-gray-500'}`}>
                              ↩ Replying to a message
                            </p>
                          </div>
                        )}

                        {/* Message Text */}
                        <p className="text-[13px] font-medium leading-relaxed">{message.mssg}</p>

                        {/* Timestamp */}
                        <p className={`text-[9px] mt-1 font-medium text-right ${isOwn ? 'text-white/50' : 'text-gray-400'}`}>
                          {formatTime(message.time || message.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Reply Bar */}
          {replyTo && (
            <div className="mb-2 flex items-center justify-between bg-green-900/40 px-4 py-2 rounded-lg border border-green-500/30">
              <div className="flex items-center gap-2">
                <span className="text-green-400 text-sm">↩</span>
                <div>
                  <p className="text-green-300 text-[10px] font-bold uppercase tracking-wider">Replying to {replyTo.Name}</p>
                  <p className="text-white/80 text-xs truncate max-w-[300px]">{replyTo.mssg}</p>
                </div>
              </div>
              <button
                className="text-red-400 hover:text-red-300 font-bold ml-4 w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center text-xs"
                onClick={handleCancelReply}
              >
                ✕
              </button>
            </div>
          )}

          {/* Input Area */}
          <div className="flex items-center gap-2">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg shrink-0"
              style={{ backgroundColor: getAvatarColor(loggedInUser.name) }}
            >
              {loggedInUser.name?.charAt(0).toUpperCase() || '?'}
            </div>
            <div className="flex flex-1 bg-gray-800 rounded-xl border border-green-500/30 overflow-hidden focus-within:border-green-400 transition-colors">
              <input
                type="text"
                className="flex-grow p-3 text-white font-medium outline-none bg-transparent placeholder:text-gray-500 text-sm"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={replyTo ? `Reply to ${replyTo.Name}...` : "Type a message..."}
              />
              <button
                className="bg-green-500 hover:bg-green-600 text-white font-bold px-5 transition-colors disabled:opacity-40"
                onClick={handleSendMessage}
                disabled={!messageInput.trim()}
              >
                {replyTo ? "Reply" : "Send ➤"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
