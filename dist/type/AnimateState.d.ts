import { Tick } from "./Tick";
import { Ticker } from "./Ticker";
export type AnimateState = Tick & {
    tickers: Ticker[];
    running: boolean;
    abort: boolean;
    abortController: AbortController;
    destroy: () => void;
};
