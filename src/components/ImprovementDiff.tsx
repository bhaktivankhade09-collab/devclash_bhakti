import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { ChangeSummary } from "../types";
import { Undo2, Redo2, CheckCircle2 } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";

interface ImprovementDiffProps {
  summary: string;
  changes: ChangeSummary[];
}

export function ImprovementDiff({ summary, changes }: ImprovementDiffProps) {
  return (
    <Card className="bg-emerald-500/5 border-emerald-500/20 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-lg font-bold flex items-center gap-2 text-emerald-400">
          <CheckCircle2 className="w-5 h-5" />
          AI Improvement Applied
        </CardTitle>
        <p className="text-sm text-white/60">{summary}</p>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px] pr-4">
          <div className="space-y-4">
            {changes.map((c, i) => (
              <div key={i} className="space-y-2 pb-4 border-b border-white/5 last:border-none">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-white/40">{c.file}</span>
                  <span className="text-xs text-emerald-500/80 italic">{c.reason}</span>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <div className="p-2 rounded bg-red-500/10 border border-red-500/20 text-[10px] font-mono text-red-400 opacity-50 truncate">
                    <Undo2 className="inline w-3 h-3 mr-1" />
                    {c.before.slice(0, 50)}...
                  </div>
                  <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-400 truncate text-bold">
                    <Redo2 className="inline w-3 h-3 mr-1" />
                    {c.after.slice(0, 60)}...
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
