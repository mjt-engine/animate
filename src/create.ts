import type { AnimateState } from "./type/AnimateState";
import type { AnimationLoopConfig } from "./type/AnimationLoopConfig";
import type { Tick } from "./type/Tick";
import type { Ticker } from "./type/Ticker";

export const create = ({
  ticksPerSecond = 60,
  ticker: tickable = [],
  running = true,
  signal,
  errorHandler = (error) => {
    throw error;
  },
  request = requestAnimationFrame,
  clock = performance,
}: AnimationLoopConfig): AnimateState => {
  // convert parameters
  const rateLimit = ticksPerSecond !== undefined;
  ticksPerSecond = rateLimit ? ticksPerSecond : 60; // TODO SHOULD CALC
  const tickStepMs = (1 / ticksPerSecond) * 1000;
  const tickers: Ticker[] = Array.isArray(tickable) ? tickable : [tickable];
  const abortController = new AbortController();

  const state: AnimateState = {
    lastTickMs: clock.now(),
    nextTickMs: clock.now(),
    tickCount: 0,
    frameCount: 0,
    costMs: 0,
    rateLimit,
    tickStepMs,
    tickers,
    running,
    abort: false,
    deltaMs: 0,
    lastDeltaMs: 0,
    lastCostMs: 0,
    abortController,
    destroy: () => {
      state.abort = true;
    },
  };

  // animation loop
  const animate = async () => {
    const curTimeMs = clock.now();
    state.costMs = 0;
    if (!rateLimit || curTimeMs >= state.nextTickMs) {
      state.lastDeltaMs = state.deltaMs;
      state.deltaMs = curTimeMs - state.lastTickMs;
      state.lastTickMs = curTimeMs;
      // state.nextTickMs += tickStepMs;
      state.nextTickMs = curTimeMs + tickStepMs;
      const tick: Tick = {
        ...state,
      };

      try {
        if (state.running) {
          for (let i = 0; i < tickers.length; i++) {
            const tickable = tickers[i];
            await tickable(tick);
          }
          state.tickCount++;
        }
      } catch (error) {
        errorHandler(error);
      }
      state.costMs = clock.now() - curTimeMs;
      state.lastCostMs = state.costMs;
    }

    // adjust the next tick cost
    state.nextTickMs = state.nextTickMs - state.costMs;
    state.frameCount++;
    if (
      state.abort ||
      state.abortController.signal.aborted ||
      signal?.aborted
    ) {
      return;
    }
    request(animate);
  };

  animate();

  return state;
};
