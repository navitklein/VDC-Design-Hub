import { Injectable, signal, computed } from '@angular/core';
import { SimulatorState, SIMULATOR_STATE_OPTIONS } from '../models';

/**
 * Service that manages the global simulator state.
 * Used by mockups to switch between loading, empty, data, and error states.
 */
@Injectable({
  providedIn: 'root'
})
export class SimulatorStateService {
  /** Current simulator state as a signal */
  private readonly _currentState = signal<SimulatorState>('data');
  
  /** Readonly signal for the current state */
  readonly currentState = this._currentState.asReadonly();
  
  /** Available state options */
  readonly stateOptions = SIMULATOR_STATE_OPTIONS;
  
  /** Computed: Get the current state option object */
  readonly currentStateOption = computed(() => 
    this.stateOptions.find(opt => opt.value === this._currentState()) ?? this.stateOptions[2]
  );
  
  /**
   * Set the simulator state
   * @param state The new state to set
   */
  setState(state: SimulatorState): void {
    this._currentState.set(state);
  }
  
  /**
   * Set state by keyboard shortcut (1-4)
   * @param shortcut The shortcut key pressed
   * @returns true if a valid shortcut was handled
   */
  setStateByShortcut(shortcut: string): boolean {
    const option = this.stateOptions.find(opt => opt.shortcut === shortcut);
    if (option) {
      this.setState(option.value);
      return true;
    }
    return false;
  }
  
  /**
   * Check if current state matches
   * @param state State to check against
   */
  isState(state: SimulatorState): boolean {
    return this._currentState() === state;
  }
  
  /**
   * Reset to default state (data)
   */
  reset(): void {
    this._currentState.set('data');
  }
}
