export type PackSize = {
  id: string;
  label: string;
  price: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  category: 'Spices' | 'Pulses' | 'Nuts' | 'Seasonal';
  image: string;
  gallery?: string[];
  shortDescription: string;
  description: string;
  sourcing: string;
  processing: string;
  ingredients: string;
  syntheticColourClaim: string;
  packs: PackSize[];
  highlights: string[];
};

// Prices are listed per pack and calculated from the current per-kilogram rates.
export const products: Product[] = [
  {
    id: 'turmeric-powder',
    slug: 'turmeric-powder',
    name: 'Turmeric Powder',
    tagline: 'Naturally golden, ground with care',
    category: 'Spices',
    image: 'https://images.pexels.com/photos/6220707/pexels-photo-6220707.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    gallery: [
      'https://images.pexels.com/photos/6220709/pexels-photo-6220709.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/6220710/pexels-photo-6220710.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/15623115/pexels-photo-15623115.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    ],
    shortDescription: 'Naturally golden turmeric with its characteristic colour — no added synthetic colourants where verified.',
    description:
      'Our turmeric powder is sourced directly from farmers who cultivate and harvest turmeric with traditional care. The rhizomes are cleaned, dried, and ground by a suitable food-processing partner, preserving the naturally golden colour and aroma turmeric is known for.',
    sourcing: 'Sourced directly from turmeric-growing farmers wherever the supply arrangement allows.',
    processing: 'Cleaned, sun-dried, and ground by a suitable food-processing partner. Packaged under hygienic conditions.',
    ingredients: 'Turmeric (Curcuma longa). No added synthetic colours where verified.',
    syntheticColourClaim: 'No added synthetic colourants where verified.',
    packs: [
      { id: 'tur-100', label: '100 g', price: 30 },
      { id: 'tur-200', label: '200 g', price: 60 },
      { id: 'tur-500', label: '500 g', price: 150 },
      { id: 'tur-1kg', label: '1 kg', price: 300 },
    ],
    highlights: ['Naturally golden', 'Directly sourced', 'No added synthetic colour*'],
  },
  {
    id: 'red-chilli-powder',
    slug: 'red-chilli-powder',
    name: 'Red Chilli Powder',
    tagline: 'Authentic colour and aroma',
    category: 'Spices',
    image: 'https://images.pexels.com/photos/33440713/pexels-photo-33440713.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    gallery: [
      'https://images.pexels.com/photos/33440709/pexels-photo-33440709.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/33440711/pexels-photo-33440711.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/6902055/pexels-photo-6902055.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    ],
    shortDescription: 'Authentic chilli colour and aroma — without added synthetic colourants where verified.',
    description:
      'Red chilli powder made from carefully sourced chillies, ground to preserve the natural colour and aroma. We work with farmers directly wherever the supply arrangement allows, and the chillies are processed by a suitable food-processing partner.',
    sourcing: 'Sourced directly from chilli-growing farmers wherever the supply arrangement allows.',
    processing: 'Cleaned, dried, and ground by a suitable food-processing partner. Hygienic packaging.',
    ingredients: 'Red chilli (Capsicum annuum). No added synthetic colours where verified.',
    syntheticColourClaim: 'No added synthetic colourants where verified.',
    packs: [
      { id: 'chilli-100', label: '100 g', price: 40 },
      { id: 'chilli-200', label: '200 g', price: 80 },
      { id: 'chilli-500', label: '500 g', price: 200 },
      { id: 'chilli-1kg', label: '1 kg', price: 400 },
    ],
    highlights: ['Authentic aroma', 'Directly sourced', 'No added synthetic colour*'],
  },
  {
    id: 'black-gram',
    slug: 'black-gram',
    name: 'Black Gram (Urad Dal)',
    tagline: 'Carefully sourced whole pulses',
    category: 'Pulses',
    image: 'https://images.pexels.com/photos/31672561/pexels-photo-31672561.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    gallery: [
      'https://images.pexels.com/photos/31672561/pexels-photo-31672561.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/30204265/pexels-photo-30204265.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/36008676/pexels-photo-36008676.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    ],
    shortDescription: 'Carefully sourced whole black gram, cleaned and sorted for everyday Indian cooking.',
    description:
      'Black gram (urad dal) is a staple in Indian kitchens. We source whole pulses directly from farmers, clean and sort them, and package them under hygienic conditions so they reach your kitchen ready to use.',
    sourcing: 'Sourced directly from pulse-growing farmers wherever the supply arrangement allows.',
    processing: 'Cleaned, sorted, and packaged under hygienic conditions.',
    ingredients: 'Black gram (Vigna mungo). Whole.',
    syntheticColourClaim: 'No added synthetic colours.',
    packs: [
      { id: 'urad-500', label: '500 g', price: 75 },
      { id: 'urad-1kg', label: '1 kg', price: 150 },
    ],
    highlights: ['Carefully cleaned', 'Directly sourced', 'Whole pulses'],
  },
  {
    id: 'red-gram',
    slug: 'red-gram',
    name: 'Red Gram (Toor Dal)',
    tagline: 'Everyday pulses for Indian cooking',
    category: 'Pulses',
    image: 'https://images.pexels.com/photos/14177776/pexels-photo-14177776.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    gallery: [
      'https://images.pexels.com/photos/34693984/pexels-photo-34693984.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/30204272/pexels-photo-30204272.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    ],
    shortDescription: 'Everyday split red gram (toor dal), carefully sourced and cleaned for daily meals.',
    description:
      'Red gram (toor dal) is one of the most commonly used pulses in Indian cooking. We source it directly from farmers and process it through a suitable food-processing partner to ensure clean, uniform dal for your kitchen.',
    sourcing: 'Sourced directly from pulse-growing farmers wherever the supply arrangement allows.',
    processing: 'Cleaned, split, and packaged by a suitable food-processing partner.',
    ingredients: 'Red gram (Cajanus cajan). Split.',
    syntheticColourClaim: 'No added synthetic colours.',
    packs: [
      { id: 'toor-500', label: '500 g', price: 75 },
      { id: 'toor-1kg', label: '1 kg', price: 150 },
    ],
    highlights: ['Everyday dal', 'Directly sourced', 'Uniform cleaning'],
  },
  {
    id: 'cashews',
    slug: 'cashews',
    name: 'Cashew Kernels',
    tagline: 'Carefully sourced cashew kernels',
    category: 'Nuts',
    image: 'https://images.pexels.com/photos/9811624/pexels-photo-9811624.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    gallery: [
      'https://images.pexels.com/photos/18876240/pexels-photo-18876240.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/4499222/pexels-photo-4499222.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    ],
    shortDescription: 'Carefully sourced cashew kernels, cleaned and graded for snacking and cooking.',
    description:
      'Our cashew kernels are sourced from cashew-growing regions and processed by a suitable partner who handles cleaning, grading, and packaging. Whole, creamy kernels suitable for snacking, sweets, and cooking.',
    sourcing: 'Sourced from cashew-growing regions through direct arrangements wherever possible.',
    processing: 'Cleaned, graded, and packaged by a suitable food-processing partner.',
    ingredients: 'Cashew kernel (Anacardium occidentale).',
    syntheticColourClaim: 'No added synthetic colours.',
    packs: [
      { id: 'cashew-250', label: '250 g', price: 240 },
      { id: 'cashew-500', label: '500 g', price: 480 },
      { id: 'cashew-1kg', label: '1 kg', price: 960 }
    ],
    highlights: ['Whole kernels', 'Carefully graded', 'Hygienic packing'],
  },
  {
    id: 'seasonal-farm-products',
    slug: 'seasonal-farm-products',
    name: 'Seasonal Farm Products',
    tagline: 'Additional agricultural products as we grow',
    category: 'Seasonal',
    image: 'https://images.pexels.com/photos/6086066/pexels-photo-6086066.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    gallery: [
      'https://images.pexels.com/photos/7208238/pexels-photo-7208238.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/31280796/pexels-photo-31280796.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    ],
    shortDescription: 'As our farmer network grows, we add seasonal agricultural products — sourced with the same direct, honest approach.',
    description:
      'Our catalogue expands as we build more direct relationships with farmers. Seasonal products may include additional pulses, whole spices, grains, and other agricultural products — all sourced with the same focus on direct farmer connections, quality, and honest information.',
    sourcing: 'Sourced directly from farmers in our growing network.',
    processing: 'Processed appropriately depending on the product, by suitable partners.',
    ingredients: 'Varies by product. Full ingredient and sourcing information provided on each pack.',
    syntheticColourClaim: 'Product-specific claims stated on each pack, where verified.',
    packs: [
      { id: 'seasonal-varies', label: 'Varies', price: 0 },
    ],
    highlights: ['Growing catalogue', 'Seasonal selection', 'Same direct sourcing'],
  },
];

export const getProductBySlug = (slug: string): Product | undefined =>
  products.find((p) => p.slug === slug);

export const categories: Array<Product['category']> = ['Spices', 'Pulses', 'Nuts', 'Seasonal'];
