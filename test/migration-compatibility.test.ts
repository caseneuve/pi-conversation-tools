import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import type { CustomEntry, ExtensionAPI, SessionEntry } from "@earendil-works/pi-coding-agent";
import { afterEach, expect, test, vi } from "vitest";
import { formatMarkedCommandsForPiEditor } from "../extensions/assistant-outline/command-editor-export.ts";
import { formatAllCommandsForEditor } from "../extensions/assistant-outline/command-export.ts";
import { extractCommandSnippets } from "../extensions/assistant-outline/command-extract.ts";
import { buildCommentState, getStoredCommentsForMessage } from "../extensions/assistant-outline/comments.ts";
import { editSectionComment } from "../extensions/assistant-outline/external-editor.ts";
import assistantOutline from "../extensions/assistant-outline/index.ts";
import { parseAssistantOutline } from "../extensions/assistant-outline/markdown-outline.ts";
import { AssistantOutlineOverlay } from "../extensions/assistant-outline/overlay.ts";
import sessionNotes, { SessionNotesComponent } from "../extensions/session-notes.ts";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

function register(factory: (pi: ExtensionAPI) => void) {
  const commands = new Map<string, Parameters<ExtensionAPI["registerCommand"]>[1]>();
  const shortcuts = new Map<string, Parameters<ExtensionAPI["registerShortcut"]>[1]>();
  const appendEntry = vi.fn<ExtensionAPI["appendEntry"]>();

  const pi = {
    registerCommand: (name, options) => commands.set(name, options),
    registerShortcut: (name, options) => shortcuts.set(name, options),
    appendEntry,
    on: vi.fn(),
  } satisfies Pick<ExtensionAPI, "registerCommand" | "registerShortcut" | "appendEntry" | "on">;

  // @ts-expect-error Registration spy intentionally supplies only the methods invoked by these factories.
  factory(pi);

  return { commands, shortcuts, appendEntry };
}

function customEntry(data: CustomEntry["data"]): SessionEntry {
  return {
    type: "custom",
    id: "state",
    parentId: null,
    timestamp: "2026-11-15T00:00:00Z",
    customType: "assistant-outline-comments",
    data,
  };
}

test("restores only string comments from the latest matching snapshot", () => {
  const branch = [
    customEntry({ messageEntryId: "message", comments: { old: "replaced" } }),
    customEntry({ messageEntryId: "other", comments: { wrong: "ignored" } }),
    customEntry({ messageEntryId: "message", comments: { good: "  revise  ", bad: 42, empty: " " } }),
  ];

  expect(getStoredCommentsForMessage(branch, "message")).toEqual({ good: "revise", empty: "" });
  expect(buildCommentState("message", { good: " revise ", empty: " " })).toEqual({
    messageEntryId: "message",
    comments: { good: "revise" },
  });
});

test("malformed comment snapshots do not become indexed string characters", () => {
  expect(
    getStoredCommentsForMessage(
      [customEntry(null), customEntry({ messageEntryId: "message", comments: "bad" })],
      "message",
    ),
  ).toEqual({});
});

test("command discussion exports stay distinct from executable editor buffers", () => {
  const snippets = extractCommandSnippets(parseAssistantOutline("# Setup\n```sh\nprintf 'fixture'\n```", "message"));
  const comments = { "1": "check this\nthen retry" };
  const discussion = formatMarkedCommandsForPiEditor(snippets, comments);
  const executable = formatAllCommandsForEditor(snippets, comments);

  expect(discussion).toBe(
    "# command snippets from the last assistant response\n\nPlease use these command snippets for the follow-up discussion:\n\n# Whole response > Setup\n# Comment: check this\n# then retry\nprintf 'fixture'\n",
  );
  expect(discussion).not.toContain("#!/");
  expect(executable).toBe(
    "#!/usr/bin/env bash\n\n# commands from the last assistant response\n\n# Whole response > Setup\n# Comment: check this\n# then retry\nprintf 'fixture'\n",
  );
});

test("outline shortcut and notes overlay reject RPC's dialog-only UI", async () => {
  const notify = vi.fn();
  const custom = vi.fn();

  const partialContext = {
    mode: "rpc",
    hasUI: true,
    ui: { notify, custom },
    sessionManager: { getBranch: () => [] },
  };

  // @ts-expect-error RPC guard must return before using omitted context capabilities.
  await register(assistantOutline).shortcuts.get("alt+o")?.handler(partialContext);
  // @ts-expect-error RPC guard must return before using omitted context capabilities.
  await register(sessionNotes).shortcuts.get("alt+n")?.handler(partialContext);

  expect(custom).not.toHaveBeenCalled();
  expect(notify.mock.calls).toEqual([
    ["/assistant-outline requires interactive mode", "error"],
    ["/session-notes requires interactive mode", "error"],
  ]);
});

test.each(["E", "\u001b[101;2u"])("open-all command action accepts legacy and enhanced Shift+E: %j", (key) => {
  const onOpenAllCommands = vi.fn(async () => {});

  const callbacks = {
    requestRender: vi.fn(),
    onClose: vi.fn(),
    onReload: async () => ({}),
    onEditComment: async () => {},
    onOpenCommandSnippet: async () => {},
    onOpenAllCommands,
    onCopyCommandSnippet: async () => {},
    getComments: () => ({}),
    getCommandSnippets: () => [],
  };

  // @ts-expect-error No rendering occurs in this input-routing test, so no theme capabilities are used.
  const overlay = new AssistantOutlineOverlay({}, callbacks);
  overlay.handleInput("c");
  overlay.handleInput(key);

  expect(onOpenAllCommands).toHaveBeenCalledOnce();
});

test.each(["G", "\u001b[103;2u"])("end navigation accepts legacy and enhanced Shift+G: %j", async (key) => {
  const onClose = vi.fn();
  const document = parseAssistantOutline("# First\nbody\n# Last\nbody", "message");

  const callbacks = {
    requestRender: vi.fn(),
    onClose,
    onReload: async () => ({ document }),
    onEditComment: async () => {},
    onOpenCommandSnippet: async () => {},
    onOpenAllCommands: async () => {},
    onCopyCommandSnippet: async () => {},
    getComments: () => ({}),
    getCommandSnippets: () => [],
  };

  // @ts-expect-error Input routing does not use the theme.
  const outline = new AssistantOutlineOverlay({}, callbacks);
  await outline.init();
  outline.handleInput(key);
  outline.handleInput("m");
  outline.handleInput("q");
  expect(onClose).toHaveBeenLastCalledWith(
    expect.objectContaining({ text: expect.stringContaining("Whole response > Last") }),
  );

  const notes = [20, 10].map((updatedAt) => ({
    id: String(updatedAt),
    title: `Note ${updatedAt}`,
    body: "body",
    status: "TODO" as const,
    createdAt: 1,
    updatedAt,
  }));

  const component = new SessionNotesComponent(
    notes,
    // @ts-expect-error Input routing does not use the theme.
    {},
    vi.fn(),
    onClose,
    async () => {},
    async () => {},
    async () => {},
    () => {},
  );

  component.handleInput(key);
  component.handleInput("m");
  component.handleInput("q");
  expect(onClose).toHaveBeenLastCalledWith(expect.objectContaining({ text: expect.stringContaining("Note 10") }));
});

test("an editor that cannot spawn must not report a saved comment", async () => {
  const temp = await mkdtemp(path.join(os.tmpdir(), "outline-editor-test-"));
  vi.stubEnv("VISUAL", path.join(temp, "missing-editor"));

  try {
    expect(
      await editSectionComment({ title: "Fixture", markdown: "# Fixture", existingComment: "original" }),
    ).toMatchObject({ ok: false, reason: "editor-error" });
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
});
