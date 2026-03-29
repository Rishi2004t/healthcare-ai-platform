import { useState, useEffect, useMemo } from "react";
import {
  FileText,
  TrendingUp,
  Award,
  Sparkles,
  Briefcase,
  Mail,
  Users,
  Target,
  PenTool,
  Search,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { HeroSection } from "@/components/Dashboard/HeroSection";
import { StatCard } from "@/components/Dashboard/StatCard";
import { QuickActionCard } from "@/components/Dashboard/QuickActionCard";
import { ActivityTimeline } from "@/components/Dashboard/ActivityTimeline";
import { motion } from "framer-motion";
import { Scroll3D } from "@/components/Animations";

interface Skill {
  skill: string;
  proficiency: number;
}

export default function Dashboard() {
  const [resumeData, setResumeData] = useState<any>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [educations, setEducations] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [jobsApplied, setJobsApplied] = useState(0);
  const [userName, setUserName] = useState<string | undefined>();

  useEffect(() => {
    loadResumeData();
    loadJobStats();
    loadUserName();
  }, []);

  const loadUserName = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .single();
        if (profile?.full_name) {
          setUserName(profile.full_name.split(" ")[0]);
        }
      }
    } catch (error) {
      console.error("Error loading user name:", error);
    }
  };

  const loadJobStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { count } = await supabase
          .from("jobs")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id);
        setJobsApplied(count || 0);
      }
    } catch (error) {
      console.error("Error loading job stats:", error);
    }
  };

  const loadResumeData = async () => {
    try {
      const { data: resumes } = await supabase
        .from("resumes")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (resumes) {
        setResumeData(resumes);

        const [expData, eduData, skillData, projData] = await Promise.all([
          supabase.from("resume_experience").select("*").eq("resume_id", resumes.id).order("order_index"),
          supabase.from("resume_education").select("*").eq("resume_id", resumes.id).order("order_index"),
          supabase.from("resume_skills").select("*").eq("resume_id", resumes.id).order("order_index"),
          supabase.from("resume_projects").select("*").eq("resume_id", resumes.id).order("order_index"),
        ]);

        setExperiences(expData.data || []);
        setEducations(eduData.data || []);
        setSkills(skillData.data || []);
        setProjects(projData.data || []);
      }
    } catch (error) {
      console.error("Error loading resume data:", error);
    }
  };

  const resumeCompletion = useMemo(() => {
    let total = 0;
    let filled = 0;

    total += 5;
    if (resumeData?.name) filled++;
    if (resumeData?.email) filled++;
    if (resumeData?.phone) filled++;
    if (resumeData?.linkedin) filled++;
    if (resumeData?.github) filled++;

    total += 1;
    if (resumeData?.summary) filled++;

    total += 1;
    if (experiences.length > 0) filled++;

    total += 1;
    if (educations.length > 0) filled++;

    total += 1;
    if (skills.length > 0) filled++;

    total += 1;
    if (projects.length > 0) filled++;

    return Math.round((filled / total) * 100);
  }, [resumeData, experiences, educations, skills, projects]);

  const avgSkillProficiency = useMemo(() => {
    if (skills.length === 0) return 0;
    const sum = skills.reduce((acc, skill) => acc + skill.proficiency, 0);
    return Math.round(sum / skills.length);
  }, [skills]);

  const quickActions = [
    {
      title: "Create Resume",
      description: "Build a professional resume with AI assistance",
      icon: FileText,
      route: "/builder",
      gradient: "bg-gradient-to-r from-blue-500 to-cyan-500",
    },
    {
      title: "Edit Resume",
      description: "Update and refine your existing resume",
      icon: PenTool,
      route: "/builder",
      gradient: "bg-gradient-to-r from-purple-500 to-pink-500",
    },
    {
      title: "Find Jobs",
      description: "Discover opportunities matching your profile",
      icon: Search,
      route: "/job-finder",
      gradient: "bg-gradient-to-r from-green-500 to-emerald-500",
    },
    {
      title: "Cold Email",
      description: "Craft compelling outreach emails",
      icon: Mail,
      route: "/cold-email",
      gradient: "bg-gradient-to-r from-orange-500 to-amber-500",
    },
    {
      title: "Track Applications",
      description: "Monitor your job application progress",
      icon: Target,
      route: "/job-tracker",
      gradient: "bg-gradient-to-r from-rose-500 to-red-500",
    },
    {
      title: "Manage Contacts",
      description: "Organize your professional network",
      icon: Users,
      route: "/contacts",
      gradient: "bg-gradient-to-r from-indigo-500 to-violet-500",
    },
  ];

  return (
    <div className="min-h-screen pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <HeroSection userName={userName} />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard
            title="Profile Completion"
            value={resumeCompletion}
            suffix="%"
            icon={TrendingUp}
            gradient="bg-gradient-to-r from-blue-500 to-cyan-500"
            delay={0}
          />
          <StatCard
            title="Jobs Applied"
            value={jobsApplied}
            icon={Briefcase}
            gradient="bg-gradient-to-r from-purple-500 to-pink-500"
            delay={0.1}
          />
          <StatCard
            title="Skills Added"
            value={skills.length}
            icon={Award}
            gradient="bg-gradient-to-r from-green-500 to-emerald-500"
            delay={0.2}
          />
          <StatCard
            title="Avg. Skill Level"
            value={avgSkillProficiency}
            suffix="%"
            icon={Sparkles}
            gradient="bg-gradient-to-r from-amber-500 to-orange-500"
            delay={0.3}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-8 mb-10">
          {/* Quick Actions */}
          <div className="w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Quick Actions</h3>
                <p className="text-sm text-muted-foreground">Jump into what you need</p>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {quickActions.map((action, index) => (
                <QuickActionCard
                  key={action.title}
                  {...action}
                  delay={index * 0.1}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Activity Timeline */}
          <Scroll3D variant="perspectiveSlide">
            <div className="backdrop-blur-xl bg-card/80 border border-border/50 rounded-3xl p-6">
              <ActivityTimeline />
            </div>
          </Scroll3D>

          {/* Skills Overview */}
          <Scroll3D variant="cardFlip" delay={0.1}>
            <div className="backdrop-blur-xl bg-card/80 border border-border/50 rounded-3xl p-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 mb-6"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">Top Skills</h3>
                  <p className="text-sm text-muted-foreground">Your strongest abilities</p>
                </div>
              </motion.div>

              {skills.length > 0 ? (
                <div className="space-y-4">
                  {skills.slice(0, 6).map((skill, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="group"
                    >
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                          {skill.skill}
                        </span>
                        <span className="text-muted-foreground">{skill.proficiency}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.proficiency}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: 0.3 + idx * 0.1 }}
                          className="h-full bg-gradient-primary rounded-full"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mb-4"
                  >
                    <Award className="w-8 h-8 text-muted-foreground" />
                  </motion.div>
                  <p className="text-muted-foreground font-medium">No skills added yet</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Start building your resume to track skills
                  </p>
                </div>
              )}
            </div>
          </Scroll3D>
        </div>
      </div>
    </div>
  );
}
