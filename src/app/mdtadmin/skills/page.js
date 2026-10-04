"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Plus, Pencil, Trash2, Wrench } from "lucide-react";
import { SkillModal } from "@/components/admin/skill-modal";
import { SectionCopy } from "@/components/admin/section-copy";
import { skillEntries } from "@/lib/skill-entries";

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("skills")
      .select("*")
      .order("id", { ascending: true });

    if (error) console.error("Error fetching skills:", error);
    else setSkills(data || []);
    setLoading(false);
  };

  const handleCreate = () => {
    setEditingSkill(null);
    setModalOpen(true);
  };

  const handleEdit = (skill) => {
    setEditingSkill(skill);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this skill category?")) return;

    const { error } = await supabase.from("skills").delete().eq("id", id);
    if (error) {
      alert("Error deleting skills");
    } else {
      fetchSkills();
    }
  };

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingSkill) {
        const { error } = await supabase
          .from("skills")
          .update(formData)
          .eq("id", editingSkill.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("skills").insert([formData]);
        if (error) throw error;
      }
      setModalOpen(false);
      fetchSkills();
    } catch (error) {
      console.error("Error saving skills:", error);
      alert("Failed to save changes.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
     return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-display font-bold text-charcoal-blue dark:text-verdigris">
          Skills
        </h1>
        <Button onClick={handleCreate} className="bg-burnt-peach hover:bg-burnt-peach/90 text-white">
          <Plus className="mr-2 h-4 w-4" /> Add Category
        </Button>
      </div>

      <SectionCopy
        title="Skills text"
        description="Headings for Technical Expertise and the moving technology row. Edit each logo and name under Tech row. Those pictures are cropped to one square size."
        fields={[
          { key: "skillsTitle", label: "Heading" },
          { key: "skillsPageTitle", label: "Page title" },
          { key: "skillsBody", label: "Intro", long: true },
          { key: "skillsPageBody", label: "Page intro", long: true },
          { key: "techEyebrow", label: "Tech eyebrow" },
          { key: "techTitle", label: "Tech heading" },
          { key: "techBody", label: "Tech intro", long: true },
        ]}
      />

      <div className="grid gap-6 md:grid-cols-2">
        {skills.map((skill) => (
          <Card key={skill.id} className="border-border/50 bg-card/50">
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                        <Wrench className="h-5 w-5 text-verdigris" />
                        <h3 className="text-xl font-bold font-display">{skill.category}</h3>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(skill)}>
                            <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(skill.id)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {skillEntries(skill).map((entry) => (
                        <div key={entry.name} className="flex items-center gap-2 rounded-md border border-border/70 px-2 py-1.5">
                            <span className="h-1 w-1 shrink-0 rounded-full bg-primary/80" />
                            <span className="truncate text-sm">{entry.name}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
          </Card>
        ))}

        {skills.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground border border-dashed rounded-lg">
                No skills found. Add a category to start.
            </div>
        )}
      </div>

      <SkillModal 
        open={modalOpen} 
        onOpenChange={setModalOpen}
        initialData={editingSkill}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
