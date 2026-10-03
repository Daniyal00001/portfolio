"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { DashboardStats } from "@/components/admin/dashboard-stats";
import { Loader2, Plus, Trash2, Edit, ExternalLink, Github, Trophy, Video, Newspaper, LayoutDashboard, Database, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectModal } from "@/components/admin/project-modal";
import { AchievementModal } from "@/components/admin/achievement-modal";
import { toast } from "sonner";
import { saveAchievementAction, deleteAchievementAction } from "@/actions/achievements";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [fetchingData, setFetchingData] = useState(false);
  const [user, setUser] = useState(null);

  // Projects State
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  // Achievements State
  const [achievementModalOpen, setAchievementModalOpen] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const checkAuth = useCallback(async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      toast.error("Session expired. Please login again.");
      window.location.href = "/login";
    } else {
      setUser(session.user);
    }
  }, []);

  const fetchProjects = useCallback(async () => {
    const { data, error } = await supabase.from("projects").select("*").order("id", { ascending: false });
    if (error) console.error("Error fetching projects:", error);
    else setProjects(data || []);
  }, []);

  const fetchAchievements = useCallback(async () => {
    const { data, error } = await supabase.from("achievements").select("*").order("date", { ascending: false });
    if (error) console.error("Error fetching achievements:", error);
    else setAchievements(data || []);
  }, []);

  const fetchData = useCallback(async () => {
    setFetchingData(true);
    await Promise.all([fetchProjects(), fetchAchievements()]);
    setFetchingData(false);
    setLoading(false);
  }, [fetchProjects, fetchAchievements]);

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

  // --- Achievements Handlers ---
  const handleCreateAchievement = () => {
    setEditingAchievement(null);
    setAchievementModalOpen(true);
  };

  const handleEditAchievement = (achievement) => {
    setEditingAchievement(achievement);
    setAchievementModalOpen(true);
  };

  const handleDeleteAchievement = async (id) => {
    if (!confirm("Are you sure you want to delete this achievement?")) return;
    try {
      const result = await deleteAchievementAction(id);
      if (result.success) {
        toast.success("Achievement deleted");
        fetchAchievements();
      } else {
        toast.error(result.error || "Error deleting achievement");
      }
    } catch (error) {
      console.error("Error deleting achievement:", error);
      toast.error("Error deleting achievement");
    }
  };

  const handleSubmitAchievement = async (formData) => {
    setIsSubmitting(true);
    try {
      const result = await saveAchievementAction(formData, editingAchievement?.id || null);
      if (result.success) {
        setAchievementModalOpen(false);
        fetchAchievements();
        toast.success("Achievement saved successfully");
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error saving achievement:", error);
      toast.error(error.message || "Failed to save achievement.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAchievementIcon = (type) => {
    switch (type) {
      case "youtube":
        return <Video className="h-4 w-4" />;
      case "article":
        return <Newspaper className="h-4 w-4" />;
      case "news":
        return <Newspaper className="h-4 w-4" />;
      default:
        return <Trophy className="h-4 w-4" />;
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
            Welcome back, {user?.user_metadata?.username || "Admin"}
          </h1>
          <p className="text-muted-foreground">Here&apos;s what&apos;s happening in your portfolio today.</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleCreateProject}
            className="bg-gradient-to-r from-charcoal-blue to-charcoal-blue/80 hover:from-charcoal-blue/90 hover:to-charcoal-blue/70 text-white shadow-lg shadow-charcoal-blue/20 transition-all hover:scale-105"
          >
            <Plus className="mr-2 h-4 w-4" /> New Project
          </Button>
          <Button
            onClick={handleCreateAchievement}
            variant="outline"
            className="border-verdigris/50 text-verdigris hover:bg-verdigris/10 transition-all hover:scale-105"
          >
            <Trophy className="mr-2 h-4 w-4" /> New Achievement
          </Button>
        </div>
      </div>

      <DashboardStats />

      <Tabs defaultValue="projects" className="w-full">
        <TabsList className="grid w-full max-w-[400px] grid-cols-2 mb-8 bg-muted/50 p-1 rounded-xl">
          <TabsTrigger value="projects" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">
            Projects
          </TabsTrigger>
          <TabsTrigger value="achievements" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">
            Achievements
          </TabsTrigger>
        </TabsList>

        {/* PROJECTS TAB */}
        <TabsContent value="projects" className="space-y-6 focus-visible:outline-none">
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
                    <Card className="border-border/50 bg-card/60 backdrop-blur-sm hover:border-verdigris/30 hover:bg-card/80 transition-all duration-300 group overflow-hidden">
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
                                  <Badge variant="outline" className="border-border/50 bg-background/50">
                                    {project.year}
                                  </Badge>
                                </div>
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
        </TabsContent>

        {/* ACHIEVEMENTS TAB */}
        <TabsContent value="achievements" className="space-y-6 focus-visible:outline-none">
          <AnimatePresence mode="wait">
            {fetchingData ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex justify-center p-12">
                <Loader2 className="animate-spin h-8 w-8 text-muted-foreground" />
              </motion.div>
            ) : achievements.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-20 text-muted-foreground border-2 border-dashed border-border/50 rounded-2xl bg-muted/10"
              >
                <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Trophy className="h-8 w-8 text-muted-foreground/50" />
                </div>
                <h3 className="text-lg font-semibold mb-1">No achievements yet</h3>
                <p className="mb-4 text-center max-w-sm">Showcase your awards, certifications, and media features here.</p>
                <Button onClick={handleCreateAchievement} variant="outline" className="border-dashed hover:border-solid hover:bg-muted">
                  Add Achievement
                </Button>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-4">
                {achievements.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="border-border/50 bg-card/60 backdrop-blur-sm hover:border-verdigris/30 hover:bg-card/80 transition-all duration-300 group">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="flex-1 flex gap-4 md:gap-6">
                            {item.thumbnail_url ? (
                              <div className="hidden md:block w-32 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-muted border border-border/50 shadow-sm group-hover:shadow-md transition-all">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={item.thumbnail_url}
                                  alt={item.title}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                              </div>
                            ) : (
                              <div className="hidden md:flex w-32 h-24 rounded-lg bg-muted/30 border border-border/50 items-center justify-center flex-shrink-0 text-muted-foreground/30">
                                <Trophy className="h-8 w-8" />
                              </div>
                            )}

                            <div className="space-y-2 flex-1 min-w-0">
                              <div className="flex items-center gap-3 flex-wrap">
                                <Badge
                                  variant="outline"
                                  className="flex items-center gap-1.5 px-2.5 py-0.5 border-verdigris/20 bg-verdigris/5 text-verdigris"
                                >
                                  {getAchievementIcon(item.type)}
                                  <span className="capitalize font-medium">{item.type}</span>
                                </Badge>
                                <span className="text-xs text-muted-foreground font-mono bg-muted/50 px-2 py-0.5 rounded">{item.date}</span>
                              </div>
                              <h3 className="text-xl font-bold line-clamp-1 group-hover:text-charcoal-blue dark:group-hover:text-verdigris transition-colors">
                                {item.title}
                              </h3>
                              <p className="text-muted-foreground text-sm line-clamp-2 pr-4">{item.description}</p>
                              {item.url && (
                                <a
                                  href={item.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 text-xs font-medium text-verdigris hover:underline pt-1"
                                >
                                  <ExternalLink className="h-3 w-3" /> View Source
                                </a>
                              )}
                            </div>
                          </div>

                          <div className="flex md:flex-row md:items-center gap-2 md:pl-6 md:border-l border-border/30 justify-end md:w-auto w-full pt-4 md:pt-0 border-t md:border-t-0">
                            <Button variant="outline" size="sm" className="hidden md:flex" onClick={() => handleEditAchievement(item)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="md:hidden flex-1" onClick={() => handleEditAchievement(item)}>
                              <Edit className="h-4 w-4 mr-2" /> Edit
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10 dark:hover:bg-destructive/10 hidden md:flex"
                              onClick={() => handleDeleteAchievement(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10 dark:hover:bg-destructive/10 md:hidden flex-1"
                              onClick={() => handleDeleteAchievement(item.id)}
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
        </TabsContent>
      </Tabs>

      <ProjectModal
        open={projectModalOpen}
        onOpenChange={setProjectModalOpen}
        initialData={editingProject}
        onSubmit={handleSubmitProject}
        isSubmitting={isSubmitting}
      />

      <AchievementModal
        open={achievementModalOpen}
        onOpenChange={setAchievementModalOpen}
        initialData={editingAchievement}
        onSubmit={handleSubmitAchievement}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
