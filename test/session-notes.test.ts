import { expect, test } from "vitest";
import sessionNotesExtension from "../extensions/session-notes.ts";

test("registers the stable command and shortcut identities", () => {
  const commands: string[] = [];
  const shortcuts: string[] = [];
  const events: string[] = [];
  const pi = {
    on(event: string) {
      events.push(event);
    },
    registerCommand(name: string) {
      commands.push(name);
    },
    registerShortcut(key: string) {
      shortcuts.push(key);
    },
  };

  // @ts-expect-error The registration spy intentionally implements only invoked methods.
  sessionNotesExtension(pi);

  expect(commands).toEqual(["session-notes"]);
  expect(shortcuts).toEqual(["alt+n"]);
  expect(events).toEqual(["session_start", "session_tree"]);
});
