
import React from 'react';
import { PipelineMetrics, AIScenario } from './types';

export const TRADITIONAL_BENCHMARKS: PipelineMetrics = {
  discoveryYears: 4.5,
  preClinicalYears: 1.5,
  clinicalPhase1Years: 1.5,
  clinicalPhase2Years: 2.5,
  clinicalPhase3Years: 3.5,
  regulatoryYears: 1.5,
  costPerDrug: 2300, // $2.3 Billion
  successRate: 10,
};

export const AI_STRATEGIC_SCENARIO: AIScenario = {
  name: "Bain Strategic Transformation",
  discoveryBoost: 30,    // 30% reduction in discovery
  clinicalBoost: 25,     // 25% reduction in clinical trials
  regulatoryBoost: 40,   // 40% reduction in regulatory
  costReduction: 22,     // 22% overall cost reduction
};

export const BAIN_ARTICLE_CONTEXT = `
Bain & Company Insight: "How to Break Through Pharma’s Innovation Bottleneck with AI"
Key Themes:
- R&D productivity has declined; it costs $2.3 billion to bring a drug to market.
- Only 10% of drugs entering clinical trials succeed.
- Generative AI can compress timelines by 20-30%.
- AI impacts: Discovery (protein folding, molecule design), Clinical (protocol optimization, patient matching), Regulatory (automated CSR drafting).
- Strategy: Moving from 'AI as a tool' to 'AI-first organization'.
`;
