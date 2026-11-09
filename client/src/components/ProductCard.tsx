import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, CheckCircle, Edit, Trash2, Calendar, Package } from 'lucide-react';
import { ProductItem } from '../services/api';
import { ExpiryBadge } from './ExpiryBadge';

interface ProductCardProps {
  product: ProductItem;
  onMarkUsed?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onMarkUsed, onDelete }) => {
  const formattedExpiry = new Date(product.expiryDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const defaultImages: Record<string, string> = {
    FOOD: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80',
    MEDICINE: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80',
    'PERSONAL CARE': 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=400&q=80',
    DEFAULT: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80'
  };

  const imageSrc = product.imageUrl || defaultImages[product.category] || defaultImages.DEFAULT;

  return (
    <div className="glass-panel rounded-2xl overflow-hidden border border-gray-800/80 hover:border-gray-700/80 transition-all duration-300 group hover:shadow-xl hover:shadow-emerald-950/20 flex flex-col justify-between">
      <div>
        {/* Image & Status Overlay */}
        <div className="relative h-44 overflow-hidden bg-gray-900">
          <img
            src={imageSrc}
            alt={product.productName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src = defaultImages.DEFAULT;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-transparent to-black/30" />
          
          <div className="absolute top-3 left-3">
            <ExpiryBadge status={product.status} remainingDays={product.remainingDays} />
          </div>

          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-950/80 text-gray-300 border border-gray-700/50 uppercase tracking-wider backdrop-blur-md">
              {product.category}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-950/90 text-emerald-300 border border-emerald-800/60 backdrop-blur-md">
              Qty: {product.quantity} {product.unit}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4">
          <Link to={`/products/${product._id}`}>
            <h3 className="font-bold text-base text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
              {product.productName}
            </h3>
          </Link>
          <p className="text-xs text-gray-400 font-medium mt-0.5">{product.brand || 'Generic'} • {product.subcategory || 'General'}</p>

          <div className="mt-3 space-y-1.5 text-xs text-gray-300">
            <div className="flex items-center gap-1.5 text-gray-400">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">{product.storageLocation}</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-400">
              <Calendar className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>Exp: <strong className="text-gray-200">{formattedExpiry}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Actions */}
      <div className="px-4 pb-4 pt-2 border-t border-gray-800/60 flex items-center justify-between gap-2">
        <button
          onClick={() => onMarkUsed && onMarkUsed(product._id)}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-semibold text-xs border border-emerald-500/30 transition-all"
        >
          <CheckCircle className="w-3.5 h-3.5" />
          <span>Mark Used</span>
        </button>

        <Link
          to={`/products/${product._id}/edit`}
          className="p-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-white border border-gray-800 transition-all"
          title="Edit Product"
        >
          <Edit className="w-3.5 h-3.5" />
        </Link>

        {onDelete && (
          <button
            onClick={() => onDelete(product._id)}
            className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-all"
            title="Delete Product"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
