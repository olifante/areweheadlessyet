import type {
    GetStaticPropsContext,
    GetStaticPathsContext,
    NextPage,
} from 'next';
import type { AreWeHeadlessYetTopicPage } from '../components/types';
import type { Topic } from '../components/StreamField/blocks/TopicsBlock';

import {
    getAreWeHeadlessYetTopicPages,
    getAreWeHeadlessYetTopicPage,
} from '../lib';

import Layout from '../components/Layout';
import TopicPageHero from '../components/TopicPageHero/TopicPageHero';
import StreamField from '../components/StreamField';

const TopicPage: NextPage<{ page: AreWeHeadlessYetTopicPage }> = ({ page }) => (
    <Layout title={page.title} lastPublishedAt={page.lastPublishedAt}>
        <TopicPageHero {...page} />
        <StreamField body={page.body} />
    </Layout>
);

export async function getStaticPaths(context: GetStaticPathsContext) {
    let { locales, defaultLocale } = context;
    console.log(`slug getStaticPaths:
    locales: ${locales}
    default locale: ${defaultLocale}`);
    if (locales) {
        const topics = await getAreWeHeadlessYetTopicPages(locales);
        const paths = topics.map((topic: Topic) => ({
            params: {
                slug: [topic.meta.slug],
            },
        }));

        return {
            paths,
            fallback: false,
        };
    }
}

export async function getStaticProps(context: GetStaticPropsContext) {
    let { params, locale, defaultLocale } = context;
    if (locale === undefined) {
        locale = defaultLocale;
    }
    let page = null;
    const slug = params
        ? params.slug
            ? params.slug[params.slug.length - 1]
            : null
        : null; // select last slug
    console.log(`slug getStaticProps:
        params: ${JSON.stringify(params)}
        locale: ${locale}
        default locale: ${defaultLocale}`);
    if (slug && locale) {
        try {
            page = await getAreWeHeadlessYetTopicPage(slug, locale);

            return {
                props: { page: page },
            };
        } catch (err) {
            if (err instanceof Error) {
                // ✅ TypeScript knows err is Error
                console.log(`Failed to obtain data :-(: ${err.message}`);
            } else {
                console.log('Unexpected error', err);
            }
        }
    }
}

export default TopicPage;
