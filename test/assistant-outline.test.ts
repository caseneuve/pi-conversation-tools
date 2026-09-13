import type { SessionEntry } from "@earendil-works/pi-coding-agent";
import { describe, expect, test } from "vitest";
import { extractCommandSnippets } from "../extensions/assistant-outline/command-extract.ts";
import { getNodeMarkdown, parseAssistantOutline } from "../extensions/assistant-outline/markdown-outline.ts";
import { getAssistantResponseById, getLatestAssistantResponse } from "../extensions/assistant-outline/session.ts";

describe("assistant-outline characterization", () => {
  test("parses headings while ignoring fenced-code headings", () => {
    const document = parseAssistantOutline(
      "# Overview\ntext\n```md\n# not a heading\n```\n## Detail ##\nbody",
      "message-1",
    );

    expect(document.root.children.map((node) => node.title)).toEqual(["Overview"]);
    expect(document.root.children[0]?.children.map((node) => node.title)).toEqual(["Detail"]);
    expect(getNodeMarkdown(document, document.nodesById.get("1.1")!)).toBe("## Detail ##\nbody");
  });

  test("extracts shell command blocks and assigns their heading path", () => {
    const document = parseAssistantOutline("# Setup\n```bash\n$ npm test\n\nnpm run typecheck\n```", "message-1");

    expect(extractCommandSnippets(document)).toMatchObject([
      { commandText: "npm test", nodeId: "1", path: "Whole response > Setup" },
      { commandText: "npm run typecheck", nodeId: "1", path: "Whole response > Setup" },
    ]);
  });

  test("uses the newest completed assistant response on the active branch", () => {
    const branch = [
      { id: "old", type: "message", message: { role: "assistant", content: [{ type: "text", text: "old" }] } },
      { id: "user", type: "message", message: { role: "user", content: [{ type: "text", text: "question" }] } },
      {
        id: "new",
        type: "message",
        message: { role: "assistant", stopReason: "stop", content: [{ type: "text", text: "new" }] },
      },
    ] as unknown as SessionEntry[];

    expect(getLatestAssistantResponse(branch).selection).toMatchObject({ messageEntryId: "new", text: "new" });
    expect(getAssistantResponseById(branch, "old").selection).toMatchObject({ messageEntryId: "old", text: "old" });
  });
});
