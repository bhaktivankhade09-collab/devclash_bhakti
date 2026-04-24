import { Button } from "./ui/button";
import { Sparkles, Activity, FileText, Layout } from "lucide-react";

const SUGGESTIONS = [
  { id: "resume", text: "Build a resume analyzer", icon: FileText },
  { id: "expense", text: "Create an expense tracker", icon: Activity },
  { id: "portfolio", text: "Design a portfolio website", icon: Layout },
  { id: "habit", text: "Build a responsive habit tracker with streak counter", icon: Sparkles },
];

interface PromptSuggestionsProps {
  onSelect: (text: string) => void;
}

export function PromptSuggestions({ onSelect }: PromptSuggestionsProps) {
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {SUGGESTIONS.map((s) => (
        <Button
          key={s.id}
          variant="outline"
          size="sm"
          onClick={() => onSelect(s.text)}
          className="rounded-full bg-white/5 border-white/10 hover:bg-white/10 transition-all group"
        >
          <s.icon className="w-3.5 h-3.5 mr-2 text-primary group-hover:scale-110 transition-transform" />
          {s.text}
        </Button>
      ))}
    </div>
  );
}
