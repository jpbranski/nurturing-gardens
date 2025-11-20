'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Button,
  CardActions,
} from '@mui/material';
import Link from 'next/link';
import { BlogPostMetadata } from '@/types/blog';

interface BlogPostCardProps {
  post: BlogPostMetadata;
}

const categoryColors: Record<string, 'success' | 'info' | 'secondary' | 'default'> = {
  native: 'success',
  pollinators: 'info',
  'plant-of-the-week': 'secondary',
  general: 'default',
};

const categoryLabels: Record<string, string> = {
  native: 'Native Plants',
  pollinators: 'Pollinators',
  'plant-of-the-week': 'Plant of the Week',
  general: 'General',
};

export default function BlogPostCard({ post }: BlogPostCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
        },
      }}
    >
      {post.coverImage && (
        <CardMedia
          component="img"
          height="200"
          image={post.coverImage}
          alt={post.title}
          sx={{ objectFit: 'cover' }}
        />
      )}
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ mb: 2 }}>
          <Chip
            label={categoryLabels[post.category] || post.category}
            size="small"
            color={categoryColors[post.category] || 'default'}
          />
        </Box>

        <Typography variant="h6" component="h3" gutterBottom fontWeight={600}>
          {post.title}
        </Typography>

        <Typography variant="body2" color="text.secondary" paragraph>
          {post.excerpt}
        </Typography>

        <Typography variant="caption" color="text.secondary">
          {formatDate(post.publishedAt)}
          {post.author && ` • ${post.author}`}
        </Typography>
      </CardContent>

      <CardActions sx={{ px: 2, pb: 2 }}>
        <Button
          component={Link}
          href={`/blog/${post.slug}`}
          variant="outlined"
          fullWidth
          size="small"
        >
          Read More
        </Button>
      </CardActions>
    </Card>
  );
}
