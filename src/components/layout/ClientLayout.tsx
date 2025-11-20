'use client';

import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import Header from './Header';
import Footer from './Footer';
import ShoppingListDrawer from '@/components/common/ShoppingListDrawer';
import CookieConsent from '@/components/common/CookieConsent';
import ChatWidget from '@/components/chat/ChatWidget';
import { getShoppingListCount } from '@/lib/shopping-list';
import { usePathname } from 'next/navigation';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [shoppingListOpen, setShoppingListOpen] = useState(false);
  const [shoppingListCount, setShoppingListCount] = useState(0);
  const pathname = usePathname();

  // Hide chat on legal pages
  const showChat = !pathname?.startsWith('/legal');

  useEffect(() => {
    // Update shopping list count on mount and when storage changes
    const updateCount = () => {
      setShoppingListCount(getShoppingListCount());
    };

    updateCount();

    // Listen for storage events (updates from other tabs)
    window.addEventListener('storage', updateCount);

    // Listen for custom event (updates from same tab)
    window.addEventListener('shoppingListUpdated', updateCount);

    return () => {
      window.removeEventListener('storage', updateCount);
      window.removeEventListener('shoppingListUpdated', updateCount);
    };
  }, []);

  const handleShoppingListToggle = () => {
    setShoppingListOpen(!shoppingListOpen);
  };

  const handleShoppingListClose = () => {
    setShoppingListOpen(false);
    // Update count after closing
    setShoppingListCount(getShoppingListCount());
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Header
        shoppingListCount={shoppingListCount}
        onShoppingListClick={handleShoppingListToggle}
      />

      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>

      <Footer />

      <ShoppingListDrawer
        open={shoppingListOpen}
        onClose={handleShoppingListClose}
        onUpdate={() => setShoppingListCount(getShoppingListCount())}
      />

      {showChat && <ChatWidget />}

      <CookieConsent />
    </Box>
  );
}
