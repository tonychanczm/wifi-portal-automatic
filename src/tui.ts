import readline from "node:readline";

export type UiState = {
    title: string;
    status: "接続OK" | "ロクイン中...";
    lastOkAt: Date | null;
    probeCount: number;
    okCount: number;
    failCount: number;
    lastRedirect: string | null;
    lastError: string | null;
};

function fmtTime(d: Date) {
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export function renderUI(s: UiState) {
    const nextExpire =
        s.lastOkAt ? new Date(s.lastOkAt.getTime() + 30 * 60 * 1000) : null;

    const lines: string[] = [];
    lines.push(s.title);
    lines.push(
        `状態：${s.status}${s.lastOkAt ? `（最終OK：${fmtTime(s.lastOkAt)}）` : ""}`
    );
    lines.push(
        `次回の有効期限予測：${nextExpire ? fmtTime(nextExpire) : "不明（まだ正常検知がありません）"}`
    );
    lines.push(
        `継続監視中：試行回数 ${s.probeCount} 回（OK ${s.okCount} / 失敗 ${s.failCount}）`
    );
    if (s.lastRedirect) lines.push(`直近のリダイレクト：${s.lastRedirect}`);
    if (s.lastError) lines.push(`直近のエラー：${s.lastError}`);
    lines.push(""); // 留空行

    // ⭐ 不刷屏：回到左上角 + 清屏，然后写固定内容
    readline.cursorTo(process.stdout, 0, 0);
    readline.clearScreenDown(process.stdout);
    process.stdout.write(lines.join("\n"));
}