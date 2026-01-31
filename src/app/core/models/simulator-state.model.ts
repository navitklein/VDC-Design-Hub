/**
 * Represents the possible states of a mockup in the simulator.
 * Each mockup should respond to these states appropriately.
 */
export type SimulatorState = 'loading' | 'empty' | 'data' | 'error';

/**
 * Configuration for the simulator state options
 */
export interface SimulatorStateOption {
  value: SimulatorState;
  label: string;
  description: string;
  shortcut: string;
}

/**
 * Default state options for the simulator dropdown
 */
export const SIMULATOR_STATE_OPTIONS: SimulatorStateOption[] = [
  {
    value: 'loading',
    label: 'Loading',
    description: 'Shows loading skeleton or spinner',
    shortcut: '1'
  },
  {
    value: 'empty',
    label: 'Empty',
    description: 'Shows empty state with no data',
    shortcut: '2'
  },
  {
    value: 'data',
    label: 'Data',
    description: 'Shows populated state with sample data',
    shortcut: '3'
  },
  {
    value: 'error',
    label: 'Error',
    description: 'Shows error state',
    shortcut: '4'
  }
];
