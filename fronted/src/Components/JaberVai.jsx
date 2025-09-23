import { useState } from "react"
import { Search, MessageCircle, Calendar, User } from "lucide-react"
import "../military-blog.css"

export default function MilitaryBlogCSS() {
  const [searchTerm, setSearchTerm] = useState("")

  const blogPosts = [
    {
      id: 1,
      title: "3RD DUMMY ARMY FOR TESTING U.S. ARMY",
      date: "5 DAYS AGO",
      image: "/gettyimages-1488453249-612x612.jpg",
      comments: 5,
      tags: ["Top Rated"],
      tagColor: "bg-red-500",
    },
    {
      id: 2,
      title: "NELL IRWIN U.S. NAVY",
      date: "SEPTEMBER 15, 2024",
      image: "/natural-lavender-skin-care-products-arrangement-free-photo.jpg",
      comments: 8,
      tags: ["Lowest Rated"],
      tagColor: "bg-red-600",
    },
    {
      id: 3,
      title: "DUMMY FOG EXPERIMENT FOR THE TOP U.S. ARMY",
      date: "SEPTEMBER 15, 2024",
      image: "/set-care-beauty-products-skin-29817248.webp",
      comments: 3,
      tags: [],
      tagColor: "",
    },
    {
      id: 4,
      title: "GEORGE E. HORNE U.S. ARMY",
      date: "AUGUST 15, 2024",
      image: "/gettyimages-1488453249-612x612.jpg",
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
    <div className="military-blog">
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
          <div className="main-content">
            {blogPosts.map((post) => (
              <article key={post.id} className="blog-post">
                <div className="post-content">
                  <img src={post.image || "/placeholder.svg"} alt={post.title} className="post-image" />
                  <div className="post-details">
                    <div className="post-tags">
                      {post.tags.map((tag, index) => (
                        <span
                          key={index}
                          className={`tag ${post.tagColor === "bg-red-500" ? "tag-top-rated" : "tag-lowest-rated"}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="post-date">
                      <Calendar className="date-icon" />
                      {post.date}
                    </p>
                    <h2 className="post-title">{post.title}</h2>
                    <div className="post-footer">
                      <div className="post-comments">
                        <MessageCircle className="comment-icon" />
                        <span>{post.comments}</span>
                      </div>
                      <button className="read-more-btn">READ MORE</button>
                    </div>
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
