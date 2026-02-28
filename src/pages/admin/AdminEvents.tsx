import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Plus, Trash2, ImagePlus, X, Pencil } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const TAGS = ["Announcement", "Programme", "Community", "Tournament", "News", "Offer"];

interface EventRow {
  id: string;
  title: string;
  excerpt: string | null;
  tag: string;
  date_label: string;
  image_url: string | null;
  created_at: string;
}

const emptyForm = {
  title: "",
  excerpt: "",
  tag: "Announcement",
  date_label: "",
  image_url: "",
};

const AdminEvents = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (!user) { navigate("/admin-login"); return; }
    const load = async () => {
      const { data: roleData } = await supabase
        .from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
      if (!roleData) { navigate("/"); return; }

      const { data } = await supabase.from("events").select("*").order("created_at", { ascending: false });
      if (data) setEvents(data as unknown as EventRow[]);
      setLoading(false);
    };
    load();
  }, [user, navigate]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `events/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file);
    if (error) { toast.error("Failed to upload image"); setUploading(false); return; }
    const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(path);
    setForm((prev) => ({ ...prev, image_url: urlData.publicUrl }));
    setUploading(false);
    e.target.value = "";
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const startEdit = (event: EventRow) => {
    setForm({
      title: event.title,
      excerpt: event.excerpt || "",
      tag: event.tag,
      date_label: event.date_label,
      image_url: event.image_url || "",
    });
    setEditingId(event.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    setSubmitting(true);

    const payload = {
      title: form.title.trim(),
      excerpt: form.excerpt.trim() || null,
      tag: form.tag,
      date_label: form.date_label.trim(),
      image_url: form.image_url.trim() || null,
    };

    if (editingId) {
      const { data, error } = await supabase.from("events").update(payload).eq("id", editingId).select().single();
      if (error) { toast.error("Failed to update event"); setSubmitting(false); return; }
      setEvents((prev) => prev.map((ev) => ev.id === editingId ? data as unknown as EventRow : ev));
      toast.success("Event updated!");
    } else {
      const { data, error } = await supabase.from("events").insert(payload).select().single();
      if (error) { toast.error("Failed to add event"); setSubmitting(false); return; }
      setEvents((prev) => [data as unknown as EventRow, ...prev]);
      toast.success("Event added!");
    }

    resetForm();
    setSubmitting(false);
  };

  const deleteEvent = async (id: string) => {
    if (!confirm("Delete this event?")) return;
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) { toast.error("Failed to delete"); return; }
    setEvents((prev) => prev.filter((ev) => ev.id !== id));
    toast.success("Event deleted");
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-bold">
          Events &amp; <span className="text-primary">More</span>
        </h1>
        <button
          onClick={() => { resetForm(); setShowForm(!showForm); }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Event
        </button>
      </div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="glass-card p-6 mb-8 space-y-5 overflow-hidden"
          >
            <h2 className="font-display text-lg font-semibold">{editingId ? "Edit Event" : "New Event"}</h2>

            {/* Image */}
            <div className="space-y-2">
              <Label>Event Image</Label>
              {form.image_url && (
                <div className="relative w-full h-48 rounded-xl overflow-hidden mb-3 border border-border">
                  <img src={form.image_url} alt="preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, image_url: "" }))}
                    className="absolute top-2 right-2 p-1 rounded-full bg-destructive text-destructive-foreground"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              <div className="flex gap-2">
                <label className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-border cursor-pointer hover:border-primary transition-colors text-sm text-muted-foreground whitespace-nowrap">
                  <ImagePlus className="w-4 h-4" />
                  {uploading ? "Uploading..." : "Upload Image"}
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
                <Input
                  placeholder="Or paste image URL"
                  value={form.image_url}
                  onChange={(e) => setForm((p) => ({ ...p, image_url: e.target.value }))}
                  className="flex-1"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tag *</Label>
                <select
                  value={form.tag}
                  onChange={(e) => setForm((p) => ({ ...p, tag: e.target.value }))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {TAGS.map((t) => (
                    <option key={t} value={t} className="bg-background text-foreground">{t}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Date Label</Label>
                <Input
                  placeholder="e.g. Feb 2026 or Ongoing"
                  value={form.date_label}
                  onChange={(e) => setForm((p) => ({ ...p, date_label: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                placeholder="Event title"
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Excerpt / Description</Label>
              <Textarea
                placeholder="Short description of the event..."
                value={form.excerpt}
                onChange={(e) => setForm((p) => ({ ...p, excerpt: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {submitting ? "Saving..." : editingId ? "Update Event" : "Publish Event"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 rounded-lg border border-border text-sm hover:bg-secondary transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Events List */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((ev) => (
          <motion.div
            key={ev.id}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card overflow-hidden flex flex-col"
          >
            {ev.image_url ? (
              <div className="h-40 overflow-hidden">
                <img src={ev.image_url} alt={ev.title} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="h-40 bg-secondary/40 flex items-center justify-center text-muted-foreground text-xs uppercase tracking-widest">
                No Image
              </div>
            )}
            <div className="p-4 flex flex-col flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-medium">{ev.tag}</span>
                <span className="text-xs text-muted-foreground">{ev.date_label}</span>
              </div>
              <h3 className="font-display text-sm font-bold mb-1">{ev.title}</h3>
              <p className="text-muted-foreground text-xs flex-1 line-clamp-2">{ev.excerpt}</p>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => startEdit(ev)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs hover:bg-secondary transition-colors"
                >
                  <Pencil className="w-3 h-3" /> Edit
                </button>
                <button
                  onClick={() => deleteEvent(ev.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-destructive border border-destructive/20 hover:bg-destructive/10 text-xs transition-colors"
                >
                  <Trash2 className="w-3 h-3" /> Delete
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {events.length === 0 && (
        <div className="glass-card p-12 text-center text-muted-foreground">
          No events yet. Click "Add Event" to publish your first event.
        </div>
      )}
    </motion.div>
  );
};

export default AdminEvents;
