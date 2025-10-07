import { useEffect } from "react"
import { useState, useRef } from "react"
import { Phone, Video, Info, Camera, ImageIcon, Mic, Send, Search, Edit, VideoIcon } from "lucide-react"
import Echo from "laravel-echo"
import Pusher from "pusher-js"

const ChatInterface = () => {
  const [users, setUsers] = useState([]);
  const [sender_id, setSenderId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [receiver_id, setReceiverId] = useState([null]);
  const echoRef = useRef(null);
  const [formData, setFormData] = useState({ message: "" });
  const [error, setError] = useState({})
  const chatEndRef = useRef(null)
  const fileInputRef = useRef(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [senderImage, setSenderImage] = useState(null);
  const [receiverImage, setReceiverImage] = useState([null]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
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
  ])
  const [messages, setMessages] = useState([
    {
      id: 2,
      type: "received",
      image: "/birthday-party-dancing.jpg",
      avatar: "/party-person.jpg",
    },
  ])

  const token = localStorage.getItem("token")

  // Scroll to bottom
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "auto" })
  }

  // Run scroll after messages are loaded or updated
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  //Findout receiver_id
  const findoutReceiverId = (chat) => {
    setReceiverId(chat.id);
    setSelectedChat(chat);
    fetchMessage(chat.id);
    setReceiverImage(chat.avatar);

  }

  // Get logged-in user
  useEffect(() => {
    const userString = localStorage.getItem("user")

    if (userString) {
      try {
        const user = JSON.parse(userString)
        setSenderId(user.id)
        setCurrentUser(user)
        setSenderImage(user.image);
        // console.log(senderImage);
      } catch (error) {
        console.error("Error parsing user data:", error)
        setError({ user: "Invalid user data" })
      }
    }
  }, [])

   // Fetch users and update mockChats
  const fetchUsers = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/users", {
        method: "GET",
        headers:{
          Accept: "Application/json",
          Authorization: `Bearer ${token}`,
        }
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const usersData = await response.json()
      setUsers(usersData)
      console.log(usersData);
      // Build mockChats from usersData
      const chats = usersData.users.map((user, index) => ({
        id: user.id || index + 1,
        name: user.name,
        avatar: user.image ? `http://127.0.0.1:8000/storage/${user.image}`: "/man.jpg",
        lastMessage: user.lastMessage ? user.lastMessage : "No message yet", // default or from API if available
        time: user.lastMessageAt ? user.lastMessageAt : "Now",
        unread: user.unread,
        online: true,
      }))

      setMockChats(chats)
    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // ChatInterface.jsx - Echo Initialization
  useEffect(() => {
    if (!token || !sender_id) return

    window.Pusher = Pusher

    // 🚨 Use the VITE_REVERB_* variables 🚨
    echoRef.current = new Echo({
      broadcaster: "pusher",
      key: import.meta.env.VITE_REVERB_APP_KEY,

      // 1. Point to your Reverb Host/Port (typically 8080 or 443)
      wsHost: import.meta.env.VITE_REVERB_HOST,
      wssHost: import.meta.env.VITE_REVERB_HOST,
      wsPort: Number.parseInt(import.meta.env.VITE_REVERB_PORT) || 8080,
      wssPort: Number.parseInt(import.meta.env.VITE_REVERB_PORT) || 8080,

      forceTLS: import.meta.env.VITE_REVERB_SCHEME === "https",
      enabledTransports: ["ws", "wss"],
      disableStats: true,
      // Reverb doesn't use Pusher's 'cluster', but the client requires it for initialization
      cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER || "mt1",

      // 2. 🚨 The Authorization Endpoint MUST include the /api prefix 🚨
      authEndpoint: "http://127.0.0.1:8000/api/broadcasting/auth", // <-- Check this URL!

      // 3. Authorization Headers (using Bearer Token)
      auth: {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        // If the 403 persists, try adding this to rule out cookie issues,
        // though not strictly needed for Bearer tokens:
        // withCredentials: true,
      },
    })

    // console.log(receiver_id)
    console.log("Echo initialized with Reverb")

    
    // ✅ PRESENCE CHANNEL: Track online users
    const presenceChannel = echoRef.current.join("presence.chat")
      .here((users) => {
        setMockChats((prevChats) =>
          prevChats.map((chat) => ({
            ...chat,
            online: users.some((u) => u.id === chat.id),
          }))
        )
      })
      .joining((user) => {
        setMockChats((prevChats) =>
          prevChats.map((chat) =>
            chat.id === user.id ? { ...chat, online: true } : chat
          )
        )
      })
      .leaving((user) => {
        setMockChats((prevChats) =>
          prevChats.map((chat) =>
            chat.id === user.id ? { ...chat, online: false } : chat
          )
        )
      })
    // Listen to sender's private channel
    const channel = echoRef.current.private(`chat-channel.${sender_id}`);


  channel.listen(".MessageSendEvent", (event) => {
  const msg = event.message;

  if (
      msg.receiver_id === Number.parseInt(receiver_id) ||
      msg.sender_id === Number.parseInt(receiver_id)){ 

      const newMessage = {
        id: msg.id,
        text: msg.message,
        image: msg.image ? `http://127.0.0.1:8000/storage/${msg.image}` : " ",
        type: msg.sender_id === Number.parseInt(sender_id) ? "sent" : "received",
        sender_id: msg.sender_id,
        receiver_id: msg.receiver_id,
        sender_image: msg.sender_image ? `http://127.0.0.1:8000/storage/${msg.sender_image}` : "/man.jpg",
        receiver_image: msg.receiver_image ? `http://127.0.0.1:8000/storage/${msg.receiver_image}` : "/man.jpg",
        client_id: msg.client_id,
        created_at: msg.created_at,
        
         //set avatar
        avatar:
          msg.type === "sent"
            ? msg.sender_image
              ? `http://127.0.0.1:8000/storage/${msg.sender_image}`
              : "/man.jpg"
              : msg.receiver_image
              ? `http://127.0.0.1:8000/storage/${msg.receiver_image}`
              : "/man.jpg",

      };
      console.log("check message: ", newMessage);
      
      // Add to messages
       setMessages((prev) => {
          // ✅ Step 1: Replace optimistic (temporary) message
          if (msg.client_id && prev.some((m) => m.client_id === msg.client_id)) {
            return prev.map((m) =>
              m.client_id === msg.client_id
                ? { ...m, ...newMessage, uploading: false }
                : m
            );
          }

          // ✅ Step 2: Prevent duplicates (real-time receiver case)
          if (prev.some((m) => m.id === newMessage.id)) {
            return prev;
          }

          // ✅ Step 3: Add new incoming message
          return [...prev, newMessage];
        });

      setUsers(prev => ({
        ...prev, 
        [msg.sender_id]: msg.sender_id,
         [msg.receiver_id]: msg.receiver_id,
      }));

      // Update chat list
      setMockChats(prev =>
        [...prev.map(chat => {
          if (chat.id === newMessage.sender_id || chat.id === newMessage.receiver_id) {
            return {
              ...chat,
              lastMessage: newMessage.text,
              time: newMessage.created_at,
              unread: newMessage.receiver_id === sender_id ? chat.unread + 1 : chat.unread,
            };
          }
          return chat;
        })].sort((a,b) => new Date(b.time) - new Date(a.time))
      );
    }
    
  });

    // Connection status logging
    channel.subscribed(() => {
      console.log("Successfully subscribed to chat-channel." + sender_id)
    })

    channel.error((error) => {
      console.error("Channel subscription error:", error)
    })

    return () => {
      if (echoRef.current) {
        channel.stopListening(".MessageSendEvent");
        echoRef.current.leave("presence.chat")
        echoRef.current.leave(`chat-channel.${sender_id}`)
        echoRef.current.disconnect()
        echoRef.current = null
      }
    }
  }, [token, sender_id, receiver_id])

  //Fetch initial message
  const fetchMessage = async (id) => {
    try {
      if (!id) return

      const params = new URLSearchParams({
        user_id: id,
      })

      const response = await fetch(`http://127.0.0.1:8000/api/messages?${params.toString()}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })

      const result = await response.json()
      if (result.success && Array.isArray(result.data)) {
        const transformedMessages = result.data.map((msg) => ({
          id: msg.id,
          type: Number(msg.sender_id) === Number(sender_id) ? "sent" : "received",
          text: msg.message,
          image: msg.image ? `http://127.0.0.1:8000/storage/${msg.image}` : " ",
          avatar: msg?.receiver_image ? `http://127.0.0.1:8000/storage/${msg.receiver_image}`: "/man.jpg",
          created_at: msg.created_at,
        }))
        setMessages(transformedMessages.reverse())
        // console.log("transformed: ", transformedMessages);

        // console.log("Fetched messages:", transformedMessages)
      }
    } catch (err) {
      console.log("Data fetch error: ", err)
    }
  }

  const [selectedChat, setSelectedChat] = useState(mockChats[0])

  // programmatically open file picker
  const triggerFileSelect = () => {
    fileInputRef.current?.click(); 
  };

// File input handler
const handleFileChange = (e) => {
  const selectedFile = e.target.files[0];
  if (!selectedFile) return;

  if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
    setError({ send: "File size must be less than 5MB" });
    return;
  }

  setFile(selectedFile);
  setPreview(URL.createObjectURL(selectedFile));
};

const handleSendMessage = async (e) => {
  e.preventDefault();
  setError({});

  // Prevent sending if no text and no file
  if (!formData.message.trim() && !file) return;

  const clientId = `tmp-${Date.now()}-${Math.random()}`; // for optimistic UI

  // Optional: add optimistic message to UI (if you maintain local state)
  const tempMsg = {
    id: clientId,
    text: formData.message,
    image: file ? URL.createObjectURL(file) : null,
    type: "sent",
    sender_id: sender_id, // make sure you have sender_id
    receiver_id: receiver_id,
    client_id: clientId,
    uploading: !!file,
  };
  setMessages(prev => [...prev, tempMsg]);

  try {
    const form = new FormData();
    form.append("receiver_id", receiver_id);
    form.append("message", formData.message);
    form.append("client_id", clientId); // match optimistic message
    if (file) form.append("file", file); // 'file' matches your backend field

    const response = await fetch("http://localhost:8000/api/messages", {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
        // Content-Type: "multipart/form-data"

      },
      body: form,
    });

    const data = await response.json();

    if (response.ok) {
      // Clear input & file - real message will be replaced via Echo listener
      setFormData({ message: "" });
      setFile(null);
      setPreview(null);
      console.log("Message sent successfully");
    } else {
      console.log("Send message error:", data);
      setError({ send: data.message || "Failed to send message" });
    }
  } catch (error) {
    console.log("Send message error:", error);
    setError({ send: "Network error occurred" });
  }
};

  //send real-time message
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (error[name]) {
      setError((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }


  return (
    <div className="flex bg-white h-screen">
      {/* Left Sidebar - Chat List */}
      <div className="hidden md:flex md:w-80 lg:w-96 border-r border-gray-200 flex-col">
        {/* Sidebar Header */}
        <div className="p-3 md:p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <h3 className="text-sm md:text-xl font-semibold">Chats</h3>
            <div className="flex gap-2 md:gap-2">
              <button className="p-1.5 md:p-2 hover:bg-gray-100 rounded-full transition-colors">
                <VideoIcon className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
              </button>
              <button className="p-1.5 md:p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Edit className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400" />
           <input
            type="text"
             placeholder="Search Messenger"
             className="w-full py-2 px-5 md:py-2 pl-9 md:pl-10 pr-3 bg-gray-100 rounded-full text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
           />
        </div>

        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {mockChats.map((chat, index) => (
            <div
              key={chat.id}
              onClick={() => findoutReceiverId(chat)}
              className={`flex items-center gap-2 md:gap-3 p-2 md:p-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedChat.id === chat.id ? "bg-gray-100" : ""
              }`}
            >
              <div className="relative flex-shrink-0">
                <img
                  src={chat.avatar || "/placeholder.svg"}
                  alt={chat.name || "Chat"}
                  className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover"
                />
              
                  <div className={`absolute bottom-0 right-0 w-3 h-3 md:w-3.5 md:h-3.5 border-2 border-white rounded-full ${chat.online ? "bg-green-600" : "bg-red-600"}`}/>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-gray-800 text-lg">{chat.name}</p>
                  <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{chat.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs md:text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                  {chat.unread > 0 && (
                    <span className="ml-2 w-4 h-4 md:w-5 md:h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center flex-shrink-0">
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
        <div className="bg-white border-b border-gray-300 p-3 md:p-4 flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="relative flex-shrink-0">
              <img
                src={selectedChat.avatar || "/placeholder.svg"}
                alt={selectedChat.name}
                className="w-9 h-9 md:w-10 md:h-10 rounded-full object-cover"
              />
              {selectedChat.online && (
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 md:w-3 md:h-3 bg-green-500 border-2 border-white rounded-full" />
              )}
            </div>
            <div className="min-w-0">
              <h5 className="font-semibold text-sm md:text-base truncate">{selectedChat.name}</h5>
              <p className="text-xs text-gray-500">Active 2m ago</p>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-3">
            <button className="p-1.5 md:p-2 hover:bg-gray-100 rounded-full text-green-800 transition-colors text-bol">
              <Phone className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <button className="p-1.5 md:p-2 hover:bg-gray-100 rounded-full text-blue-800 transition-colors">
              <Video className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <button className="p-1.5 md:p-2 hover:bg-gray-100 rounded-full text-green-800 transition-colors">
              <Info className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
        </div>

        {/* Messages Area with Decorative Background */}
        <div
          className="flex-1 overflow-y-auto p-4 md:p-6 relative"
          style={{
            background: "linear-gradient(135deg, #7dd3c0 0%, #a8e6cf 100%)",
          }}
        >
          {/* Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Lollipop decorations */}
            <div className="absolute top-6 right-10 md:top-10 md:right-20 w-16 h-16 md:w-24 md:h-24 opacity-40">
              <div className="relative">
                <div className="w-10 h-10 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-teal-300 to-teal-400 absolute top-0 right-0" />
                <div className="w-0.5 md:w-1 h-12 md:h-20 bg-white absolute top-8 right-4 md:top-12 md:right-7 rotate-45" />
              </div>
            </div>

            <div className="absolute top-20 right-16 md:top-32 md:right-32 w-14 h-14 md:w-20 md:h-20 opacity-40">
              <div className="relative">
                <div className="w-9 h-9 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-pink-300 to-pink-400 absolute" />
                <div className="w-0.5 md:w-1 h-10 md:h-16 bg-white absolute top-7 left-4 md:top-10 md:left-6 rotate-12" />
              </div>
            </div>

            <div className="absolute top-40 right-6 md:top-60 md:right-10 w-18 h-18 md:w-28 md:h-28 opacity-40">
              <div className="relative">
                <div className="w-12 h-12 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-teal-400 to-teal-500 absolute" />
                <div className="w-0.5 md:w-1 h-14 md:h-24 bg-white absolute top-10 left-5 md:top-16 md:left-9 rotate-[-20deg]" />
              </div>
            </div>

            <div className="absolute bottom-24 right-12 md:bottom-32 md:right-24 w-16 h-16 md:w-24 md:h-24 opacity-40">
              <div className="relative">
                <div className="w-10 h-10 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-pink-400 to-pink-500 absolute" />
                <div className="w-0.5 md:w-1 h-12 md:h-20 bg-white absolute top-8 left-4 md:top-12 md:left-7 rotate-[30deg]" />
              </div>
            </div>

            {/* Lips decoration */}
            <div className="absolute bottom-12 right-8 md:bottom-16 md:right-16 w-20 h-20 md:w-32 md:h-32 opacity-60">
              <div className="relative">
                <div className="w-16 h-10 md:w-24 md:h-16 bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 rounded-full" />
                <div className="absolute top-4 left-2 md:top-6 md:left-4 w-10 h-5 md:w-16 md:h-8 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full" />
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="space-y-3 md:space-y-4 relative z-10 pt-2 pb-3">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === "sent" ? "justify-end" : "justify-start"}`}>
                <div className="flex items-end gap-1.5 md:gap-2 max-w-[85%] sm:max-w-[75%] md:max-w-md mt-2 md:mt-3">
                  {message.type === "received" && (
                    <img
                      src={message.avatar || "/placeholder.svg"}
                      alt="User"
                      className="w-6 h-6 md:w-7 md:h-7 rounded-full object-cover flex-shrink-0 border-gray-800"
                    />
                  )}

                  <div>
                      {message.image && message.image.trim() !== "" && (
                      <div className="bg-white rounded-2xl p-2 md:p-3 shadow-sm gp-1">
                        <img
                          src={message.image || "/placeholder.svg"}
                          // alt="Shared"
                          className="rounded-xl max-w-[200px] sm:max-w-xs"
                        />
                      </div>
                      )}
                      {message.text && message.text.trim() !== "" &&  (
                      <div
                        className={`px-3 py-2 md:px-4 md:py-2 rounded-2xl shadow-sm text-sm d:text-base ${
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

       {/* Preview above the input bar container */}
       {preview && (
          <div className="mb-2 flex items-center gap-2">
            <img src={preview} alt="preview" className="w-24 h-24 object-cover rounded" />
            <button onClick={() => { setFile(null); setPreview(null); }} className="text-red-500">Remove</button>
          </div>
        )}


        {/* Input Bar Container */}
        <div className="bg-white border-t border-gray-200 p-3 md:p-4 mb-1">
          <form onSubmit={handleSendMessage} className="flex items-center gap-1 md:gap-2">
            {/* File upload button */}
            <button
              type="button"
              onClick={triggerFileSelect}
              className="p-1.5 md:p-2 hover:bg-gray-100 rounded-full text-blue-500 transition-colors"
            >
              <ImageIcon className="w-4 h-4 md:w-5 md:h-5" />
            </button>

            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />

            {/* Other buttons */}
            <button
              type="button"
              className="p-1.5 md:p-2 hover:bg-gray-100 rounded-full text-blue-500 transition-colors"
            >
              <Camera className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <button
              type="button"
              className="p-1.5 md:p-2 hover:bg-gray-100 rounded-full text-blue-500 transition-colors"
            >
              <Mic className="w-4 h-4 md:w-5 md:h-5" />
            </button>

            {/* Text input */}
            <input
              type="text"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 md:px-4 md:py-2 bg-gray-100 rounded-full text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Submit button */}
            <button
              type="submit"
              disabled={!formData.message.trim() && !file}
              className="p-1.5 md:p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4 md:w-5 md:h-5" />
            </button>

            <div ref={chatEndRef} />
          </form>
        </div>


      </div>
    </div>
  )
}

export default ChatInterface

// import { useEffect, useState, useRef } from "react"
// import { Phone, Video, Info, Camera, ImageIcon, Mic, Send, Search, Edit, VideoIcon } from "lucide-react"

// const ChatInterface = () => {
//   const [sender_id] = useState(1) // Mock sender ID
//   const [receiver_id, setReceiverId] = useState(2) // Mock receiver ID
//   const [formData, setFormData] = useState({ message: "" })
//   const [error, setError] = useState({})
//   const chatEndRef = useRef(null)
//   const fileInputRef = useRef(null)
//   const [file, setFile] = useState(null)
//   const [preview, setPreview] = useState(null)

//   const [mockChats, setMockChats] = useState([
//     {
//       id: 2,
//       name: "Sarah Johnson",
//       avatar: "/adorable-baby.png",
//       lastMessage: "Hey! How are you doing?",
//       time: "2m ago",
//       unread: 2,
//       online: true,
//     },
//     {
//       id: 3,
//       name: "Mike Chen",
//       avatar: "/adorable-baby.png",
//       lastMessage: "Thanks for the help!",
//       time: "15m ago",
//       unread: 0,
//       online: true,
//     },
//     {
//       id: 4,
//       name: "Emma Wilson",
//       avatar: "/adorable-baby.png",
//       lastMessage: "See you tomorrow 👋",
//       time: "1h ago",
//       unread: 0,
//       online: false,
//     },
//     {
//       id: 5,
//       name: "Alex Rodriguez",
//       avatar: "/adorable-baby.png",
//       lastMessage: "Perfect! Let's do it.",
//       time: "3h ago",
//       unread: 1,
//       online: true,
//     },
//     {
//       id: 6,
//       name: "Lisa Anderson",
//       avatar: "/adorable-baby.png",
//       lastMessage: "Got the files, thanks!",
//       time: "5h ago",
//       unread: 0,
//       online: false,
//     },
//   ])

//   const [messages, setMessages] = useState([
//     {
//       id: 1,
//       type: "received",
//       text: "Hey! How are you doing?",
//       avatar: "//adorable-baby.png",
//       timestamp: new Date(Date.now() - 300000),
//     },
//     {
//       id: 2,
//       type: "sent",
//       text: "I'm doing great! Just working on some projects. How about you?",
//       timestamp: new Date(Date.now() - 240000),
//     },
//     {
//       id: 3,
//       type: "received",
//       text: "Same here! Been pretty busy lately.",
//       avatar: "/adorable-baby.png",
//       timestamp: new Date(Date.now() - 180000),
//     },
//     {
//       id: 4,
//       type: "received",
//       image: "/adorable-baby.png",
//       avatar: "/adorable-baby.png",
//       timestamp: new Date(Date.now() - 120000),
//     },
//     {
//       id: 5,
//       type: "sent",
//       text: "Nice setup! Love the aesthetic 😊",
//       timestamp: new Date(Date.now() - 60000),
//     },
//   ])

//   const [selectedChat, setSelectedChat] = useState(mockChats[0])

//   // Scroll to bottom
//   const scrollToBottom = () => {
//     chatEndRef.current?.scrollIntoView({ behavior: "auto" })
//   }

//   // Run scroll after messages are loaded or updated
//   useEffect(() => {
//     scrollToBottom()
//   }, [messages])

//   const findoutReceiverId = (chat) => {
//     setReceiverId(chat.id)
//     setSelectedChat(chat)

//     // Load mock messages for selected chat
//     const mockMessagesForChat = [
//       {
//         id: Date.now(),
//         type: "received",
//         text: `Hey! This is ${chat.name}`,
//         avatar: chat.avatar,
//         timestamp: new Date(Date.now() - 300000),
//       },
//       {
//         id: Date.now() + 1,
//         type: "sent",
//         text: "Hi! How can I help you?",
//         timestamp: new Date(Date.now() - 240000),
//       },
//     ]
//     setMessages(mockMessagesForChat)
//   }

//   const triggerFileSelect = () => {
//     fileInputRef.current?.click()
//   }

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0]
//     if (!selectedFile) return

//     if (selectedFile.size > 5 * 1024 * 1024) {
//       setError({ send: "File size must be less than 5MB" })
//       return
//     }

//     setFile(selectedFile)
//     setPreview(URL.createObjectURL(selectedFile))
//   }

//   const handleSendMessage = async (e) => {
//     e.preventDefault()
//     setError({})

//     if (!formData.message.trim() && !file) return

//     const newMessage = {
//       id: Date.now(),
//       text: formData.message,
//       image: file ? URL.createObjectURL(file) : null,
//       type: "sent",
//       timestamp: new Date(),
//     }

//     setMessages((prev) => [...prev, newMessage])

//     // Update last message in chat list
//     setMockChats((prev) =>
//       prev.map((chat) =>
//         chat.id === selectedChat.id ? { ...chat, lastMessage: formData.message || "Image", time: "Just now" } : chat,
//       ),
//     )

//     // Reset form
//     setFormData({ message: "" })
//     setFile(null)
//     setPreview(null)

//     // Simulate received response after 2 seconds
//     setTimeout(() => {
//       const responseMessage = {
//         id: Date.now() + 1,
//         text: "Thanks for your message! I'll get back to you soon.",
//         type: "received",
//         avatar: selectedChat.avatar,
//         timestamp: new Date(),
//       }
//       setMessages((prev) => [...prev, responseMessage])
//     }, 2000)
//   }

//   const handleInputChange = (e) => {
//     const { name, value } = e.target
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }))

//     if (error[name]) {
//       setError((prev) => ({
//         ...prev,
//         [name]: "",
//       }))
//     }
//   }

//   return (
//     <div className="flex h-screen bg-white">
//       {/* Left Sidebar - Chat List */}
//       <div className="hidden md:flex md:w-80 lg:w-96 border-r border-gray-200 flex-col">
//         {/* Sidebar Header */}
//         <div className="p-3 md:p-4 border-b border-gray-200">
//           <div className="flex items-center justify-between mb-3 md:mb-4">
//             <h3 className="text-sm md:text-xl font-semibold">Chats</h3>
//             <div className="flex gap-2 md:gap-2">
//               <button className="p-1.5 md:p-2 hover:bg-gray-100 rounded-full transition-colors">
//                 <VideoIcon className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
//               </button>
//               <button className="p-1.5 md:p-2 hover:bg-gray-100 rounded-full transition-colors">
//                 <Edit className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
//               </button>
//             </div>
//           </div>


//         </div>

//         {/* Chat List */}
//         <div className="flex-1 overflow-y-auto">
//           {mockChats.map((chat) => (
//             <div
//               key={chat.id}
//               onClick={() => findoutReceiverId(chat)}
//               className={`flex items-center gap-2 md:gap-3 p-2 md:p-3 cursor-pointer hover:bg-gray-50 transition-colors ${
//                 selectedChat.id === chat.id ? "bg-gray-100" : ""
//               }`}
//             >
//               <div className="relative flex-shrink-0">
//                 <img
//                   src={chat.avatar || "/placeholder.svg"}
//                   alt={chat.name || "Chat"}
//                   className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover"
//                 />
//                 <div
//                   className={`absolute bottom-0 right-0 w-3 h-3 md:w-3.5 md:h-3.5 border-2 border-white rounded-full ${chat.online ? "bg-green-500" : "bg-gray-400"}`}
//                 />
//               </div>

//               <div className="flex-1 min-w-0">
//                 <div className="flex items-center justify-between">
//                   <p className="text-sm md:text-base font-semibold text-gray-900 truncate">{chat.name}</p>
//                   <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{chat.time}</span>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <p className="text-xs md:text-sm text-gray-600 truncate">{chat.lastMessage}</p>
//                   {chat.unread > 0 && (
//                     <span className="ml-2 min-w-[18px] h-[18px] md:min-w-[20px] md:h-5 px-1.5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center flex-shrink-0">
//                       {chat.unread}
//                     </span>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Right Side - Chat Area */}
//       <div className="flex-1 flex flex-col">
//         {/* Chat Header */}
//         <div className="bg-white border-b border-gray-200 p-3 md:p-4 flex items-center justify-between">
//           <div className="flex items-center gap-2 md:gap-3">
//             <div className="relative flex-shrink-0">
//               <img
//                 src={selectedChat.avatar || "/placeholder.svg"}
//                 alt={selectedChat.name}
//                 className="w-9 h-9 md:w-10 md:h-10 rounded-full object-cover"
//               />
//               {selectedChat.online && (
//                 <div className="absolute bottom-0 right-0 w-2.5 h-2.5 md:w-3 md:h-3 bg-green-500 border-2 border-white rounded-full" />
//               )}
//             </div>
//             <div className="min-w-0">
//               <h5 className="font-semibold text-sm md:text-base truncate">{selectedChat.name}</h5>
//               <p className="text-xs text-gray-500">{selectedChat.online ? "Active now" : "Active 2m ago"}</p>
//             </div>
//           </div>

//           <div className="flex items-center gap-2 md:gap-3">
//             <button className="p-1.5 md:p-2 hover:bg-gray-100 rounded-full text-blue-600 transition-colors">
//               <Phone className="w-4 h-4 md:w-5 md:h-5" />
//             </button>
//             <button className="p-1.5 md:p-2 hover:bg-gray-100 rounded-full text-blue-600 transition-colors">
//               <Video className="w-4 h-4 md:w-5 md:h-5" />
//             </button>
//             <button className="p-1.5 md:p-2 hover:bg-gray-100 rounded-full text-blue-600 transition-colors">
//               <Info className="w-4 h-4 md:w-5 md:h-5" />
//             </button>
//           </div>
//         </div>

//         {/* Messages Area with Decorative Background */}
//         <div
//           className="flex-1 overflow-y-auto p-4 md:p-6 relative"
//           style={{
//             background: "linear-gradient(135deg, #7dd3c0 0%, #a8e6cf 100%)",
//           }}
//         >
//           {/* Decorative Elements */}
//           <div className="absolute inset-0 overflow-hidden pointer-events-none">
//             {/* Lollipop decorations */}
//             <div className="absolute top-6 right-10 md:top-10 md:right-20 w-16 h-16 md:w-24 md:h-24 opacity-30">
//               <div className="relative">
//                 <div className="w-10 h-10 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-teal-300 to-teal-400 absolute top-0 right-0" />
//                 <div className="w-0.5 md:w-1 h-12 md:h-20 bg-white/80 absolute top-8 right-4 md:top-12 md:right-7 rotate-45" />
//               </div>
//             </div>

//             <div className="absolute top-20 right-16 md:top-32 md:right-32 w-14 h-14 md:w-20 md:h-20 opacity-30">
//               <div className="relative">
//                 <div className="w-9 h-9 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-pink-300 to-pink-400 absolute" />
//                 <div className="w-0.5 md:w-1 h-10 md:h-16 bg-white/80 absolute top-7 left-4 md:top-10 md:left-6 rotate-12" />
//               </div>
//             </div>

//             <div className="absolute top-40 right-6 md:top-60 md:right-10 w-18 h-18 md:w-28 md:h-28 opacity-30">
//               <div className="relative">
//                 <div className="w-12 h-12 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-teal-400 to-teal-500 absolute" />
//                 <div className="w-0.5 md:w-1 h-14 md:h-24 bg-white/80 absolute top-10 left-5 md:top-16 md:left-9 rotate-[-20deg]" />
//               </div>
//             </div>

//             <div className="absolute bottom-24 right-12 md:bottom-32 md:right-24 w-16 h-16 md:w-24 md:h-24 opacity-30">
//               <div className="relative">
//                 <div className="w-10 h-10 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-pink-400 to-pink-500 absolute" />
//                 <div className="w-0.5 md:w-1 h-12 md:h-20 bg-white/80 absolute top-8 left-4 md:top-12 md:left-7 rotate-[30deg]" />
//               </div>
//             </div>

//             {/* Lips decoration */}
//             <div className="absolute bottom-12 right-8 md:bottom-16 md:right-16 w-20 h-12 md:w-32 md:h-20 opacity-40">
//               <div className="relative">
//                 <div className="w-16 h-8 md:w-24 md:h-12 bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 rounded-full" />
//                 <div className="absolute top-3 left-3 md:top-4 md:left-5 w-10 h-4 md:w-14 md:h-6 bg-gradient-to-r from-rose-300 to-pink-400 rounded-full opacity-70" />
//               </div>
//             </div>
//           </div>

//           {/* Messages */}
//           <div className="space-y-3 md:space-y-4 relative z-10">
//             {messages.map((message) => (
//               <div key={message.id} className={`flex ${message.type === "sent" ? "justify-end" : "justify-start"}`}>
//                 <div className="flex items-end gap-1.5 md:gap-2 max-w-[85%] sm:max-w-[75%] md:max-w-md">
//                   {message.type === "received" && (
//                     <img
//                       src={message.avatar || "/placeholder.svg"}
//                       alt="User"
//                       className="w-6 h-6 md:w-7 md:h-7 rounded-full object-cover flex-shrink-0"
//                     />
//                   )}

//                   <div className="flex flex-col gap-1">
//                     {message.image && (
//                       <div className="bg-white rounded-2xl p-2 md:p-2.5 shadow-md">
//                         <img
//                           src={message.image || "/placeholder.svg"}
//                           alt="Shared"
//                           className="rounded-xl max-w-[200px] sm:max-w-[250px] md:max-w-xs"
//                         />
//                       </div>
//                     )}
//                     {message.text && (
//                       <div
//                         className={`px-3 py-2 md:px-4 md:py-2.5 rounded-2xl shadow-md text-sm md:text-base ${
//                           message.type === "sent"
//                             ? "bg-blue-500 text-white rounded-br-sm"
//                             : "bg-white text-gray-800 rounded-bl-sm"
//                         }`}
//                       >
//                         {message.text}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))}
//             <div ref={chatEndRef} />
//           </div>
//         </div>

//         {/* Preview above the input bar */}
//         {preview && (
//           <div className="bg-white border-t border-gray-200 p-3 flex items-center gap-3">
//             <img
//               src={preview || "/placeholder.svg"}
//               alt="preview"
//               className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg"
//             />
//             <button
//               onClick={() => {
//                 setFile(null)
//                 setPreview(null)
//               }}
//               className="text-red-500 hover:text-red-700 font-medium text-sm"
//             >
//               Remove
//             </button>
//           </div>
//         )}

//         {/* Input Bar */}
//         <div className="bg-white border-t border-gray-200 p-3 md:p-4">
//           <form onSubmit={handleSendMessage} className="flex items-center gap-1.5 md:gap-2">
//             <button
//               type="button"
//               onClick={triggerFileSelect}
//               className="p-1.5 md:p-2 hover:bg-gray-100 rounded-full text-blue-500 transition-colors flex-shrink-0"
//             >
//               <ImageIcon className="w-4 h-4 md:w-5 md:h-5" />
//             </button>

//             <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />

//             <button
//               type="button"
//               className="p-1.5 md:p-2 hover:bg-gray-100 rounded-full text-blue-500 transition-colors flex-shrink-0"
//             >
//               <Camera className="w-4 h-4 md:w-5 md:h-5" />
//             </button>

//             <button
//               type="button"
//               className="p-1.5 md:p-2 hover:bg-gray-100 rounded-full text-blue-500 transition-colors flex-shrink-0"
//             >
//               <Mic className="w-4 h-4 md:w-5 md:h-5" />
//             </button>

//             <input
//               type="text"
//               name="message"
//               value={formData.message}
//               onChange={handleInputChange}
//               placeholder="Type a message..."
//               className="flex-1 px-3 py-2 md:px-4 md:py-2.5 bg-gray-100 rounded-full text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />

//             <button
//               type="submit"
//               disabled={!formData.message.trim() && !file}
//               className="p-2 md:p-2.5 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex-shrink-0"
//             >
//               <Send className="w-4 h-4 md:w-5 md:h-5" />
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ChatInterface


