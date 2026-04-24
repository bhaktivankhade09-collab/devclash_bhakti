import * as React from "react";
import { useState, useEffect } from "react";
import { Project } from "../types";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { History, Layout, Calendar, ChevronRight, Copy, Search, Trash2 } from "lucide-react";
import { Input } from "./ui/input";

interface HistoryPageProps {
  onOpen: (p: Project) => void;
}

export function HistoryPage({ onOpen }: HistoryPageProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/history")
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
        setLoading(false);
      });
  }, []);

  const filtered = projects.filter(p => 
    p.appName.toLowerCase().includes(search.toLowerCase()) || 
    p.description.toLowerCase().includes(search.toLowerCase())
  );

  const deleteProject = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this project?')) {
      await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      setProjects(projects.filter(p => p._id !== id));
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white flex items-center gap-3">
            <History className="w-10 h-10 text-primary" />
            Project Vault
          </h1>
          <p className="text-white/60 mt-2">Relive your past creations and bring them back to life.</p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <Input 
            placeholder="Search projects..." 
            className="pl-10 bg-white/5 border-white/10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-250px)] pr-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array(6).fill(0).map((_, i) => (
              <Card key={i} className="h-[200px] animate-pulse bg-white/5 border-white/10" />
            ))
          ) : filtered.length === 0 ? (
            <div className="col-span-full py-20 text-center space-y-4">
              <Layout className="w-16 h-16 mx-auto text-white/10" />
              <p className="text-white/40 text-lg">No projects excavated yet. Go build something brave.</p>
            </div>
          ) : (
            filtered.map((p) => (
              <Card 
                key={p._id}
                className="group relative overflow-hidden bg-white/5 border-white/10 hover:border-primary/50 transition-all cursor-pointer hover:-translate-y-1"
                onClick={() => onOpen(p)}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl font-bold truncate pr-8">{p.appName}</CardTitle>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="w-8 h-8 hover:bg-red-500/20 hover:text-red-400"
                        onClick={(e) => deleteProject(p._id!, e)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-white/50 line-clamp-2 min-h-[40px]">{p.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-white/30 font-bold">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" />
                      {new Date(p.createdAt!).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1 text-primary group-hover:gap-2 transition-all">
                      Open Project <ChevronRight className="w-3 h-3" />
                    </div>
                  </div>
                </CardContent>
                <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
