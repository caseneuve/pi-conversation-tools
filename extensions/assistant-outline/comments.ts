import type { SessionEntry } from "@earendil-works/pi-coding-agent";
import { getNodePath } from "./markdown-outline";
import type {
  AssistantOutlineCommentState,
  ExportedSectionsPayload,
  ParsedAssistantOutline,
  SectionComments,
} from "./types";

export const ASSISTANT_OUTLINE_COMMENTS_TYPE = "assistant-outline-comments";

// Persisted custom-entry data is untrusted, including legacy/malformed snapshots.
function isCommentDataObject(value: unknown): value is object {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isCommentText(value: unknown): value is string {
  return typeof value === "string";
}

export function getStoredCommentsForMessage(branch: SessionEntry[], messageEntryId: string): SectionComments {
  let comments: SectionComments = {};

  for (const entry of branch) {
    if (entry.type !== "custom" || entry.customType !== ASSISTANT_OUTLINE_COMMENTS_TYPE) continue;

    if (
      !isCommentDataObject(entry.data) ||
      !("messageEntryId" in entry.data) ||
      entry.data.messageEntryId !== messageEntryId
    )
      continue;

    comments = {};

    if (!("comments" in entry.data) || !isCommentDataObject(entry.data.comments)) continue;

    for (const [key, value] of Object.entries(entry.data.comments)) {
      if (isCommentText(value)) comments[key] = value.trim();
    }
  }

  return comments;
}

export function buildCommentState(messageEntryId: string, comments: SectionComments): AssistantOutlineCommentState {
  return {
    messageEntryId,
    comments: Object.fromEntries(
      Object.entries(comments)
        .map(([key, value]) => [key, value.trim()])
        .filter(([, value]) => Boolean(value)),
    ),
  };
}

export function buildExportedSectionsPayload(
  document: ParsedAssistantOutline,
  markedIds: ReadonlySet<string>,
  comments: SectionComments,
): ExportedSectionsPayload | undefined {
  if (markedIds.size === 0) return undefined;

  const sections = [...markedIds]
    .map((id) => document.nodesById.get(id))
    .filter((node): node is NonNullable<typeof node> => Boolean(node))
    .map((node) => ({
      node,
      path: getNodePath(document, node.id).join(" > "),
      comment: comments[node.id]?.trim() ?? "",
    }))
    .sort((a, b) => a.node.startLine - b.node.startLine);

  if (sections.length === 0) return undefined;

  const hasAnyComments = sections.some((section) => Boolean(section.comment));
  const body = sections
    .map((section) => {
      if (!section.comment) return `- ${section.path}`;
      return `- ${section.path}\n  Comment: ${section.comment.replace(/\r?\n/g, "\n  ")}`;
    })
    .join("\n\n");

  return {
    kind: "sections",
    count: sections.length,
    text:
      (hasAnyComments
        ? "# comments on the last assistant response\n\nPlease revise or answer with these section-targeted comments:\n\n"
        : "# sections from the last assistant response\n\nPlease focus on these sections from your last response:\n\n") +
      body +
      "\n",
  };
}
