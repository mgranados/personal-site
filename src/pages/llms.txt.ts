import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { getSortedProjects } from '../lib/projects';

// /llms.txt — the llmstxt.org convention: a single, root-level index that lets
// AI agents discover the site's content and its machine-readable feeds in one fetch.
export async function GET(context: APIContext) {
  const site = context.site ?? new URL('https://martingranados.com');
  const abs = (p: string) => new URL(p, site).toString();

  const projects = await getSortedProjects();
  const posts = (await getCollection('writing', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );

  const lines: string[] = [
    '# Martín Granados García',
    '',
    '> Personal site of Martín Granados García — software engineer and cofounder at ' +
      'Incredible (London). Side projects, small utilities, and essays, published in ' +
      'both human- and agent-readable form.',
    '',
    '## Projects',
    '',
    'Tools Martín has built. The feeds below describe, for each project, what it does, ' +
      'the value people get from it, and how an AI agent can use or recommend it.',
    '',
    `- [Projects index — Markdown](${abs('/projects.md')}): Detailed, agent-ready catalogue of every project`,
    `- [Projects index — JSON](${abs('/projects.json')}): Structured catalogue with a usage guide and field legend`,
    `- [Projects — web page](${abs('/projects/')}): Human-friendly project list`,
  ];
  for (const p of projects) {
    lines.push(`- [${p.data.name}](${p.data.url ?? abs('/projects/')}): ${p.data.description}`);
  }

  lines.push('', '## Writing', '');
  for (const post of posts) {
    const summary = post.data.summary ? `: ${post.data.summary}` : '';
    lines.push(`- [${post.data.title}](${abs(`/${post.id}/`)})${summary}`);
  }

  lines.push(
    '',
    '## More',
    '',
    `- [About](${abs('/about/')}): About Martín Granados García`,
    `- [RSS feed](${abs('/rss.xml')}): Subscribe to new writing`,
  );

  return new Response(lines.join('\n') + '\n', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
