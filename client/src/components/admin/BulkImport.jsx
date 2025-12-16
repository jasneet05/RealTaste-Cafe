import { useState } from 'react';
import { Upload, Download, FileText, AlertCircle } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import api from '../../utils/api';

const BulkImport = ({ type, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const toast = useToast();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/json') {
      setFile(selectedFile);
      setErrors([]);
    } else {
      toast.error('Please select a valid JSON file');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file first');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post(`/api/bulk/${type}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setFile(null);
        setErrors(response.data.errors || []);
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    const templates = {
      products: JSON.stringify([
        {
          "name": "Burger",
          "description": "Delicious beef burger",
          "price": 299,
          "category": "category_id_here",
          "stock": 50,
          "image": "burger.jpg",
          "isAvailable": true
        },
        {
          "name": "Coffee",
          "description": "Hot coffee",
          "price": 99,
          "category": "category_id_here",
          "stock": 100,
          "image": "coffee.jpg",
          "isAvailable": true
        }
      ], null, 2),
      categories: JSON.stringify([
        {
          "name": "Fast Food",
          "description": "Quick and tasty food items",
          "isActive": true
        },
        {
          "name": "Beverages",
          "description": "Hot and cold drinks",
          "isActive": true
        }
      ], null, 2)
    };

    const content = templates[type];
    const blob = new Blob([content], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}_template.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl card-spacing border-2 border-amber-200">
      <h3 className="text-xl font-serif font-bold text-amber-900 mb-6 flex items-center">
        <Upload className="h-6 w-6 mr-3" />
        Bulk Import {type === 'products' ? 'Products' : 'Categories'}
      </h3>

      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900">JSON Format Required</h4>
              <p className="text-blue-700 text-sm mt-1">
                Upload a JSON file with an array of objects. Download the template below for reference.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={downloadTemplate}
            className="flex items-center justify-center space-x-2 px-4 py-2 border border-amber-300 text-amber-700 rounded-lg hover:bg-amber-50 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Download Template</span>
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select JSON File
          </label>
          <input
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          {file && (
            <p className="text-sm text-green-600 mt-2">
              Selected: {file.name}
            </p>
          )}
        </div>

        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="w-full bg-amber-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-amber-700 disabled:opacity-50 transition-colors flex items-center justify-center space-x-2"
        >
          <Upload className="h-5 w-5" />
          <span>{loading ? 'Uploading...' : 'Upload & Import'}</span>
        </button>

        {errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-900">Import Errors</h4>
                <ul className="text-red-700 text-sm mt-2 space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BulkImport;