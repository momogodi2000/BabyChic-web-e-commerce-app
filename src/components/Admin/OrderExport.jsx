import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Download, 
  FileText, 
  FileSpreadsheet, 
  Calendar,
  Filter,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import api from '../../services/api';

const OrderExport = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [exportSettings, setExportSettings] = useState({
    format: 'csv',
    dateRange: 'all',
    startDate: '',
    endDate: '',
    status: 'all',
    includeCustomerInfo: true,
    includeProductInfo: true,
    includeShippingInfo: true,
    includePaymentInfo: true
  });
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState(null);

  const handleSettingChange = (key, value) => {
    setExportSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const validateSettings = () => {
    if (exportSettings.dateRange === 'custom') {
      if (!exportSettings.startDate || !exportSettings.endDate) {
        setExportStatus({
          success: false,
          message: t('admin.export.pleaseSelectDateRange')
        });
        return false;
      }
      if (new Date(exportSettings.startDate) > new Date(exportSettings.endDate)) {
        setExportStatus({
          success: false,
          message: t('admin.export.invalidDateRange')
        });
        return false;
      }
    }
    return true;
  };

  const handleExport = async () => {
    if (!validateSettings()) return;

    setIsExporting(true);
    setExportStatus(null);

    try {
      const response = await api.post('/admin/orders/export', exportSettings, {
        responseType: 'blob'
      });

      // Create blob URL and download
      const blob = new Blob([response.data], {
        type: exportSettings.format === 'csv' ? 'text/csv' : 'application/pdf'
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `orders_export_${timestamp}.${exportSettings.format}`;
      link.setAttribute('download', filename);
      
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setExportStatus({
        success: true,
        message: t('admin.export.exportSuccess')
      });

      // Close dialog after successful export
      setTimeout(() => {
        onClose();
        setExportStatus(null);
      }, 2000);

    } catch (error) {
      console.error('Export error:', error);
      setExportStatus({
        success: false,
        message: error.response?.data?.message || t('admin.export.exportError')
      });
    } finally {
      setIsExporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-90vh overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {t('admin.export.exportOrders')}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Export Format */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {t('admin.export.format')}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleSettingChange('format', 'csv')}
                className={`flex items-center justify-center p-4 border rounded-lg transition-colors ${
                  exportSettings.format === 'csv'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <FileSpreadsheet className="h-5 w-5 mr-2" />
                CSV
              </button>
              <button
                onClick={() => handleSettingChange('format', 'pdf')}
                className={`flex items-center justify-center p-4 border rounded-lg transition-colors ${
                  exportSettings.format === 'pdf'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <FileText className="h-5 w-5 mr-2" />
                PDF
              </button>
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {t('admin.export.dateRange')}
            </label>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <button
                onClick={() => handleSettingChange('dateRange', 'all')}
                className={`flex items-center justify-center p-3 border rounded-lg transition-colors ${
                  exportSettings.dateRange === 'all'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {t('admin.export.allTime')}
              </button>
              <button
                onClick={() => handleSettingChange('dateRange', 'custom')}
                className={`flex items-center justify-center p-3 border rounded-lg transition-colors ${
                  exportSettings.dateRange === 'custom'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Calendar className="h-4 w-4 mr-2" />
                {t('admin.export.customRange')}
              </button>
            </div>

            {exportSettings.dateRange === 'custom' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    {t('admin.export.startDate')}
                  </label>
                  <input
                    type="date"
                    value={exportSettings.startDate}
                    onChange={(e) => handleSettingChange('startDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    {t('admin.export.endDate')}
                  </label>
                  <input
                    type="date"
                    value={exportSettings.endDate}
                    onChange={(e) => handleSettingChange('endDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Order Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {t('admin.export.orderStatus')}
            </label>
            <select
              value={exportSettings.status}
              onChange={(e) => handleSettingChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">{t('admin.export.allStatuses')}</option>
              <option value="pending">{t('admin.orders.status.pending')}</option>
              <option value="confirmed">{t('admin.orders.status.confirmed')}</option>
              <option value="processing">{t('admin.orders.status.processing')}</option>
              <option value="shipped">{t('admin.orders.status.shipped')}</option>
              <option value="delivered">{t('admin.orders.status.delivered')}</option>
              <option value="cancelled">{t('admin.orders.status.cancelled')}</option>
            </select>
          </div>

          {/* Data Inclusion Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {t('admin.export.includeData')}
            </label>
            <div className="space-y-2">
              {[
                { key: 'includeCustomerInfo', label: t('admin.export.customerInfo') },
                { key: 'includeProductInfo', label: t('admin.export.productInfo') },
                { key: 'includeShippingInfo', label: t('admin.export.shippingInfo') },
                { key: 'includePaymentInfo', label: t('admin.export.paymentInfo') }
              ].map((option) => (
                <label key={option.key} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={exportSettings[option.key]}
                    onChange={(e) => handleSettingChange(option.key, e.target.checked)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Status Message */}
          {exportStatus && (
            <div className={`flex items-center p-3 rounded-lg ${
              exportStatus.success 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              {exportStatus.success ? (
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              )}
              <span className={`text-sm ${
                exportStatus.success ? 'text-green-700' : 'text-red-700'
              }`}>
                {exportStatus.message}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 p-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {t('admin.common.cancel')}
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            {isExporting ? (
              <>
                <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {t('admin.export.exporting')}
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                {t('admin.export.export')}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderExport;