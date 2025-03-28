import { AnimationRequestFunction } from "./AnimationRequestFunction";
import { Ticker } from "./Ticker";
export type AnimationLoopConfig = {
    ticksPerSecond?: number;
    ticker?: Ticker | Ticker[];
    running?: boolean;
    signal?: AbortSignal;
    errorHandler?: (error: unknown) => void;
    request?: AnimationRequestFunction;
};
