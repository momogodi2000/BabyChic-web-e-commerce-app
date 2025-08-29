import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Download, 
  Smartphone, 
  Monitor, 
  Wifi, 
  WifiOff, 
  X,
  Check,
  Star
} from 'lucide-react';

const PWAInstallModal = () => {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showOfflineNotice, setShowOfflineNotice] = useState(false);

  useEffect(() => {
    // Check if PWA is already installed
    const checkIfInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isWebApp = window.navigator.standalone;
      setIsInstalled(isStandalone || isWebApp);
    };

    checkIfInstalled();

    // Listen for PWA install prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Show install modal if not dismissed before
      const isDismissed = localStorage.getItem('pwa-install-dismissed');
      if (!isDismissed && !isInstalled) {
        setTimeout(() => setShowModal(true), 3000); // Show after 3 seconds
      }
    };

    // Listen for successful installation
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowModal(false);
      localStorage.removeItem('pwa-install-dismissed');
    };

    // Listen for online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineNotice(true);
      setTimeout(() => setShowOfflineNotice(false), 5000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isInstalled]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowModal(false);
    }
    
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowModal(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  const handleRemindLater = () => {
    setShowModal(false);
    // Show again after 24 hours
    const remindTime = Date.now() + (24 * 60 * 60 * 1000);
    localStorage.setItem('pwa-install-remind', remindTime.toString());
  };

  if (isInstalled) return null;

  return (
    <>
      {/* Install Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white p-6 text-center">
              <div className="mx-auto w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-4">
                <Download className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-bold mb-2">
                {t('pwa.install.title')}
              </h2>
              <p className="text-white text-opacity-90 text-sm">
                {t('pwa.install.subtitle')}
              </p>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="space-y-4 mb-6">
                <div className="flex items-start space-x-3">
                  <div className="bg-green-100 rounded-full p-2 mt-1">
                    <Wifi className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {t('pwa.features.offline')}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {t('pwa.features.offlineDesc')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 rounded-full p-2 mt-1">
                    <Smartphone className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {t('pwa.features.fast')}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {t('pwa.features.fastDesc')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-purple-100 rounded-full p-2 mt-1">
                    <Star className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {t('pwa.features.native')}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {t('pwa.features.nativeDesc')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                {deferredPrompt ? (
                  <button
                    onClick={handleInstall}
                    className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-3 px-4 rounded-lg font-medium hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <Download className="h-5 w-5" />
                    <span>{t('pwa.install.button')}</span>
                  </button>
                ) : (
                  <div className="text-center py-3">
                    <p className="text-sm text-gray-600">
                      {t('pwa.install.manual')}
                    </p>
                  </div>
                )}

                <div className="flex space-x-3">
                  <button
                    onClick={handleRemindLater}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                  >
                    {t('pwa.install.later')}
                  </button>
                  <button
                    onClick={handleDismiss}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                  >
                    {t('pwa.install.dismiss')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Offline Notice */}
      {showOfflineNotice && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm bg-orange-500 text-white p-4 rounded-lg shadow-lg z-50">
          <div className="flex items-center space-x-3">
            <WifiOff className="h-5 w-5" />
            <div>
              <p className="font-medium text-sm">
                {t('pwa.offline.title')}
              </p>
              <p className="text-xs opacity-90">
                {t('pwa.offline.message')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Online/Offline Status Indicator */}
      <div className="fixed top-4 right-4 z-40">
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${
          isOnline 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {isOnline ? (
            <>
              <Wifi className="h-3 w-3" />
              <span>{t('pwa.status.online')}</span>
            </>
          ) : (
            <>
              <WifiOff className="h-3 w-3" />
              <span>{t('pwa.status.offline')}</span>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default PWAInstallModal;