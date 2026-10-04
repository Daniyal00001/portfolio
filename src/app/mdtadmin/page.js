"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Trash2, Edit, ExternalLink, Github, Database } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProjectModal } from "@/components/admin/project-modal";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { SectionCopy } from "@/components/admin/section-copy";

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [fetchingData, setFetchingData] = useState(false);

  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const checkAuth = useCallback(async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      toast.error("Session expired. Please login again.");
      window.location.href = "/login";
    }
  }, []);

  const fetchProjects = useCallback(async () => {
    const { data, error } = await supabase.from("projects").select("*").order("sort_order", { ascending: true, nullsFirst: false }).order("id", { ascending: true });
    if (error) console.error("Error fetching projects:", error);
    else setProjects(data || []);
  }, []);

  const fetchData = useCallback(async () => {
    setFetchingData(true);
    await fetchProjects();
    setFetchingData(false);
    setLoading(false);
  }, [fetchProjects]);

  useEffect(() => {
    checkAuth();
    fetchData();
  }, [checkAuth, fetchData]);

  // --- Projects Handlers ---
  const handleCreateProject = () => {
    setEditingProject(null);
    setProjectModalOpen(true);
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setProjectModalOpen(true);
  };

  const handleToggleVisible = async (project, visible) => {
    setProjects((current) => current.map((item) => (item.id === project.id ? { ...item, visible } : item)));
    const { error } = await supabase.from("projects").update({ visible }).eq("id", project.id);
    if (error) {
      setProjects((current) => current.map((item) => (item.id === project.id ? { ...item, visible: project.visible !== false } : item)));
      toast.error("Could not update that project.");
      return;
    }
    toast.success(visible ? "Project is now shown" : "Project is now hidden");
  };

  const handleDeleteProject = async (id) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) toast.error("Error deleting project");
    else {
      toast.success("Project deleted");
      fetchProjects();
    }
  };

  const handleSubmitProject = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingProject) {
        const { error } = await supabase.from("projects").update(formData).eq("id", editingProject.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("projects").insert([formData]);
        if (error) throw error;
      }
      setProjectModalOpen(false);
      fetchProjects();
      toast.success("Project saved successfully");
    } catch (error) {
      console.error("Error saving project:", error);
      toast.error("Failed to save project.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-charcoal-blue dark:text-verdigris" />
          <p className="text-muted-foreground animate-pulse">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-charcoal-blue dark:text-verdigris mb-1">
            Projects
          </h1>
          <p className="text-muted-foreground">The work shown on the Projects tab.</p>
        </div>
        <Button
          onClick={handleCreateProject}
          className="bg-gradient-to-r from-charcoal-blue to-charcoal-blue/80 hover:from-charcoal-blue/90 hover:to-charcoal-blue/70 text-white shadow-lg shadow-charcoal-blue/20 transition-all hover:scale-105"
        >
          <Plus className="mr-2 h-4 w-4" /> New Project
        </Button>
      </div>

      <div className="space-y-6">
          <SectionCopy
            title="Projects text"
            description="Headings shown on the Projects tab."
            fields={[
              { key: "projectsTitle", label: "Heading" },
              { key: "projectsPageTitle", label: "Page title" },
              { key: "projectsBody", label: "Intro", long: true },
              { key: "projectsPageBody", label: "Page intro", long: true },
            ]}
          />
          <AnimatePresence mode="wait">
            {fetchingData ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex justify-center p-12">
                <Loader2 className="animate-spin h-8 w-8 text-muted-foreground" />
              </motion.div>
            ) : projects.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-20 text-muted-foreground border-2 border-dashed border-border/50 rounded-2xl bg-muted/10"
              >
                <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Database className="h-8 w-8 text-muted-foreground/50" />
                </div>
                <h3 className="text-lg font-semibold mb-1">No projects yet</h3>
                <p className="mb-4 text-center max-w-sm">Get started by creating your first project to showcase on your portfolio.</p>
                <Button onClick={handleCreateProject} variant="outline" className="border-dashed hover:border-solid hover:bg-muted">
                  Create Project
                </Button>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-4">
                {projects.map((project, index) => (
                  <motion.div key={project.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                    <Card className={`border-border/50 bg-card/60 backdrop-blur-sm hover:border-verdigris/30 hover:bg-card/80 transition-all duration-300 group overflow-hidden ${project.visible === false ? "opacity-60" : ""}`}>
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row">
                          <div className="flex-1 p-6 space-y-4">
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <div className="flex items-center gap-3 flex-wrap">
                                  <h3 className="text-xl font-bold text-foreground group-hover:text-charcoal-blue dark:group-hover:text-verdigris transition-colors">
                                    {project.name}
                                  </h3>
                                  {project.featured && <Badge className="bg-tuscan-sun/90 text-charcoal-blue border-none shadow-sm">Featured</Badge>}
                                  {project.visible === false && <Badge variant="outline">Hidden</Badge>}
                                  <Badge variant="outline" className="border-border/50 bg-background/50">
                                    {project.year}
                                  </Badge>
                                </div>
                                {project.associated_with ? (
                                  <p className="text-xs text-muted-foreground">Associated with {project.associated_with}</p>
                                ) : null}
                                <p className="text-muted-foreground text-sm line-clamp-2">{project.description}</p>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2 pt-2">
                              {project.tech?.slice(0, 6).map((t, idx) => (
                                <Badge
                                  key={idx}
                                  variant="secondary"
                                  className="bg-muted/50 hover:bg-muted text-xs font-normal border border-border/30"
                                >
                                  {t}
                                </Badge>
                              ))}
                              {(project.tech?.length || 0) > 6 && (
                                <Badge variant="outline" className="text-xs text-muted-foreground">
                                  +{project.tech.length - 6} more
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="flex md:flex-col gap-2 p-6 md:border-l border-border/30 bg-muted/5 justify-end md:justify-center min-w-[140px]">
                            <label className="flex items-center justify-between gap-3 rounded-md border border-border/50 px-2 py-1.5 text-sm">
                              <span>{project.visible === false ? "Hidden" : "Shown"}</span>
                              <Switch
                                checked={project.visible !== false}
                                onCheckedChange={(checked) => handleToggleVisible(project, checked)}
                                aria-label={`${project.visible === false ? "Show" : "Hide"} ${project.name}`}
                              />
                            </label>
                            {project.github_url && (
                              <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground hover:text-foreground" asChild>
                                <a href={project.github_url} target="_blank" rel="noreferrer">
                                  <Github className="h-4 w-4 mr-2" /> Repo
                                </a>
                              </Button>
                            )}
                            {project.live_url && (
                              <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground hover:text-foreground" asChild>
                                <a href={project.live_url} target="_blank" rel="noreferrer">
                                  <ExternalLink className="h-4 w-4 mr-2" /> Live Demo
                                </a>
                              </Button>
                            )}
                            <div className="h-px bg-border/50 w-full my-1 hidden md:block" />
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full justify-start hover:bg-background hover:text-charcoal-blue dark:hover:text-verdigris"
                              onClick={() => handleEditProject(project)}
                            >
                              <Edit className="h-4 w-4 mr-2" /> Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 dark:hover:bg-destructive/10"
                              onClick={() => handleDeleteProject(project.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" /> Delete
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
      </div>

      <ProjectModal
        open={projectModalOpen}
        onOpenChange={setProjectModalOpen}
        initialData={editingProject}
        onSubmit={handleSubmitProject}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
