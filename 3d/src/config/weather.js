/**
 * ============================================================================
 * WEATHER & ATMOSPHERIC PHENOMENA CONFIGURATION
 * ============================================================================
 * All tunable parameters for clouds, precipitation, and view-dependent fading.
 */

export const WEATHER_CONFIG = {
  // Base cloud altitude above the ocean plane (scene units; land height is ~0.18)
  CLOUD_BASE_Y: 1.8,

  // Random vertical variation per cloud puff to prevent artificial uniformity
  CLOUD_Y_JITTER: 0.25,

  // Global scale multiplier applied to cloud puff geometry
  CLOUD_SCALE: 0.4,

  // Default cloud material opacity
  CLOUD_OPACITY: 0.55,

  // Minimum opacity when X-ray mode or grazing view-angle fading is active
  CLOUD_MIN_OPACITY: 0.12,

  // Camera distance thresholds for altitude fading (scene units)
  CLOUD_FADE_START: 3.0,
  CLOUD_FADE_END: 1.2,

  // Lateral offset shifting clouds toward flanking ocean bodies (scene units)
  CLOUD_OFFSET_FROM_LAND: 0.35,

  // Rain particle fall parameters
  RAIN_FALL_SPEED: 6.5,
  RAIN_STREAK_LENGTH: 0.35,
  RAIN_OPACITY: 0.55
};
