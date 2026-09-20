package com.relaxit.backend.simulator;

import com.relaxit.backend.entity.PostureType;

import java.util.Map;

public class ScenarioEngine {

  public enum Scenario {
    IDLE,
    NORMAL_SITTING,
    LEAN_LEFT,
    LEAN_RIGHT,
    FORWARD_LEAN,
    SLOUCHING,
    FREQUENT_MOVEMENT,
    PROLONGED_POOR_POSTURE,
    USER_LEAVES,
    LOW_BATTERY,
    LONG_RUN
  }

  private Scenario currentScenario = Scenario.NORMAL_SITTING;
  private double scenarioTimeSeconds = 0.0;
  private int longRunPhase = 0;

  public ScenarioEngine() {
  }

  public Scenario getCurrentScenario() {
    return currentScenario;
  }

  public void setScenario(Scenario scenario, SimulationState state) {
    this.currentScenario = scenario;
    this.scenarioTimeSeconds = 0.0;
    this.longRunPhase = 0;
    applyScenarioState(scenario, state);
  }

  public void update(double dtSeconds, SimulationState state) {
    this.scenarioTimeSeconds += dtSeconds;

    if (currentScenario == Scenario.LONG_RUN) {
      updateLongRun(dtSeconds, state);
    } else if (currentScenario == Scenario.FREQUENT_MOVEMENT) {
      updateFrequentMovement(dtSeconds, state);
    } else {
      // Periodic step for smooth state interpolation
      state.step(dtSeconds, 0.2);
    }
  }

  private void applyScenarioState(Scenario scenario, SimulationState state) {
    switch (scenario) {
      case IDLE:
      case USER_LEAVES:
        state.setPostureState(PostureType.UNKNOWN);
        break;
      case NORMAL_SITTING:
        state.setPostureState(PostureType.GOOD);
        break;
      case LEAN_LEFT:
      case PROLONGED_POOR_POSTURE:
        state.setPostureState(PostureType.LEANING_LEFT);
        break;
      case LEAN_RIGHT:
        state.setPostureState(PostureType.LEANING_RIGHT);
        break;
      case FORWARD_LEAN:
        state.setPostureState(PostureType.FORWARD_LEAN);
        break;
      case SLOUCHING:
        state.setPostureState(PostureType.SLOUCHING);
        break;
      case LOW_BATTERY:
        state.setPostureState(PostureType.GOOD);
        state.setBatteryLevel(12.0);
        break;
      case FREQUENT_MOVEMENT:
        state.setPostureState(PostureType.GOOD);
        break;
      case LONG_RUN:
        state.setPostureState(PostureType.GOOD);
        break;
    }
  }

  private void updateFrequentMovement(double dtSeconds, SimulationState state) {
    // Every 5 seconds, toggle between GOOD, LEAN_LEFT, LEAN_RIGHT
    int phase = ((int) (scenarioTimeSeconds / 5.0)) % 3;
    if (phase == 0)
      state.setPostureState(PostureType.GOOD);
    else if (phase == 1)
      state.setPostureState(PostureType.LEANING_LEFT);
    else
      state.setPostureState(PostureType.LEANING_RIGHT);

    state.step(dtSeconds, 0.4);
  }

  private void updateLongRun(double dtSeconds, SimulationState state) {
    // Phase transitions every 30 simulated seconds for testing
    int phase = (int) (scenarioTimeSeconds / 30.0);
    switch (phase % 6) {
      case 0:
        state.setPostureState(PostureType.GOOD);
        break;
      case 1:
        state.setPostureState(PostureType.LEANING_LEFT);
        break;
      case 2:
        state.setPostureState(PostureType.GOOD);
        break;
      case 3:
        state.setPostureState(PostureType.FORWARD_LEAN);
        break;
      case 4:
        state.setPostureState(PostureType.SLOUCHING);
        break;
      case 5:
        state.setPostureState(PostureType.UNKNOWN);
        break;
    }
    state.step(dtSeconds, 0.25);
  }
}
