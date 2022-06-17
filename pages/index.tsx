import type { GetStaticPropsContext, NextPage } from 'next';
import type { AreWeHeadlessYetHomePage } from '../components/types';
import type { Topics } from '../components/StreamField/blocks/TopicsBlock';

import { getAreWeHeadlessYetHomePage, getAreWeHeadlessYetTopics } from '../lib';

import Layout from '../components/Layout';
import HomeHero from '../components/HomeHero';
import StreamField from '../components/StreamField';

const Home: NextPage<{ page: AreWeHeadlessYetHomePage; topics: Topics }> = ({
    page,
    topics,
}) => (
    <Layout
        title="Are we headless yet? | Wagtail"
        lastPublishedAt={page.lastPublishedAt}
    >
        <HomeHero icon={page.straplineIcon} text={page.straplineText} />
        <StreamField body={page.body} topics={topics.items} />
    </Layout>
);

export async function getStaticProps(context: GetStaticPropsContext) {
    let { locale, defaultLocale } = context;
    // console.log(`index getStaticProps:
    // locale: ${locale}
    // default locale: ${defaultLocale}`);
    if (locale === undefined) {
        locale = defaultLocale;
    }
    if (locale) {
        const page = await getAreWeHeadlessYetHomePage(locale);
        const topics = await getAreWeHeadlessYetTopics(locale);

        return { props: { page: page, topics: topics } };
    }
}

export default Home;
