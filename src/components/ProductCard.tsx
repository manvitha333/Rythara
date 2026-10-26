import { Link } from 'react-router-dom';
import { Plus, MessageCircle } from 'lucide-react';
import { type Product } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { buildWhatsAppEnquiryLink } from '@/data/brand';

export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const firstPack = product.packs[0];
  const isSeasonal = product.category === 'Seasonal';

  return (
    <article className="group hover-lift flex flex-col overflow-hidden rounded-3xl border border-forest-800/8 bg-white/60 backdrop-blur-sm">
      <Link to={`/products/${product.slug}`} className="relative block overflow-hidden">
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
          />
        </div>
        <span className="absolute left-4 top-4 rounded-full bg-cream-100/90 px-3 py-1 text-xs font-semibold text-forest-800 backdrop-blur-sm">
          {product.category}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <Link to={`/products/${product.slug}`}>
          <h3 className="font-display text-xl font-600 text-forest-800 transition-colors group-hover:text-forest-900">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 text-sm text-forest-700/60">{product.tagline}</p>

        <p className="mt-3 text-sm leading-relaxed text-forest-700/80">
          {product.shortDescription}
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {product.highlights.map((h) => (
            <span
              key={h}
              className="rounded-full bg-forest-800/5 px-2.5 py-1 text-[11px] font-medium text-forest-700"
            >
              {h}
            </span>
          ))}
        </div>

        <div className="mt-5 flex items-end justify-between">
          <div>
            <p className="text-xs text-forest-700/50">From</p>
            <p className="font-display text-lg font-600 text-forest-800">
              {firstPack.price > 0 ? `₹${firstPack.price}` : 'Varies'}
              {firstPack.price > 0 && <span className="text-xs font-400 text-forest-700/50"> / {firstPack.label}</span>}
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5 text-[11px] text-forest-700/60">
            {product.packs.map((p) => (
              <span key={p.id} className="rounded-md border border-forest-800/10 px-1.5 py-0.5">
                {p.label}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-5 flex gap-2">
          {isSeasonal ? (
            <a
              href={buildWhatsAppEnquiryLink(product.name)}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary flex-1"
            >
              <MessageCircle className="h-4 w-4" />
              Enquire
            </a>
          ) : (
            <button
              onClick={() => add(product, firstPack)}
              className="btn-primary flex-1"
            >
              <Plus className="h-4 w-4" />
              Add to Cart
            </button>
          )}
          <Link
            to={`/products/${product.slug}`}
            className="btn-secondary px-4"
            aria-label={`View ${product.name} details`}
          >
            Details
          </Link>
        </div>
      </div>
    </article>
  );
}
