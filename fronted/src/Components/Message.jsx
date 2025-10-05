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
  const [unreadCount, setUnreadCount] = useState(0);
  const [senderImage, setSenderImage] = useState([null]);
  const [receiverImage, setReceiverImage] = useState([null]);
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
  console.log("Real- time send message: ", event);
  if (
      event.message.receiver_id === Number.parseInt(receiver_id) ||
      event.message.sender_id === Number.parseInt(receiver_id)){ 

      const newMessage = {
        id: event.message.id,
        text: event.message.message,
        type: event.message.sender_id === Number.parseInt(sender_id) ? "sent" : "received",
        sender_id: event.message.sender_id,
        receiver_id: event.message.receiver_id,
        sender_image: event.message.sender_image  || "/man.jpg",
        receiver_image: event.message.receiver_image || "/man.jpg",
        created_at: event.message.created_at,
      };
      console.log(newMessage);

      // Add to messages
      setMessages(prev => {
        if (prev.some(m => m.id === newMessage.id)) return prev;
        return [...prev, newMessage];
      });

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
      console.log(result);
      if (result.success && Array.isArray(result.data)) {
        const transformedMessages = result.data.map((msg) => ({
          id: msg.id,
          type: Number(msg.sender_id) === Number(sender_id) ? "sent" : "received",
          text: msg.message,
          avatar: msg.receiver_image ? `http://127.0.0.1:8000/storage/${msg.receiver_image}`: "/man.jpg",
          created_at: msg.created_at,
        }))
        setMessages(transformedMessages.reverse())

        // console.log("Fetched messages:", transformedMessages)
      }
    } catch (err) {
      console.log("Data fetch error: ", err)
    }
  }

  const [selectedChat, setSelectedChat] = useState(mockChats[0])

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

  const handleSendMessage = async (e) => {
    e.preventDefault()
    setError({})

    if (!formData.message.trim()) return

    try {
      const response = await fetch("http://localhost:8000/api/messages", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          message: formData.message,
          receiver_id: receiver_id,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Clear input - message will be added via Echo listener
        setFormData({ message: "" })
        console.log("Message sent successfully")
      } else {
        console.log("Send message error:", data)
        setError({ send: data.message || "Failed to send message" })
      }
    } catch (error) {
      console.log("Send message error:", error)
      setError({ send: "Network error occurred" })
    }
  }

  // count un read message


  return (
    <div className="flex h-screen bg-white">
      {/* Left Sidebar - Chat List */}
      <div className="hidden md:flex md:w-80 lg:w-96 border-r border-gray-200 flex-col">
        {/* Sidebar Header */}
        <div className="p-3 md:p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <h3 className="text-sm md:text-xl text-red-600 font-semibold">Chats</h3>
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
            <Search className="absolute left-3 mt-4 mb-4 -translate-y-1/2 w-3.5 h-3.5 md:w-4 md:h-4 text-gray-600" />
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
                    {message.image ? (
                      <div className="bg-white rounded-2xl p-2 md:p-3 shadow-sm">
                        <img
                          src={message.image || "/placeholder.svg"}
                          alt="Shared"
                          className="rounded-xl max-w-[200px] sm:max-w-xs"
                        />
                      </div>
                    ) : (
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

        {/* Input Bar */}
        <div className="bg-white border-t border-gray-200 p-3 md:p-4 mb-1">
          <form onSubmit={handleSendMessage} className="flex items-center gap-1 md:gap-2">
            <button
              type="button"
              className="p-1.5 md:p-2 hover:bg-gray-100 rounded-full text-blue-500 transition-colors"
            >
              <ImageIcon className="w-4 h-4 md:w-5 md:h-5" />
            </button>
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

            <input
              type="text"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 md:px-4 md:py-2 bg-gray-100 rounded-full text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              disabled={!formData.message.trim()}
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

