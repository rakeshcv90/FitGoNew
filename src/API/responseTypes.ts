export type historyData = {
  normal_exercises: {
    exercise_data: Array<{exercise_id: number}>;
    summary: {
      formatted_time: string;
      total_calories: number;
      total_exercises: number;
      total_time_seconds: number;
    };
  };
  step_count: {
    steps: number;
    calories: number;
    distance: number;
  };
};
