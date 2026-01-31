/**
 * Status of a mockup feature in the design process
 */
export type FeatureStatus = 'draft' | 'review' | 'ready';

/**
 * Represents a mockup feature in the Design Hub
 */
export interface Feature {
  /** URL-friendly identifier */
  slug: string;
  
  /** Display name of the feature */
  name: string;
  
  /** Brief description of the feature */
  description: string;
  
  /** Current status in the design workflow */
  status: FeatureStatus;
  
  /** ISO date string of last update */
  lastUpdated: string;
  
  /** Path to thumbnail image */
  thumbnail: string;
  
  /** Tags for filtering and categorization */
  tags: string[];
}

/**
 * Structure of the features.json data file
 */
export interface FeaturesFile {
  features: Feature[];
}

/**
 * Identity information for a feature (from identity.md)
 */
export interface FeatureIdentity {
  problemStatement: string;
  userResearchLinks: string[];
  jiraTicketUrl?: string;
  technicalConstraints: string[];
}
