const BULLET_RE = /^\s*(?:[-•*]|\d+[.)])\s+(.+)$/;

/**
 * Split plain-text tour descriptions into paragraphs and bullet lists
 * so the detail page can render richer typography without HTML/markdown.
 */
export const parseTourDescription = (desc) => {
  if (!desc || typeof desc !== "string") {
    return { blocks: [] };
  }

  const normalized = desc.replace(/\r\n/g, "\n").trim();
  if (!normalized) return { blocks: [] };

  const chunks = normalized
    .split(/\n{2,}/)
    .map((chunk) => chunk.trim())
    .filter(Boolean);

  const blocks = [];

  chunks.forEach((chunk) => {
    const lines = chunk
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    if (lines.length === 0) return;

    const bulletMatches = lines.map((line) => line.match(BULLET_RE));
    const allBullets = bulletMatches.every(Boolean);

    if (allBullets && lines.length > 1) {
      blocks.push({
        type: "list",
        items: bulletMatches.map((match) => match[1].trim()),
      });
      return;
    }

    if (allBullets && lines.length === 1) {
      blocks.push({ type: "list", items: [bulletMatches[0][1].trim()] });
      return;
    }

    // Mixed: split consecutive bullets into a list, keep prose as paragraphs
    let prose = [];
    let bullets = [];

    const flushProse = () => {
      if (prose.length) {
        blocks.push({ type: "paragraph", text: prose.join(" ") });
        prose = [];
      }
    };

    const flushBullets = () => {
      if (bullets.length) {
        blocks.push({ type: "list", items: bullets });
        bullets = [];
      }
    };

    lines.forEach((line) => {
      const match = line.match(BULLET_RE);
      if (match) {
        flushProse();
        bullets.push(match[1].trim());
      } else {
        flushBullets();
        prose.push(line);
      }
    });

    flushProse();
    flushBullets();
  });

  // If everything was one long line with no breaks, treat as single paragraph
  if (blocks.length === 0) {
    blocks.push({ type: "paragraph", text: normalized });
  }

  return { blocks };
};
