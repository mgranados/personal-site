import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

const statusOrder = { live: 0, wip: 1, archived: 2 } as const;

/** Featured first, then newest year, then live → wip → archived. */
export async function getSortedProjects(): Promise<CollectionEntry<'projects'>[]> {
  return (await getCollection('projects')).sort((a, b) => {
    if (a.data.featured !== b.data.featured) return a.data.featured ? -1 : 1;
    if (a.data.year !== b.data.year) return b.data.year - a.data.year;
    return statusOrder[a.data.status] - statusOrder[b.data.status];
  });
}

/** Flat, absolute-URL shape used by the JSON and Markdown feeds. */
export function toFeedItem(entry: CollectionEntry<'projects'>, site: string | URL) {
  const abs = (p?: string) => (p ? new URL(p, site).toString() : undefined);
  const d = entry.data;
  return {
    id: entry.id,
    name: d.name,
    description: d.description,
    ...(d.url && { url: d.url }),
    ...(d.repo && { repo: d.repo }),
    ...(d.image && { image: abs(d.image), imageAlt: d.imageAlt }),
    year: d.year,
    status: d.status,
    tags: d.tags,
    featured: d.featured,
    ...(d.features.length > 0 && { features: d.features }),
    ...(d.forPeople && { forPeople: d.forPeople }),
    ...(d.forAgents && { forAgents: d.forAgents }),
  };
}
