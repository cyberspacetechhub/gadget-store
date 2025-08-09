const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Function to validate and configure Cloudinary
const configureCloudinary = () => {
    const requiredEnvVars = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
    const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

    if (missingEnvVars.length > 0) {
        console.error('Missing required Cloudinary environment variables:', missingEnvVars);
        throw new Error(`Missing Cloudinary configuration: ${missingEnvVars.join(', ')}`);
    }

    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    console.log('✅ Cloudinary configured with cloud name:', process.env.CLOUDINARY_CLOUD_NAME);
    return true;
};

// Test Cloudinary connection
const testCloudinaryConnection = async () => {
    try {
        // Configure Cloudinary first
        configureCloudinary();

        await cloudinary.api.ping();
        console.log('✅ Cloudinary connection successful');
        return true;
    } catch (error) {
        console.error('❌ Cloudinary connection failed:', error.message);
        return false;
    }
};

exports.uploadImage = async (filePath, folderName) => {
    try {
        console.log('📤 Starting image upload:', { filePath, folderName });

        // Configure Cloudinary (validates env vars)
        configureCloudinary();

        // Validate inputs
        if (!filePath) {
            throw new Error('File path is required');
        }

        if (!folderName) {
            throw new Error('Folder name is required');
        }

        // Check if file exists
        if (!fs.existsSync(filePath)) {
            throw new Error(`File does not exist: ${filePath}`);
        }

        // Get file stats
        const stats = fs.statSync(filePath);
        console.log('📊 File info:', {
            size: `${(stats.size / 1024 / 1024).toFixed(2)} MB`,
            path: filePath,
            folder: folderName
        });

        // Validate file size (max 10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (stats.size > maxSize) {
            throw new Error(`File too large: ${(stats.size / 1024 / 1024).toFixed(2)}MB. Maximum allowed: 10MB`);
        }

        // Upload to Cloudinary with enhanced options
        const uploadOptions = {
            folder: folderName,
            resource_type: 'image',
            transformation: [
                { width: 400, height: 400, crop: 'fill', gravity: 'face' },
                { quality: 'auto:good' },
                { format: 'auto' }
            ],
            use_filename: true,
            unique_filename: true,
            overwrite: false
        };

        console.log('🚀 Uploading to Cloudinary with options:', uploadOptions);

        const result = await cloudinary.uploader.upload(filePath, uploadOptions);

        console.log('✅ Upload successful:', {
            public_id: result.public_id,
            secure_url: result.secure_url,
            format: result.format,
            width: result.width,
            height: result.height,
            bytes: result.bytes
        });

        return result.secure_url;

    } catch (error) {
        console.error('❌ Cloudinary upload error:', {
            message: error.message,
            stack: error.stack,
            filePath,
            folderName
        });

        // Provide more specific error messages
        if (error.message.includes('Invalid image file')) {
            throw new Error(`Invalid image file: ${path.basename(filePath)}`);
        } else if (error.message.includes('File size too large')) {
            throw new Error(`File size too large. Maximum allowed: 10MB`);
        } else if (error.message.includes('Invalid API key')) {
            throw new Error('Cloudinary API configuration error. Please check your credentials.');
        } else if (error.message.includes('Network')) {
            throw new Error('Network error while uploading to Cloudinary. Please try again.');
        } else {
            throw new Error(`Cloudinary upload failed: ${error.message}`);
        }
    }
};

// Export test function for debugging
exports.testCloudinaryConnection = testCloudinaryConnection;
