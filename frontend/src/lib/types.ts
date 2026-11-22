export interface TelemetryData {
  node_id: string;
  location: string;
  ambient_temperature_c: number;
  ambient_humidity_rh: number;
  sample_mass_g?: number;
  biomass_moisture_sim_percent?: number;
  core_temperature_c?: number;
  delta_temperature_c?: number;
  trend_c?: number;
  score?: number;
  hardware_class?: string;
  hardware_recommendation?: string;
  high_temperature_warning?: boolean;
  simulation_source: string;
  received_at: string;
}

export interface PresetSample {
  id: string;
  title: string;
  origin: string;
  target_hypothesis: string;
  description: string;
  ambient_temperature_c: number;
  ambient_humidity_rh: number;
  core_temperature_c?: number;
  sample_mass_g: number;
  biomass_moisture_percent: number;
  post_harvest_age_days: number;
  seed_condition_score: number;
}

export interface ClassificationInput {
  ambient_temperature_c: number;
  ambient_humidity_rh: number;
  sample_mass_g: number;
  biomass_moisture_percent: number;
  post_harvest_age_days: number;
  seed_condition_score: number;
  sample_label?: string;
}

export interface PredictionResult {
  sample_label: string;
  input_parameters: ClassificationInput;
  classification_output: {
    status: string;
    model_status_badge: string;
    primary_recommendation: string;
    confidence_score: number;
    class_probabilities: {
      [key: string]: number;
    };
    comparative_model: {
      algorithm: string;
      result: {
        predicted_class: string;
        agreement_with_rf: boolean;
        confidence: number;
      };
    };
    scientific_explanation: {
      primary_factors: string[];
      recommended_lab_tests: string[];
      scientific_disclaimers: string[];
    };
    validated_against_sni: boolean;
  };
}

export interface ModelInfo {
  status: string;
  primary_algorithm: string;
  comparative_algorithm: string;
  deep_learning_status: string;
  computer_vision_status: string;
  transparency_note: string;
  metrics: {
    dataset_info: {
      total_samples: number;
      train_samples: number;
      test_samples: number;
      classes: string[];
      features: string[];
      status: string;
    };
    random_forest: {
      accuracy: number;
      feature_importance: Record<string, number>;
    };
    decision_tree: {
      accuracy: number;
      feature_importance: Record<string, number>;
    };
  };
}
