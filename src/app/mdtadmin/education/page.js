"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Plus, Pencil, Trash2, GraduationCap } from "lucide-react";
import { EducationModal } from "@/components/admin/education-modal";
import { SectionCopy } from "@/components/admin/section-copy";

export default function AdminEducationPage() {
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("education")
      .select("*")
      .order("id", { ascending: false });

    if (error) console.error("Error fetching education:", error);
    else setEducation(data || []);
    setLoading(false);
  };

  const handleCreate = () => {
    setEditingEducation(null);
    setModalOpen(true);
  };

  const handleEdit = (edu) => {
    setEditingEducation(edu);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this education entry?")) return;

    const { error } = await supabase.from("education").delete().eq("id", id);
    if (error) {
      alert("Error deleting education");
    } else {
      fetchEducation();
    }
  };

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingEducation) {
        const { error } = await supabase
          .from("education")
          .update(formData)
          .eq("id", editingEducation.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("education").insert([formData]);
        if (error) throw error;
      }
      setModalOpen(false);
      fetchEducation();
    } catch (error) {
      console.error("Error saving education:", error);
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
          Education
        </h1>
        <Button onClick={handleCreate} className="bg-burnt-peach hover:bg-burnt-peach/90 text-white">
          <Plus className="mr-2 h-4 w-4" /> Add Education
        </Button>
      </div>

      <SectionCopy
        title="Education text"
        description="Headings shown on the Education tab."
        fields={[
          { key: "educationTitle", label: "Heading" },
          { key: "educationPageTitle", label: "Page title" },
          { key: "educationBody", label: "Intro", long: true },
          { key: "educationPageBody", label: "Page intro", long: true },
        ]}
      />

      <div className="grid gap-4">
        {education.map((edu) => (
          <Card key={edu.id} className="border-border/50 bg-card/50">
            <CardContent className="p-6">
                <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                        <div className="mt-1">
                            {edu.logo_url ? (
                              <img src={edu.logo_url} alt="" className="h-12 w-12 shrink-0 rounded-md border border-border bg-white object-contain p-0.5" />
                            ) : (
                              <GraduationCap className="h-6 w-6 text-verdigris" />
                            )}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">{edu.degree}</h3>
                            <p className="text-lg text-primary font-medium">{edu.university}</p>
                            <p className="text-sm text-muted-foreground">{edu.period}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(edu)}>
                            <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(edu.id)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>
          </Card>
        ))}

        {education.length === 0 && (
            <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg">
                No education entries found. Add one to start.
            </div>
        )}
      </div>

      <EducationModal 
        open={modalOpen} 
        onOpenChange={setModalOpen}
        initialData={editingEducation}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
