import type { NextPage } from 'next';
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

export async function getStaticPaths({ locales, defaultLocale }) {
    console.log(`slug getStaticPaths:
    locales: ${locales}
    default locale: ${defaultLocale}`);
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

export async function getStaticProps({
    params,
    locale,
    defaultLocale,
}: {
    [key: string]: any;
}) {
    if (locale === undefined) {
        locale = defaultLocale;
    }
    let page = null;
    const slug = params ? params.slug[params.slug.length - 1] : null; // select last slug
    try {
        page = await getAreWeHeadlessYetTopicPage(slug, locale);
    } catch (e) {
        console.log(`Failed to obtain data :-(: ${e.message}`);
    }
    console.log(`slug getStaticProps:
    params: ${JSON.stringify(params)}
    locale: ${locale}
    default locale: ${defaultLocale}`);

    return {
        props: { page: page },
    };
}

export default TopicPage;
