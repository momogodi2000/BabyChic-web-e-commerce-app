import { useState, useEffect } from 'react'
import { 
  Settings, 
  Globe, 
  Palette, 
  Bell, 
  Shield,
  Mail,
  Phone,
  MapPin,
  Store,
  DollarSign,
  Truck,
  CreditCard,
  Upload,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  Info,
  Camera,
  Monitor,
  Smartphone,
  Tablet
} from 'lucide-react'
import { settingsAPI } from '../../services/api'
import { useNotification } from '../../hooks/useNotification'

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('general') // general, appearance, notifications, payment, shipping, security
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const { showNotification } = useNotification()

  const [settings, setSettings] = useState({
    // General Settings
    siteName: 'BabyChic',
    siteDescription: 'Mode & Tendance pour toute la famille',
    contactEmail: 'contact@babychic.cm',
    supportEmail: 'support@babychic.cm',
    phone: '+237 6XX XXX XXX',
    address: 'Quartier Emana, Yaoundé, Cameroun',
    businessHours: 'Lun-Sam: 8h-18h',
    currency: 'XAF',
    language: 'fr',
    timezone: 'Africa/Douala',
    maintenanceMode: false,
    
    // Appearance Settings
    primaryColor: '#3B82F6',
    secondaryColor: '#10B981',
    logo: '',
    favicon: '',
    customCss: '',
    theme: 'light', // light, dark, auto
    fontFamily: 'Inter',
    
    // Notification Settings
    emailNotifications: {
      newOrder: true,
      lowStock: true,
      newMessage: true,
      systemAlerts: true
    },
    smsNotifications: {
      newOrder: false,
      paymentConfirmed: true,
      orderShipped: true
    },
    
    // Payment Settings
    freeShippingThreshold: 25000,
    deliveryFee: 2500,
    taxRate: 0,
    paymentMethods: {
      mtnMomo: true,
      orangeMoney: true,
      cash: true,
      whatsapp: true
    },
    
    // Shipping Settings
    shippingZones: [
      { name: 'Yaoundé', fee: 0, freeThreshold: 25000 },
      { name: 'Douala', fee: 5000, freeThreshold: 50000 }
    ],
    
    // Security Settings
    sessionTimeout: 30, // minutes
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireNumbers: true,
      requireSymbols: false
    },
    twoFactorAuth: false,
    loginAttempts: 5,
    autoBackup: true,
    
    // SEO Settings
    metaTitle: 'BabyChic - Mode & Tendance pour toute la famille',
    metaDescription: 'Découvrez notre collection de vêtements pour enfants et femmes au Cameroun',
    metaKeywords: 'vêtements enfants, mode femme, babychic, cameroun',
    googleAnalytics: '',
    facebookPixel: '',
    
    // Social Media
    socialMedia: {
      facebook: '',
      instagram: '',
      twitter: '',
      whatsapp: '+237 6XX XXX XXX',
      youtube: ''
    }
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setIsLoading(true)
      const response = await settingsAPI.getAll()
      setSettings({ ...settings, ...response.data })
    } catch (error) {
      console.error('Error fetching settings:', error)
      showNotification('Erreur lors du chargement des paramètres', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSettingChange = (category, key, value) => {
    if (category) {
      setSettings({
        ...settings,
        [category]: {
          ...settings[category],
          [key]: value
        }
      })
    } else {
      setSettings({
        ...settings,
        [key]: value
      })
    }
  }

  const handleSave = async (category = null) => {
    try {
      setIsSaving(true)
      
      if (category) {
        await settingsAPI.updateCategory(category, settings[category])
        showNotification(`Paramètres ${category} sauvegardés`, 'success')
      } else {
        await settingsAPI.updateAll(settings)
        showNotification('Tous les paramètres sauvegardés', 'success')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      showNotification('Erreur lors de la sauvegarde', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const handleFileUpload = async (file, type) => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', type)
      
      const response = await settingsAPI.uploadFile(formData)
      
      if (type === 'logo') {
        setSettings({ ...settings, logo: response.data.url })
      } else if (type === 'favicon') {
        setSettings({ ...settings, favicon: response.data.url })
      }
      
      showNotification(`${type} téléchargé avec succès`, 'success')
    } catch (error) {
      console.error('Error uploading file:', error)
      showNotification('Erreur lors du téléchargement', 'error')
    }
  }

  const resetToDefaults = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir réinitialiser tous les paramètres ?')) {
      try {
        await settingsAPI.resetToDefaults()
        await fetchSettings()
        showNotification('Paramètres réinitialisés', 'success')
      } catch (error) {
        console.error('Error resetting settings:', error)
        showNotification('Erreur lors de la réinitialisation', 'error')
      }
    }
  }

  const tabs = [
    { id: 'general', name: 'Général', icon: Settings },
    { id: 'appearance', name: 'Apparence', icon: Palette },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'payment', name: 'Paiements', icon: CreditCard },
    { id: 'shipping', name: 'Livraison', icon: Truck },
    { id: 'security', name: 'Sécurité', icon: Shield }
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des paramètres...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Paramètres Généraux</h1>
          <p className="text-gray-600 mt-2">Configurez votre application BabyChic</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={resetToDefaults}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <RefreshCw size={18} />
            <span>Réinitialiser</span>
          </button>
          <button
            onClick={() => handleSave()}
            disabled={isSaving}
            className="btn-primary flex items-center space-x-2"
          >
            <Save size={18} />
            <span>{isSaving ? 'Sauvegarde...' : 'Sauvegarder Tout'}</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64">
          <nav className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-50 text-primary-700 border-primary-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={18} />
                  <span className="font-medium">{tab.name}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Informations Générales</h3>
                  <p className="text-sm text-gray-600">Configurez les informations de base de votre boutique</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom du Site *
                    </label>
                    <input
                      type="text"
                      value={settings.siteName}
                      onChange={(e) => handleSettingChange(null, 'siteName', e.target.value)}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Devise *
                    </label>
                    <select
                      value={settings.currency}
                      onChange={(e) => handleSettingChange(null, 'currency', e.target.value)}
                      className="input-field"
                    >
                      <option value="XAF">Franc CFA (XAF)</option>
                      <option value="EUR">Euro (EUR)</option>
                      <option value="USD">Dollar US (USD)</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description du Site
                    </label>
                    <textarea
                      value={settings.siteDescription}
                      onChange={(e) => handleSettingChange(null, 'siteDescription', e.target.value)}
                      rows={3}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email de Contact *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                      <input
                        type="email"
                        value={settings.contactEmail}
                        onChange={(e) => handleSettingChange(null, 'contactEmail', e.target.value)}
                        className="input-field pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
                      <input
                        type="tel"
                        value={settings.phone}
                        onChange={(e) => handleSettingChange(null, 'phone', e.target.value)}
                        className="input-field pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adresse *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                      <input
                        type="text"
                        value={settings.address}
                        onChange={(e) => handleSettingChange(null, 'address', e.target.value)}
                        className="input-field pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Horaires d'Ouverture
                    </label>
                    <input
                      type="text"
                      value={settings.businessHours}
                      onChange={(e) => handleSettingChange(null, 'businessHours', e.target.value)}
                      className="input-field"
                      placeholder="Lun-Sam: 8h-18h"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fuseau Horaire
                    </label>
                    <select
                      value={settings.timezone}
                      onChange={(e) => handleSettingChange(null, 'timezone', e.target.value)}
                      className="input-field"
                    >
                      <option value="Africa/Douala">Afrique/Douala</option>
                      <option value="Europe/Paris">Europe/Paris</option>
                      <option value="America/New_York">Amérique/New York</option>
                    </select>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Mode Maintenance</h4>
                      <p className="text-sm text-gray-600">Désactive temporairement l'accès public au site</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.maintenanceMode}
                        onChange={(e) => handleSettingChange(null, 'maintenanceMode', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end pt-6">
                  <button
                    onClick={() => handleSave('general')}
                    disabled={isSaving}
                    className="btn-primary"
                  >
                    Sauvegarder les Paramètres Généraux
                  </button>
                </div>
              </div>
            )}

            {/* Appearance Settings */}
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Apparence & Branding</h3>
                  <p className="text-sm text-gray-600">Personnalisez l'apparence de votre boutique</p>
                </div>

                <div className="space-y-6">
                  {/* Logo Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Logo du Site
                    </label>
                    <div className="flex items-center space-x-4">
                      {settings.logo && (
                        <img src={settings.logo} alt="Logo" className="w-16 h-16 object-contain border border-gray-200 rounded" />
                      )}
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files[0]) {
                              handleFileUpload(e.target.files[0], 'logo')
                            }
                          }}
                          className="hidden"
                          id="logo-upload"
                        />
                        <label
                          htmlFor="logo-upload"
                          className="cursor-pointer bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                        >
                          <Upload size={16} />
                          <span>Télécharger un Logo</span>
                        </label>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG jusqu'à 2MB</p>
                      </div>
                    </div>
                  </div>

                  {/* Color Settings */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Couleur Primaire
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={settings.primaryColor}
                          onChange={(e) => handleSettingChange(null, 'primaryColor', e.target.value)}
                          className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={settings.primaryColor}
                          onChange={(e) => handleSettingChange(null, 'primaryColor', e.target.value)}
                          className="input-field"
                          placeholder="#3B82F6"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Couleur Secondaire
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={settings.secondaryColor}
                          onChange={(e) => handleSettingChange(null, 'secondaryColor', e.target.value)}
                          className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={settings.secondaryColor}
                          onChange={(e) => handleSettingChange(null, 'secondaryColor', e.target.value)}
                          className="input-field"
                          placeholder="#10B981"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Theme Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Thème
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { value: 'light', name: 'Clair', icon: Monitor },
                        { value: 'dark', name: 'Sombre', icon: Smartphone },
                        { value: 'auto', name: 'Automatique', icon: Tablet }
                      ].map((theme) => {
                        const Icon = theme.icon
                        return (
                          <label
                            key={theme.value}
                            className={`cursor-pointer border-2 rounded-lg p-4 text-center transition-colors ${
                              settings.theme === theme.value
                                ? 'border-primary-500 bg-primary-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <input
                              type="radio"
                              name="theme"
                              value={theme.value}
                              checked={settings.theme === theme.value}
                              onChange={(e) => handleSettingChange(null, 'theme', e.target.value)}
                              className="sr-only"
                            />
                            <Icon className="mx-auto mb-2 text-gray-600" size={24} />
                            <span className="text-sm font-medium text-gray-900">{theme.name}</span>
                          </label>
                        )
                      })}
                    </div>
                  </div>

                  {/* Custom CSS */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CSS Personnalisé
                    </label>
                    <textarea
                      value={settings.customCss}
                      onChange={(e) => handleSettingChange(null, 'customCss', e.target.value)}
                      rows={6}
                      className="input-field font-mono text-sm"
                      placeholder="/* Votre CSS personnalisé ici */"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Attention: Le CSS personnalisé peut affecter l'apparence du site
                    </p>
                  </div>
                </div>

                <div className="flex justify-end pt-6">
                  <button
                    onClick={() => handleSave('appearance')}
                    disabled={isSaving}
                    className="btn-primary"
                  >
                    Sauvegarder l'Apparence
                  </button>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Notifications</h3>
                  <p className="text-sm text-gray-600">Configurez les notifications par email et SMS</p>
                </div>

                <div className="space-y-6">
                  {/* Email Notifications */}
                  <div>
                    <h4 className="text-md font-semibold text-gray-900 mb-4">Notifications Email</h4>
                    <div className="space-y-4">
                      {Object.entries(settings.emailNotifications).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <div>
                            <h5 className="text-sm font-medium text-gray-900">
                              {key === 'newOrder' && 'Nouvelle commande'}
                              {key === 'lowStock' && 'Stock faible'}
                              {key === 'newMessage' && 'Nouveau message'}
                              {key === 'systemAlerts' && 'Alertes système'}
                            </h5>
                            <p className="text-sm text-gray-600">
                              {key === 'newOrder' && 'Recevoir un email pour chaque nouvelle commande'}
                              {key === 'lowStock' && 'Alerte quand un produit a un stock faible'}
                              {key === 'newMessage' && 'Notification pour les nouveaux messages clients'}
                              {key === 'systemAlerts' && 'Alertes importantes du système'}
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={(e) => handleSettingChange('emailNotifications', key, e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* SMS Notifications */}
                  <div>
                    <h4 className="text-md font-semibold text-gray-900 mb-4">Notifications SMS</h4>
                    <div className="space-y-4">
                      {Object.entries(settings.smsNotifications).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <div>
                            <h5 className="text-sm font-medium text-gray-900">
                              {key === 'newOrder' && 'Nouvelle commande'}
                              {key === 'paymentConfirmed' && 'Paiement confirmé'}
                              {key === 'orderShipped' && 'Commande expédiée'}
                            </h5>
                            <p className="text-sm text-gray-600">
                              {key === 'newOrder' && 'SMS pour chaque nouvelle commande'}
                              {key === 'paymentConfirmed' && 'Confirmation de paiement par SMS'}
                              {key === 'orderShipped' && 'Notification d\'expédition'}
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={(e) => handleSettingChange('smsNotifications', key, e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-6">
                  <button
                    onClick={() => handleSave('notifications')}
                    disabled={isSaving}
                    className="btn-primary"
                  >
                    Sauvegarder les Notifications
                  </button>
                </div>
              </div>
            )}

            {/* Payment Settings */}
            {activeTab === 'payment' && (
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Paramètres de Paiement</h3>
                  <p className="text-sm text-gray-600">Configurez les méthodes de paiement et frais</p>
                </div>

                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Seuil Livraison Gratuite (FCFA)
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 text-gray-400" size={18} />
                        <input
                          type="number"
                          value={settings.freeShippingThreshold}
                          onChange={(e) => handleSettingChange(null, 'freeShippingThreshold', parseInt(e.target.value))}
                          className="input-field pl-10"
                          min="0"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Frais de Livraison (FCFA)
                      </label>
                      <div className="relative">
                        <Truck className="absolute left-3 top-3 text-gray-400" size={18} />
                        <input
                          type="number"
                          value={settings.deliveryFee}
                          onChange={(e) => handleSettingChange(null, 'deliveryFee', parseInt(e.target.value))}
                          className="input-field pl-10"
                          min="0"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div>
                    <h4 className="text-md font-semibold text-gray-900 mb-4">Méthodes de Paiement</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      {Object.entries(settings.paymentMethods).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              key === 'mtnMomo' ? 'bg-yellow-100' :
                              key === 'orangeMoney' ? 'bg-orange-100' :
                              key === 'cash' ? 'bg-green-100' :
                              'bg-blue-100'
                            }`}>
                              <CreditCard className={`${
                                key === 'mtnMomo' ? 'text-yellow-600' :
                                key === 'orangeMoney' ? 'text-orange-600' :
                                key === 'cash' ? 'text-green-600' :
                                'text-blue-600'
                              }`} size={20} />
                            </div>
                            <span className="font-medium text-gray-900">
                              {key === 'mtnMomo' && 'MTN Mobile Money'}
                              {key === 'orangeMoney' && 'Orange Money'}
                              {key === 'cash' && 'Paiement à la livraison'}
                              {key === 'whatsapp' && 'WhatsApp Pay'}
                            </span>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={(e) => handleSettingChange('paymentMethods', key, e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-6">
                  <button
                    onClick={() => handleSave('payment')}
                    disabled={isSaving}
                    className="btn-primary"
                  >
                    Sauvegarder les Paiements
                  </button>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Paramètres de Sécurité</h3>
                  <p className="text-sm text-gray-600">Configurez la sécurité de votre application</p>
                </div>

                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Timeout Session (minutes)
                      </label>
                      <input
                        type="number"
                        value={settings.sessionTimeout}
                        onChange={(e) => handleSettingChange(null, 'sessionTimeout', parseInt(e.target.value))}
                        className="input-field"
                        min="5"
                        max="480"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tentatives de Connexion Max
                      </label>
                      <input
                        type="number"
                        value={settings.loginAttempts}
                        onChange={(e) => handleSettingChange(null, 'loginAttempts', parseInt(e.target.value))}
                        className="input-field"
                        min="3"
                        max="10"
                      />
                    </div>
                  </div>

                  {/* Password Policy */}
                  <div>
                    <h4 className="text-md font-semibold text-gray-900 mb-4">Politique de Mot de Passe</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Longueur Minimale
                        </label>
                        <input
                          type="number"
                          value={settings.passwordPolicy.minLength}
                          onChange={(e) => handleSettingChange('passwordPolicy', 'minLength', parseInt(e.target.value))}
                          className="input-field w-32"
                          min="6"
                          max="32"
                        />
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Majuscules requises</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.passwordPolicy.requireUppercase}
                              onChange={(e) => handleSettingChange('passwordPolicy', 'requireUppercase', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Chiffres requis</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.passwordPolicy.requireNumbers}
                              onChange={(e) => handleSettingChange('passwordPolicy', 'requireNumbers', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Symboles requis</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.passwordPolicy.requireSymbols}
                              onChange={(e) => handleSettingChange('passwordPolicy', 'requireSymbols', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Security Options */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="text-sm font-medium text-gray-900">Authentification à Deux Facteurs</h5>
                        <p className="text-sm text-gray-600">Sécurité renforcée pour les comptes administrateur</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.twoFactorAuth}
                          onChange={(e) => handleSettingChange(null, 'twoFactorAuth', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="text-sm font-medium text-gray-900">Sauvegarde Automatique</h5>
                        <p className="text-sm text-gray-600">Sauvegarde quotidienne des données importantes</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.autoBackup}
                          onChange={(e) => handleSettingChange(null, 'autoBackup', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-6">
                  <button
                    onClick={() => handleSave('security')}
                    disabled={isSaving}
                    className="btn-primary"
                  >
                    Sauvegarder la Sécurité
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminSettings