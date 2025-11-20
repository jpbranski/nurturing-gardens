import React from 'react';
import {
  Container,
  Box,
  Typography,
  Chip,
  Divider,
  Button,
  Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from 'next/link';
import ClientLayout from '@/components/layout/ClientLayout';
import { getPostBySlug } from '@/lib/blog';
import ReactMarkdown from 'react-markdown';

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return (
      <ClientLayout>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Alert severity="error">Blog post not found</Alert>
        </Container>
      </ClientLayout>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <ClientLayout>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Button
          component={Link}
          href="/blog"
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 3 }}
        >
          Back to Blog
        </Button>

        <Box sx={{ mb: 4 }}>
          <Chip label={post.category} color="primary" sx={{ mb: 2 }} />
          <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
            {post.title}
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {post.excerpt}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Published {formatDate(post.publishedAt)}
            {post.author && ` • By ${post.author}`}
            {post.updatedAt && ` • Updated ${formatDate(post.updatedAt)}`}
          </Typography>
        </Box>

        <Divider sx={{ mb: 4 }} />

        <Box
          sx={{
            '& h2': {
              fontSize: '1.75rem',
              fontWeight: 600,
              mt: 4,
              mb: 2,
            },
            '& h3': {
              fontSize: '1.5rem',
              fontWeight: 600,
              mt: 3,
              mb: 2,
            },
            '& p': {
              fontSize: '1rem',
              lineHeight: 1.8,
              mb: 2,
            },
            '& ul, & ol': {
              mb: 2,
              pl: 3,
            },
            '& li': {
              mb: 1,
            },
            '& a': {
              color: 'primary.main',
              textDecoration: 'underline',
            },
          }}
        >
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary" paragraph>
            Enjoyed this article? Explore more plants and gardening tips!
          </Typography>
          <Button component={Link} href="/browse" variant="contained">
            Browse Plants
          </Button>
        </Box>
      </Container>
    </ClientLayout>
  );
}
