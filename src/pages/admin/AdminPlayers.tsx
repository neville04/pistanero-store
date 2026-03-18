import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Plus, Trash2, ImagePlus, X, Pencil, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const SPORTS = ["Tennis", "Basketball", "Badminton", "Squash", "Pickleball", "Other"];
const LEVELS = ["Beginner", "Intermediate", "Advanced", "Professional"];

interface PlayerRow {
  id: string;
  name: string;
  sport: string;
  level: string;
  experience_years: number;
  bio: string | null;
  image_urls: string[];
}

const AdminPlayers = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [players, setPlayers] = useState<PlayerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [sport, setSport] = useState("Tennis");
  const [level, setLevel] = useState("Beginner");
  const [experienceYears, setExperienceYears] = useState("0");
  const [bio, setBio] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    if (!user) { navigate("/admin-login"); return; }
    const load = async () => {
      const { data: roleData } = await supabase
        .from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
      if (!roleData) { navigate("/"); return; }

      const { data } = await supabase.from("players").select("*").order("created_at", { ascending: false });
      if (data) setPlayers(data as unknown as PlayerRow[]);
      setLoading(false);
    };
    load();
  }, [user, navigate]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (imageUrls.length + files.length > 3) {
      toast.error("Maximum 3 photos per player");
      return;
    }
    setUploading(true);
    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("player-images").upload(path, file);
      if (error) { toast.error(`Failed to upload ${file.name}`); continue; }
      const { data: urlData } = supabase.storage.from("player-images").getPublicUrl(path);
      setImageUrls((prev) => [...prev, urlData.publicUrl]);
    }
    setUploading(false);
    e.target.value = "";
  };

  const removeImage = (idx: number) => setImageUrls((prev) => prev.filter((_, i) => i !== idx));

  const resetForm = () => {
    setName(""); setSport("Tennis"); setLevel("Beginner");
    setExperienceYears("0"); setBio(""); setImageUrls([]);
    setEditingId(null);
  };

  const startEdit = (p: PlayerRow) => {
    setName(p.name); setSport(p.sport); setLevel(p.level);
    setExperienceYears(String(p.experience_years)); setBio(p.bio || "");
    setImageUrls(p.image_urls);
    setEditingId(p.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { toast.error("Player name is required"); return; }
    setSubmitting(true);

    const payload = {
      name: name.trim(),
      sport,
      level,
      experience_years: parseInt(experienceYears) || 0,
      bio: bio.trim() || null,
      image_urls: imageUrls,
    };

    if (editingId) {
      const { data, error } = await supabase.from("players").update(payload).eq("id", editingId).select().single();
      if (error) { toast.error("Failed to update player"); setSubmitting(false); return; }
      setPlayers((prev) => prev.map((p) => p.id === editingId ? data as unknown as PlayerRow : p));
      toast.success("Player updated!");
    } else {
      const { data, error } = await supabase.from("players").insert(payload).select().single();
      if (error) { toast.error("Failed to add player"); setSubmitting(false); return; }
      setPlayers((prev) => [data as unknown as PlayerRow, ...prev]);
      toast.success("Player added!");
    }

    resetForm();
    setShowForm(false);
    setSubmitting(false);
  };

  const deletePlayer = async (id: string) => {
    const { error } = await supabase.from("players").delete().eq("id", id);
    if (error) { toast.error("Failed to delete player"); return; }
    setPlayers((prev) => prev.filter((p) => p.id !== id));
    toast.success("Player deleted");
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-bold">
          Player <span className="text-primary">Management</span>
        </h1>
        <button
          onClick={() => { resetForm(); setShowForm(!showForm); }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Player
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          onSubmit={handleSubmit}
          className="glass-card p-6 mb-8 space-y-5"
        >
          <h2 className="font-display text-lg font-semibold">{editingId ? "Edit Player" : "New Player"}</h2>

          {/* Photos */}
          <div className="space-y-2">
            <Label>Photos (up to 3)</Label>
            <div className="flex flex-wrap gap-3 mb-2">
              {imageUrls.map((url, i) => (
                <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border border-border">
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
              {imageUrls.length < 3 && (
                <label className="w-24 h-24 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-primary transition-colors text-muted-foreground">
                  <ImagePlus className="w-5 h-5" />
                  <span className="text-xs">{uploading ? "Uploading..." : "Add Photo"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              )}
            </div>
            <p className="text-xs text-muted-foreground">Upload up to 3 player photos.</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Player Name *</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. John Doe" required />
            </div>
            <div className="space-y-2">
              <Label>Experience (years)</Label>
              <Input
                type="number"
                min="0"
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
                placeholder="e.g. 3"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Sport</Label>
              <select
                value={sport}
                onChange={(e) => setSport(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {SPORTS.map((s) => (
                  <option key={s} value={s} className="bg-background text-foreground">{s}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Level</Label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {LEVELS.map((l) => (
                  <option key={l} value={l} className="bg-background text-foreground">{l}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Bio / Profile Info</Label>
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Player background, achievements, playing style..."
              rows={3}
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {submitting ? "Saving..." : editingId ? "Update Player" : "Save Player"}
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

      {/* Players Grid */}
      {players.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <User className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No players yet. Add your first player above.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {players.map((p) => (
            <div key={p.id} className="glass-card p-5 flex flex-col">
              {/* Photo */}
              <div className="w-20 h-20 rounded-full overflow-hidden mb-4 bg-secondary/40 border border-border/40 flex items-center justify-center mx-auto">
                {p.image_urls.length > 0 ? (
                  <img src={p.image_urls[0]} alt={p.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              <h3 className="font-display font-bold text-center mb-1">{p.name}</h3>
              <div className="flex items-center justify-center gap-2 mb-2 flex-wrap">
                <span className="text-xs bg-primary/15 text-primary px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wide">
                  {p.sport}
                </span>
                <span className="text-xs text-muted-foreground">{p.level}</span>
              </div>
              <p className="text-xs text-muted-foreground text-center mb-1">
                {p.experience_years} yr{p.experience_years !== 1 ? "s" : ""} experience
              </p>
              {p.bio && <p className="text-xs text-muted-foreground text-center line-clamp-2 flex-1">{p.bio}</p>}
              {/* Extra photos */}
              {p.image_urls.length > 1 && (
                <div className="flex gap-1.5 justify-center mt-3">
                  {p.image_urls.slice(1).map((url, i) => (
                    <img key={i} src={url} alt="" className="w-10 h-10 rounded-lg object-cover border border-border/40" />
                  ))}
                </div>
              )}
              <div className="flex gap-2 mt-4 justify-center">
                <button
                  onClick={() => startEdit(p)}
                  className="p-2 rounded-lg text-primary hover:bg-primary/10 transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deletePlayer(p.id)}
                  className="p-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default AdminPlayers;
