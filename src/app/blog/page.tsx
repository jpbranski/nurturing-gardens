import React from 'react';
import { Container, Typography } from '@mui/material';
import ClientLayout from '@/components/layout/ClientLayout';
import BlogContent from '@/components/blog/BlogContent';
import { getAllPosts } from '@/lib/blog';

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <ClientLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h3" gutterBottom fontWeight={700}>
          Blog
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Tips, guides, and inspiration for sustainable, zone-appropriate gardening
        </Typography>

        <BlogContent posts={posts} />
      </Container>
    </ClientLayout>
  );
}
