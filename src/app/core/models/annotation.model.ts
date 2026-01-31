/**
 * Represents a UX annotation attached to a UI element.
 * Used for developer handoff notes.
 */
export interface Annotation {
  /** Unique identifier for the annotation */
  id: string;
  
  /** CSS selector or element reference for positioning */
  selector?: string;
  
  /** Short title for the annotation */
  title: string;
  
  /** Detailed note/instruction for developers */
  note: string;
  
  /** Position of the marker relative to the element */
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

/**
 * Input configuration for the appAnnotation directive
 */
export interface AnnotationConfig {
  title: string;
  note: string;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

/**
 * Structure of the annotations.json file
 */
export interface AnnotationsFile {
  annotations: Annotation[];
}
