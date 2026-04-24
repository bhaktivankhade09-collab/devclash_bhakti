import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { AppBlueprint } from "../types";
import { User, Layers, Cpu, Database, Play } from "lucide-react";
import { Badge } from "./ui/badge";

interface BlueprintCardProps {
  blueprint: AppBlueprint;
}

export function BlueprintCard({ blueprint }: BlueprintCardProps) {
  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur-xl hover:bg-white/10 transition-colors">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Layers className="w-5 h-5 text-primary" />
          AI Blueprint: {blueprint.appName}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="space-y-3">
          <h4 className="flex items-center gap-2 text-sm font-semibold text-white/70 uppercase tracking-wider">
            <User className="w-4 h-4" />
            Target Users
          </h4>
          <div className="flex flex-wrap gap-2">
            {blueprint.targetUsers.map((u, i) => (
              <Badge key={i} variant="secondary" className="bg-blue-500/10 text-blue-400 border-none">
                {u}
              </Badge>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h4 className="flex items-center gap-2 text-sm font-semibold text-white/70 uppercase tracking-wider">
            <Play className="w-4 h-4" />
            Key Features
          </h4>
          <ul className="grid grid-cols-1 gap-1 text-sm text-white/80">
            {blueprint.keyFeatures.map((f, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                {f}
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-3">
          <h4 className="flex items-center gap-2 text-sm font-semibold text-white/70 uppercase tracking-wider">
            <Cpu className="w-4 h-4" />
            UI Components
          </h4>
          <div className="flex flex-wrap gap-2">
            {blueprint.uiComponents.map((c, i) => (
              <Badge key={i} variant="outline" className="text-emerald-400 border-emerald-500/20">
                {c}
              </Badge>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h4 className="flex items-center gap-2 text-sm font-semibold text-white/70 uppercase tracking-wider">
            <Database className="w-4 h-4" />
            Data Flow
          </h4>
          <ul className="grid grid-cols-1 gap-1 text-sm text-white/80">
            {blueprint.dataFlow.map((d, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                {d}
              </li>
            ))}
          </ul>
        </section>
      </CardContent>
    </Card>
  );
}
