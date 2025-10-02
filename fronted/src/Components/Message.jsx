import { useEffect } from "react"
import { useState, useRef } from "react"
import { Phone, Video, Info, Camera, ImageIcon, Mic, Send, Search, Edit, VideoIcon } from "lucide-react"
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

const ChatInterface = () => {
  const [users, setUsers] = useState([]);
  const [sender_id, setSenderId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [receiver_id, setReceiverId] = useState([null]);
  const echoRef = useRef(null);
  const [formData, setFormData] = useState({ message: "" });
  const [error, setError] = useState({});
  const chatEndRef = useRef(null);
  const [mockChats, setMockChats] = useState([
        {
          id: 1,
          name: "Free Solo",
          avatar: "/man.jpg",
          lastMessage: "Max, I took a few water...",
          time: "11:02",
          unread: 1,
          online: true,
        },
  ]);
  const [messages, setMessages] = useState([
      {
        id: 2,
        type: "received",
        image: "/birthday-party-dancing.jpg",
        avatar: "/party-person.jpg",
      },
  ]);

  const token = localStorage.getItem('token');

   // Scroll to bottom
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "auto" });
  };

  // Run scroll after messages are loaded or updated
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  //Findout receiver_id
  const findoutReceiverId = (chat) => {
    setReceiverId(chat.id);
    setSelectedChat(chat);
    fetchMessage(chat.id);

  }

  // Get logged-in user
  useEffect(() => {
    const userString = localStorage.getItem("user");
    
    if (userString) {
      try {
        const user = JSON.parse(userString);
        setSenderId(user.id);
        setCurrentUser(user);
      } catch (error) {
        console.error("Error parsing user data:", error);
        setError({ user: "Invalid user data" });
      }
    }
  }, []);

  // ChatInterface.jsx - Echo Initialization
  useEffect(() => {
      if (!token || !sender_id) return;

      window.Pusher = Pusher;
      
      // 🚨 Use the VITE_REVERB_* variables 🚨
      echoRef.current = new Echo({
          broadcaster: 'pusher',
          key: import.meta.env.VITE_REVERB_APP_KEY,
          
          // 1. Point to your Reverb Host/Port (typically 8080 or 443)
          wsHost: import.meta.env.VITE_REVERB_HOST,
          wssHost: import.meta.env.VITE_REVERB_HOST,
          wsPort: parseInt(import.meta.env.VITE_REVERB_PORT) || 8080,
          wssPort: parseInt(import.meta.env.VITE_REVERB_PORT) || 8080,
          
          forceTLS: import.meta.env.VITE_REVERB_SCHEME === 'https',
          enabledTransports: ['ws', 'wss'],
          disableStats: true, 
          // Reverb doesn't use Pusher's 'cluster', but the client requires it for initialization
          cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER || 'mt1', 

          // 2. 🚨 The Authorization Endpoint MUST include the /api prefix 🚨
          authEndpoint: 'http://127.0.0.1:8000/api/broadcasting/auth', // <-- Check this URL!
          
          // 3. Authorization Headers (using Bearer Token)
          auth: {
              headers: {
                  Authorization: `Bearer ${token}`,
                  Accept: 'application/json',
                  'X-Requested-With': 'XMLHttpRequest',
              },
              // If the 403 persists, try adding this to rule out cookie issues, 
              // though not strictly needed for Bearer tokens:
              // withCredentials: true,
          },
      });

      console.log(receiver_id);
      console.log('Echo initialized with Reverb');

      // Listen to sender's private channel
      const channel = echoRef.current.private(`chat-channel.${sender_id}`);
      
      channel.listen('.MessageSendEvent', (event) => {
        console.log('Real-time message received:', event);
        
        // Only add message if it's for current conversation
        if (event.message.receiver_id === parseInt(receiver_id) || 
            event.message.sender_id === parseInt(receiver_id)) {
          
          const newMessage = {
            id: event.message.id,
            type: event.message.sender_id === parseInt(sender_id) ? 'sent' : 'received',
            text: event.message.message,
            created_at: event.message.created_at,
          };

          setMessages(prev => {
            // Prevent duplicate messages
            const exists = prev.some(msg => msg.id === newMessage.id);
            if (exists) return prev;
            return [...prev, newMessage];
          });
        }
      });

      // Connection status logging
      channel.subscribed(() => {
        console.log('Successfully subscribed to chat-channel.' + sender_id);
      });

      channel.error((error) => {
        console.error('Channel subscription error:', error);
      });

      return () => {
        if (echoRef.current) {
          echoRef.current.leave(`chat-channel.${sender_id}`);
          echoRef.current.disconnect();
        }
      };
    }, [token, sender_id, receiver_id]);

//Fetch initial message
  const fetchMessage = async (id) => {
      try {

        if (!id) return;
        
        const params = new URLSearchParams({
          user_id: id
        });

        const response = await fetch(`http://127.0.0.1:8000/api/messages?${params.toString()}`, {
          method: "GET",
          headers: {
            'Accept': "application/json",
            'Authorization':'Bearer ' + localStorage.getItem('token'),
          }
        });

      const result = await response.json();
      console.log(result, token);
      if (result.success && Array.isArray(result.data)) {
        const transformedMessages = result.data.map(msg => ({
          id: msg.id,
          type: Number(msg.sender_id) === Number(sender_id) ? 'sent' : 'received',
          text: msg.message,
          created_at: msg.created_at,
        }));
        setMessages(transformedMessages.reverse());

        console.log('Fetched messages:', transformedMessages);
      }
    }
      catch(err){
        console.log("Data fetch error: ",err);
      }

    };

  // Fetch users and update mockChats
  const fetchUsers = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/users");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const usersData = await response.json();
      setUsers(usersData);

      // Build mockChats from usersData
      const chats = usersData.users.map((user, index) => ({
        id: user.id || index + 1,
        name: user.name,
        avatar: "/man.jpg",
        lastMessage: "No messages yet", // default or from API if available
        time: "Now",
        unread: 0,
        online:true,
      }));

      setMockChats(chats);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

   const [selectedChat, setSelectedChat] = useState(mockChats[0])
  
   //send real-time message
    const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error[name]) {
      setError((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    setError({});

    if (!formData.message.trim()) return;

    try {
      const response = await fetch("http://localhost:8000/api/messages", {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify({
          message: formData.message,
          receiver_id: receiver_id,
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Clear input - message will be added via Echo listener
        setFormData({ message: "" });
        console.log('Message sent successfully');
      } else {
        console.log("Send message error:", data);
        setError({ send: data.message || "Failed to send message" });
      }

    } catch (error) {
      console.log("Send message error:", error);
      setError({ send: "Network error occurred" });
    }
  };



  return (
    <div className="flex h-screen bg-white">
      {/* Left Sidebar - Chat List */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl text-red-600">Chats</h1>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <VideoIcon className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Edit className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search Messenger"
              className="w-full py-2 px-5 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {mockChats.map((chat, index) => (
            <div
              key={chat.id + index}
              onClick={() => findoutReceiverId(chat)}
              className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 ${
                selectedChat.id === chat.id ? "bg-gray-100" : ""
              }`}
            >
              <div className="relative">
                <img
                  src={chat.avatar || "/placeholder.svg"}
                  alt={chat.name || "Chat"}
                  className="w-14 h-14 rounded-full object-cover"
                />
                {chat.online && (
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-red-400 truncate">{chat.name}</h3>
                  <span className="text-xs text-gray-500">{chat.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                  {chat.unread > 0 && (
                    <span className="ml-2 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center flex-shrink-0">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side - Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={selectedChat.avatar || "/placeholder.svg"}
                alt={selectedChat.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              {selectedChat.online && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
              )}
            </div>
            <div>
              <h2 className="font-semibold">{selectedChat.name}</h2>
              <p className="text-xs text-gray-500">Active 2m ago</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-gray-100 rounded-full text-blue-500">
              <Phone className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full text-blue-500">
              <Video className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
              <Info className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages Area with Decorative Background */}
        <div
            className="flex-1 overflow-y-auto p-6 relative"
            style={{
              background: "linear-gradient(135deg, #7dd3c0 0%, #a8e6cf 100%)",
            }}
          >
          {/* Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Lollipop decorations */}
            <div className="absolute top-10 right-20 w-24 h-24 opacity-40">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-300 to-teal-400 absolute top-0 right-0" />
                <div className="w-1 h-20 bg-white absolute top-12 right-7 rotate-45" />
              </div>
            </div>

            <div className="absolute top-32 right-32 w-20 h-20 opacity-40">
              <div className="relative">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-300 to-pink-400 absolute" />
                <div className="w-1 h-16 bg-white absolute top-10 left-6 rotate-12" />
              </div>
            </div>

            <div className="absolute top-60 right-10 w-28 h-28 opacity-40">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-400 to-teal-500 absolute" />
                <div className="w-1 h-24 bg-white absolute top-16 left-9 rotate-[-20deg]" />
              </div>
            </div>

            <div className="absolute bottom-32 right-24 w-24 h-24 opacity-40">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-pink-500 absolute" />
                <div className="w-1 h-20 bg-white absolute top-12 left-7 rotate-[30deg]" />
              </div>
            </div>

            {/* Lips decoration */}
            <div className="absolute bottom-16 right-16 w-32 h-32 opacity-60">
              <div className="relative">
                <div className="w-24 h-16 bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 rounded-full" />
                <div className="absolute top-6 left-4 w-16 h-8 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full" />
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="space-y-4 relative z-10 pt-2 pb-3">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === "sent" ? "justify-end" : "justify-start"}`}>
                <div className="flex items-end gap-2 max-w-md mt-3">
                  {message.type === "received" && (
                    <img
                      src={message.avatar || "/placeholder.svg"}
                      alt="User"
                      className="w-7 h-7 rounded-full object-cover flex-shrink-0 border-gray-800"
                    />
                  )}

                  <div>
                    {message.image ? (
                      <div className="bg-white rounded-2xl p-3 shadow-sm">
                        <img src={message.image || "/placeholder.svg"} alt="Shared" className="rounded-xl max-w-xs" />
                      </div>
                    ) : (
                      <div
                        className={`px-4 py-2 rounded-2xl shadow-sm ${
                          message.type === "sent" ? "bg-blue-500 text-white" : "bg-white text-gray-800"
                        }`}
                      >
                        {message.text}
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="bg-white border-t border-gray-200 p-4">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <button type="button" className="p-2 hover:bg-gray-100 rounded-full text-blue-500">
              <ImageIcon className="w-5 h-5" />
            </button>
            <button type="button" className="p-2 hover:bg-gray-100 rounded-full text-blue-500">
              <Camera className="w-5 h-5" />
            </button>
            <button type="button" className="p-2 hover:bg-gray-100 rounded-full text-blue-500">
              <Mic className="w-5 h-5" />
            </button>

            <input
              type="text"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              disabled={!formData.message.trim()}
              className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
             <div ref={chatEndRef} />
          </form>
        </div>
      </div>
    </div>
  )
}

export default ChatInterface
