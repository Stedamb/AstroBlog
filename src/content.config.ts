import { glob } from 'astro/loaders';
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';

const post = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/post' }),
  schema: z
    .object({
      /** Title */
      title: z.string(),
      /** Description */
      description: z.string().optional(),
      /** Tags */
      tags: z.array(z.string()).optional(),
      /** Is draft */
      draft: z.boolean().optional(),
      /** Publish date (required when not draft) */
      pubDate: z.coerce.date().optional(),
    })
    .refine(
      (data) => {
        // If it's a draft, pubDate is not required, otherwise it is required
        if (data.draft === true) {
          return true;
        }
        return data.pubDate !== undefined;
      },
      {
        message: 'When draft is false, pubDate is required',
        path: ['pubDate'],
      },
    ),
});

export const collections = { post };
