'use client';

import { useState, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Header from '@/components/Header';
import CategoryNav from '@/components/CategoryNav';
import DishCard from '@/components/DishCard';
import SkeletonCard from '@/components/SkeletonCard';
import { Category, MenuItem } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { mockCategories, mockMenuItems } from '@/lib/mock-data';
import { useLanguage } from '@/lib/LanguageContext';

const USE_MOCK =
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL.includes('YOUR_PROJECT_ID');

export default function MenuPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    async function load() {
      if (USE_MOCK) {
        // Simulate network delay for realistic skeleton effect
        await new Promise((r) => setTimeout(r, 900));
        setCategories(mockCategories);
        setItems(mockMenuItems);
        setLoading(false);
        return;
      }

      const [{ data: cats }, { data: menuItems }] = await Promise.all([
        supabase.from('categories').select('*').order('sort_order'),
        supabase
          .from('menu_items')
          .select('*, categories(*)')
          .eq('is_available', true)
          .order('sort_order'),
      ]);
      if (cats) {
        setCategories(cats);
        if (cats.length > 0) setSelectedCategory(cats[0].id);
      }
      if (menuItems) setItems(menuItems);
      setLoading(false);
    }
    load();
  }, []);

  const visibleItems = useMemo(() => {
    if (!selectedCategory) return items;
    return items.filter((i) => i.category_id === selectedCategory);
  }, [items, selectedCategory]);

  const handleCategorySelect = (id: string) => {
    setSelectedCategory(id);
  };

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--color-bg)' }}>
      <Header />
      <CategoryNav
        categories={categories}
        selected={selectedCategory}
        onSelect={handleCategorySelect}
      />

      <main style={{ maxWidth: 640, margin: '0 auto', padding: '20px 14px 40px' }}>
        {/* Section heading */}
        <AnimatePresence mode="wait">
          <motion.h2
            key={selectedCategory}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.25 }}
            style={{
              fontFamily: "'Cairo', sans-serif",
              fontSize: 18,
              fontWeight: 700,
              color: 'var(--color-text)',
              marginBottom: 16,
            }}
          >
            {selectedCategory
              ? t(
                categories.find((c) => c.id === selectedCategory)?.name_ar ?? '',
                categories.find((c) => c.id === selectedCategory)?.name ?? ''
              )
              : ''}
            {!loading && (
              <span
                style={{
                  marginRight: 8,
                  fontSize: 13,
                  fontWeight: 500,
                  color: 'var(--color-text-muted)',
                }}
              >
                ({visibleItems.length})
              </span>
            )}
          </motion.h2>
        </AnimatePresence>

        {/* Item grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 14,
          }}
        >
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : visibleItems.map((item, idx) => (
              <DishCard key={item.id} item={item} index={idx} />
            ))}
        </div>

        {!loading && visibleItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: 'var(--color-text-muted)',
              fontFamily: "'Cairo', sans-serif",
              fontSize: 16,
            }}
          >
            {t('لا توجد أطباق في هذه الفئة حالياً', 'No items in this category currently')}
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer
        style={{
          textAlign: 'center',
          padding: '24px 20px',
          borderTop: '1px solid var(--color-border)',
          color: 'var(--color-text-muted)',
          fontSize: 12,
          fontFamily: "'Cairo', sans-serif",
        }}
      >
        {t('© 2025 مطعم بيت الكرم — جميع الحقوق محفوظة', '© 2025 Beit Al-Karam Restaurant — All rights reserved')}
      </footer>
    </div>
  );
}
