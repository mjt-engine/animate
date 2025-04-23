export type Tick = {
  lastTickMs: number;
  nextTickMs: number;
  tickCount: number;
  tickStepMs: number;
  frameCount: number;
  deltaMs: number;
  lastDeltaMs: number;
  costMs: number;
  lastCostMs: number;
  rateLimit: boolean;
};
