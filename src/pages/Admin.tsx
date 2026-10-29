import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Check, Edit3, Eye, EyeOff, LogOut, Package, Plus, Search, Trash2, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useProducts } from '@/context/ProductContext';
import { supabase } from '@/lib/supabase';
import { toProduct, type Product, type ProductRow, type ProductStatus } from '@/data/products';

type EditorValues = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  category: string;
  image: string;
  gallery: string;
  shortDescription: string;
  description: string;
  price: string;
  unit: string;
  stockQuantity: string;
  status: ProductStatus;
  sourcing: string;
  processing: string;
  ingredients: string;
  syntheticColourClaim: string;
  highlights: string;
  packs: string;
};

const emptyEditor: EditorValues = {
  id: '', slug: '', name: '', tagline: '', category: 'Spices', image: '', gallery: '',
  shortDescription: '', description: '', price: '0', unit: 'kg', stockQuantity: '0', status: 'active',
  sourcing: '', processing: '', ingredients: '', syntheticColourClaim: '', highlights: '', packs: '[]',
};

const statusLabel: Record<ProductStatus, string> = { active: 'Active', hidden: 'Hidden', out_of_stock: 'Out of Stock' };

const editorFromProduct = (product: Product): EditorValues => ({
  id: product.id, slug: product.slug, name: product.name, tagline: product.tagline, category: product.category,
  image: product.image, gallery: product.gallery.join('\n'), shortDescription: product.shortDescription,
  description: product.description, price: String(product.price), unit: product.unit,
  stockQuantity: String(product.stockQuantity), status: product.status, sourcing: product.sourcing,
  processing: product.processing, ingredients: product.ingredients, syntheticColourClaim: product.syntheticColourClaim,
  highlights: product.highlights.join(', '), packs: JSON.stringify(product.packs),
});

const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export default function Admin() {
  const { session, isAdmin, loading: authLoading, signIn, signOut } = useAuth();
  const { refresh } = useProducts();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ProductStatus>('all');
  const [editor, setEditor] = useState<EditorValues | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [login, setLogin] = useState({ email: '', password: '' });

  const loadProducts = async () => {
    setLoading(true);
    const { data, error: queryError } = await supabase.from('products').select('*').order('created_at', { ascending: true });
    if (queryError) {
      console.error('admin products load failed', queryError);
      setError('Could not load products.');
    } else setProducts((data as ProductRow[]).map(toProduct));
    setLoading(false);
  };

  useEffect(() => {
    if (isAdmin) void loadProducts();
  }, [isAdmin]);

  const filtered = useMemo(() => products.filter((product) => {
    const term = query.trim().toLowerCase();
    return (statusFilter === 'all' || product.status === statusFilter) &&
      (!term || `${product.name} ${product.category} ${product.slug}`.toLowerCase().includes(term));
  }), [products, query, statusFilter]);

  const counts = useMemo(() => ({
    total: products.length,
    active: products.filter((product) => product.status === 'active').length,
    hidden: products.filter((product) => product.status === 'hidden').length,
    out: products.filter((product) => product.status === 'out_of_stock').length,
  }), [products]);

  const updateStatus = async (product: Product, status: ProductStatus) => {
    setError(null);
    const { error: updateError } = await supabase.from('products').update({ status }).eq('id', product.id);
    if (updateError) {
      console.error('product status update failed', updateError);
      setError('Could not update that product status.');
      return;
    }
    setProducts((current) => current.map((item) => item.id === product.id ? { ...item, status } : item));
    await refresh();
  };

  const saveProduct = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editor) return;
    setError(null);
    let packs: unknown;
    try { packs = JSON.parse(editor.packs || '[]'); } catch { setError('Pack options must be valid JSON.'); return; }
    const id = editor.id || slugify(editor.slug || editor.name);
    const slug = slugify(editor.slug || editor.name);
    if (!id || !slug || !editor.name.trim() || !editor.image.trim()) { setError('Name, slug, and main image are required.'); return; }
    const payload = {
      id, slug, name: editor.name.trim(), tagline: editor.tagline.trim(), category: editor.category.trim() || 'Other',
      image: editor.image.trim(), gallery: editor.gallery.split('\n').map((item) => item.trim()).filter(Boolean),
      short_description: editor.shortDescription.trim(), description: editor.description.trim(),
      price: Math.max(0, Number(editor.price) || 0), unit: editor.unit.trim() || 'kg',
      stock_quantity: Math.max(0, Math.floor(Number(editor.stockQuantity) || 0)), status: editor.status,
      details: { sourcing: editor.sourcing.trim(), processing: editor.processing.trim(), ingredients: editor.ingredients.trim(), syntheticColourClaim: editor.syntheticColourClaim.trim(), highlights: editor.highlights.split(',').map((item) => item.trim()).filter(Boolean) },
      packs,
    };
    const result = editor.id
      ? await supabase.from('products').update(payload).eq('id', editor.id)
      : await supabase.from('products').insert(payload);
    if (result.error) {
      console.error('product save failed', result.error);
      setError('Could not save the product. Check the details and try again.');
      return;
    }
    setEditor(null);
    setMessage('Product saved.');
    await loadProducts();
    await refresh();
  };

  const deleteProduct = async (product: Product) => {
    if (!window.confirm(`Permanently delete ${product.name}? Hide it instead if you may sell it again.`)) return;
    const { error: deleteError } = await supabase.from('products').delete().eq('id', product.id);
    if (deleteError) { console.error('product delete failed', deleteError); setError('Could not delete the product.'); return; }
    setProducts((current) => current.filter((item) => item.id !== product.id));
    await refresh();
    setMessage('Product deleted.');
  };

  const submitLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(await signIn(login.email.trim(), login.password));
  };

  if (authLoading) return <div className="min-h-screen bg-cream-100 px-6 pt-32 text-center text-forest-700/70">Checking admin access…</div>;
  if (!session) return <AdminLogin login={login} setLogin={setLogin} onSubmit={submitLogin} error={error} />;
  if (!isAdmin) return <div className="min-h-screen bg-cream-100 px-6 pt-32 text-center"><p className="text-forest-800">This account is not authorized to manage products.</p><button onClick={() => void signOut()} className="btn-secondary mt-5">Sign out</button></div>;

  return (
    <div className="min-h-screen bg-cream-100 px-5 pb-20 pt-28 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div><p className="eyebrow">RYTHARA Admin</p><h1 className="mt-2 font-display text-4xl font-600 text-forest-800">Product management</h1><p className="mt-2 text-sm text-forest-700/65">Keep your public catalogue current from one place.</p></div>
          <div className="flex gap-2"><button onClick={() => { setEditor({ ...emptyEditor }); setError(null); }} className="btn-primary"><Plus className="h-4 w-4" />Add product</button><button onClick={() => void signOut()} className="btn-secondary px-4" aria-label="Sign out"><LogOut className="h-4 w-4" /></button></div>
        </div>
        {message && <div className="mt-6 flex items-center justify-between rounded-2xl bg-forest-800 px-4 py-3 text-sm text-cream-100"><span>{message}</span><button onClick={() => setMessage(null)}><X className="h-4 w-4" /></button></div>}
        {error && <div className="mt-6 rounded-2xl border border-earth-400/30 bg-earth-100/50 px-4 py-3 text-sm text-earth-700">{error}</div>}

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat icon={Package} label="Total products" value={counts.total} />
          <Stat icon={Check} label="Active" value={counts.active} />
          <Stat icon={EyeOff} label="Hidden" value={counts.hidden} />
          <Stat icon={Eye} label="Out of stock" value={counts.out} />
        </div>

        <div className="mt-10 overflow-hidden rounded-3xl border border-forest-800/8 bg-white/70">
          <div className="flex flex-col gap-3 border-b border-forest-800/8 p-5 md:flex-row md:items-center md:justify-between"><div className="relative md:max-w-sm md:flex-1"><Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-forest-700/40" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products" className="w-full rounded-xl border border-forest-800/15 bg-cream-100/50 py-2.5 pl-10 pr-3 text-sm text-forest-800 outline-none focus:border-forest-800" /></div><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as 'all' | ProductStatus)} className="rounded-xl border border-forest-800/15 bg-cream-100/50 px-3 py-2.5 text-sm text-forest-800 outline-none"><option value="all">All statuses</option><option value="active">Active</option><option value="hidden">Hidden</option><option value="out_of_stock">Out of Stock</option></select></div>
          {loading ? <p className="p-8 text-sm text-forest-700/60">Loading products…</p> : <div className="divide-y divide-forest-800/8">{filtered.map((product) => <ProductRow key={product.id} product={product} onEdit={() => setEditor(editorFromProduct(product))} onDelete={() => void deleteProduct(product)} onStatus={(status) => void updateStatus(product, status)} />)}{filtered.length === 0 && <p className="p-8 text-sm text-forest-700/60">No products match these filters.</p>}</div>}
        </div>
      </div>
      {editor && <ProductEditor values={editor} setValues={setEditor} onClose={() => setEditor(null)} onSubmit={saveProduct} />}
    </div>
  );
}

function AdminLogin({ login, setLogin, onSubmit, error }: { login: { email: string; password: string }; setLogin: (value: { email: string; password: string }) => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void; error: string | null }) {
  return <div className="flex min-h-screen items-center justify-center bg-cream-100 px-5 pt-16"><form onSubmit={onSubmit} className="w-full max-w-md rounded-3xl border border-forest-800/8 bg-white/80 p-8 shadow-xl"><p className="eyebrow">RYTHARA Admin</p><h1 className="mt-3 font-display text-4xl font-600 text-forest-800">Sign in</h1><p className="mt-3 text-sm leading-relaxed text-forest-700/65">Use an authorized administrator account to manage the public catalogue.</p>{error && <p className="mt-5 rounded-xl bg-earth-100/60 p-3 text-sm text-earth-700">{error}</p>}<label className="mt-6 block text-sm font-semibold text-forest-800">Email<input required type="email" value={login.email} onChange={(event) => setLogin({ ...login, email: event.target.value })} className="mt-2 w-full rounded-xl border border-forest-800/15 bg-cream-100/50 px-4 py-3 text-sm outline-none focus:border-forest-800" /></label><label className="mt-4 block text-sm font-semibold text-forest-800">Password<input required type="password" value={login.password} onChange={(event) => setLogin({ ...login, password: event.target.value })} className="mt-2 w-full rounded-xl border border-forest-800/15 bg-cream-100/50 px-4 py-3 text-sm outline-none focus:border-forest-800" /></label><button className="btn-primary mt-6 w-full">Sign in</button></form></div>;
}

function Stat({ icon: Icon, label, value }: { icon: typeof Package; label: string; value: number }) { return <div className="rounded-2xl border border-forest-800/8 bg-white/70 p-5"><Icon className="h-5 w-5 text-turmeric-600" /><p className="mt-4 text-xs uppercase tracking-wide text-forest-700/55">{label}</p><p className="mt-1 font-display text-3xl font-600 text-forest-800">{value}</p></div>; }

function ProductRow({ product, onEdit, onDelete, onStatus }: { product: Product; onEdit: () => void; onDelete: () => void; onStatus: (status: ProductStatus) => void }) { return <div className="flex flex-col gap-4 p-5 lg:grid lg:grid-cols-[minmax(220px,1.5fr)_130px_130px_150px_auto] lg:items-center"><div className="flex items-center gap-4"><img src={product.image} alt="" className="h-16 w-16 rounded-xl object-cover" /><div><p className="font-semibold text-forest-800">{product.name}</p><p className="mt-1 text-xs text-forest-700/55">{product.category} · ₹{product.price}/{product.unit}</p></div></div><div><p className="text-xs text-forest-700/50 lg:hidden">Stock</p><p className="text-sm font-semibold text-forest-800">{product.stockQuantity} {product.unit}</p></div><div><p className="text-xs text-forest-700/50 lg:hidden">Status</p><select value={product.status} onChange={(event) => onStatus(event.target.value as ProductStatus)} className="rounded-lg border border-forest-800/15 bg-cream-100 px-2 py-1.5 text-xs font-semibold text-forest-800"><option value="active">Active</option><option value="hidden">Hidden</option><option value="out_of_stock">Out of Stock</option></select></div><p className="text-xs text-forest-700/55">{statusLabel[product.status]}</p><div className="flex gap-2 lg:justify-end"><button onClick={onEdit} className="btn-secondary px-3 py-2 text-xs"><Edit3 className="h-3.5 w-3.5" />Edit</button><button onClick={onDelete} className="flex h-9 w-9 items-center justify-center rounded-full border border-earth-400/30 text-earth-600 transition hover:bg-earth-100" aria-label={`Delete ${product.name}`}><Trash2 className="h-4 w-4" /></button></div></div>; }

function ProductEditor({ values, setValues, onClose, onSubmit }: { values: EditorValues; setValues: (values: EditorValues) => void; onClose: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  const update = (key: keyof EditorValues, value: string) => setValues({ ...values, [key]: value });
  const field = (key: keyof EditorValues, label: string, props: Record<string, string> = {}) => <label className="block text-sm font-semibold text-forest-800">{label}<input {...props} value={values[key] as string} onChange={(event) => update(key, event.target.value)} className="mt-1.5 w-full rounded-xl border border-forest-800/15 bg-cream-100/60 px-3 py-2.5 text-sm font-normal outline-none focus:border-forest-800" /></label>;
  return <div className="fixed inset-0 z-[80] overflow-y-auto bg-forest-900/45 px-4 py-8 backdrop-blur-sm"><form onSubmit={onSubmit} className="mx-auto max-w-4xl rounded-3xl bg-cream-100 p-6 shadow-2xl sm:p-8"><div className="flex items-start justify-between"><div><p className="eyebrow">Catalogue editor</p><h2 className="mt-2 font-display text-3xl font-600 text-forest-800">{values.id ? 'Edit product' : 'Add product'}</h2></div><button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full text-forest-700 hover:bg-forest-800/10"><X className="h-5 w-5" /></button></div><div className="mt-7 grid gap-4 sm:grid-cols-2">{field('name', 'Product name', { required: 'true' })}{field('slug', 'URL slug', { required: 'true' })}{field('tagline', 'Tagline')}{field('category', 'Category', { required: 'true' })}{field('image', 'Main image URL', { required: 'true', type: 'url' })}{field('gallery', 'Gallery image URLs, one per line', { placeholder: 'https://…' })}{field('price', 'Price', { type: 'number', min: '0', step: '0.01' })}{field('unit', 'Unit', { placeholder: 'kg, packet, box' })}{field('stockQuantity', 'Available stock quantity', { type: 'number', min: '0', step: '1' })}<label className="block text-sm font-semibold text-forest-800">Status<select value={values.status} onChange={(event) => update('status', event.target.value)} className="mt-1.5 w-full rounded-xl border border-forest-800/15 bg-cream-100/60 px-3 py-2.5 text-sm font-normal outline-none"><option value="active">Active</option><option value="hidden">Hidden</option><option value="out_of_stock">Out of Stock</option></select></label></div><div className="mt-4 grid gap-4 sm:grid-cols-2">{field('shortDescription', 'Short description')}{field('highlights', 'Highlights, comma separated')}</div><label className="mt-4 block text-sm font-semibold text-forest-800">Description<textarea required value={values.description} onChange={(event) => update('description', event.target.value)} rows={4} className="mt-1.5 w-full rounded-xl border border-forest-800/15 bg-cream-100/60 px-3 py-2.5 text-sm font-normal outline-none focus:border-forest-800" /></label><div className="mt-4 grid gap-4 sm:grid-cols-2">{field('sourcing', 'Sourcing details')}{field('processing', 'Processing details')}{field('ingredients', 'Ingredients')}{field('syntheticColourClaim', 'Product detail note')}</div><label className="mt-4 block text-sm font-semibold text-forest-800">Pack options JSON<textarea value={values.packs} onChange={(event) => update('packs', event.target.value)} rows={3} className="mt-1.5 w-full rounded-xl border border-forest-800/15 bg-cream-100/60 px-3 py-2.5 font-mono text-xs font-normal outline-none focus:border-forest-800" /></label><div className="mt-7 flex justify-end gap-2"><button type="button" onClick={onClose} className="btn-secondary">Cancel</button><button className="btn-primary">Save product</button></div></form></div>;
}
