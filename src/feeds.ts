import { XMLParser } from "fast-xml-parser"

export async function fetchFeed(feedURL: string): Promise<RSSFeed | undefined> {
    console.log(`fetching feed from url: ${feedURL}`)
    try {
        const response = await fetch(feedURL, {
            headers: {
                'Accept': 'application/xml',
                'User-Agent': 'gator'
            }
        })
        if (!response.ok) {
            throw new Error(`Invalid response from fetch feeds: ${response.status}`)
        }
        const xml = await response.text()
        const parser = new XMLParser();
        const parsedData = parser.parse(xml)
        if(!parsedData.rss?.channel) {
            throw new Error(`Invalid feed. No channel present`)
        }
        const channel = parsedData.rss.channel
        const title = channel.title
        const link = channel.link
        const description = channel.description
        let validItems: RSSItem[] = []
        if (channel.item) {
            const items = Array.isArray(channel.item) ? channel.item : [channel.item]
            
            validItems = items.map((element:any): RSSItem | null => {
                const title = element.title;
                const link = element.link;
                const description = element.description;
                const pubDate = element.pubDate;
                if( title && link && description && pubDate &&
                    typeof title === 'string' && title.trim() !== '' &&
                    typeof link === 'string' && link.trim() !== '' &&
                    typeof description === 'string' && description.trim() !== '' &&
                    typeof pubDate === 'string' && pubDate.trim() !== ''
                ) {
                    const rssItemElement: RSSItem = {
                                    title: element.title,
                                    link: element.link,
                                    description: element.description,
                                    pubDate: element.pubDate
                                }
                    return rssItemElement
                }
                return null
                
            }).filter((element: any): element is RSSItem => element !== null)

        }
         const rssFeed: RSSFeed = {
                channel: {
                    title: title,
                    link: link,
                    description: description,
                    item: validItems
                }
            }
        return rssFeed
        

    } catch (err: unknown) {
        if(err instanceof Error) {
            console.log(`Failed to fetch feeds: ${err.message}`)
        }else {
            console.error(`Failed to fetch feeds: ${err}`);
        }
        return undefined
    }
}

export type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};

export type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};