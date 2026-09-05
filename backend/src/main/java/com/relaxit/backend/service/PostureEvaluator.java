package com.relaxit.backend.service;

import com.relaxit.backend.dto.telemetry.SensorReadingDTO;
import com.relaxit.backend.entity.PostureType;

import org.springframework.stereotype.Service;

import java.util.EnumMap;
import java.util.List;
import java.util.Map;

@Service
public class PostureEvaluator {

  public static class EvaluationResult {
    private final PostureType postureType;
    private final int score;

    public EvaluationResult(PostureType postureType, int score) {
      this.postureType = postureType;
      this.score = score;
    }

    public PostureType getPostureType() {
      return postureType;
    }

    public int getScore() {
      return score;
    }
  }

  public EvaluationResult evaluate(List<SensorReadingDTO> readings) {
    if (readings == null || readings.isEmpty()) {
      return new EvaluationResult(PostureType.UNKNOWN, 0);
    }

    Map<com.relaxit.backend.entity.SensorType, Double> pressureMap = new EnumMap<>(com.relaxit.backend.entity.SensorType.class);
    for (SensorReadingDTO r : readings) {
      if (r.getSensorType() != null && r.getValue() != null) {
        pressureMap.put(r.getSensorType(), r.getValue());
      }
    }

    Double ul = pressureMap.get(com.relaxit.backend.entity.SensorType.PRESSURE_UL);
    Double ur = pressureMap.get(com.relaxit.backend.entity.SensorType.PRESSURE_UR);
    Double ll = pressureMap.get(com.relaxit.backend.entity.SensorType.PRESSURE_LL);
    Double lr = pressureMap.get(com.relaxit.backend.entity.SensorType.PRESSURE_LR);

    if (ul == null || ur == null || ll == null || lr == null) {
      return new EvaluationResult(PostureType.UNKNOWN, 50);
    }

    double totalPressure = ul + ur + ll + lr;
    if (totalPressure < 5.0) {
      // User is not sitting or barely touching
      return new EvaluationResult(PostureType.UNKNOWN, 0);
    }

    double leftTotal = ul + ll;
    double rightTotal = ur + lr;
    double upperTotal = ul + ur;
    double lowerTotal = ll + lr;

    double leftRightDiff = Math.abs(leftTotal - rightTotal) / totalPressure;
    double upperLowerRatio = lowerTotal > 0 ? upperTotal / lowerTotal : 0;

    if (leftTotal > rightTotal && leftRightDiff > 0.35) {
      return new EvaluationResult(PostureType.LEANING_LEFT, 60);
    } else if (rightTotal > leftTotal && leftRightDiff > 0.35) {
      return new EvaluationResult(PostureType.LEANING_RIGHT, 60);
    } else if (upperLowerRatio < 0.25) {
      return new EvaluationResult(PostureType.SLOUCHING, 45);
    } else if (upperLowerRatio > 2.0) {
      return new EvaluationResult(PostureType.FORWARD_LEAN, 55);
    }

    return new EvaluationResult(PostureType.GOOD, 95);
  }
}
