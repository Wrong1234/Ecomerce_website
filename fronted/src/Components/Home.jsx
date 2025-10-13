import { Phone, Video, Info, Camera, ImageIcon, Mic, Send, Search, Edit, VideoIcon, Paperclip } from "lucide-react"

const Home = () => {

  return (
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
  );
};

export default Home;
