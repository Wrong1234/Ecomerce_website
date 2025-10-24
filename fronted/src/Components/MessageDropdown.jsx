import { useRef, useEffect } from "react"
import { Edit2, Trash2, X, Forward } from "lucide-react"

const MessageDropdown = ({ message, onEdit, onDelete, onRemove, onForward, onClose, position }) => {
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [onClose])

  const handleEdit = () => {
    onEdit(message)
    onClose()
  }

  const handleDelete = () => {
    onDelete(message)
    onClose()
  }

  const handleRemove = () => {
    onRemove(message)
    onClose()
  }

  const handleForward = () => {
    onForward(message)
    onClose()
  }

  return (
    <div
      ref={dropdownRef}
      className="absolute z-50 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[160px]"
      style={{
        top: position.top,
        left: position.left,
        right: position.right,
      }}
    >
      {/* Edit Option */}
      <button
        onClick={handleEdit}
        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-100 transition-colors text-left text-sm text-gray-700"
      >
        <Edit2 className="w-4 h-4 text-blue-600" />
        <span>Edit</span>
      </button>

      {/* Delete Option */}
      <button
        onClick={handleDelete}
        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-100 transition-colors text-left text-sm text-gray-700"
      >
        <Trash2 className="w-4 h-4 text-red-600" />
        <span>Remove</span>
      </button>

      {/* Remove Option */}
      <button
        onClick={handleRemove}
        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-100 transition-colors text-left text-sm text-gray-700"
      >
        <X className="w-4 h-4 text-orange-600" />
        <span>Reply</span>
      </button>

      {/* Forward Option */}
      <button
        onClick={handleForward}
        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-100 transition-colors text-left text-sm text-gray-700"
      >
        <Forward className="w-4 h-4 text-green-600" />
        <span>Forward</span>
      </button>
    </div>
  )
}

export default MessageDropdown
