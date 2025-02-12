/*
 * @Author: kim
 * @Description: RSS feed
 */
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import sanitizeHtml from 'sanitize-html';
import { remark } from 'remark';
import html from 'remark-html';
import remarkBlockContainers from 'remark-block-containers';
import remarkGemoji from 'remark-gemoji';
import slateConfig from '~@/slate.config';

async function parseMarkdownToHtml(markdown) {
  const result = await remark().use(html).use(remarkBlockContainers).use(remarkGemoji).process(markdown);
  return result.toString();
}

export async function GET(context) {
  const blog = await getCollection('post');

  const postItems = await Promise.all(blog
    .filter((post) => !post.data.draft)
    .sort((a, b) => b.data.pubDate - a.data.pubDate)
    .map(async (post) => {
      const content = await parseMarkdownToHtml(post.body);
      return {
        link: `/blog/${post.slug}/`,
        title: post.data.title,
        content: sanitizeHtml(content, {
          allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img'])
        }),
        ...post.data,
      }
    }));

  const rssOptions = {
    stylesheet: '/pretty-feed-v3.xsl',
    title: slateConfig.title,
    description: slateConfig.description,
    site: context.site,
    trailingSlash: false,
    items: postItems,
  }

  if(slateConfig.follow) {
    rssOptions.customData = `<follow_challenge>
      <feedId>${slateConfig.follow.feedId}</feedId>
      <userId>${slateConfig.follow.userId}</userId>
    </follow challenge>`;
  }

  return rss(rssOptions);
}
