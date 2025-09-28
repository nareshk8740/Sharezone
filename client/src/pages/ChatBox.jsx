import React, { useRef, useState, useEffect } from 'react';
import { Image, Send } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react'
import api from '../api/axios';
import { addMessage, fetchMessages, resetMessages } from '../features/messages/messagesSlice';
import toast from 'react-hot-toast';

const ChatBox = () => {
  const {messages} = useSelector((state)=> state.messages);
  const {userId} = useParams()
  const {getToken} = useAuth()
  const dispatch = useDispatch();

  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [user, setUser] = useState(null);
  const messagesEndRef = useRef(null);

  const connections = useSelector((state)=> state.connections.connections)

   const fetchUserMessages = async () => {
    try {
      const token = await getToken()
      dispatch(fetchMessages({token, userId}))
    } catch (error) {
      toast.error(error.message)
    }
  }

   const sendMessage = async () => {
    try {
      if(!text && !image) return

      const token = await getToken()
      const formData = new FormData();
      formData.append('to_user_id', userId)
      formData.append('text', text);
      image && formData.append('image', image);

      const { data } = await api.post('/api/message/send', formData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (data.success) {
        setText('')
        setImage(null)
        dispatch(addMessage(data.message))
      }else{
        throw new Error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(()=>{
    fetchUserMessages() 
    return ()=>{
      dispatch(resetMessages())
    }
  },[userId])

  useEffect(()=>{
    if(connections.length > 0){
      const user = connections.find(connection => connection._id === userId)
      setUser(user)
    }
  },[connections, userId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    user && (
      <div className='flex flex-col h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'>
        
        {/* Top Bar */}
        <div className='flex items-center gap-2 p-2 md:px-10 xl:pl-42 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 border-b border-indigo-300 shadow-lg'>
          <img src={user.profile_picture} className='size-8 rounded-full ring-2 ring-white/50' alt='' />
          <div>
            <p className='font-medium text-white'>{user.full_name}</p>
            <p className='text-sm text-blue-100 -mt-1.5'>@{user.username}</p>
          </div>
        </div>

        {/* Messages */}
        <div className='p-5 md:px-10 h-full overflow-y-scroll bg-gradient-to-b from-blue-50/30 to-indigo-50/50'>
          <div className='space-y-4 max-w-4xl mx-auto'>
            {messages
              .toSorted((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
              .map((message, index) => (
                <div
                  key={index}
                  className={`flex flex-col ${message.to_user_id !== user._id ? 'items-start' : 'items-end'}`}
                >
                  <div
                    className={`p-3 text-sm max-w-sm rounded-2xl shadow-md border ${
                      message.to_user_id !== user._id
                        ? 'bg-white/90 text-slate-700 border-blue-100 rounded-bl-sm'
                        : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-blue-400 rounded-br-sm'
                    }`}
                  >
                    {message.message_type === 'image' && (
                      <img src={message.media_url} alt='' className='w-full max-w-sm rounded-lg mb-2' />
                    )}
                    <p>{message.text}</p>
                  </div>
                </div>
              ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Box */}
        <div className='px-4 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm border-t border-blue-200'>
          <div
            className='flex items-center justify-between gap-3 pl-5 pr-4 h-15 p-1.5 bg-white/90 
                       w-full max-w-2xl lg:max-w-4xl mx-auto border border-blue-200 shadow-lg 
                       rounded-full mb-5 backdrop-blur-sm'
          >
            <input
              type='text'
              className='flex-1 outline-none text-slate-700 text-sm placeholder:text-gray-600'
              placeholder='Type a message...'
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              onChange={(e) => setText(e.target.value)}
              value={text}
            />

            <label htmlFor='image' className='cursor-pointer'>
              {image ? (
                <img
                  src={URL.createObjectURL(image)}
                  className='h-8 w-8 rounded object-cover ring-2 ring-blue-300'
                  alt=''
                />
              ) : (
                <Image className='size-6 text-blue-500 hover:text-indigo-600 transition-colors' />
              )}
              <input
                type='file'
                id='image'
                accept='image/*'
                hidden
                onChange={(e) => setImage(e.target.files[0])}
              />
            </label>

            <button
              onClick={sendMessage}
              className='bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 
                         hover:from-blue-600 hover:via-indigo-600 hover:to-purple-700 
                         active:scale-95 cursor-pointer text-white p-2 rounded-full 
                         shadow-lg transition-all duration-200'
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default ChatBox;
