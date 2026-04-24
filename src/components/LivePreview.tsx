import { useState, useMemo } from "react";
import { Monitor, Phone, RefreshCcw, Maximize2 } from "lucide-react";
import { Button } from "./ui/button";

interface LivePreviewProps {
  files: {
    'index.html': string;
    'style.css': string;
    'script.js': string;
  };
}

export function LivePreview({ files }: LivePreviewProps) {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [key, setKey] = useState(0);

  const srcDoc = useMemo(() => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>${files['style.css']}</style>
        </head>
        <body>
          ${files['index.html']}
          <script>${files['script.js']}</script>
        </body>
      </html>
    `;
  }, [files, key]);

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-xl overflow-hidden border border-white/10 shadow-2xl">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-white/5">
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'desktop' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => setViewMode('desktop')}
            className="w-8 h-8"
          >
            <Monitor className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'mobile' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => setViewMode('mobile')}
            className="w-8 h-8"
          >
            <Phone className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setKey(k => k + 1)}
            className="w-8 h-8"
          >
            <RefreshCcw className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              const win = window.open();
              win?.document.write(srcDoc);
              win?.document.close();
            }}
            className="w-8 h-8"
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex-1 p-4 bg-slate-950 flex items-center justify-center overflow-auto">
        <div 
          className={`bg-white rounded-lg shadow-2xl transition-all duration-300 ease-in-out origin-top ${
            viewMode === 'mobile' ? 'w-[375px] h-[667px]' : 'w-full h-full'
          }`}
        >
          <iframe
            key={key}
            srcDoc={srcDoc}
            className="w-full h-full border-none rounded-lg"
            sandbox="allow-scripts allow-forms allow-modals"
            title="Preview"
          />
        </div>
      </div>
    </div>
  );
}
