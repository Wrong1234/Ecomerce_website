// import { useState, useEffect } from 'react';
// import { Phone, Video, Info, Camera, Image, Mic, Send } from 'lucide-react';
// import {useLocation, useParams} from "react-router-dom";

// const ChatInterface = () => {

//   const [error, setError] = useState({});
//   const { id: receiver_id } = useParams();
//   const [sender_id, setSenderId] = useState(null);
//   const [currentUser, setCurrentUser] = useState(null);
//   const token = localStorage.getItem("token");
  
  // // Get logged-in user from localStorage
  // useEffect(() => {
  //   const userString = localStorage.getItem("user");
    
  //   if (userString) {
  //     try {
  //       const user = JSON.parse(userString);
        
  //       // Get user ID (adjust based on your user object structure)
  //       const userId = user.id;
  //       setSenderId(userId);
  //       setCurrentUser(user);
        
  //       // console.log("Sender Id: ", userId);
  //     } catch (error) {
  //       console.error("Error parsing user data:", error);
  //       setError({ user: "Invalid user data" });
  //     }
  //   } else {
  //     console.log("No user found in localStorage");
  //     // Optionally redirect to login
  //     // navigate('/login');
  //   }
  // }, []);

//   // console.log("Receiver Id: ", receiver_id);

//   const [messages, setMessages] = useState([]);

//   const per_page = 10;
//   const params = new URLSearchParams({
//     user_id: receiver_id,
//     per_page: per_page
//   });
//   const fetchData = async () =>{

//     try{
//       const response = await fetch(`http://127.0.0.1:8000/api/messages?${params.toString()}`, {
//         method: "GET",
//         headers:{
//           'Accept': "Application/json",
//           'Authorization': `Bearer ${token}`,
//         }
//       })

//       const result = await response.json();
//       if(result.success && result.data && result.data.data){
//         const transformedMessages = result.data.data.map(msg => ({
//           id : msg.id,
//           type: msg.sender_id === sender_id ? 'sent' : 'received',
//           text: msg.message,
//           created_at: msg.created_at,
//         }));
//         setMessages(transformedMessages.reverse());
//       }
//     }
//     catch(err){
//       console.log("Message fetch errors", err);
//     }
//   }
  
//  useEffect(() => {
//   // Only fetch data when sender_id is available
//   if (sender_id && receiver_id && token) {
//     fetchData();
//   }
// }, [sender_id, receiver_id, token]);

//   const [formData, setFormData] = useState({
//     message: "",
//   })

//   const handleInputChange = (e) =>{
//       const {name, value} = e.target;
//       setFormData((prev) => ({
//         ...prev, 
//         [name]:value,
//       }));

//       if(error[name]){
//         setError((prev) =>({
//           ...prev,
//           [name]: "",
//         }))
//       }
//   }

//   const handleSendMessage = async(e) => {
//     e.preventDefault();
//     setError({});

//     if (!formData.message.trim()) return;

//     try{
//       const requestData = {
//         message: formData.message,
//         sender_id: sender_id,
//         receiver_id: receiver_id,
//       }

//       const response = await fetch("http://localhost:8000/api/messages", {
//         method: "POST",
//         headers:{
//           'Accept': 'Application/json',
//           'Content-Type': 'Application/json',
//           'Authorization': `Bearer ${token}`,
//         },
        
//         body: JSON.stringify({
//           message:formData.message,
//           sender_id: sender_id,
//           receiver_id: receiver_id,
//         })
//       });

//       const data = await response.json();
      
//       if(response.ok){
//         const newMessage = {
//           id: data.data?.id || Date.now(),
//           type: 'sent',
//           text: formData.message,
//           created_at: new Date().toISOString(),
//         };
//         setMessages(prev => [...prev, newMessage]);
//           setFormData({ message: " " })
//       }
//       else{
//         console.log("Fix up errors");
//       }
      
//     }
//     catch(error){
//       console.log("Type and send message", error)
//     }
//   }
//   return (
//     <div className="max-w-md mx-auto bg-white h-screen flex flex-col mt-1">
//       {/* Header */}
//       <div className="bg-blue-500 text-white p-4 flex items-center justify-between ">
//         <div className="flex items-center space-x-3">
//           <button className="text-white">
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//             </svg>
//           </button>
//           <div className="flex items-center space-x-3 gap-2">
//             <div className="w-8 h-8 bg-gray-300 rounded-full overflow-hidden">
//               <img 
//                 // src="/api/placeholder/32/32" 
//                 alt="Regina" 
//                 className="w-full h-full object-cover"
//               />
//             </div>
//             <div>
//               <div className="font-medium">Mahabur</div>
//               <div className="text-xs text-blue-100">Active 14 minutes ago</div>
//             </div>
//           </div>
//         </div>
//         <div className="flex items-center space-x-4 gap-4">
//           <Phone className="w-5 h-5" />
//           <Video className="w-5 h-5" />
//           <Info className="w-5 h-5" />
//         </div>
//       </div>

//       {/* Messages Container */}
//       <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
//         {messages.map((message) => (
//           <div
//             key={message.id}
//             className={`flex ${message.type === 'sent' ? 'justify-end' : 'justify-start'}`}
//           >
//             <div className="flex items-end space-x-2 max-w-xs p-1 gap-2">
//               {message.type === 'received' && (
//                 <div className="w-6 h-6 bg-gray-300 rounded-full overflow-hidden flex-shrink-0">
//                   <img 
//                     // src="/api/placeholder/24/24" 
//                     alt="Regina" 
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//               )}
//               <div
//                 className={`px-4 py-2 rounded-2xl max-w-full break-words ${
//                   message.type === 'sent'
//                     ? 'bg-blue-500 text-white rounded-full'
//                     : 'bg-white text-gray-800 rounded-full shadow-sm border'
//                 }`}
//               >
//                 {message.text}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Input Bar */}
//       <div className="p-4 bg-white border-t border-gray-200">
//         <div className="flex items-center space-x-3">
//           <div className="flex space-x-2">
//             <button className="text-blue-500 p-1">
//               <div className="w-6 h-6 grid grid-cols-2 gap-0.5">
//                 <div className="w-2 h-2 bg-current rounded-sm"></div>
//                 <div className="w-2 h-2 bg-current rounded-sm"></div>
//                 <div className="w-2 h-2 bg-current rounded-sm"></div>
//                 <div className="w-2 h-2 bg-current rounded-sm"></div>
//               </div>
//             </button>
//             <button className="text-blue-500">
//               <Camera className="w-6 h-6" />
//             </button>
//             <button className="text-blue-500">
//               <Image className="w-6 h-6" />
//             </button>
//             <button className="text-blue-500">
//               <Mic className="w-6 h-6" />
//             </button>
//           </div>
          
//           <form onSubmit={handleSendMessage}>
//             <div className="flex-1 flex items-center space-x-2 gap-1">
//               <input
//                 type="text"
//                 id="message"
//                 name="message"
//                 value={formData.message}
//                 onChange={handleInputChange}
//                 placeholder="Type a message..."
//                 className="flex-1 px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
//               />
//               <button
//                 type="submit"
//                 className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 <Send className="w-5 h-5" />
//               </button>
//           </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatInterface;
// import { useState, useEffect, useRef } from 'react';
// import { Phone, Video, Info, Camera, Image, Mic, Send } from 'lucide-react';
// import { useParams } from "react-router-dom";
// import Echo from 'laravel-echo';
// import Pusher from 'pusher-js';

// const ChatInterface = () => {
//   const [error, setError] = useState({});
//   const { id: receiver_id } = useParams();
//   const [sender_id, setSenderId] = useState(null);
//   const [currentUser, setCurrentUser] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [formData, setFormData] = useState({ message: "" });
//   const token = localStorage.getItem("token");
//   const echoRef = useRef(null);

//   // Initialize Laravel Echo with Reverb
//   useEffect(() => {
//     if (!token || !sender_id) return;

//     window.Pusher = Pusher;

//     // echoRef.current = new Echo({
//     //   broadcaster: 'reverb',
//     //   key: process.env.REACT_APP_REVERB_APP_KEY,
//     //   wsHost: process.env.REACT_APP_REVERB_HOST,
//     //   wsPort: process.env.REACT_APP_REVERB_PORT ?? 8080,
//     //   wssPort: process.env.REACT_APP_REVERB_PORT ?? 8080,
//     //   forceTLS: (process.env.REACT_APP_REVERB_SCHEME ?? 'https') === 'https',
//     //   enabledTransports: ['ws', 'wss'],
//     //   authEndpoint: 'http://127.0.0.1:8000/broadcasting/auth',
//     //   auth: {
//     //     headers: {
//     //       Authorization: `Bearer ${token}`,
//     //       Accept: 'application/json',
//     //     },
//     //   },
//     // });
//     echoRef.current = new Echo({
//     broadcaster: 'pusher',
//     key: import.meta.env.VITE_REVERB_APP_KEY,
//     wsHost: import.meta.env.VITE_REVERB_HOST,
//     wsPort: parseInt(import.meta.env.VITE_REVERB_PORT) || 8080,
//     wssPort: parseInt(import.meta.env.VITE_REVERB_PORT) || 8080,
//     forceTLS: import.meta.env.VITE_REVERB_SCHEME === 'https',
//     enabledTransports: ['ws', 'wss'],
//     authEndpoint: 'http://127.0.0.1:8000/broadcasting/auth',
//     auth: {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         Accept: 'application/json',
//       },
//     },
//   });


//     console.log('Echo initialized with Reverb');

//     // Listen to sender's private channel
//     const channel = echoRef.current.private(`chat-channel.${sender_id}`);
    
//     channel.listen('.MessageSendEvent', (event) => {
//       console.log('Real-time message received:', event);
      
//       // Only add message if it's for current conversation
//       if (event.message.receiver_id === parseInt(receiver_id) || 
//           event.message.sender_id === parseInt(receiver_id)) {
        
//         const newMessage = {
//           id: event.message.id,
//           type: event.message.sender_id === parseInt(sender_id) ? 'sent' : 'received',
//           text: event.message.message,
//           created_at: event.message.created_at,
//         };

//         setMessages(prev => {
//           // Prevent duplicate messages
//           const exists = prev.some(msg => msg.id === newMessage.id);
//           if (exists) return prev;
//           return [...prev, newMessage];
//         });
//       }
//     });

//     // Connection status logging
//     channel.subscribed(() => {
//       console.log('Successfully subscribed to chat-channel.' + sender_id);
//     });

//     channel.error((error) => {
//       console.error('Channel subscription error:', error);
//     });

//     return () => {
//       if (echoRef.current) {
//         echoRef.current.leave(`chat-channel.${sender_id}`);
//         echoRef.current.disconnect();
//       }
//     };
//   }, [token, sender_id, receiver_id]);

//   // Get logged-in user
//   useEffect(() => {
//     const userString = localStorage.getItem("user");
    
//     if (userString) {
//       try {
//         const user = JSON.parse(userString);
//         setSenderId(user.id);
//         setCurrentUser(user);
//       } catch (error) {
//         console.error("Error parsing user data:", error);
//         setError({ user: "Invalid user data" });
//       }
//     }
//   }, []);

//   // Fetch initial messages
//   const fetchData = async () => {
//     try {
//       const params = new URLSearchParams({
//         user_id: receiver_id,
//         per_page: 10
//       });

//       const response = await fetch(`http://127.0.0.1:8000/api/messages?${params.toString()}`, {
//         method: "GET",
//         headers: {
//           'Accept': "application/json",
//           'Authorization': `Bearer ${token}`,
//         }
//       });

//       const result = await response.json();
//       if (result.success && result.data && result.data.data) {
//         const transformedMessages = result.data.data.map(msg => ({
//           id: msg.id,
//           type: msg.sender_id === sender_id ? 'sent' : 'received',
//           text: msg.message,
//           created_at: msg.created_at,
//         }));
//         setMessages(transformedMessages.reverse());
//       }
//     } catch (err) {
//       console.log("Message fetch errors", err);
//     }
//   };

//   useEffect(() => {
//     if (sender_id && receiver_id && token) {
//       fetchData();
//     }
//   }, [sender_id, receiver_id, token]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));

//     if (error[name]) {
//       setError((prev) => ({
//         ...prev,
//         [name]: "",
//       }));
//     }
//   };

//   const handleSendMessage = async (e) => {
//     e.preventDefault();
//     setError({});

//     if (!formData.message.trim()) return;

//     try {
//       const response = await fetch("http://localhost:8000/api/messages", {
//         method: "POST",
//         headers: {
//           'Accept': 'application/json',
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           message: formData.message,
//           receiver_id: receiver_id,
//         })
//       });

//       const data = await response.json();

//       if (response.ok) {
//         // Clear input - message will be added via Echo listener
//         setFormData({ message: "" });
//         console.log('Message sent successfully');
//       } else {
//         console.log("Send message error:", data);
//         setError({ send: data.message || "Failed to send message" });
//       }

//     } catch (error) {
//       console.log("Send message error:", error);
//       setError({ send: "Network error occurred" });
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto bg-white h-screen flex flex-col mt-1">
//       {/* Header */}
//       <div className="bg-blue-500 text-white p-4 flex items-center justify-between">
//         <div className="flex items-center space-x-3">
//           <button className="text-white">
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//             </svg>
//           </button>
//           <div className="flex items-center space-x-3 gap-2">
//             <div className="w-8 h-8 bg-gray-300 rounded-full overflow-hidden">
//               <img alt="User" className="w-full h-full object-cover" />
//             </div>
//             <div>
//               <div className="font-medium">{currentUser?.name || 'User'}</div>
//               <div className="text-xs text-blue-100">Active now</div>
//             </div>
//           </div>
//         </div>
//         <div className="flex items-center space-x-4 gap-4">
//           <Phone className="w-5 h-5 cursor-pointer" />
//           <Video className="w-5 h-5 cursor-pointer" />
//           <Info className="w-5 h-5 cursor-pointer" />
//         </div>
//       </div>

//       {/* Messages Container */}
//       <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
//         {messages.length === 0 ? (
//           <div className="text-center text-gray-500 mt-10">
//             No messages yet. Start the conversation!
//           </div>
//         ) : (
//           messages.map((message) => (
//             <div
//               key={message.id}
//               className={`flex ${message.type === 'sent' ? 'justify-end' : 'justify-start'}`}
//             >
//               <div className="flex items-end space-x-2 max-w-xs p-1 gap-2">
//                 {message.type === 'received' && (
//                   <div className="w-6 h-6 bg-gray-300 rounded-full overflow-hidden flex-shrink-0">
//                     <img alt="User" className="w-full h-full object-cover" />
//                   </div>
//                 )}
//                 <div
//                   className={`px-4 py-2 rounded-2xl max-w-full break-words ${
//                     message.type === 'sent'
//                       ? 'bg-blue-500 text-white'
//                       : 'bg-white text-gray-800 shadow-sm border'
//                   }`}
//                 >
//                   {message.text}
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       {/* Input Bar */}
//       <div className="p-4 bg-white border-t border-gray-200">
//         {error.send && (
//           <div className="mb-2 text-red-500 text-sm">{error.send}</div>
//         )}
//         <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
//           <div className="flex space-x-2">
//             <button type="button" className="text-blue-500 hover:text-blue-600">
//               <Camera className="w-6 h-6" />
//             </button>
//             <button type="button" className="text-blue-500 hover:text-blue-600">
//               <Image className="w-6 h-6" />
//             </button>
//           </div>

//           <input
//             type="text"
//             name="message"
//             value={formData.message}
//             onChange={handleInputChange}
//             placeholder="Type a message..."
//             className="flex-1 px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
//           />
//           <button
//             type="submit"
//             disabled={!formData.message.trim()}
//             className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
//           >
//             <Send className="w-5 h-5" />
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ChatInterface;
// export default ChatInterface;
import { useState, useEffect, useRef } from 'react';
import { Phone, Video, Info, Camera, Image, Mic, Send } from 'lucide-react';
import { useParams } from "react-router-dom";
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

const ChatInterface = () => {
  const [error, setError] = useState({});
  const { id: receiver_id } = useParams();
  const [sender_id, setSenderId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [formData, setFormData] = useState({ message: "" });
  const token = localStorage.getItem("token");
  const echoRef = useRef(null);

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


  // Initialize Laravel Echo with Reverb
  useEffect(() => {
    if (!token || !sender_id) return;

    window.Pusher = Pusher;

    // echoRef.current = new Echo({
    //   broadcaster: 'pusher',
    //   key: import.meta.env.VITE_REVERB_APP_KEY,
    //   wsHost: import.meta.env.VITE_REVERB_HOST,
    //   wsPort: parseInt(import.meta.env.VITE_REVERB_PORT) || 8080,
    //   wssPort: parseInt(import.meta.env.VITE_REVERB_PORT) || 8080,
    //   forceTLS: import.meta.env.VITE_REVERB_SCHEME === 'https',
    //   enabledTransports: ['ws', 'wss'],
    //   authEndpoint: 'http://127.0.0.1:8000/broadcasting/auth',
    //   auth: {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //       Accept: 'application/json',
    //     },
    //      withCredentials: true,
    //   },
    //   // ADD THIS LINE
    //   cluster: import.meta.env.VITE_REVERB_APP_CLUSTER || 'mt1', // Or whatever your Reverb cluster is configured to
    // });
    echoRef.current = new Echo({
      broadcaster: 'pusher',
      key: import.meta.env.VITE_REVERB_APP_KEY,
      wsHost: import.meta.env.VITE_REVERB_HOST,
      wssHost: import.meta.env.VITE_REVERB_HOST,
      wsPort: parseInt(import.meta.env.VITE_REVERB_PORT) || 8080,
      wssPort: parseInt(import.meta.env.VITE_REVERB_PORT) || 8080,
      forceTLS: import.meta.env.VITE_REVERB_SCHEME === 'https',
      enabledTransports: ['ws', 'wss'],
      disableStats: true,              // important for local dev
      cluster: import.meta.env.VITE_REVERB_APP_CLUSTER || 'mt1', // REQUIRED by pusher-js
      authEndpoint: 'http://127.0.0.1:8000/broadcasting/auth',
      auth: {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
        withCredentials: true,
      },
    });




    console.log('Echo initialized with Reverb');
    console.log(token);

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

  // Fetch initial messages
  const fetchData = async () => {
    try {
      const params = new URLSearchParams({
        user_id: receiver_id,
        per_page: 10
      });

      const response = await fetch(`http://127.0.0.1:8000/api/messages?${params.toString()}`, {
        method: "GET",
        headers: {
          'Accept': "application/json",
          'Authorization': `Bearer ${token}`,
        }
      });

      const result = await response.json();
      if (result.success && result.data && result.data.data) {
        const transformedMessages = result.data.data.map(msg => ({
          id: msg.id,
          type: msg.sender_id === sender_id ? 'sent' : 'received',
          text: msg.message,
          created_at: msg.created_at,
        }));
        setMessages(transformedMessages.reverse());
      }
    } catch (err) {
      console.log("Message fetch errors", err);
    }
  };

  useEffect(() => {
    if (sender_id && receiver_id && token) {
      fetchData();
    }
  }, [sender_id, receiver_id, token]);

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
          'Authorization': `Bearer ${token}`,
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
    <div className="max-w-md mx-auto bg-white h-screen flex flex-col mt-1">
      {/* Header */}
      <div className="bg-blue-500 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button className="text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex items-center space-x-3 gap-2">
            <div className="w-8 h-8 bg-gray-300 rounded-full overflow-hidden">
              <img alt="User" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="font-medium">{currentUser?.name || 'User'}</div>
              <div className="text-xs text-blue-100">Active now</div>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4 gap-4">
          <Phone className="w-5 h-5 cursor-pointer" />
          <Video className="w-5 h-5 cursor-pointer" />
          <Info className="w-5 h-5 cursor-pointer" />
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'sent' ? 'justify-end' : 'justify-start'}`}
            >
              <div className="flex items-end space-x-2 max-w-xs p-1 gap-2">
                {message.type === 'received' && (
                  <div className="w-6 h-6 bg-gray-300 rounded-full overflow-hidden flex-shrink-0">
                    <img alt="User" className="w-full h-full object-cover" />
                  </div>
                )}
                <div
                  className={`px-4 py-2 rounded-2xl max-w-full break-words ${
                    message.type === 'sent'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-800 shadow-sm border'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input Bar */}
      <div className="p-4 bg-white border-t border-gray-200">
        {error.send && (
          <div className="mb-2 text-red-500 text-sm">{error.send}</div>
        )}
        <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
          <div className="flex space-x-2">
            <button type="button" className="text-blue-500 hover:text-blue-600">
              <Camera className="w-6 h-6" />
            </button>
            <button type="button" className="text-blue-500 hover:text-blue-600">
              <Image className="w-6 h-6" />
            </button>
          </div>

          <input
            type="text"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
          />
          <button
            type="submit"
            disabled={!formData.message.trim()}
            className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;