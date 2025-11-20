'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  CardActions,
} from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';
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
        minHeight: 480,
        maxHeight: 480,
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4
        },
      }}
    >
      {post.coverImage && (
        <Box
          sx={{
            position: 'relative',
            height: 200,
            width: '100%',
            flexShrink: 0,
            backgroundColor: 'grey.200'
          }}
        >
          <Image
            src={post.coverImage}
            alt={`${post.title} - Cover image`}
            fill
            sizes="(max-width: 600px) 100vw, (max-width: 960px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
            priority={false}
          />
        </Box>
      )}
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minHeight: 220 }}>
        <Box sx={{ mb: 1.5 }}>
          <Chip
            label={categoryLabels[post.category] || post.category}
            size="small"
            color={categoryColors[post.category] || 'default'}
          />
        </Box>

        <Typography
          variant="h6"
          component="h3"
          gutterBottom
          fontWeight={600}
          sx={{
            height: 64,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            mb: 1.5
          }}
        >
          {post.title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          paragraph
          sx={{
            flexGrow: 1,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            mb: 2
          }}
        >
          {post.excerpt}
        </Typography>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 'auto' }}>
          {formatDate(post.publishedAt)}
          {post.author && ` • ${post.author}`}
        </Typography>
      </CardContent>

      <CardActions sx={{ px: 2, pb: 2, height: 60, alignItems: 'center' }}>
        <Button
          component={Link}
          href={`/blog/${post.slug}`}
          variant="outlined"
          fullWidth
          size="small"
          aria-label={`Read more about ${post.title}`}
        >
          Read More
        </Button>
      </CardActions>
    </Card>
  );
}
