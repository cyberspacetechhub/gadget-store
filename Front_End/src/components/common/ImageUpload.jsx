import { useState, useRef } from 'react';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';

const ImageUpload = ({ 
  label, 
  name, 
  multiple = false, 
  maxFiles = 10, 
  onFilesChange, 
  existingImages = [],
  required = false 
}) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    
    if (multiple && files.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }

    setSelectedFiles(files);
    
    // Create previews
    const newPreviews = files.map(file => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      uploading: true
    }));
    
    setPreviews(newPreviews);
    
    // Upload files immediately
    const uploadedUrls = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const formData = new FormData();
        formData.append(multiple ? 'images' : 'image', file);
        
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:3600/api/'}upload/${multiple ? 'multiple' : 'single'}`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            body: formData
          }
        );
        
        const result = await response.json();
        
        if (response.ok) {
          const imageUrl = multiple ? result.data.urls[0].url : result.data.url;
          uploadedUrls.push(imageUrl);
          
          // Update preview with uploaded URL
          setPreviews(prev => prev.map((preview, index) => 
            index === i ? { ...preview, uploadedUrl: imageUrl, uploading: false } : preview
          ));
        } else {
          console.error('Upload failed:', result.message);
          // Update preview to show error
          setPreviews(prev => prev.map((preview, index) => 
            index === i ? { ...preview, error: true, uploading: false } : preview
          ));
        }
      } catch (error) {
        console.error('Upload error:', error);
        setPreviews(prev => prev.map((preview, index) => 
          index === i ? { ...preview, error: true, uploading: false } : preview
        ));
      }
    }
    
    // Call parent callback with uploaded URLs
    if (onFilesChange) {
      onFilesChange(uploadedUrls);
    }
  };

  const removeFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    
    // Revoke URL to prevent memory leaks
    URL.revokeObjectURL(previews[index].url);
    
    setSelectedFiles(newFiles);
    setPreviews(newPreviews);
    
    if (onFilesChange) {
      onFilesChange(newFiles);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        name={name}
        multiple={multiple}
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        required={required && selectedFiles.length === 0 && existingImages.length === 0}
      />
      
      {/* Upload Area */}
      <div
        onClick={triggerFileInput}
        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
      >
        <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Click to upload {multiple ? 'images' : 'image'}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500">
          PNG, JPG, JPEG up to 5MB {multiple && `(max ${maxFiles} files)`}
        </p>
      </div>

      {/* Preview Grid */}
      {previews.length > 0 && (
        <div className={`grid gap-4 ${multiple ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1 max-w-xs'}`}>
          {previews.map((preview, index) => (
            <div key={index} className="relative group">
              <img
                src={preview.url}
                alt={preview.name}
                className={`w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-600 ${
                  preview.uploading ? 'opacity-50' : ''
                } ${preview.error ? 'border-red-500' : ''}`}
              />
              {preview.uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              {preview.error && (
                <div className="absolute inset-0 flex items-center justify-center bg-red-500 bg-opacity-75 rounded-lg">
                  <span className="text-white text-xs">Upload Failed</span>
                </div>
              )}
              {preview.uploadedUrl && (
                <div className="absolute top-2 left-2 bg-green-500 text-white rounded-full p-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
              <p className="mt-1 text-xs text-gray-500 truncate">{preview.name}</p>
            </div>
          ))}
        </div>
      )}

      {/* Existing Images */}
      {existingImages.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Images:</p>
          <div className={`grid gap-4 ${multiple ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1 max-w-xs'}`}>
            {existingImages.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image.url || image}
                  alt={image.alt || `Existing image ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;