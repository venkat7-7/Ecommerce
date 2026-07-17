export interface Product {
  id: number
  name: string
  brand: string
  price: number
  originalPrice?: number
  discount?: number
  rating: number
  reviews: number
  category: string
  subcategory: string
  colors: string[]
  sizes: string[]
  images: string[]
  badge?: 'New' | 'Sale' | 'Best Seller' | 'Limited'
  inStock: boolean
  stockCount?: number
  description: string
  features: string[]
  tags: string[]
}

export const products: Product[] = [
  {
    id: 1,
    name: 'Minimal Edge Sneaker',
    brand: 'VELO',
    price: 189,
    originalPrice: 240,
    discount: 21,
    rating: 4.8,
    reviews: 2341,
    category: 'Footwear',
    subcategory: 'Sneakers',
    colors: ['#F5F5F5', '#111111', '#5B8DEF', '#22C55E'],
    sizes: ['US 7', 'US 8', 'US 9', 'US 10', 'US 11', 'US 12'],
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=800&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&h=800&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&h=800&fit=crop&auto=format',
    ],
    badge: 'Sale',
    inStock: true,
    stockCount: 12,
    description: 'The Minimal Edge Sneaker redefines understated luxury. Crafted from premium full-grain leather with a vulcanized sole, this silhouette blurs the line between performance and art.',
    features: ['Full-grain leather upper', 'Cushioned insole', 'Vulcanized rubber sole', 'Ortholite footbed', 'Breathable lining'],
    tags: ['leather', 'minimal', 'premium', 'everyday'],
  },
  {
    id: 2,
    name: 'Cloud Nine Running',
    brand: 'AERO',
    price: 245,
    rating: 4.9,
    reviews: 1876,
    category: 'Footwear',
    subcategory: 'Running',
    colors: ['#FFFFFF', '#111111', '#EF4444'],
    sizes: ['US 7', 'US 8', 'US 9', 'US 10', 'US 11'],
    images: [
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&h=800&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&h=800&fit=crop&auto=format',
    ],
    badge: 'Best Seller',
    inStock: true,
    stockCount: 34,
    description: 'Engineered for speed, designed for style. The Cloud Nine features our proprietary CloudFoam technology for unparalleled cushioning with zero compromise on responsiveness.',
    features: ['CloudFoam midsole', 'Knit upper', 'Carbon fiber plate', 'Reflective details', 'Heel counter'],
    tags: ['running', 'performance', 'foam', 'speed'],
  },
  {
    id: 3,
    name: 'Heritage Wool Jacket',
    brand: 'ARTIS',
    price: 420,
    originalPrice: 580,
    discount: 28,
    rating: 4.7,
    reviews: 892,
    category: 'Clothing',
    subcategory: 'Outerwear',
    colors: ['#4A4A4A', '#C4A882', '#111111'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=800&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1547624643-3bf761b09502?w=800&h=800&fit=crop&auto=format',
    ],
    badge: 'Sale',
    inStock: true,
    stockCount: 7,
    description: 'An heirloom-quality piece woven from 100% Merino wool. The Heritage Jacket carries the weight of craft traditions and the lightness of modern cut.',
    features: ['100% Merino wool', 'Horn buttons', 'Satin lining', 'Double-stitched seams', 'Water resistant'],
    tags: ['wool', 'heritage', 'premium', 'winter'],
  },
  {
    id: 4,
    name: 'Sculpt Leather Tote',
    brand: 'FORMA',
    price: 385,
    rating: 4.9,
    reviews: 654,
    category: 'Accessories',
    subcategory: 'Bags',
    colors: ['#C4A882', '#111111', '#8B4513'],
    sizes: ['One Size'],
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&h=800&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&h=800&fit=crop&auto=format',
    ],
    badge: 'New',
    inStock: true,
    stockCount: 18,
    description: 'Where architecture meets function. The Sculpt Tote is hand-stitched from full-grain Italian leather with a structured silhouette that commands attention.',
    features: ['Full-grain Italian leather', 'Hand-stitched details', 'Internal organization', 'Solid brass hardware', 'Dust bag included'],
    tags: ['leather', 'tote', 'structured', 'italian'],
  },
  {
    id: 5,
    name: 'Meridian Timepiece',
    brand: 'HORA',
    price: 890,
    rating: 4.8,
    reviews: 341,
    category: 'Accessories',
    subcategory: 'Watches',
    colors: ['#C0C0C0', '#C4A882', '#111111'],
    sizes: ['38mm', '42mm'],
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=800&h=800&fit=crop&auto=format',
    ],
    badge: 'Limited',
    inStock: true,
    stockCount: 3,
    description: 'The Meridian is a study in restraint. Swiss movement, sapphire crystal, and a brushed stainless case that catches light without demanding attention.',
    features: ['Swiss quartz movement', 'Sapphire crystal', '100m water resistance', 'Stainless steel case', '2-year warranty'],
    tags: ['watch', 'swiss', 'luxury', 'minimalist'],
  },
  {
    id: 6,
    name: 'Linen Studio Set',
    brand: 'LUME',
    price: 165,
    rating: 4.6,
    reviews: 1123,
    category: 'Clothing',
    subcategory: 'Sets',
    colors: ['#F5F0EB', '#111111', '#8B9DC3'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=800&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=800&fit=crop&auto=format',
    ],
    badge: 'New',
    inStock: true,
    stockCount: 45,
    description: 'Belgian linen that breathes and ages beautifully. The Studio Set is an exercise in considered simplicity — two pieces that dress up or down effortlessly.',
    features: ['100% Belgian linen', 'Pre-washed fabric', 'Concealed button closure', 'Relaxed fit', 'Machine washable'],
    tags: ['linen', 'set', 'minimal', 'summer'],
  },
  {
    id: 7,
    name: 'Carbon Slide Sandal',
    brand: 'VELO',
    price: 95,
    originalPrice: 120,
    discount: 21,
    rating: 4.5,
    reviews: 789,
    category: 'Footwear',
    subcategory: 'Sandals',
    colors: ['#111111', '#F5F5F5', '#5B8DEF'],
    sizes: ['US 6', 'US 7', 'US 8', 'US 9', 'US 10'],
    images: [
      'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=800&h=800&fit=crop&auto=format',
    ],
    badge: 'Sale',
    inStock: true,
    stockCount: 28,
    description: 'Engineered from recycled carbon fiber composite, the Slide Sandal is the lightest and most durable sandal in its class.',
    features: ['Recycled carbon fiber', 'Memory foam footbed', 'Anti-slip outsole', 'Adjustable strap', 'Vegan materials'],
    tags: ['sandal', 'summer', 'minimal', 'eco'],
  },
  {
    id: 8,
    name: 'Titanium Sunglasses',
    brand: 'OPTIC',
    price: 310,
    rating: 4.7,
    reviews: 456,
    category: 'Accessories',
    subcategory: 'Eyewear',
    colors: ['#C0C0C0', '#C4A882', '#111111'],
    sizes: ['One Size'],
    images: [
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=800&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&h=800&fit=crop&auto=format',
    ],
    badge: 'New',
    inStock: true,
    stockCount: 15,
    description: 'Paper-thin titanium frames with polarized glass lenses. The lightest sunglasses we have ever made — you will forget you are wearing them.',
    features: ['Grade 5 titanium', 'Polarized glass lenses', 'UV400 protection', 'Spring hinges', 'Handcrafted in Japan'],
    tags: ['sunglasses', 'titanium', 'polarized', 'japan'],
  },
]

export const categories = [
  { name: 'Footwear', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop&auto=format', count: 124 },
  { name: 'Clothing', image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&h=600&fit=crop&auto=format', count: 89 },
  { name: 'Accessories', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop&auto=format', count: 67 },
  { name: 'Bags', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=600&fit=crop&auto=format', count: 43 },
]

export const reviews = [
  {
    id: 1,
    name: 'Sophia Laurent',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&auto=format',
    rating: 5,
    date: 'Dec 2025',
    product: 'Minimal Edge Sneaker',
    text: 'Absolutely worth every penny. The quality is unmatched — I have worn these daily for three months and they look better with age. Packaging was impeccable.',
  },
  {
    id: 2,
    name: 'Marcus Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&auto=format',
    rating: 5,
    date: 'Jan 2026',
    product: 'Heritage Wool Jacket',
    text: 'This jacket is a masterpiece. The wool is incredibly soft yet structured, and the fit is exactly as described. I get compliments every time I wear it.',
  },
  {
    id: 3,
    name: 'Amara Osei',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop&auto=format',
    rating: 5,
    date: 'Feb 2026',
    product: 'Sculpt Leather Tote',
    text: 'The craftsmanship is extraordinary. Holds its shape perfectly, the leather is supple yet durable. Customer service was exceptional when I had a question about sizing.',
  },
]

export const brands = ['VELO', 'AERO', 'ARTIS', 'FORMA', 'HORA', 'LUME', 'OPTIC']

export const instagramImages = [
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&auto=format',
]
