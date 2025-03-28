export const create = ({ ticksPerSecond = 60, ticker: tickable = [], running = true, signal, errorHandler = (error) => {
    throw error;
}, request = requestAnimationFrame, }) => {
    // convert parameters
    const rateLimit = ticksPerSecond !== undefined;
    ticksPerSecond = rateLimit ? ticksPerSecond : 60; // TODO SHOULD CALC
    const tickStepMs = (1 / ticksPerSecond) * 1000;
    const tickers = Array.isArray(tickable) ? tickable : [tickable];
    const abortController = new AbortController();
    const state = {
        lastTickMs: Date.now(),
        nextTickMs: Date.now(),
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
        abortController,
        destroy: () => {
            state.abort = true;
        },
    };
    // animation loop
    const animate = async () => {
        const curTimeMs = Date.now();
        state.costMs = 0;
        if (!rateLimit || curTimeMs >= state.nextTickMs) {
            state.lastDeltaMs = state.deltaMs;
            state.deltaMs = curTimeMs - state.lastTickMs;
            state.lastTickMs = curTimeMs;
            // state.nextTickMs += tickStepMs;
            state.nextTickMs = curTimeMs + tickStepMs;
            const tick = {
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
            }
            catch (error) {
                errorHandler(error);
            }
            state.costMs = (Date.now() - curTimeMs) * 1000;
        }
        // adjust the next tick cost
        state.nextTickMs = state.nextTickMs - state.costMs;
        state.frameCount++;
        if (state.abort ||
            state.abortController.signal.aborted ||
            signal?.aborted) {
            return;
        }
        request(animate);
    };
    animate();
    return state;
};
//# sourceMappingURL=create.js.map