import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Button, buttonVariants } from "./ui/button";
import { Info, HelpCircle, Code2, Paintbrush, Zap, ArrowRight } from "lucide-react";
import { AppExplanation } from "../types";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "../lib/utils";

interface ExplainPanelProps {
  explanation: AppExplanation;
}

export function ExplainPanel({ explanation }: ExplainPanelProps) {
  return (
    <Sheet>
      <SheetTrigger className={cn(buttonVariants({ variant: "outline" }), "gap-2 bg-white/5 border-white/10 hover:bg-white/10")}>
        <Info className="w-4 h-4" />
        Explain This App
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] bg-slate-950 border-white/10 text-white overflow-hidden flex flex-col p-0">
        <SheetHeader className="p-6 border-b border-white/10">
          <SheetTitle className="text-2xl font-bold flex items-center gap-2 text-primary">
            <HelpCircle className="w-6 h-6" />
            App Architecture
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-8">
            <section>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-blue-400">
                <Zap className="w-5 h-5" />
                Overview
              </h3>
              <p className="text-white/70 leading-relaxed">{explanation.overview}</p>
            </section>

            <section className="space-y-4">
              <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/10">
                <h4 className="flex items-center gap-2 font-semibold mb-2 text-orange-400">
                  <Code2 className="w-4 h-4" />
                  HTML Structure
                </h4>
                <p className="text-sm text-white/60">{explanation.indexHtml}</p>
              </div>

              <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
                <h4 className="flex items-center gap-2 font-semibold mb-2 text-blue-400">
                  <Paintbrush className="w-4 h-4" />
                  Styling (CSS)
                </h4>
                <p className="text-sm text-white/60">{explanation.styleCss}</p>
              </div>

              <div className="p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/10">
                <h4 className="flex items-center gap-2 font-semibold mb-2 text-yellow-400">
                  <Zap className="w-4 h-4" />
                  Logic (JS)
                </h4>
                <p className="text-sm text-white/60">{explanation.scriptJs}</p>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-4 text-emerald-400 flex items-center gap-2">
                <ArrowRight className="w-5 h-5" />
                User Interactions
              </h3>
              <ul className="space-y-3">
                {explanation.interactions.map((it, i) => (
                  <li key={i} className="flex gap-3 text-sm text-white/70">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
                      {i + 1}
                    </span>
                    {it}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-4 text-purple-400 flex items-center gap-2">
                <ArrowRight className="w-5 h-5" />
                Core Data Flow
              </h3>
              <ul className="space-y-3">
                {explanation.dataFlow.map((df, i) => (
                  <li key={i} className="flex gap-3 text-sm text-white/70">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold">
                      {i + 1}
                    </span>
                    {df}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
