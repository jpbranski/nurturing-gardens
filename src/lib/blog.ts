import { BlogPost, BlogPostMetadata, BlogCategory } from '@/types/blog';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'src/data/posts');

/**
 * Get all blog posts
 */
export function getAllPosts(): BlogPostMetadata[] {
  try {
    // Check if directory exists
    if (!fs.existsSync(postsDirectory)) {
      return getMockPosts();
    }

    const fileNames = fs.readdirSync(postsDirectory);
    const allPosts = fileNames
      .filter(fileName => fileName.endsWith('.md') || fileName.endsWith('.mdx'))
      .map(fileName => {
        const slug = fileName.replace(/\.mdx?$/, '');
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data } = matter(fileContents);

        return {
          slug,
          title: data.title,
          excerpt: data.excerpt,
          category: data.category as BlogCategory,
          publishedAt: data.publishedAt,
          updatedAt: data.updatedAt,
          coverImage: data.coverImage,
          author: data.author,
        };
      });

    // Filter out future posts
    const now = new Date();
    const publishedPosts = allPosts.filter(post => {
      const publishDate = new Date(post.publishedAt);
      return publishDate <= now;
    });

    // Sort by date, newest first
    return publishedPosts.sort((a, b) => {
      const dateA = new Date(a.publishedAt);
      const dateB = new Date(b.publishedAt);
      return dateB.getTime() - dateA.getTime();
    });
  } catch (error) {
    console.error('Error reading blog posts:', error);
    return getMockPosts();
  }
}

/**
 * Get a single blog post by slug
 */
export function getPostBySlug(slug: string): BlogPost | null {
  try {
    // Check if directory exists
    if (!fs.existsSync(postsDirectory)) {
      return getMockPostBySlug(slug);
    }

    const fullPath = path.join(postsDirectory, `${slug}.md`);
    const mdxPath = path.join(postsDirectory, `${slug}.mdx`);

    let fileContents: string;
    if (fs.existsSync(fullPath)) {
      fileContents = fs.readFileSync(fullPath, 'utf8');
    } else if (fs.existsSync(mdxPath)) {
      fileContents = fs.readFileSync(mdxPath, 'utf8');
    } else {
      return getMockPostBySlug(slug);
    }

    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title,
      excerpt: data.excerpt,
      content,
      category: data.category as BlogCategory,
      publishedAt: data.publishedAt,
      updatedAt: data.updatedAt,
      coverImage: data.coverImage,
      author: data.author,
    };
  } catch (error) {
    console.error(`Error reading blog post ${slug}:`, error);
    return getMockPostBySlug(slug);
  }
}

/**
 * Get posts by category
 */
export function getPostsByCategory(category: BlogCategory): BlogPostMetadata[] {
  const allPosts = getAllPosts();
  return allPosts.filter(post => post.category === category);
}

/**
 * Get the latest plant of the week post
 */
export function getLatestPlantOfTheWeek(): BlogPostMetadata | null {
  const posts = getPostsByCategory('plant-of-the-week');
  return posts.length > 0 ? posts[0] : null;
}

/**
 * Get recent posts (for homepage)
 */
export function getRecentPosts(limit = 3): BlogPostMetadata[] {
  const allPosts = getAllPosts();
  return allPosts.slice(0, limit);
}

// Mock blog posts for development
function getMockPosts(): BlogPostMetadata[] {
  const now = new Date();
  const posts: BlogPostMetadata[] = [
    {
      slug: 'why-choose-native-plants',
      title: 'Why Choose Native Plants for Your Garden?',
      excerpt: 'Native plants are adapted to local conditions, require less maintenance, and support local ecosystems. Learn why they should be the foundation of your garden.',
      category: 'native',
      publishedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      coverImage: 'https://images.unsplash.com/photo-1466781783364-36c955e42a7f',
      author: 'Nurturing Gardens Team',
    },
    {
      slug: 'creating-pollinator-paradise',
      title: 'Creating a Pollinator Paradise in Your Backyard',
      excerpt: 'Discover how to transform your garden into a haven for bees, butterflies, and hummingbirds with the right plant selections and garden design.',
      category: 'pollinators',
      publishedAt: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      coverImage: 'https://images.unsplash.com/photo-1568526381923-caf3fd520382',
      author: 'Nurturing Gardens Team',
    },
    {
      slug: 'plant-of-the-week-purple-coneflower',
      title: 'Plant of the Week: Purple Coneflower',
      excerpt: 'Meet the purple coneflower, a native powerhouse that attracts pollinators, survives drought, and adds stunning color to any garden.',
      category: 'plant-of-the-week',
      publishedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      coverImage: 'https://images.unsplash.com/photo-1597165171577-346229e51a45',
      author: 'Nurturing Gardens Team',
    },
    {
      slug: 'understanding-hardiness-zones',
      title: 'Understanding USDA Hardiness Zones',
      excerpt: 'Learn what hardiness zones mean and how to use them to choose plants that will thrive in your specific climate.',
      category: 'general',
      publishedAt: new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000).toISOString(),
      coverImage: 'https://images.unsplash.com/photo-1523301551780-cd17359a95d0',
      author: 'Nurturing Gardens Team',
    },
  ];

  return posts.sort((a, b) => {
    const dateA = new Date(a.publishedAt);
    const dateB = new Date(b.publishedAt);
    return dateB.getTime() - dateA.getTime();
  });
}

function getMockPostBySlug(slug: string): BlogPost | null {
  const posts = getMockPosts();
  const metadata = posts.find(p => p.slug === slug);

  if (!metadata) return null;

  return {
    ...metadata,
    content: getMockContent(slug),
  };
}

function getMockContent(slug: string): string {
  const contents: Record<string, string> = {
    'why-choose-native-plants': `
Native plants are the backbone of healthy, sustainable gardens. They've evolved over thousands of years to thrive in local conditions, making them naturally resilient and low-maintenance.

## Benefits of Native Plants

### Adapted to Local Climate
Native plants are already adapted to your region's rainfall patterns, temperature extremes, and soil conditions. This means they require less watering, fertilizing, and general care once established.

### Support Local Wildlife
Native plants have co-evolved with local insects, birds, and other wildlife. They provide the specific nectar, pollen, seeds, and habitat that native species need to survive.

### Reduce Maintenance
Because they're adapted to local conditions, native plants generally require less intervention. No need for excessive watering, fertilizing, or pest control.

### Preserve Biodiversity
By choosing native plants, you're helping to preserve the genetic diversity and ecological relationships that make ecosystems resilient.

## Getting Started with Natives

Start by researching which plants are native to your specific region. Not all native plants are native everywhere! Choose plants suited to your specific conditions (sun, soil, moisture) and enjoy watching your garden become a thriving ecosystem.
    `,
    'creating-pollinator-paradise': `
Pollinators are essential to our food system and ecosystem health. By creating a pollinator-friendly garden, you're not just beautifying your space—you're supporting crucial environmental services.

## Key Principles

### Plant Diversity
Include plants that bloom at different times throughout the growing season. This ensures pollinators have food from spring through fall.

### Native Plants First
Native pollinators have evolved alongside native plants. These plants provide the best nutrition and are easiest for pollinators to use.

### Avoid Pesticides
Pesticides harm beneficial insects along with pests. Choose organic methods and embrace a few imperfect leaves as signs of a healthy ecosystem.

### Provide Water
Add a shallow water source with rocks or sticks for landing platforms. Even a simple bird bath or shallow dish works perfectly.

### Create Habitat
Leave some bare ground for ground-nesting bees. Provide brush piles and leave dead stems standing over winter for overwintering insects.

## Recommended Plants

Consider including purple coneflower, black-eyed Susan, butterfly weed, wild columbine, and native salvias. These are all excellent pollinator plants that thrive in many zones.
    `,
    'plant-of-the-week-purple-coneflower': `
The purple coneflower (*Echinacea purpurea*) is a stunning native perennial that deserves a place in every garden.

## Why We Love It

This tough, drought-tolerant plant produces distinctive flowers with purple-pink petals surrounding a spiky orange cone. It blooms from mid-summer into fall, providing color when many other plants are fading.

## Pollinator Magnet

Butterflies, bees, and other beneficial insects flock to coneflower blooms. In fall and winter, goldfinches feast on the seed heads, making it a four-season wildlife plant.

## Growing Tips

- **Zones**: 3-9
- **Sun**: Full sun to part shade (best flowering in full sun)
- **Soil**: Well-drained, tolerates poor soil
- **Water**: Low once established
- **Spacing**: 18 inches apart

## Care Notes

Deadhead spent flowers to encourage more blooms, or leave them for winter bird food. Plants may self-seed but are rarely invasive. Divide clumps every 3-4 years to maintain vigor.

Purple coneflower is perfect for beginners—it's forgiving, beautiful, and ecologically beneficial. What more could you ask for?
    `,
    'understanding-hardiness-zones': `
USDA Hardiness Zones are the foundation of smart plant selection. Understanding your zone helps you choose plants that will survive and thrive in your climate.

## What Are Hardiness Zones?

The USDA divides North America into 13 zones based on average annual minimum winter temperatures. Each zone represents a 10°F difference, with sub-zones (a and b) representing 5°F differences.

## Finding Your Zone

You can find your zone by entering your ZIP code into the USDA's online tool. Remember that microclimates in your yard may vary from the general zone rating.

## Using Zone Information

Plant tags and descriptions typically list a zone range (e.g., "zones 5-9"). This means the plant should survive winters in zone 5 and summers in zone 9.

### Zone Isn't Everything

While zones are helpful, they only measure winter cold. Other factors matter too:

- **Summer heat**: Some plants struggle in hot, humid climates
- **Rainfall**: Drought-tolerant plants may not thrive in wet regions
- **Soil type**: Clay, sand, and loam all affect plant success
- **Microclimates**: South-facing walls, slopes, and sheltered areas create warmer spots

## Beyond the Basics

Consider plants native to your region first. They're adapted to all local conditions, not just winter temperatures. Zone ratings are a starting point, but local expertise and native plants are your best guides.
    `,
  };

  return contents[slug] || 'Content coming soon...';
}
