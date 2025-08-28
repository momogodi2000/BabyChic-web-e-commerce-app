import { useState, useEffect } from 'react'
import { Mic, MicOff, Volume2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const VoiceSearch = ({ onSearchResult, className = '' }) => {
  const { t } = useTranslation()
  const [isListening, setIsListening] = useState(false)
  const [recognition, setRecognition] = useState(null)
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    // Check if speech recognition is supported
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognitionInstance = new SpeechRecognition()
      
      recognitionInstance.continuous = false
      recognitionInstance.interimResults = false
      recognitionInstance.lang = 'fr-FR' // Default to French
      
      recognitionInstance.onstart = () => {
        setIsListening(true)
      }
      
      recognitionInstance.onresult = (event) => {
        const last = event.results.length - 1
        const text = event.results[last][0].transcript
        
        if (onSearchResult) {
          onSearchResult(text)
        }
        
        setIsListening(false)
      }
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
      }
      
      recognitionInstance.onend = () => {
        setIsListening(false)
      }
      
      setRecognition(recognitionInstance)
      setIsSupported(true)
    } else {
      setIsSupported(false)
    }
  }, [onSearchResult])

  const toggleListening = () => {
    if (!recognition) return

    if (isListening) {
      recognition.stop()
    } else {
      recognition.start()
    }
  }

  if (!isSupported) {
    return null // Don't render if not supported
  }

  return (
    <button
      onClick={toggleListening}
      className={`p-2 rounded-lg transition-all duration-200 ${
        isListening 
          ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
          : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300'
      } ${className}`}
      title={isListening ? 'Arrêter l\'écoute' : 'Recherche vocale'}
      aria-label={isListening ? 'Arrêter la recherche vocale' : 'Démarrer la recherche vocale'}
    >
      {isListening ? (
        <MicOff size={18} />
      ) : (
        <Mic size={18} />
      )}
    </button>
  )
}

export default VoiceSearch
