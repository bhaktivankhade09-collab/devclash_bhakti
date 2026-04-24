export interface AppFiles {
  'index.html': string;
  'style.css': string;
  'script.js': string;
}

export interface AppBlueprint {
  appName: string;
  targetUsers: string[];
  keyFeatures: string[];
  uiComponents: string[];
  dataFlow: string[];
}

export interface AppExplanation {
  overview: string;
  indexHtml: string;
  styleCss: string;
  scriptJs: string;
  interactions: string[];
  dataFlow: string[];
}

export interface ChangeSummary {
  file: string;
  before: string;
  after: string;
  reason: string;
}

export interface AIResponse {
  appName: string;
  description: string;
  improvementSummary?: string;
  readme: string;
  blueprint: AppBlueprint;
  explanation: AppExplanation;
  beforeAfterChanges?: ChangeSummary[];
  files: AppFiles;
}

export interface Project extends AIResponse {
  _id?: string;
  prompt: string;
  createdAt?: string;
  updatedAt?: string;
}
