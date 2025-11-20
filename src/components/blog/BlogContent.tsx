'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Grid,
} from '@mui/material';
import BlogPostCard from './BlogPostCard';
import { BlogPostMetadata, BlogCategory } from '@/types/blog';

interface BlogContentProps {
  posts: BlogPostMetadata[];
}

export default function BlogContent({ posts }: BlogContentProps) {
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory | 'all'>('all');

  const displayedPosts =
    selectedCategory === 'all'
      ? posts
      : posts.filter((post) => post.category === selectedCategory);

  const handleCategoryChange = (_event: React.SyntheticEvent, newValue: BlogCategory | 'all') => {
    setSelectedCategory(newValue);
  };

  return (
    <>
      {/* Category Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs value={selectedCategory} onChange={handleCategoryChange} aria-label="blog categories">
          <Tab label="All Posts" value="all" />
          <Tab label="Native Plants" value="native" />
          <Tab label="Pollinators" value="pollinators" />
          <Tab label="Plant of the Week" value="plant-of-the-week" />
          <Tab label="General" value="general" />
        </Tabs>
      </Box>

      {/* Posts Grid */}
      {displayedPosts.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          No posts in this category yet. Check back soon!
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {displayedPosts.map((post) => (
            <Grid item xs={12} sm={6} md={4} key={post.slug}>
              <BlogPostCard post={post} />
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
}
