import { Editor } from "@monaco-editor/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { FileCode, FileJson, FileType } from "lucide-react";

interface CodeEditorProps {
  files: {
    'index.html': string;
    'style.css': string;
    'script.js': string;
  };
  onChange: (file: string, content: string) => void;
}

export function CodeEditor({ files, onChange }: CodeEditorProps) {
  return (
    <div className="w-full h-full bg-[#1e1e1e] rounded-xl overflow-hidden border border-white/10 shadow-2xl">
      <Tabs defaultValue="html" className="w-full h-full flex flex-col">
        <div className="flex items-center justify-between px-4 bg-[#252526] border-b border-white/5">
          <TabsList className="bg-transparent border-none">
            <TabsTrigger value="html" className="data-[state=active]:bg-[#1e1e1e] rounded-t-lg px-4 gap-2">
              <FileCode className="w-4 h-4 text-orange-400" />
              index.html
            </TabsTrigger>
            <TabsTrigger value="css" className="data-[state=active]:bg-[#1e1e1e] rounded-t-lg px-4 gap-2">
              <FileType className="w-4 h-4 text-blue-400" />
              style.css
            </TabsTrigger>
            <TabsTrigger value="js" className="data-[state=active]:bg-[#1e1e1e] rounded-t-lg px-4 gap-2">
              <FileJson className="w-4 h-4 text-yellow-400" />
              script.js
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="html" className="flex-1 mt-0">
          <Editor
            height="100%"
            defaultLanguage="html"
            theme="vs-dark"
            value={files['index.html']}
            onChange={(val) => onChange('index.html', val || '')}
            options={{ minimap: { enabled: false }, fontSize: 14 }}
          />
        </TabsContent>
        <TabsContent value="css" className="flex-1 mt-0">
          <Editor
            height="100%"
            defaultLanguage="css"
            theme="vs-dark"
            value={files['style.css']}
            onChange={(val) => onChange('style.css', val || '')}
            options={{ minimap: { enabled: false }, fontSize: 14 }}
          />
        </TabsContent>
        <TabsContent value="js" className="flex-1 mt-0">
          <Editor
            height="100%"
            defaultLanguage="javascript"
            theme="vs-dark"
            value={files['script.js']}
            onChange={(val) => onChange('script.js', val || '')}
            options={{ minimap: { enabled: false }, fontSize: 14 }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
