// S3 Upload Configuration
export const uploadConfig = {
  endpoint: 'http://localhost:8000/upload-photos',
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedFileTypes: ['jpg', 'jpeg', 'png', 'webp'],
  
  // Upload settings
  settings: {
    folder: "property-photos",
    category: "property_listing",
    
    // File validation
    maxFiles: 20, // Maximum number of files per property
    
    // Image optimization settings (if your backend supports it)
    imageQuality: 80,
    maxImageWidth: 1920,
    maxImageHeight: 1080
  }
};

// Helper function to validate file before upload
export const validateFile = (file) => {
  const { maxFileSize, allowedFileTypes } = uploadConfig;
  
  // Check file size
  if (file.size > maxFileSize) {
    return {
      isValid: false,
      error: `File size must be less than ${maxFileSize / 1024 / 1024}MB`
    };
  }
  
  // Check file type
  const fileExtension = file.name.split('.').pop().toLowerCase();
  if (!allowedFileTypes.includes(fileExtension)) {
    return {
      isValid: false,
      error: `File type must be one of: ${allowedFileTypes.join(', ')}`
    };
  }
  
  return { isValid: true };
};

// Helper function to format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

// Helper function to generate thumbnail URL (if your S3 setup supports it)
export const getThumbnailUrl = (originalUrl, width = 300, height = 200) => {
  // If your backend generates thumbnails, modify this function accordingly
  // For now, we'll return the original URL
  return originalUrl;
}; 