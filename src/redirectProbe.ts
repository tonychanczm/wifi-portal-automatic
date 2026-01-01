import fetch, { Response } from "node-fetch";
import {PROBE_TARGET, PROBE_TIMEOUT, USER_AGENT} from "./config";

export async function probeRedirect(
    url = PROBE_TARGET,
    timeoutMs = PROBE_TIMEOUT
): Promise<string | null> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const res: Response = await fetch(url, {
            method: "GET",
            headers: {
                "User-Agent": USER_AGENT,
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            },
            redirect: "manual", // 大事！
            signal: controller.signal,
        });

        if (
            res.status === 301 ||
            res.status === 302 ||
            res.status === 307 ||
            res.status === 308
        ) {
            const location = res.headers.get("location");
            return location ?? null;
        }
        if (res.status === 200) {
            const body = await res.text()
            const regexp = /top\.location\.href="(http:\/\/.+)";/
            const result = regexp.exec(body)
            if (result && result?.length >= 2) {
                return result[1]
            }
        }

        return null;
    } catch (e: any) {
        return null;
    } finally {
        clearTimeout(timer);
    }
}