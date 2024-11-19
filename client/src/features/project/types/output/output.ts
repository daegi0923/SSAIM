export interface Proposal {
    title: string;
    description: string;
    background: string;
    feature: string;
    effect: string;
}

export interface FeatureSpec {
    Domain: string[];
    FeatureName: string[];
    Description: string[];
    Type: string[];
    owner: string[];
    priority: string[];
  }