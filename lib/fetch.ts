import humps from 'humps';
import type { Topic } from '../components/StreamField/blocks/TopicsBlock';

/**
 * Helper to fetch data from Wagtail's API.
 * @param path - URl path.
 * @param params - Mapping of query parameters.
 */
async function fetchHelper(path: string, params: { [key: string]: string }) {
    let headers = new Headers();
    if (process.env.INSTANCE === 'staging') {
        const auth =
            'Basic ' +
            Buffer.from(
                `${process.env.AUTH_USER}:${process.env.AUTH_PASSWORD}`,
            ).toString('base64');
        headers.append('Authorization', auth);
    }
    const response = await fetch(
        `${process.env.BASE_URL}api/v2/pages/${path}?` +
            new URLSearchParams(params),
        { headers: headers },
    );

    if (!response.ok) {
        throw new Error(response.statusText);
    }

    return await response.json();
}

/**
 * Retrieves the ID of the AreWeHeadless home page for further API querying.
 */
async function getAreWeHeadlessYetHomePageID(locale: string ) {
    const response = await fetchHelper('', {
        type: 'areweheadlessyet.AreWeHeadlessYetHomePage',
        locale: locale,
    });

    const items = response.items;
    if (items.length === 0) {
        throw new Error("Failed to fetch AreWeHeadlessYet home page's ID.");
    }
    return items[0].id;
}

/**
 * Retrieves the AreWeHeadlessYet home page.
 */
export async function getAreWeHeadlessYetHomePage(locale: string) {
    const homePageID = await getAreWeHeadlessYetHomePageID(locale);
    const response = await fetchHelper(homePageID, {});
    return humps.camelizeKeys(response);
}

/**
 * Retrieves all topics defined in the AreWeHeadlessYet backend.
 */
export async function getAreWeHeadlessYetTopics(locale: string) {
    const response = await fetchHelper('', {
        type: 'areweheadlessyet.AreWeHeadlessYetTopicPage',
        locale: locale,
        fields: 'title,status_color,introduction',
    });
    return humps.camelizeKeys(response);
}

/**
 * Retrieves all topic pages from the AreWeHeadlessYet backend.
 */
export async function getAreWeHeadlessYetTopicPages(locales: string[]) {
    const response = await fetchHelper('', {
        type: 'areweheadlessyet.AreWeHeadlessYetTopicPage',
        locale: locales.join(','),
        fields: '*',
    });
    return <Topic[]>humps.camelizeKeys(response.items);
}

/**
 * Retrieves a topic's page.
 * @param slug - Topic's slug
 */
export async function getAreWeHeadlessYetTopicPage(slug: string, locale: string) {
    const response = await fetchHelper('', {
        type: 'areweheadlessyet.AreWeHeadlessYetTopicPage',
        slug: slug,
        locale: locale,
        fields: '*',
    });

    const items = response.items;
    if (items.length === 0) {
        throw new Error(`Failed to fetch the ${slug} topic page.`);
    }
    return humps.camelizeKeys(items[0]);
}
