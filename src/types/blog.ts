export type BlogCategory = 'native' | 'pollinators' | 'plant-of-the-week' | 'general';

export interface BlogPost {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: BlogCategory;
  publishedAt: string;
  updatedAt?: string;
  coverImage?: string;
  author?: string;
}

export interface BlogPostMetadata {
  title: string;
  slug: string;
  excerpt: string;
  category: BlogCategory;
  publishedAt: string;
  updatedAt?: string;
  coverImage?: string;
  author?: string;
}
