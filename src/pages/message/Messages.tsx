import { useState, useRef, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  Send, 
  Search, 
  MoreVertical, 
  Phone, 
  Video,
  ArrowLeft,
  Check,
  CheckCheck,
  Home,
  MessageSquare
} from 'lucide-react';
import useAppStore from '@/store/useAppStore';
import { mockUsers } from '@/services/mock/data';
import type { Message } from '@/types';

export default function Messages() {
  const { id } = useParams<{ id: string }>();
  const { currentUser, messages, getConversation, addMessage } = useAppStore();
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversations = mockUsers
    .filter(u => u.id !== currentUser?.id && u.id !== 'user-6')
    .slice(0, 5)
    .map(user => {
      const convMessages = getConversation(currentUser?.id || '', user.id);
      const lastMessage = convMessages[convMessages.length - 1];
      const unreadCount = convMessages.filter(m => m.receiverId === currentUser?.id && !m.isRead).length;
      return {
        user,
        lastMessage,
        unreadCount,
        updatedAt: lastMessage?.createdAt || new Date().toISOString(),
      };
    })
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const selectedUser = id ? mockUsers.find(u => u.id === id) : null;
  const conversationMessages = selectedUser 
    ? getConversation(currentUser?.id || '', selectedUser.id) 
    : [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversationMessages.length]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser || !currentUser) return;

    const message: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      receiverId: selectedUser.id,
      content: newMessage,
      isRead: false,
      createdAt: new Date().toISOString(),
      type: 'text',
    };

    addMessage(message);
    setNewMessage('');
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const diffDays = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return '今天';
    if (diffDays === 1) return '昨天';
    if (diffDays < 7) return `${diffDays}天前`;
    return date.toLocaleDateString('zh-CN');
  };

  return (
    <div className="h-[calc(100vh-4rem)] bg-warm-50 flex">
      {/* Conversation List */}
      <div className={`${selectedUser ? 'hidden md:block' : 'block'} w-full md:w-80 lg:w-96 bg-white border-r border-gray-100 flex flex-col`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-100">
          <h1 className="text-xl font-bold text-gray-900 mb-4">消息</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索对话"
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => (
            <Link
              key={conv.user.id}
              to={`/messages/${conv.user.id}`}
              className={`flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors border-b border-gray-50 ${
                id === conv.user.id ? 'bg-primary-50' : ''
              }`}
            >
              <div className="relative">
                <img 
                  src={conv.user.avatar} 
                  alt={conv.user.nickname}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-900 truncate">{conv.user.nickname}</span>
                  <span className="text-xs text-gray-400 flex-shrink-0">
                    {conv.lastMessage ? formatDate(conv.lastMessage.createdAt) : ''}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500 truncate">
                    {conv.lastMessage?.content || '开始对话吧'}
                  </p>
                  {conv.unreadCount > 0 && (
                    <span className="flex-shrink-0 w-5 h-5 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`${selectedUser ? 'block' : 'hidden md:block'} flex-1 flex flex-col`}>
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white">
              <div className="flex items-center gap-3">
                <Link 
                  to="/messages"
                  className="md:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <img 
                  src={selectedUser.avatar} 
                  alt={selectedUser.nickname}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedUser.nickname}</h3>
                  <span className="text-xs text-green-500">在线</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                  <Phone className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                  <Video className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Date Separator */}
              <div className="flex items-center justify-center">
                <span className="px-3 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                  今天
                </span>
              </div>

              {conversationMessages.length > 0 ? (
                conversationMessages.map((msg) => {
                  const isSent = msg.senderId === currentUser?.id;
                  return (
                    <div 
                      key={msg.id} 
                      className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-end gap-2 max-w-[75%] ${
                        isSent ? 'flex-row-reverse' : 'flex-row'
                      }`}>
                        {!isSent && (
                          <img 
                            src={selectedUser.avatar} 
                            alt=""
                            className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                          />
                        )}
                        <div>
                          <div 
                            className={`px-4 py-2.5 rounded-2xl ${
                              isSent 
                                ? 'bg-gradient-to-r from-primary-500 to-primary-400 text-white rounded-br-md' 
                                : 'bg-white text-gray-800 rounded-bl-md shadow-sm'
                            }`}
                          >
                            <p className="text-sm leading-relaxed">{msg.content}</p>
                          </div>
                          <div className={`flex items-center gap-1 mt-1 ${
                            isSent ? 'justify-end' : 'justify-start'
                          }`}>
                            <span className="text-xs text-gray-400">
                              {formatTime(msg.createdAt)}
                            </span>
                            {isSent && (
                              msg.isRead 
                                ? <CheckCheck className="w-3.5 h-3.5 text-blue-400" />
                                : <Check className="w-3.5 h-3.5 text-gray-300" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 mb-2">还没有对话</p>
                  <p className="text-sm text-gray-400">打个招呼，开始你们的换宿之旅吧</p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 border-t border-gray-100 bg-white">
              <div className="flex items-end gap-3">
                <div className="flex-1 relative">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="输入消息..."
                    rows={1}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400"
                    style={{ minHeight: '48px', maxHeight: '120px' }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend(e);
                      }
                    }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="p-3 bg-gradient-to-r from-primary-500 to-primary-400 text-white rounded-full hover:from-primary-600 hover:to-primary-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">换宿家消息</h3>
              <p className="text-gray-500 mb-6">选择一个对话开始聊天</p>
              <Link 
                to="/search"
                className="btn-primary inline-block"
              >
                去找房源
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
