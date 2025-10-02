import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import apiService from '../utils/apiService';
import LoadingSpinner from '../components/LoadingSpinner';
import { FaPaperPlane, FaArrowLeft, FaSearch } from 'react-icons/fa';

export default function Messages() {
  const { currentUser } = useSelector((state) => state.user);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);

  // Fetch all conversations
  useEffect(() => {
    fetchConversations();
  }, []);

  // Fetch messages when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation._id);
      // Mark conversation as read
      apiService.messages.markConversationAsRead(selectedConversation._id);
    }
  }, [selectedConversation]);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await apiService.messages.getConversations();
      if (response.success) {
        setConversations(response.data);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (userId) => {
    try {
      const response = await apiService.messages.getConversation(userId);
      if (response.success) {
        setMessages(response.data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      setSending(true);
      const response = await apiService.messages.sendMessage({
        receiverId: selectedConversation._id,
        content: newMessage.trim(),
      });

      if (response.success) {
        setMessages([...messages, response.data]);
        setNewMessage('');
        // Update conversation list
        fetchConversations();
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.conversationWith.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.conversationWith.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className='max-w-7xl mx-auto p-4 min-h-screen'>
      <h1 className='text-3xl font-bold mb-6'>Messages</h1>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 bg-white rounded-lg shadow-lg overflow-hidden' style={{ height: 'calc(100vh - 200px)' }}>
        {/* Conversations List */}
        <div className='lg:col-span-1 border-r border-gray-200 flex flex-col'>
          {/* Search */}
          <div className='p-4 border-b border-gray-200'>
            <div className='relative'>
              <FaSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
              <input
                type='text'
                placeholder='Search conversations...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>
          </div>

          {/* Conversation List */}
          <div className='flex-1 overflow-y-auto'>
            {filteredConversations.length === 0 ? (
              <div className='p-8 text-center text-gray-500'>
                <p>No conversations yet</p>
              </div>
            ) : (
              filteredConversations.map((conv) => (
                <div
                  key={conv._id}
                  onClick={() => setSelectedConversation(conv.conversationWith)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition ${
                    selectedConversation?._id === conv.conversationWith._id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className='flex items-start gap-3'>
                    <img
                      src={conv.conversationWith.profilePicture || '/default-avatar.png'}
                      alt={conv.conversationWith.fullName}
                      className='w-12 h-12 rounded-full object-cover'
                    />
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center justify-between'>
                        <p className='font-semibold text-sm truncate'>
                          {conv.conversationWith.fullName || conv.conversationWith.email}
                        </p>
                        {conv.unreadCount > 0 && (
                          <span className='bg-blue-500 text-white text-xs px-2 py-1 rounded-full'>
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className='text-sm text-gray-600 truncate'>
                        {conv.lastMessage.content}
                      </p>
                      <p className='text-xs text-gray-400 mt-1'>
                        {new Date(conv.lastMessage.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Messages Area */}
        <div className='lg:col-span-2 flex flex-col'>
          {!selectedConversation ? (
            <div className='flex-1 flex items-center justify-center text-gray-500'>
              <p>Select a conversation to start messaging</p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className='p-4 border-b border-gray-200 flex items-center gap-3'>
                <button
                  onClick={() => setSelectedConversation(null)}
                  className='lg:hidden p-2 hover:bg-gray-100 rounded-full'
                >
                  <FaArrowLeft />
                </button>
                <img
                  src={selectedConversation.profilePicture || '/default-avatar.png'}
                  alt={selectedConversation.fullName}
                  className='w-10 h-10 rounded-full object-cover'
                />
                <div>
                  <h2 className='font-semibold'>
                    {selectedConversation.fullName || selectedConversation.email}
                  </h2>
                  <p className='text-xs text-gray-500'>{selectedConversation.email}</p>
                </div>
              </div>

              {/* Messages */}
              <div className='flex-1 overflow-y-auto p-4 space-y-4'>
                {messages.length === 0 ? (
                  <div className='text-center text-gray-500 py-8'>
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((message) => {
                    const isSender = message.sender._id === currentUser._id;
                    return (
                      <div
                        key={message._id}
                        className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            isSender
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-200 text-gray-800'
                          }`}
                        >
                          <p className='break-words'>{message.content}</p>
                          <div className='flex items-center gap-2 mt-1'>
                            <p
                              className={`text-xs ${
                                isSender ? 'text-blue-100' : 'text-gray-500'
                              }`}
                            >
                              {new Date(message.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                            {message.metadata?.isEdited && (
                              <span
                                className={`text-xs italic ${
                                  isSender ? 'text-blue-100' : 'text-gray-500'
                                }`}
                              >
                                (edited)
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className='p-4 border-t border-gray-200'>
                <div className='flex gap-2'>
                  <input
                    type='text'
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder='Type a message...'
                    className='flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                    disabled={sending}
                  />
                  <button
                    type='submit'
                    disabled={!newMessage.trim() || sending}
                    className='bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2'
                  >
                    {sending ? (
                      'Sending...'
                    ) : (
                      <>
                        <FaPaperPlane />
                        Send
                      </>
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
