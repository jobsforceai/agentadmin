import React from 'react';
import { twMerge } from 'tailwind-merge';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  className?: string;
}

const StatsCard = ({ title, value, change, icon, className }: StatsCardProps) => {
  const isPositive = change && change > 0;
  
  return (
    <Card className={twMerge('transition-all duration-300 hover:shadow-lg', className)}>
      <CardContent className="py-6">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-gray-500">{title}</div>
          <div className="p-2 rounded-lg bg-gray-50">{icon}</div>
        </div>
        
        <div className="mt-3">
          <div className="text-2xl font-bold text-gray-900">{value}</div>
          
          {change !== undefined && (
            <div className="flex items-center mt-2">
              <div className={`flex items-center text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {isPositive ? (
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                )}
                <span className="font-medium">{Math.abs(change)}%</span>
              </div>
              <div className="ml-2 text-xs text-gray-500">from last month</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;