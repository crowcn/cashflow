'use client';

import { useState, useEffect } from 'react';

// 模拟价格获取函数
const fetchPrice = async (id: string): Promise<string> => {
  // 这里可以替换为实际的 API 调用
  const mockPrices: Record<string, string> = {
    'total': '¥47,001',
    'monthly': '¥3,917',
    'yearly': '¥47,001',
  };
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockPrices[id] || '¥0');
    }, 100);
  });
};

export function usePrice(id: string) {
  const [price, setPrice] = useState<string>("");

  useEffect(() => {
    fetchPrice(id).then(price => setPrice(price));
  }, [id]);

  return price;
} 