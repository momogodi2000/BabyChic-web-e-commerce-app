import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { useTranslation } from 'react-i18next'

const ThemeSwitch = ({ className = '' }) => {
  const { theme, toggleTheme, isDark } = useTheme()
  const { t } = useTranslation()

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 ${className}`}
      title={isDark ? t('theme.light') : t('theme.dark')}
      aria-label={t('theme.toggle')}
    >
      {isDark ? (
        <Sun size={18} className="transition-transform duration-300 rotate-0 hover:rotate-12" />
      ) : (
        <Moon size={18} className="transition-transform duration-300 rotate-0 hover:-rotate-12" />
      )}
    </button>
  )
}

export default ThemeSwitch
