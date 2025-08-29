import { useState, useEffect } from 'react'
import { 
  MessageSquare, 
  Mail, 
  Send, 
  Reply, 
  Archive, 
  Trash2,
  Search, 
  Filter,
  Calendar,
  User,
  Phone,
  Tag,
  Star,
  StarOff,
  Eye,
  EyeOff,
  Download,
  RefreshCw,
  Plus,
  Settings,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { contactAPI, newsletterAPI } from '../../services/api'
import { useNotification } from '../../hooks/useNotification'

const AdminContact = () => {
  const [activeTab, setActiveTab] = useState('messages') // messages, newsletter, campaigns
  const [messages, setMessages] = useState([])
  const [newsletters, setNewsletters] = useState([])
  const [campaigns, setCampaigns] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedMessages, setSelectedMessages] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [tagFilter, setTagFilter] = useState('')
  const [showReplyModal, setShowReplyModal] = useState(false)
  const [showCampaignModal, setShowCampaignModal] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const { showNotification } = useNotification()

  const [replyData, setReplyData] = useState({
    subject: '',
    message: '',
    template: ''
  })

  const [campaignData, setCampaignData] = useState({
    name: '',
    subject: '',
    content: '',
    template: 'newsletter',
    recipients: 'all', // all, active, segment
    scheduledDate: '',
    status: 'draft'
  })

  const messageStatuses = [
    { value: 'new', label: 'Nouveau', color: 'bg-blue-100 text-blue-800' },
    { value: 'read', label: 'Lu', color: 'bg-gray-100 text-gray-800' },
    { value: 'replied', label: 'Répondu', color: 'bg-green-100 text-green-800' },
    { value: 'archived', label: 'Archivé', color: 'bg-yellow-100 text-yellow-800' }
  ]

  const messageTags = [
    { value: 'general', label: 'Général', color: 'bg-gray-100 text-gray-800' },
    { value: 'support', label: 'Support', color: 'bg-blue-100 text-blue-800' },
    { value: 'complaint', label: 'Réclamation', color: 'bg-red-100 text-red-800' },
    { value: 'suggestion', label: 'Suggestion', color: 'bg-green-100 text-green-800' },
    { value: 'order', label: 'Commande', color: 'bg-purple-100 text-purple-800' }
  ]

  const emailTemplates = [
    { id: 'welcome', name: 'Message de bienvenue' },
    { id: 'promotion', name: 'Promotion spéciale' },
    { id: 'newsletter', name: 'Newsletter' },
    { id: 'support', name: 'Support client' },
    { id: 'feedback', name: 'Demande d\'avis' }
  ]

  useEffect(() => {
    fetchData()
  }, [activeTab, searchQuery, statusFilter, tagFilter, currentPage])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      
      if (activeTab === 'messages') {
        const params = {
          page: currentPage,
          limit: 20,
          search: searchQuery,
          status: statusFilter,
          tag: tagFilter
        }
        const response = await contactAPI.getAll(params)
        setMessages(response.data.messages || [])
      } else if (activeTab === 'newsletter') {
        const response = await newsletterAPI.getSubscribers()
        setNewsletters(response.data.subscribers || [])
      } else if (activeTab === 'campaigns') {
        const response = await newsletterAPI.getCampaigns()
        setCampaigns(response.data.campaigns || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      // Use mock data for demonstration
      if (activeTab === 'messages') {
        setMessages([
          {
            id: 1,
            name: 'Marie Dubois',
            email: 'marie.dubois@email.com',
            phone: '+237 6XX XXX XXX',
            subject: 'Question sur les tailles',
            message: 'Bonjour, j\'aimerais connaître le guide des tailles pour les vêtements enfants...',
            status: 'new',
            tag: 'support',
            created_at: '2024-01-15T10:30:00Z',
            starred: false
          },
          {
            id: 2,
            name: 'Jean Martin',
            email: 'jean.martin@email.com',
            phone: '+237 6XX XXX XXY',
            subject: 'Problème de livraison',
            message: 'Ma commande #12345 n\'est toujours pas arrivée...',
            status: 'replied',
            tag: 'complaint',
            created_at: '2024-01-14T09:15:00Z',
            starred: true
          }
        ])
      } else if (activeTab === 'newsletter') {
        setNewsletters([
          {
            id: 1,
            email: 'subscriber1@email.com',
            subscribed_at: '2024-01-10T08:00:00Z',
            status: 'active',
            source: 'website'
          },
          {
            id: 2,
            email: 'subscriber2@email.com',
            subscribed_at: '2024-01-09T14:30:00Z',
            status: 'active',
            source: 'checkout'
          }
        ])
      } else if (activeTab === 'campaigns') {
        setCampaigns([
          {
            id: 1,
            name: 'Campagne Janvier 2024',
            subject: 'Nouvelles collections disponibles !',
            recipients_count: 1250,
            sent_count: 1200,
            opened_count: 480,
            clicked_count: 96,
            status: 'sent',
            created_at: '2024-01-10T10:00:00Z',
            sent_at: '2024-01-10T15:00:00Z'
          }
        ])
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleMessageAction = async (messageId, action) => {
    try {
      switch (action) {
        case 'markRead':
          await contactAPI.updateStatus(messageId, { status: 'read' })
          showNotification('Message marqué comme lu', 'success')
          break
        case 'markUnread':
          await contactAPI.updateStatus(messageId, { status: 'new' })
          showNotification('Message marqué comme non lu', 'success')
          break
        case 'archive':
          await contactAPI.updateStatus(messageId, { status: 'archived' })
          showNotification('Message archivé', 'success')
          break
        case 'star':
          await contactAPI.toggleStar(messageId)
          showNotification('Message marqué', 'success')
          break
        case 'delete':
          if (window.confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
            await contactAPI.delete(messageId)
            showNotification('Message supprimé', 'success')
          }
          break
      }
      fetchData()
    } catch (error) {
      console.error('Error updating message:', error)
      showNotification('Erreur lors de la mise à jour', 'error')
    }
  }

  const handleBulkAction = async (action) => {
    if (selectedMessages.length === 0) {
      showNotification('Aucun message sélectionné', 'warning')
      return
    }

    try {
      switch (action) {
        case 'markRead':
          await contactAPI.bulkUpdate(selectedMessages, { status: 'read' })
          showNotification(`${selectedMessages.length} messages marqués comme lus`, 'success')
          break
        case 'archive':
          await contactAPI.bulkUpdate(selectedMessages, { status: 'archived' })
          showNotification(`${selectedMessages.length} messages archivés`, 'success')
          break
        case 'delete':
          if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedMessages.length} messages ?`)) {
            await contactAPI.bulkDelete(selectedMessages)
            showNotification(`${selectedMessages.length} messages supprimés`, 'success')
          }
          break
      }
      setSelectedMessages([])
      fetchData()
    } catch (error) {
      console.error('Error with bulk action:', error)
      showNotification('Erreur lors de l\'action groupée', 'error')
    }
  }

  const handleReply = async (e) => {
    e.preventDefault()
    try {
      await contactAPI.reply(selectedMessage.id, replyData)
      showNotification('Réponse envoyée avec succès', 'success')
      setShowReplyModal(false)
      setReplyData({ subject: '', message: '', template: '' })
      fetchData()
    } catch (error) {
      console.error('Error sending reply:', error)
      showNotification('Erreur lors de l\'envoi', 'error')
    }
  }

  const handleCampaignSubmit = async (e) => {
    e.preventDefault()
    try {
      await newsletterAPI.createCampaign(campaignData)
      showNotification('Campagne créée avec succès', 'success')
      setShowCampaignModal(false)
      setCampaignData({
        name: '',
        subject: '',
        content: '',
        template: 'newsletter',
        recipients: 'all',
        scheduledDate: '',
        status: 'draft'
      })
      fetchData()
    } catch (error) {
      console.error('Error creating campaign:', error)
      showNotification('Erreur lors de la création', 'error')
    }
  }

  const exportData = async (type) => {
    try {
      if (type === 'messages') {
        await contactAPI.exportMessages()
      } else if (type === 'subscribers') {
        await newsletterAPI.exportSubscribers()
      }
      showNotification('Export en cours...', 'success')
    } catch (error) {
      console.error('Error exporting data:', error)
      showNotification('Erreur lors de l\'export', 'error')
    }
  }

  const getStatusBadge = (status) => {
    const statusInfo = messageStatuses.find(s => s.value === status) || messageStatuses[0]
    return statusInfo
  }

  const getTagBadge = (tag) => {
    const tagInfo = messageTags.find(t => t.value === tag) || messageTags[0]
    return tagInfo
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contact & Newsletter</h1>
          <p className="text-gray-600 mt-2">Gérez les messages clients et campagnes email</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => exportData(activeTab === 'messages' ? 'messages' : 'subscribers')}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Download size={18} />
            <span>Exporter</span>
          </button>
          {activeTab === 'campaigns' && (
            <button
              onClick={() => setShowCampaignModal(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus size={18} />
              <span>Nouvelle Campagne</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('messages')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'messages'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <MessageSquare size={18} />
                <span>Messages Contact</span>
                <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs">
                  {messages.filter(m => m.status === 'new').length}
                </span>
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('newsletter')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'newsletter'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Mail size={18} />
                <span>Newsletter</span>
                <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs">
                  {newsletters.length}
                </span>
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('campaigns')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'campaigns'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Send size={18} />
                <span>Campagnes</span>
                <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs">
                  {campaigns.length}
                </span>
              </div>
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Total Messages</p>
                      <p className="text-2xl font-bold text-gray-900">{messages.length}</p>
                    </div>
                    <MessageSquare className="text-blue-600" size={24} />
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Nouveaux</p>
                      <p className="text-2xl font-bold text-red-600">
                        {messages.filter(m => m.status === 'new').length}
                      </p>
                    </div>
                    <AlertCircle className="text-red-600" size={24} />
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Traités</p>
                      <p className="text-2xl font-bold text-green-600">
                        {messages.filter(m => m.status === 'replied').length}
                      </p>
                    </div>
                    <CheckCircle className="text-green-600" size={24} />
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Temps Réponse Moyen</p>
                      <p className="text-2xl font-bold text-gray-900">2.4h</p>
                    </div>
                    <Clock className="text-orange-600" size={24} />
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div className="flex items-center space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Rechercher des messages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-field pl-10"
                  />
                </div>
                
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="input-field"
                >
                  <option value="">Tous les statuts</option>
                  {messageStatuses.map(status => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
                
                <select
                  value={tagFilter}
                  onChange={(e) => setTagFilter(e.target.value)}
                  className="input-field"
                >
                  <option value="">Tous les tags</option>
                  {messageTags.map(tag => (
                    <option key={tag.value} value={tag.value}>{tag.label}</option>
                  ))}
                </select>
              </div>

              {/* Bulk Actions */}
              {selectedMessages.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
                  <span className="text-blue-800 font-medium">
                    {selectedMessages.length} message(s) sélectionné(s)
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleBulkAction('markRead')}
                      className="text-blue-600 hover:bg-blue-100 px-3 py-1 rounded"
                    >
                      Marquer comme lu
                    </button>
                    <button
                      onClick={() => handleBulkAction('archive')}
                      className="text-blue-600 hover:bg-blue-100 px-3 py-1 rounded"
                    >
                      Archiver
                    </button>
                    <button
                      onClick={() => handleBulkAction('delete')}
                      className="text-red-600 hover:bg-red-100 px-3 py-1 rounded"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              )}

              {/* Messages List */}
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow ${
                      message.status === 'new' ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <input
                          type="checkbox"
                          checked={selectedMessages.includes(message.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedMessages([...selectedMessages, message.id])
                            } else {
                              setSelectedMessages(selectedMessages.filter(id => id !== message.id))
                            }
                          }}
                          className="mt-1"
                        />
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-gray-900">{message.name}</h3>
                            {message.starred && <Star className="text-yellow-500" size={16} />}
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(message.status).color}`}>
                              {getStatusBadge(message.status).label}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTagBadge(message.tag).color}`}>
                              {getTagBadge(message.tag).label}
                            </span>
                          </div>
                          
                          <div className="text-sm text-gray-600 mb-2">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-1">
                                <Mail size={14} />
                                <span>{message.email}</span>
                              </div>
                              {message.phone && (
                                <div className="flex items-center space-x-1">
                                  <Phone size={14} />
                                  <span>{message.phone}</span>
                                </div>
                              )}
                              <div className="flex items-center space-x-1">
                                <Calendar size={14} />
                                <span>{new Date(message.created_at).toLocaleDateString('fr-FR')}</span>
                              </div>
                            </div>
                          </div>
                          
                          <h4 className="font-medium text-gray-900 mb-1">{message.subject}</h4>
                          <p className="text-gray-600 text-sm line-clamp-2">{message.message}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleMessageAction(message.id, 'star')}
                          className="p-2 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                          title={message.starred ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                        >
                          {message.starred ? <Star size={16} /> : <StarOff size={16} />}
                        </button>
                        
                        <button
                          onClick={() => {
                            setSelectedMessage(message)
                            setReplyData({ 
                              subject: `Re: ${message.subject}`, 
                              message: `Bonjour ${message.name},\n\nMerci pour votre message.\n\n`, 
                              template: 'support' 
                            })
                            setShowReplyModal(true)
                          }}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Répondre"
                        >
                          <Reply size={16} />
                        </button>
                        
                        <button
                          onClick={() => handleMessageAction(message.id, message.status === 'new' ? 'markRead' : 'markUnread')}
                          className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title={message.status === 'new' ? 'Marquer comme lu' : 'Marquer comme non lu'}
                        >
                          {message.status === 'new' ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                        
                        <button
                          onClick={() => handleMessageAction(message.id, 'archive')}
                          className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                          title="Archiver"
                        >
                          <Archive size={16} />
                        </button>
                        
                        <button
                          onClick={() => handleMessageAction(message.id, 'delete')}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Newsletter Tab */}
          {activeTab === 'newsletter' && (
            <div className="space-y-6">
              {/* Newsletter Stats */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Total Abonnés</p>
                      <p className="text-2xl font-bold text-gray-900">{newsletters.length}</p>
                    </div>
                    <Users className="text-blue-600" size={24} />
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Actifs</p>
                      <p className="text-2xl font-bold text-green-600">
                        {newsletters.filter(n => n.status === 'active').length}
                      </p>
                    </div>
                    <CheckCircle className="text-green-600" size={24} />
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Croissance (30j)</p>
                      <p className="text-2xl font-bold text-purple-600">+12%</p>
                    </div>
                    <TrendingUp className="text-purple-600" size={24} />
                  </div>
                </div>
              </div>

              {/* Subscribers List */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Abonnés à la Newsletter</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-3 px-6 font-medium text-gray-700">Email</th>
                        <th className="text-left py-3 px-6 font-medium text-gray-700">Date d'inscription</th>
                        <th className="text-left py-3 px-6 font-medium text-gray-700">Source</th>
                        <th className="text-left py-3 px-6 font-medium text-gray-700">Statut</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {newsletters.map((subscriber) => (
                        <tr key={subscriber.id} className="hover:bg-gray-50">
                          <td className="py-4 px-6 text-gray-900">{subscriber.email}</td>
                          <td className="py-4 px-6 text-gray-600">
                            {new Date(subscriber.subscribed_at).toLocaleDateString('fr-FR')}
                          </td>
                          <td className="py-4 px-6">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              subscriber.source === 'website' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {subscriber.source === 'website' ? 'Site web' : 'Commande'}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              subscriber.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {subscriber.status === 'active' ? 'Actif' : 'Inactif'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Campaigns Tab */}
          {activeTab === 'campaigns' && (
            <div className="space-y-6">
              {/* Campaign Stats */}
              <div className="grid md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Campagnes Envoyées</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {campaigns.filter(c => c.status === 'sent').length}
                      </p>
                    </div>
                    <Send className="text-blue-600" size={24} />
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Taux d'Ouverture</p>
                      <p className="text-2xl font-bold text-green-600">40%</p>
                    </div>
                    <Eye className="text-green-600" size={24} />
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Taux de Clic</p>
                      <p className="text-2xl font-bold text-purple-600">8%</p>
                    </div>
                    <TrendingUp className="text-purple-600" size={24} />
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Emails Envoyés</p>
                      <p className="text-2xl font-bold text-orange-600">12,450</p>
                    </div>
                    <Mail className="text-orange-600" size={24} />
                  </div>
                </div>
              </div>

              {/* Campaigns List */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Campagnes Email</h3>
                </div>
                <div className="space-y-4 p-6">
                  {campaigns.map((campaign) => (
                    <div key={campaign.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{campaign.name}</h4>
                          <p className="text-sm text-gray-600">{campaign.subject}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          campaign.status === 'sent' 
                            ? 'bg-green-100 text-green-800' 
                            : campaign.status === 'draft'
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {campaign.status === 'sent' ? 'Envoyée' : 
                           campaign.status === 'draft' ? 'Brouillon' : 'Programmée'}
                        </span>
                      </div>
                      
                      <div className="grid md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Destinataires:</span>
                          <span className="ml-1 font-medium">{campaign.recipients_count?.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Envoyés:</span>
                          <span className="ml-1 font-medium">{campaign.sent_count?.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Ouverts:</span>
                          <span className="ml-1 font-medium">{campaign.opened_count?.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Clics:</span>
                          <span className="ml-1 font-medium">{campaign.clicked_count?.toLocaleString()}</span>
                        </div>
                      </div>
                      
                      <div className="mt-3 text-xs text-gray-500">
                        Créée le {new Date(campaign.created_at).toLocaleDateString('fr-FR')}
                        {campaign.sent_at && 
                          ` • Envoyée le ${new Date(campaign.sent_at).toLocaleDateString('fr-FR')}`
                        }
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reply Modal */}
      {showReplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Répondre au message</h3>
              <button
                onClick={() => setShowReplyModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleReply} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Template
                </label>
                <select
                  value={replyData.template}
                  onChange={(e) => setReplyData({...replyData, template: e.target.value})}
                  className="input-field"
                >
                  <option value="">Sélectionner un template</option>
                  {emailTemplates.map(template => (
                    <option key={template.id} value={template.id}>{template.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sujet *
                </label>
                <input
                  type="text"
                  value={replyData.subject}
                  onChange={(e) => setReplyData({...replyData, subject: e.target.value})}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  value={replyData.message}
                  onChange={(e) => setReplyData({...replyData, message: e.target.value})}
                  rows={6}
                  className="input-field"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowReplyModal(false)}
                  className="btn-outline"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn-primary flex items-center space-x-2"
                >
                  <Send size={16} />
                  <span>Envoyer</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Campaign Modal */}
      {showCampaignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Créer une campagne</h3>
              <button
                onClick={() => setShowCampaignModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCampaignSubmit} className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de la campagne *
                  </label>
                  <input
                    type="text"
                    value={campaignData.name}
                    onChange={(e) => setCampaignData({...campaignData, name: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Template
                  </label>
                  <select
                    value={campaignData.template}
                    onChange={(e) => setCampaignData({...campaignData, template: e.target.value})}
                    className="input-field"
                  >
                    {emailTemplates.map(template => (
                      <option key={template.id} value={template.id}>{template.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Objet de l'email *
                </label>
                <input
                  type="text"
                  value={campaignData.subject}
                  onChange={(e) => setCampaignData({...campaignData, subject: e.target.value})}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contenu *
                </label>
                <textarea
                  value={campaignData.content}
                  onChange={(e) => setCampaignData({...campaignData, content: e.target.value})}
                  rows={8}
                  className="input-field"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Destinataires
                  </label>
                  <select
                    value={campaignData.recipients}
                    onChange={(e) => setCampaignData({...campaignData, recipients: e.target.value})}
                    className="input-field"
                  >
                    <option value="all">Tous les abonnés</option>
                    <option value="active">Abonnés actifs</option>
                    <option value="recent">Récents (30 jours)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date programmée (optionnel)
                  </label>
                  <input
                    type="datetime-local"
                    value={campaignData.scheduledDate}
                    onChange={(e) => setCampaignData({...campaignData, scheduledDate: e.target.value})}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => setShowCampaignModal(false)}
                  className="btn-outline"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
                >
                  Sauvegarder en brouillon
                </button>
                <button
                  type="submit"
                  className="btn-primary flex items-center space-x-2"
                >
                  <Send size={16} />
                  <span>Programmer l'envoi</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminContact