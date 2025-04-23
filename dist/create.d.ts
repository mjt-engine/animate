import type { AnimateState } from "./type/AnimateState";
import type { AnimationLoopConfig } from "./type/AnimationLoopConfig";
export declare const create: ({ ticksPerSecond, ticker: tickable, running, signal, errorHandler, request, clock, }: AnimationLoopConfig) => AnimateState;
