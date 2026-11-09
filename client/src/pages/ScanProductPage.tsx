import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Upload, Sparkles, CheckCircle2, AlertCircle, RefreshCw, Layers, Calendar, Tag, MapPin } from 'lucide-react';
import { api, ScanResult } from '../services/api';
import { Toast } from '../components/Toast';

export const ScanProductPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Extracted post-OCR review state
  const [extractedData, setExtractedData] = useState<ScanResult | null>(null);
  const [formData, setFormData] = useState({
    productName: '',
    brand: '',
    category: 'FOOD',
    subcategory: 'Packaged Food',
    expiryDate: '',
    manufacturingDate: '',
    quantity: 1,
    unit: 'pcs',
    storageLocation: 'Refrigerator'
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  const steps = [
    'Analyzing Image Quality & Format',
    'Detecting Household Product Boundaries',
    'Executing Computer Vision OCR Text Extraction',
    'Parsing Date Signatures (EXP / MFG / Best Before)',
    'Running Category & Storage Location Classifier'
  ];

  const handleFileChange = (file: File) => {
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setExtractedData(null);
  };

  const startCamera = async () => {
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setToast({ message: 'Camera access denied or unavailable.', type: 'error' });
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
            handleFileChange(file);
            stopCamera();
          }
        }, 'image/jpeg');
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setIsCameraActive(false);
  };

  const runAiScan = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setCurrentStep(0);

    // Animate step progress
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < steps.length - 1) return prev + 1;
        clearInterval(stepInterval);
        return prev;
      });
    }, 600);

    try {
      const bodyFormData = new FormData();
      bodyFormData.append('image', selectedFile);

      const res = await api.post('/ai/scan-product', bodyFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        const data: ScanResult = res.data.data;
        setExtractedData(data);
        setFormData({
          productName: data.productName || 'Scanned Product',
          brand: data.brand || 'Generic',
          category: data.category || 'FOOD',
          subcategory: data.subcategory || 'General',
          expiryDate: data.expiryDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
          manufacturingDate: data.manufacturingDate || '',
          quantity: data.quantity || 1,
          unit: data.unit || 'pcs',
          storageLocation: data.recommendedLocation || 'Kitchen Cupboard'
        });
        setToast({ message: 'AI scan complete! Please review and confirm extracted details.', type: 'success' });
      }
    } catch (err: any) {
      setToast({ message: err.message || 'AI Scan processing failed.', type: 'error' });
    } finally {
      clearInterval(stepInterval);
      setIsProcessing(false);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/products', {
        ...formData,
        imageUrl: previewUrl || ''
      });

      if (res.data.success) {
        setToast({ message: 'Product saved to inventory!', type: 'success' });
        setTimeout(() => navigate('/inventory'), 800);
      }
    } catch (err: any) {
      setToast({ message: err.message || 'Error saving product.', type: 'error' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header Banner */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5">
          <Camera className="w-7 h-7 text-emerald-400" /> Scan Product & AI Detection
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          Capture or upload product packaging images. Our 7-Agent AI system will extract expiry dates and classify categories automatically.
        </p>
      </div>

      {!extractedData ? (
        /* SCAN / CAMERA INPUT SECTION */
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-gray-800 space-y-6">
          {/* Camera Viewfinder or Image Preview Box */}
          <div className="relative min-h-[300px] sm:min-h-[380px] rounded-2xl bg-gray-900 border-2 border-dashed border-gray-800 flex flex-col items-center justify-center overflow-hidden">
            {isCameraActive ? (
              <div className="relative w-full h-full flex flex-col items-center justify-center">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover rounded-2xl" />
                <canvas ref={canvasRef} className="hidden" />
                <div className="animate-scan" />
                
                <div className="absolute bottom-4 flex items-center gap-3">
                  <button
                    onClick={capturePhoto}
                    className="px-6 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm shadow-xl shadow-emerald-500/40"
                  >
                    📸 Capture Photo
                  </button>
                  <button
                    onClick={stopCamera}
                    className="px-4 py-2.5 rounded-full bg-gray-800 text-gray-300 font-semibold text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : previewUrl ? (
              <div className="relative w-full h-[360px] group">
                <img src={previewUrl} alt="Scan preview" className="w-full h-full object-contain rounded-2xl" />
                {isProcessing && <div className="animate-scan" />}
                <button
                  onClick={() => { setSelectedFile(null); setPreviewUrl(null); }}
                  className="absolute top-3 right-3 px-3 py-1.5 rounded-xl bg-black/70 text-white text-xs backdrop-blur-md"
                >
                  Change Image
                </button>
              </div>
            ) : (
              <div className="text-center p-8 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                  <Camera className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Upload or Capture Product Packaging</h3>
                  <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                    Supported formats: JPG, PNG, WEBP. Ensure dates (EXP/MFG) are clearly visible.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    onClick={startCamera}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-semibold text-sm border border-emerald-500/30 transition-all"
                  >
                    <Camera className="w-4 h-4" /> Open Camera
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files && e.target.files[0] && handleFileChange(e.target.files[0])}
                  />

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 font-semibold text-sm border border-gray-700 transition-all"
                  >
                    <Upload className="w-4 h-4" /> Upload Image
                  </button>
                </div>

                {/* 1-Click Sample Test Images */}
                <div className="pt-6 border-t border-gray-800/80 max-w-lg mx-auto">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Or Test With Sample Products:</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { name: 'Fresh Milk', fn: 'milk.jpg', img: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80' },
                      { name: 'Wheat Bread', fn: 'bread.jpg', img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80' },
                      { name: 'Paracetamol', fn: 'paracetamol.jpg', img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80' },
                      { name: 'Shampoo', fn: 'shampoo.jpg', img: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=400&q=80' }
                    ].map((sample, idx) => (
                      <button
                        key={idx}
                        onClick={async () => {
                          // Create sample mock file for instant OCR test
                          const response = await fetch(sample.img);
                          const blob = await response.blob();
                          const file = new File([blob], sample.fn, { type: 'image/jpeg' });
                          handleFileChange(file);
                        }}
                        className="p-2 rounded-xl glass-card border border-gray-800 hover:border-emerald-500/50 text-left transition-all group"
                      >
                        <img src={sample.img} alt="" className="w-full h-16 object-cover rounded-lg mb-1.5 group-hover:scale-105 transition-transform" />
                        <span className="text-[11px] font-bold text-gray-200 group-hover:text-emerald-400 block truncate">{sample.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Animated 5-Step Progress Indicator during processing */}
          {isProcessing && (
            <div className="space-y-3 p-4 rounded-2xl bg-gray-900/80 border border-emerald-500/30">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 animate-spin" /> Processing Product with 7-Agent AI...
              </h4>
              <div className="space-y-2">
                {steps.map((stepText, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs">
                    {idx < currentStep ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : idx === currentStep ? (
                      <RefreshCw className="w-4 h-4 text-amber-400 animate-spin shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-gray-700 shrink-0" />
                    )}
                    <span className={idx === currentStep ? 'text-white font-semibold' : idx < currentStep ? 'text-gray-300' : 'text-gray-500'}>
                      Step {idx + 1}: {stepText}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Run AI Analysis CTA */}
          {previewUrl && !isProcessing && (
            <button
              onClick={runAiScan}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 transition-all hover:scale-[1.01]"
            >
              <Sparkles className="w-4 h-4" /> Run AI Text & Expiry Extraction
            </button>
          )}
        </div>
      ) : (
        /* EDITABLE POST-OCR CONFIRMATION FORM */
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-gray-800 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-800 pb-4">
            <div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
                Confidence Score: {extractedData.confidenceScore}%
              </span>
              <h2 className="text-xl font-bold text-white mt-1">Confirm Extracted Product Details</h2>
            </div>
            <button
              onClick={() => setExtractedData(null)}
              className="px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold"
            >
              Re-scan Image
            </button>
          </div>

          <form onSubmit={handleSaveProduct} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Product Name</label>
              <input
                type="text"
                required
                value={formData.productName}
                onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                className="w-full glass-input rounded-xl px-3.5 py-2 text-sm text-gray-200 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Brand</label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full glass-input rounded-xl px-3.5 py-2 text-sm text-gray-200 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full glass-input rounded-xl px-3.5 py-2 text-sm text-gray-200 bg-gray-900 focus:outline-none"
              >
                <option value="FOOD">FOOD</option>
                <option value="MEDICINE">MEDICINE</option>
                <option value="PERSONAL CARE">PERSONAL CARE</option>
                <option value="SANITARY PRODUCTS">SANITARY PRODUCTS</option>
                <option value="CLEANING PRODUCTS">CLEANING PRODUCTS</option>
                <option value="GROCERIES">GROCERIES</option>
                <option value="BABY PRODUCTS">BABY PRODUCTS</option>
                <option value="OTHER">OTHER</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Expiry Date *</label>
              <input
                type="date"
                required
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                className="w-full glass-input rounded-xl px-3.5 py-2 text-sm text-gray-200 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Storage Location</label>
              <select
                value={formData.storageLocation}
                onChange={(e) => setFormData({ ...formData, storageLocation: e.target.value })}
                className="w-full glass-input rounded-xl px-3.5 py-2 text-sm text-gray-200 bg-gray-900 focus:outline-none"
              >
                <option value="Refrigerator">Refrigerator</option>
                <option value="Freezer">Freezer</option>
                <option value="Kitchen Cupboard">Kitchen Cupboard</option>
                <option value="Grocery Shelf">Grocery Shelf</option>
                <option value="Medicine Box">Medicine Box</option>
                <option value="Bathroom">Bathroom</option>
                <option value="Cosmetic Shelf">Cosmetic Shelf</option>
                <option value="Cleaning Storage">Cleaning Storage</option>
                <option value="Storeroom">Storeroom</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Quantity</label>
              <input
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value, 10) || 1 })}
                className="w-full glass-input rounded-xl px-3.5 py-2 text-sm text-gray-200 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2 pt-4 flex items-center justify-end gap-3 border-t border-gray-800">
              <button
                type="button"
                onClick={() => setExtractedData(null)}
                className="px-5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30"
              >
                Save Product to Inventory
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
