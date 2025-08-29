import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Upload, 
  Download, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  X,
  Info
} from 'lucide-react';
import api from '../../services/api';

const AdminBulkUpload = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('upload');
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadResults, setUploadResults] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Sample CSV template
  const csvTemplate = `name,description,price,category,subcategory,brand,stock_quantity,sku,weight,dimensions,colors,sizes,images,is_featured,is_active
"Robe d'été pour bébé","Belle robe d'été en coton bio",15000,"Bébé","Vêtements","BabyChic",25,"RC001",0.2,"30x20x2","Rose;Bleu;Blanc","6M;12M;18M","image1.jpg;image2.jpg",false,true
"T-shirt enfant unisexe","T-shirt confortable pour enfants",8000,"Enfant","Vêtements","BabyChic",50,"TC002",0.15,"35x25x1","Rouge;Vert;Jaune","2A;3A;4A;5A","tshirt1.jpg",true,true`;

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/csv') {
      setUploadFile(file);
      setUploadResults(null);
    } else {
      alert(t('admin.bulkUpload.invalidFileType'));
    }
  };

  const downloadTemplate = () => {
    const blob = new Blob([csvTemplate], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'product_template.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleBulkUpload = async () => {
    if (!uploadFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('csvFile', uploadFile);

    try {
      const response = await api.post('/admin/products/bulk-upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });

      setUploadResults(response.data);
    } catch (error) {
      console.error('Bulk upload error:', error);
      setUploadResults({
        success: false,
        message: error.response?.data?.message || t('admin.bulkUpload.uploadError'),
        errors: error.response?.data?.errors || []
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const renderUploadTab = () => (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <Info className="h-5 w-5 text-blue-400 mt-0.5 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-blue-800 mb-2">
              {t('admin.bulkUpload.instructions')}
            </h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• {t('admin.bulkUpload.instruction1')}</li>
              <li>• {t('admin.bulkUpload.instruction2')}</li>
              <li>• {t('admin.bulkUpload.instruction3')}</li>
              <li>• {t('admin.bulkUpload.instruction4')}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Template Download */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-4">{t('admin.bulkUpload.downloadTemplate')}</h3>
        <p className="text-gray-600 mb-4">{t('admin.bulkUpload.templateDescription')}</p>
        <button
          onClick={downloadTemplate}
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Download className="h-4 w-4 mr-2" />
          {t('admin.bulkUpload.downloadCSV')}
        </button>
      </div>

      {/* File Upload */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-4">{t('admin.bulkUpload.uploadFile')}</h3>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          {uploadFile ? (
            <div className="space-y-2">
              <FileText className="h-12 w-12 text-green-500 mx-auto" />
              <p className="text-gray-900 font-medium">{uploadFile.name}</p>
              <p className="text-gray-500 text-sm">
                {(uploadFile.size / 1024).toFixed(2)} KB
              </p>
              <button
                onClick={() => setUploadFile(null)}
                className="text-red-600 hover:text-red-700 text-sm"
              >
                {t('admin.common.remove')}
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="h-12 w-12 text-gray-400 mx-auto" />
              <div>
                <label className="cursor-pointer">
                  <span className="text-blue-600 hover:text-blue-700 font-medium">
                    {t('admin.bulkUpload.selectFile')}
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept=".csv"
                    onChange={handleFileSelect}
                  />
                </label>
                <p className="text-gray-500 text-sm mt-1">
                  {t('admin.bulkUpload.csvOnly')}
                </p>
              </div>
            </div>
          )}
        </div>

        {uploadFile && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={handleBulkUpload}
              disabled={isUploading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isUploading ? (
                <>
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {t('admin.bulkUpload.uploading')} ({uploadProgress}%)
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2 inline" />
                  {t('admin.bulkUpload.startUpload')}
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Upload Results */}
      {uploadResults && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">{t('admin.bulkUpload.results')}</h3>
          
          {uploadResults.success ? (
            <div className="space-y-4">
              <div className="flex items-center text-green-600">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span className="font-medium">{t('admin.bulkUpload.uploadSuccess')}</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-600">{t('admin.bulkUpload.successful')}</p>
                  <p className="text-2xl font-bold text-green-700">
                    {uploadResults.stats?.successful || 0}
                  </p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-sm text-red-600">{t('admin.bulkUpload.failed')}</p>
                  <p className="text-2xl font-bold text-red-700">
                    {uploadResults.stats?.failed || 0}
                  </p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm text-yellow-600">{t('admin.bulkUpload.skipped')}</p>
                  <p className="text-2xl font-bold text-yellow-700">
                    {uploadResults.stats?.skipped || 0}
                  </p>
                </div>
              </div>

              {uploadResults.errors && uploadResults.errors.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium text-red-600 mb-2">{t('admin.bulkUpload.errors')}:</h4>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {uploadResults.errors.map((error, index) => (
                      <div key={index} className="text-sm text-red-600 bg-red-50 p-2 rounded">
                        <strong>{t('admin.bulkUpload.row')} {error.row}:</strong> {error.message}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center text-red-600">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span className="font-medium">{t('admin.bulkUpload.uploadFailed')}</span>
              </div>
              <p className="text-gray-600">{uploadResults.message}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderHistoryTab = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium mb-4">{t('admin.bulkUpload.uploadHistory')}</h3>
      <p className="text-gray-500 text-center py-8">
        {t('admin.bulkUpload.historyComingSoon')}
      </p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t('admin.bulkUpload.title')}
        </h1>
        <p className="text-gray-600">
          {t('admin.bulkUpload.subtitle')}
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('upload')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'upload'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {t('admin.bulkUpload.upload')}
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'history'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {t('admin.bulkUpload.history')}
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'upload' && renderUploadTab()}
      {activeTab === 'history' && renderHistoryTab()}
    </div>
  );
};

export default AdminBulkUpload;