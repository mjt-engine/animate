import { Tick } from "./Tick";
export type Ticker<R = unknown> = (tick: Tick) => Promise<R> | R;
