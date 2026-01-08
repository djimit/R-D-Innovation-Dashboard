
export interface PipelineMetrics {
  discoveryYears: number;
  preClinicalYears: number;
  clinicalPhase1Years: number;
  clinicalPhase2Years: number;
  clinicalPhase3Years: number;
  regulatoryYears: number;
  costPerDrug: number; // in Millions USD
  successRate: number; // percentage
}

export interface AIScenario {
  name: string;
  discoveryBoost: number; // percentage reduction
  clinicalBoost: number; // percentage reduction
  regulatoryBoost: number; // percentage reduction
  costReduction: number; // percentage reduction
}

export interface AnalysisResult {
  executiveSummary: string;
  bottleneckAnalysis: string[];
  strategicRecommendations: string[];
  impactProjection: {
    timeSaved: string;
    costSaved: string;
    npvIncrease: string;
  };
}
