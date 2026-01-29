"use client";

import React, { useEffect, useState } from 'react';
import { Megaphone, Activity, DollarSign, Clock, ExternalLink, BarChart3 } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Spinner from '../common/Spinner';
import promotionService, { Promotion } from '@/services/promotionService';
import PromotionAnalyticsModal from './PromotionAnalyticsModal';

export default function PromotionList() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPromotionId, setSelectedPromotionId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const data = await promotionService.getPromotions();
        setPromotions(data);
      } catch (error) {
        console.error('Failed to fetch promotions:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPromotions();
  }, []);

  const handleToggleStatus = async (promotionId: string, currentStatus: string) => {
    try {
      let updatedPromotion: Promotion;
      if (currentStatus === 'active') {
        updatedPromotion = await promotionService.pausePromotion(promotionId);
      } else {
        updatedPromotion = await promotionService.resumePromotion(promotionId);
      }
      
      setPromotions(prev => prev.map(p => 
        p._id === promotionId ? updatedPromotion : p
      ));
    } catch (error) {
      console.error('Failed to toggle promotion status:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (promotions.length === 0) {
    return (
      <Card className="p-12 text-center bg-gray-50/50 dark:bg-gray-900/50 border-dashed border-2">
        <div className="bg-primary-50 dark:bg-primary-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Megaphone className="w-8 h-8 text-primary-600 dark:text-primary-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">No active promotions</h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
          Start promoting your professional posts to reach a wider audience and grow your business network.
        </p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
      {promotions.map((promotion) => (
        <Card key={promotion._id} className="p-6 hover:shadow-xl transition-all duration-300 group overflow-hidden relative">
          {/* Status Gradient Strip */}
          <div className={`absolute top-0 left-0 w-1 h-full ${
            promotion.status === 'active' ? 'bg-success-500' : 
            promotion.status === 'paused' ? 'bg-yellow-500' : 'bg-gray-500'
          }`} />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-3">
                <Badge 
                  variant={promotion.status === 'active' ? 'success' : promotion.status === 'paused' ? 'warning' : 'gray'}
                  size="sm"
                  className="uppercase tracking-wider font-bold"
                >
                  {promotion.status}
                </Badge>
                <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Ends {new Date(promotion.endDate).toLocaleDateString()}
                </span>
              </div>
              
              <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 transition-colors cursor-pointer flex items-center gap-2">
                Business Campaign #{promotion._id.slice(-6)}
                <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-tight">Budget</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-1">
                    <DollarSign className="w-3 h-3 text-success-500" />
                    {promotion.budget}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-tight">Spent</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-1">
                    <Activity className="w-3 h-3 text-primary-500" />
                    {promotion.spent}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-tight">Duration</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {promotion.duration} Days
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-tight">Reach</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {Math.floor(promotion.spent * 150)}+ views
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => handleToggleStatus(promotion._id, promotion.status)}
                className={`px-4 py-2 text-sm font-bold transition-colors ${
                  promotion.status === 'active' 
                    ? 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100' 
                    : 'text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300'
                }`}
              >
                {promotion.status === 'active' ? 'Pause' : 'Resume'}
              </button>
              <button 
                onClick={() => setSelectedPromotionId(promotion._id)}
                className="px-6 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl text-sm font-bold text-gray-900 dark:text-gray-100 transition-all flex items-center gap-2 group/btn"
              >
                <BarChart3 className="w-4 h-4 text-primary-500 group-hover/btn:scale-110 transition-transform" />
                Analytics
              </button>
            </div>
          </div>
        </Card>
      ))}

      {/* Analytics Modal */}
      {selectedPromotionId && (
        <PromotionAnalyticsModal 
          promotionId={selectedPromotionId} 
          onClose={() => setSelectedPromotionId(null)} 
        />
      )}
    </div>
  );
}
