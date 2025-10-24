import { useState, useRef, useEffect } from "react"
import { Trash2, Play, Pause, Send, Square } from "lucide-react"

export default function VoiceMessage({ receiverId, onClose }) {

  console.log("Receiver ID:", receiverId);
  
  const [recording, setRecording] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])
  const audioRef = useRef(null)
  const timerRef = useRef(null)
  const animationRef = useRef(null)

  const [waveformBars, setWaveformBars] = useState(
    Array(40)
      .fill(0)
      .map(() => Math.random() * 0.5 + 0.2),
  )

  useEffect(() => {
    if (recording) {
      const animate = () => {
        setWaveformBars((prev) => prev.map(() => Math.random() * 0.8 + 0.2))
        animationRef.current = requestAnimationFrame(animate)
      }
      animationRef.current = requestAnimationFrame(animate)
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [recording])

  useEffect(() => {
    if (recording) {
      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1)
      }, 1000)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [recording])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const handleEnded = () => setIsPlaying(false)

    audio.addEventListener("timeupdate", updateTime)
    audio.addEventListener("ended", handleEnded)

    return () => {
      audio.removeEventListener("timeupdate", updateTime)
      audio.removeEventListener("ended", handleEnded)
    }
  }, [previewUrl])

  useEffect(() => {
    startRecording()
  }, [])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mr = new MediaRecorder(stream)
      chunksRef.current = []

      mr.ondataavailable = (ev) => {
        if (ev.data && ev.data.size > 0) {
          chunksRef.current.push(ev.data)
        }
      }

      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: chunksRef.current[0]?.type || "audio/webm",
        })
        const url = URL.createObjectURL(blob)
        setPreviewUrl(url)
        mr._lastBlob = blob
        stream.getTracks().forEach((track) => track.stop())
      }

      mr.start()
      mediaRecorderRef.current = mr
      setRecording(true)
      setDuration(0)
    } catch (err) {
      console.error("Recording error:", err)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop()
    }
    setRecording(false)
  }

  const togglePlayPause = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const deleteRecording = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    setPreviewUrl(null)
    setDuration(0)
    setCurrentTime(0)
    chunksRef.current = []
    if (onClose) onClose()
  }

  const sendVoice = async () => {
    const mr = mediaRecorderRef.current
    let blob

    if (mr && mr._lastBlob) {
      blob = mr._lastBlob
    } else if (chunksRef.current.length) {
      blob = new Blob(chunksRef.current, {
        type: chunksRef.current[0]?.type || "audio/webm",
      })
    }

    if (!blob) return

    const clientId = `tmp-${Date.now()}-${Math.random()}`
    const filename = `${clientId}.webm`
    const file = new File([blob], filename, { type: blob.type })
 
    const formData = new FormData()
    formData.append("receiver_id", receiverId)
    formData.append("message", "")
    formData.append("client_id", clientId)
    formData.append("audio", file)

    setIsUploading(true)
    try {
      const res = await fetch("http://127.0.0.1:8000/api/messages", {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.message || "Upload failed")
      }
      deleteRecording()
    } catch (err) {
      console.error("Upload error:", err)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      {/* Delete Button */}
      <button
        onClick={deleteRecording}
        className="p-2 text-red-400 hover:text-red-300 transition-colors rounded-full hover:bg-red-500/10"
      >
        <Trash2 className="w-5 h-5" />
      </button>

      {/* Play/Pause or Recording Indicator */}
      {recording ? (
        <div className="flex items-center gap-2 px-2">
          <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
        </div>
      ) : previewUrl ? (
        <button
          onClick={togglePlayPause}
          className="p-2 text-red-500 hover:text-[#00a884] transition-colors rounded-full hover:bg-[#2a3942]"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
        </button>
      ) : null}

      {/* Timer */}
      <div className="text-[#8696a0] font-mono text-sm min-w-[45px]">
        {formatTime(previewUrl ? currentTime : duration)}
      </div>

      {/* Waveform Visualization */}
      <div className="flex items-center justify-center gap-[2px] h-8 flex-1 min-w-0 px-2">
        {waveformBars.map((height, i) => (
          <div
            key={i}
            className="w-[2px] rounded-full transition-all duration-150"
            style={{
              height: `${height * 100}%`,
              backgroundColor: recording ? "#00a884" : "#8696a0",
              opacity: recording ? 1 : 0.5,
            }}
          />
        ))}
      </div>

      {/* Stop Recording or Send Button */}
      {recording ? (
        <button
          onClick={stopRecording}
          className="p-2 text-green-500 hover:text-red-400 transition-colors rounded-full hover:bg-[#2a3942]"
        >
          <Square className="w-5 h-5 fill-current" />
        </button>
      ) : (
        <button
          onClick={sendVoice}
          disabled={isUploading}
          className="p-2 text-[#00a884] hover:text-[#06cf9c] transition-colors rounded-full hover:bg-[#2a3942] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5" />
        </button>
      )}

      {/* Hidden audio element for playback */}
      {previewUrl && <audio ref={audioRef} src={previewUrl} className="hidden" />}
    </div>
  )
}