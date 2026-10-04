"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Plus, Pencil, Trash2, MapPin, Calendar, Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ExperienceModal } from "@/components/admin/experience-modal";
import { saveExperienceAction, deleteExperienceAction } from "@/actions/experience";
import { toast } from "sonner";
import { SectionCopy } from "@/components/admin/section-copy";

export default function AdminExperiencePage() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchExperience();
  }, []);

  const fetchExperience = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("experience")
      .select("id, company, position, location, description, duration, start_date, end_date, type, skills, logo_url, company_url, links, is_development, created_at")
      .order("id", { ascending: true });

    if (error) console.error("Error fetching experience:", error);
    else setExperiences(data || []);
    setLoading(false);
  };

  const handleCreate = () => {
    setEditingExperience(null);
    setModalOpen(true);
  };

  const handleEdit = (exp) => {
    setEditingExperience(exp);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this experience entry?")) return;

    const result = await deleteExperienceAction(id);
    if (result.success) {
      toast.success("Experience deleted");
      fetchExperience();
    } else {
      toast.error(result.error || "Error deleting experience");
    }
  };

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      const result = await saveExperienceAction(formData, editingExperience?.id || null);
      if (result.success) {
        setModalOpen(false);
        fetchExperience();
        toast.success("Experience saved successfully");
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error saving experience:", error);
      toast.error(error.message || "Failed to save changes.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-display font-bold text-charcoal-blue dark:text-verdigris">Experience</h1>
        <Button onClick={handleCreate} className="bg-burnt-peach hover:bg-burnt-peach/90 text-white">
          <Plus className="mr-2 h-4 w-4" /> Add Experience
        </Button>
      </div>

      <SectionCopy
        title="Experience text"
        description="Headings shown on the Experience tab."
        fields={[
          { key: "experienceTitle", label: "Heading" },
          { key: "experiencePageTitle", label: "Page title" },
          { key: "experienceDevHeading", label: "Group heading" },
          { key: "experienceOtherHeading", label: "Other roles heading" },
          { key: "experienceBody", label: "Intro", long: true },
          { key: "experiencePageBody", label: "Page intro", long: true },
        ]}
      />

      <div className="grid gap-4">
        {experiences.map((exp) => (
          <Card key={exp.id} className="border-border/50 bg-card/50">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {exp.logo_url ? (
                        <img src={exp.logo_url} alt="" className="h-12 w-12 shrink-0 rounded-md border border-border bg-white object-contain p-0.5" />
                      ) : null}
                      <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold">{exp.position}</h3>
                        {exp.is_development !== false ? (
                          <Badge variant="secondary" className="bg-tuscan-sun/20 text-tuscan-sun border-tuscan-sun/30">
                            Dev Role
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground whitespace-nowrap">
                            Other Exp
                          </Badge>
                        )}
                      </div>
                      <p className="text-lg text-primary font-medium">{exp.company}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {exp.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {exp.location}
                    </span>
                    {exp.type && (
                      <span className="flex items-center gap-1">
                        <Briefcase className="h-3 w-3" /> {exp.type}
                      </span>
                    )}
                  </div>

                  <p className="text-muted-foreground">{exp.description}</p>

                  {exp.skills && exp.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {exp.skills.map((skill, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs bg-background/50">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  )}

                </div>

                <div className="flex md:flex-col gap-2 justify-start md:border-l md:pl-4 border-border/50">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(exp)}>
                    <Pencil className="h-4 w-4 mr-2" /> Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(exp.id)}>
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {experiences.length === 0 && (
          <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg">
            No experience entries found. Add one to get started.
          </div>
        )}
      </div>

      <ExperienceModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        initialData={editingExperience}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
