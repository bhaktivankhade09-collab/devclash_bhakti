import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Zap, 
  Send, 
  Save, 
  Download, 
  History, 
  Github, 
  Menu, 
  X, 
  ChevronRight, 
  Sparkles, 
  Eye, 
  Code, 
  Wand2,
  AlertCircle,
  Loader2
} from "lucide-react";
import { Toaster, toast } from "sonner";
import JSZip from "jszip";
import { saveAs } from "file-saver";

import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Textarea } from "./components/ui/textarea";
import { Input } from "./components/ui/input";
import { Badge } from "./components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { TooltipProvider } from "./components/ui/tooltip";

import { PromptSuggestions } from "./components/PromptSuggestions";
import { BlueprintCard } from "./components/BlueprintCard";
import { CodeEditor } from "./components/CodeEditor";
import { LivePreview } from "./components/LivePreview";
import { ExplainPanel } from "./components/ExplainPanel";
import { ImprovementDiff } from "./components/ImprovementDiff";
import { HistoryPage } from "./components/HistoryPage";

import { generateApp, improveApp } from "./lib/gemini";
import { Project, AIResponse } from "./types";

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [improvePrompt, setImprovePrompt] = useState("");
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [improving, setImproving] = useState(false);
  const [view, setView] = useState<'editor' | 'history'>('editor');
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');

  // Force dark mode
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim()) return toast.error("Please enter a prompt first");
    
    setLoading(true);
    try {
      const data = await generateApp(prompt);
      setProject({ ...data, prompt });
      toast.success("App generated successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error("Generation failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImprove = async () => {
    if (!improvePrompt.trim() || !project) return;
    
    setImproving(true);
    try {
      const data = await improveApp(improvePrompt, project.files, project.blueprint);
      setProject({ 
        ...project, 
        files: data.files, 
        blueprint: data.blueprint,
        improvementSummary: data.improvementSummary,
        beforeAfterChanges: data.beforeAfterChanges,
        explanation: data.explanation || project.explanation
      });
      setImprovePrompt("");
      toast.success("AI improvement applied!");
    } catch (err: any) {
      toast.error("Improvement failed: " + err.message);
    } finally {
      setImproving(false);
    }
  };

  const handleSave = async () => {
    if (!project) return;
    try {
      const res = await fetch("/api/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...project, id: project._id }),
      });
      const saved = await res.json();
      setProject({ ...project, _id: saved._id });
      toast.success("Project saved to your vault!");
    } catch (err) {
      toast.error("Save failed");
    }
  };

  const handleDownload = async () => {
    if (!project) return;
    const zip = new JSZip();
    zip.file("index.html", project.files["index.html"]);
    zip.file("style.css", project.files["style.css"]);
    zip.file("script.js", project.files["script.js"]);
    zip.file("README.md", `# ${project.appName}\n\n${project.description}\n\n## README\n${project.readme}`);
    
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, `${project.appName.replace(/\s+/g, '-').toLowerCase()}.zip`);
    toast.success("Project ZIP downloaded!");
  };

  const handleFileChange = (file: string, content: string) => {
    if (!project) return;
    setProject({
      ...project,
      files: {
        ...project.files,
        [file]: content
      }
    });
  };

  return (
    <TooltipProvider>
        <div className="min-h-screen bg-[#020204] text-slate-300 font-sans selection:bg-primary/30 relative overflow-hidden">
          <Toaster position="top-right" />
          
          {/* Ambient Background Glows */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-[10%] -left-[10%] w-[500px] h-[500px] ambient-indigo blur-[120px] rounded-full animate-pulse" />
            <div className="absolute top-[20%] -right-[10%] w-[400px] h-[400px] ambient-purple blur-[100px] rounded-full" />
            <div className="absolute -bottom-[10%] left-[20%] w-[300px] h-[300px] bg-emerald-600/5 blur-[120px] rounded-full" />
          </div>

          {/* Navigation */}
          <header className="sticky top-0 z-50 backdrop-blur-lg bg-black/20 border-b border-white/5 py-4 px-8 flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('editor')}>
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.4)]">
                <Zap className="w-5 h-5 text-white fill-white" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-white">
                OnePrompt <span className="text-slate-500 font-normal">Studio</span>
              </h1>
            </div>

            <nav className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setView(view === 'editor' ? 'history' : 'editor')}
                className="gap-2 text-white/70 hover:text-white"
              >
                {view === 'editor' ? <History className="w-4 h-4" /> : <Code className="w-4 h-4" />}
                {view === 'editor' ? 'History' : 'Back to Editor'}
              </Button>
              <div className="h-4 w-px bg-white/10 mx-2" />
              <Button variant="outline" size="sm" className="hidden sm:flex rounded-full bg-white/5 border-white/10">
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </Button>
            </nav>
          </header>

          <main className="relative z-10">
            <AnimatePresence mode="wait">
              {view === 'history' ? (
                <HistoryPage onOpen={(p) => { setProject(p); setView('editor'); }} />
              ) : (
                <div className="max-w-[1600px] mx-auto p-4 md:p-8 space-y-8">
                  {/* Prompt Section */}
                  {!project && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="max-w-3xl mx-auto text-center space-y-8 py-12 md:py-20"
                    >
                      <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-none text-white">
                        From Prompt to <span className="text-indigo-500 italic">App</span>
                      </h2>
                      <p className="text-xl text-slate-400 max-w-xl mx-auto font-medium">
                        Speak your vision. Our AI architect constructs your full-stack frontend with precision-crafted code.
                      </p>
                      
                      <div className="relative group">
                        <div className="absolute inset-0 bg-indigo-500/10 blur-3xl group-focus-within:bg-indigo-500/20 transition-all duration-500 rounded-3xl" />
                        <Card className="relative glass border-white/10 shadow-2xl overflow-hidden rounded-3xl p-1">
                          <CardContent className="p-4 flex flex-col gap-4 bg-black/40 rounded-[22px]">
                             <Textarea 
                                placeholder="Build a responsive habit tracker with a streak counter and visual progress rings..."
                                className="border-none bg-transparent focus-visible:ring-0 text-xl min-h-[140px] resize-none placeholder:text-slate-700 font-medium"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                             />
                             <div className="flex items-center justify-between">
                               <div className="flex gap-3">
                                  <Badge variant="secondary" className="bg-white/5 text-slate-400 border border-white/5">GPT-4o</Badge>
                                  <Badge variant="secondary" className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">Gemini 1.5 Pro</Badge>
                               </div>
                               <Button size="lg" onClick={handleGenerate} disabled={loading} className="rounded-xl gap-2 font-bold px-10 bg-indigo-600 hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-500/20 py-6">
                                 {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                                 {loading ? 'Generating...' : 'Build Application'}
                               </Button>
                             </div>
                          </CardContent>
                        </Card>
                      </div>

                      <PromptSuggestions onSelect={setPrompt} />
                    </motion.div>
                  )}

                  {/* Editor View */}
                  {project && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in zoom-in-95 duration-500">
                      {/* Left Column: Input & Info */}
                      <div className="lg:col-span-4 space-y-6">
                        <Card className="bg-white/[0.03] border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                          <CardHeader className="bg-white/[0.02] pb-5 border-b border-white/5 flex flex-row items-center justify-between p-6">
                            <div>
                              <CardTitle className="text-2xl font-bold tracking-tight text-white">{project.appName}</CardTitle>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Active Development</p>
                              </div>
                            </div>
                            <ExplainPanel explanation={project.explanation} />
                          </CardHeader>
                          <CardContent className="p-6 space-y-8">
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">Project Concept</label>
                              <p className="text-sm text-slate-400 leading-relaxed font-medium">
                                {project.description}
                              </p>
                            </div>

                            <BlueprintCard blueprint={project.blueprint} />

                            <div className="space-y-3">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-purple-400">AI Refinement</label>
                              <div className="relative group">
                                <Input 
                                  placeholder="Refine button styles or add a new feature..." 
                                  className="bg-black/40 border-white/10 focus-visible:ring-indigo-500 h-12 rounded-xl pl-4 pr-12 text-sm"
                                  value={improvePrompt}
                                  onChange={(e) => setImprovePrompt(e.target.value)}
                                  onKeyDown={(e) => e.key === 'Enter' && handleImprove()}
                                />
                                <Button 
                                  size="icon" 
                                  onClick={handleImprove} 
                                  disabled={improving} 
                                  className="absolute right-1 top-1 h-10 w-10 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/20"
                                >
                                  {improving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                </Button>
                              </div>
                            </div>

                            {project.beforeAfterChanges && project.beforeAfterChanges.length > 0 && (
                              <ImprovementDiff 
                                summary={project.improvementSummary || ""} 
                                changes={project.beforeAfterChanges} 
                              />
                            )}

                            <div className="pt-4 grid grid-cols-2 gap-4">
                              <Button variant="outline" className="h-12 rounded-xl bg-white/5 hover:bg-white/10 border-white/10 gap-2 font-semibold text-xs transition-all" onClick={handleSave}>
                                <Save className="w-4 h-4" />
                                Save Studio
                              </Button>
                              <Button className="h-12 rounded-xl bg-indigo-600 hover:bg-indigo-500 gap-2 font-semibold text-xs shadow-lg shadow-indigo-600/20 transition-all border-none" onClick={handleDownload}>
                                <Download className="w-4 h-4" />
                                Export Zip
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Right Column: Code & Preview */}
                      <div className="lg:col-span-8 space-y-6 min-h-[750px] flex flex-col">
                        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full h-full flex flex-col">
                          <div className="flex items-center justify-between mb-2">
                             <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                                <Button 
                                  onClick={() => setActiveTab('preview')}
                                  className={`px-6 py-1 text-xs font-bold rounded-lg transition-all ${activeTab === 'preview' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-transparent text-slate-500 hover:text-slate-300'}`}
                                  variant="ghost"
                                >
                                  Live Preview
                                </Button>
                                <Button 
                                  onClick={() => setActiveTab('code')}
                                  className={`px-6 py-1 text-xs font-bold rounded-lg transition-all ${activeTab === 'code' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-transparent text-slate-500 hover:text-slate-300'}`}
                                  variant="ghost"
                                >
                                  Code Studio
                                </Button>
                             </div>
                            <Button variant="ghost" size="sm" onClick={() => setProject(null)} className="text-white/20 hover:text-red-400 font-bold uppercase tracking-widest text-[10px]">
                              <X className="w-4 h-4 mr-1" />
                              Discard Session
                            </Button>
                          </div>

                          <div className="flex-1 min-h-0">
                            <TabsContent value="preview" className="w-full h-full mt-0 focus-visible:ring-0">
                               <LivePreview files={project.files} />
                            </TabsContent>
                            <TabsContent value="code" className="w-full h-full mt-0 focus-visible:ring-0">
                               <CodeEditor files={project.files} onChange={handleFileChange} />
                            </TabsContent>
                          </div>
                        </Tabs>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </AnimatePresence>
          </main>

          {/* Footer Pipeline Status */}
          <footer className="h-12 bg-black border-t border-white/5 flex items-center px-8 text-[10px] gap-8 mt-auto relative z-10">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 uppercase font-bold tracking-widest leading-none">Pipeline Status</span>
              <div className="flex gap-2 items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"></span>
                <span className="text-slate-300">Operational</span>
              </div>
              <div className="w-4 h-[1px] bg-slate-800"></div>
              <div className="flex gap-2 items-center">
                <span className={`w-1.5 h-1.5 rounded-full ${loading || improving ? 'bg-indigo-500 animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.4)]' : 'bg-slate-700'}`}></span>
                <span className={loading || improving ? 'text-indigo-400' : 'text-slate-500'}>
                  {loading ? 'Processing Prompt...' : improving ? 'Refining Architecture...' : 'Waiting for input'}
                </span>
              </div>
            </div>
            <div className="ml-auto flex gap-6 text-slate-600 font-mono tracking-tighter">
              <span>REGION: CLOUD-RUN-WEST</span>
              <span>ENGINE: GEMINI-PRO-LATEST</span>
            </div>
          </footer>
        </div>
      </TooltipProvider>
    );
}
