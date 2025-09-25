import { useState } from "react"
import { Search, MessageCircle, Calendar, User } from "lucide-react"
import "../military-blog.css"

const MilitaryBlogCSS = () => {
  const [searchTerm, setSearchTerm] = useState("")

  const blogPosts = [
    {
      id: 1,
      title: "3RD DUMMY ARMY FOR TESTING U.S. ARMY",
      date: "5 DAYS AGO",
      image: "/istockphoto-1550071750-612x612-1.jpg",
      comments: 5,
      tags: ["Top Rated"],
      tagColor: "bg-red-500",
    },
    {
      id: 2,
      title: "NELL IRWIN U.S. NAVY",
      date: "SEPTEMBER 15, 2024",
      image: "/free-leetcode-3521542-2944960-1.webp",
      comments: 8,
      tags: ["Lowest Rated"],
      tagColor: "bg-red-600",
    },
    {
      id: 3,
      title: "DUMMY FOG EXPERIMENT FOR THE TOP U.S. ARMY",
      date: "SEPTEMBER 15, 2024",
      image: "/free-leetcode-3521542-2944960-1.webp",
      comments: 3,
      tags: [],
      tagColor: "",
    },
    {
      id: 4,
      title: "GEORGE E. HORNE U.S. ARMY",
      date: "AUGUST 15, 2024",
      image: "/HORNE-website-6.jpg",
      comments: 12,
      tags: [],
      tagColor: "",
    },
  ]

  const serviceBranches = ["U.S. AIR FORCE", "U.S. ARMY", "U.S. COAST GUARD", "U.S. MARINES CORPS", "U.S. NAVY"]

  const comments = [
    {
      user: "JERROD22",
      post: "Daniel J. Martin",
      branch: "U.S. Air Force",
    },
    {
      user: "ANONYMOUS",
      post: "Daniel J. Martin",
      branch: "U.S. Air Force",
    },
    {
      user: "SMILLY",
      post: "Jeffrey Adams (Ret)",
      branch: "U.S. Air Force",
    },
  ]

  const units = [
    "1-6 ARMOR BATTALION",
    "516TH SPECIAL OPERATIONS AVIATION REGIMENT (AIRBORNE)",
    "1ST ARMORED DIVISION",
    "2-7 INFANTRY BATTALION",
    "2D BOMB WING",
    "2D THEATER SIGNAL BRIGADE",
    "2-69 ARMOR BATTALION",
  ]

  return (
    <div className="military-blog gap-0">
      <header className="military-header">
        <div className="header-container">
          <nav className="header-nav">
            <h1 className="header-title">Military Defense News</h1>
            <div className="nav-links">
              <a href="/" className="back-link">
                ← Back to Showcase
              </a>
            </div>
          </nav>
        </div>
      </header>

      <div className="main-container">
        <div className="content-grid">
          {/* Main Content */}
          <div className="main-content w-185">
            {blogPosts.map((post) => (
              <article key={post.id} className="blog-post">
                <div className="post-content">
                  <div className="post-details">
                    <p className="post-date">
                      {post.date}
                    </p>
                    <h2 className="post-title">{post.title}</h2>
                  </div>
                  <div>
                      <img src={post.image || "/placeholder.svg"} alt={post.title} className="post-image" />
                  </div>
                </div>
                {/* <hr /> */}
                <div className="flex justify-between items-center border rounded-b-md">
                  {/* Left: Comments */}
                  <div className="flex items-center flex-1 px-4 py-3 border-r gap-2 justify-end font-bold text-neutral-400 hover:text-neutral-800 ">
                    <MessageCircle className="comment-icon mr-2" />
                    <span>{post.comments}</span>
                  </div>

                  {/* Right: Read More */}
                  <div className="px-4 py-2">
                    <button className="font-semibold hover:text-red-500">READ MORE</button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Sidebar */}
          <div className="sidebar">
            {/* Service Branches */}
            <div className="sidebar-section service-branches">
              <div className="section-header">
                <h3>SERVICE BRANCHES</h3>
              </div>
              <div className="section-content">
                {serviceBranches.map((branch, index) => (
                  <button key={index} className="branch-btn">
                    {branch}
                  </button>
                ))}
              </div>
            </div>

            {/* Search */}
            <div className="sidebar-section search-section">
              <div className="search-container">
                <div className="search-input-wrapper">
                  <input
                    type="text"
                    placeholder="SEARCH..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                  <Search className="search-icon" />
                </div>
              </div>
            </div>

            {/* Comments */}
            <div className="sidebar-section comments-section">
              <div className="section-header">
                <h3>COMMENTS</h3>
              </div>
              <div className="section-content">
                {comments.map((comment, index) => (
                  <div key={index} className="comment-item">
                    <div className="comment-header">
                      <User className="user-icon" />
                      <span className="comment-user">{comment.user}</span>
                      <span className="comment-on">on</span>
                      <span className="comment-post">{comment.post}</span>
                    </div>
                    <p className="comment-branch">{comment.branch}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Units */}
            <div className="sidebar-section units-section">
              <div className="section-header">
                <h3>UNITS</h3>
              </div>
              <div className="section-content">
                {units.map((unit, index) => (
                  <button key={index} className="unit-btn">
                    {unit}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


export default MilitaryBlogCSS;