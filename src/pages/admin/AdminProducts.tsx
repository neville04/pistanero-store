import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Plus, Trash2, ImagePlus, X, Pencil } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const sections = ["men", "women", "courts", "bags", "sports"];
const categories = ["Footwear", "Rackets", "Balls", "Apparel", "Accessories", "Bags", "Training", "Equipment"];

interface ProductRow {
  id: string;
  name: string;
  price: number;
  category: string;
  section: string;
  description: string | null;
  color: string | null;
  size: string | null;
  image_urls: string[];
  is_featured: boolean;
}

const AdminProducts = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Footwear");
  const [section, setSection] = useState("men");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!user) { navigate("/admin-login"); return; }
    const load = async () => {
      const { data: roleData } = await supabase
        .from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
      if (!roleData) { navigate("/"); return; }

      const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      if (data) setProducts(data as unknown as ProductRow[]);
      setLoading(false);
    };
    load();
  }, [user, navigate]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("product-images").upload(path, file);
      if (error) { toast.error(`Failed to upload ${file.name}`); continue; }
      const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(path);
      setImageUrls((prev) => [...prev, urlData.publicUrl]);
    }
    setUploading(false);
    e.target.value = "";
  };

  const addImageUrl = () => {
    if (imageUrl.trim()) {
      setImageUrls((prev) => [...prev, imageUrl.trim()]);
      setImageUrl("");
    }
  };

  const removeImage = (idx: number) => setImageUrls((prev) => prev.filter((_, i) => i !== idx));

  const resetForm = () => {
    setName(""); setPrice(""); setCategory("Footwear"); setSection("men");
    setDescription(""); setColor(""); setSize(""); setIsFeatured(false);
    setImageUrls([]); setImageUrl("");
    setEditingId(null);
  };

  const startEdit = (p: ProductRow) => {
    setName(p.name); setPrice(String(p.price)); setCategory(p.category); setSection(p.section);
    setDescription(p.description || ""); setColor(p.color || ""); setSize(p.size || "");
    setIsFeatured(p.is_featured); setImageUrls(p.image_urls); setImageUrl("");
    setEditingId(p.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price) { toast.error("Name and price are required"); return; }
    setSubmitting(true);

    const payload = {
      name: name.trim(),
      price: parseFloat(price),
      category,
      section,
      description: description.trim() || null,
      color: color.trim() || null,
      size: size.trim() || null,
      image_urls: imageUrls,
      is_featured: isFeatured,
    };

    if (editingId) {
      const { data, error } = await supabase.from("products").update(payload).eq("id", editingId).select().single();
      if (error) { toast.error("Failed to update product"); setSubmitting(false); return; }
      setProducts((prev) => prev.map((p) => p.id === editingId ? data as unknown as ProductRow : p));
      toast.success("Product updated!");
    } else {
      const { data, error } = await supabase.from("products").insert(payload).select().single();
      if (error) { toast.error("Failed to add product"); setSubmitting(false); return; }
      setProducts((prev) => [data as unknown as ProductRow, ...prev]);
      toast.success("Product added!");
    }

    resetForm();
    setShowForm(false);
    setSubmitting(false);
  };

  const deleteProduct = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) { toast.error("Failed to delete"); return; }
    setProducts((prev) => prev.filter((p) => p.id !== id));
    toast.success("Product deleted");
  };

  const toggleFeatured = async (id: string, current: boolean) => {
    const { error } = await supabase.from("products").update({ is_featured: !current }).eq("id", id);
    if (error) { toast.error("Failed to update"); return; }
    setProducts((prev) => prev.map((p) => p.id === id ? { ...p, is_featured: !current } : p));
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-bold">
          Product <span className="text-primary">Management</span>
        </h1>
        <button
          onClick={() => { resetForm(); setShowForm(!showForm); }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Add Product Form */}
      {showForm && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          onSubmit={handleSubmit}
          className="glass-card p-6 mb-8 space-y-5"
        >
          <h2 className="font-display text-lg font-semibold">{editingId ? "Edit Product" : "New Product"}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Section *</Label>
              <select
                value={section}
                onChange={(e) => setSection(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {sections.map((s) => (
                  <option key={s} value={s} className="bg-background text-foreground">
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Category *</Label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {categories.map((c) => (
                  <option key={c} value={c} className="bg-background text-foreground">
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Images */}
          <div className="space-y-2">
            <Label>Images</Label>
            <div className="flex flex-wrap gap-3 mb-2">
              {imageUrls.map((url, i) => (
                <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-border">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-0.5 right-0.5 p-0.5 rounded-full bg-destructive text-destructive-foreground"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <label className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-border cursor-pointer hover:border-primary transition-colors text-sm text-muted-foreground">
                <ImagePlus className="w-4 h-4" />
                {uploading ? "Uploading..." : "Upload"}
                <input type="file" accept="image/*" multiple onChange={handleFileUpload} className="hidden" />
              </label>
              <Input
                placeholder="Or paste image URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="flex-1"
              />
              <button
                type="button"
                onClick={addImageUrl}
                className="px-3 py-2 rounded-lg border border-border text-sm hover:bg-secondary transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Product Name *</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Adidas Courtjam" required />
            </div>
            <div className="space-y-2">
              <Label>Price (UGX) *</Label>
              <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="250000" required />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Color</Label>
              <Input value={color} onChange={(e) => setColor(e.target.value)} placeholder="e.g. Black/Blue" />
            </div>
            <div className="space-y-2">
              <Label>Size</Label>
              <Input value={size} onChange={(e) => setSize(e.target.value)} placeholder="e.g. 7.5 (41.3)" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Product description..." />
          </div>

          <div className="flex items-center gap-3">
            <Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
            <Label>Show in Featured Section</Label>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {submitting ? "Saving..." : editingId ? "Update Product" : "Save Product"}
            </button>
            <button
              type="button"
              onClick={() => { resetForm(); setShowForm(false); }}
              className="px-6 py-2 rounded-lg border border-border text-sm hover:bg-secondary transition-colors"
            >
              Cancel
            </button>
          </div>
        </motion.form>
      )}

      {/* Products List */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 font-display text-xs uppercase tracking-widest text-muted-foreground">Image</th>
                <th className="text-left p-4 font-display text-xs uppercase tracking-widest text-muted-foreground">Name</th>
                <th className="text-left p-4 font-display text-xs uppercase tracking-widest text-muted-foreground">Section</th>
                <th className="text-left p-4 font-display text-xs uppercase tracking-widest text-muted-foreground">Price</th>
                <th className="text-left p-4 font-display text-xs uppercase tracking-widest text-muted-foreground">Featured</th>
                <th className="text-left p-4 font-display text-xs uppercase tracking-widest text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-border/50 hover:bg-secondary/30">
                  <td className="p-4">
                    {p.image_urls.length > 0 ? (
                      <img src={p.image_urls[0]} alt={p.name} className="w-12 h-12 rounded-lg object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-secondary/50 flex items-center justify-center text-muted-foreground text-xs">N/A</div>
                    )}
                  </td>
                  <td className="p-4">
                    <p className="font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.color} {p.size && `· ${p.size}`}</p>
                  </td>
                  <td className="p-4 capitalize text-muted-foreground">{p.section}</td>
                  <td className="p-4 text-primary font-bold">{p.price.toLocaleString()} UGX</td>
                  <td className="p-4">
                    <Switch checked={p.is_featured} onCheckedChange={() => toggleFeatured(p.id, p.is_featured)} />
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button onClick={() => startEdit(p)} className="p-2 rounded-lg text-primary hover:bg-primary/10 transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteProduct(p.id)} className="p-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {products.length === 0 && <p className="text-center text-muted-foreground py-12">No products yet.</p>}
      </div>
    </motion.div>
  );
};

export default AdminProducts;
