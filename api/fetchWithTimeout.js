const TIME_OUT = 15;
export function fetchWithTimeout(url, options, timeout = TIME_OUT * 1000) {
    return Promise.race([
        fetch(url, options),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), timeout))
    ]);
}