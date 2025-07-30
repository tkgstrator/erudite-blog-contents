import { AtpAgent, RichText } from '@atproto/api'

type FrontMatter = {
    title: string
    data: Date
    description: string
    tags: string[]
    authors: string[],
    path: string
}

const agent = new AtpAgent({
    service: 'https://bsky.social',
})
await agent.login({
    identifier: import.meta.env.BSKY_IDENTIFIER || process.env.BSKY_IDENTIFIER,
    password: import.meta.env.BSKY_PASSWORD || process.env.BSKY_PASSWORD,
})
const frontmatters: FrontMatter[] = JSON.parse(import.meta.env.FRONTMATTERS || process.env.FRONTMATTERS || '[]');
if (frontmatters.length !== 0) {
    const frontmatter: FrontMatter = frontmatters[0]
    // リンクを作成
    const url: URL = new URL(frontmatter.path, 'https://blog.tkgstrator.work/')
    const hashTags = frontmatter.tags.map((tag) => `#${tag.replace(/\s+/g, '')}`).join(' ')
    const text: RichText = new RichText({
        text: ['新しい記事を投稿しました'].concat(hashTags).join('\n'),
    })
    text.detectFacets(agent)

    const buffer = await (await fetch(new URL('/static/1200x630.png', 'https://blog.tkgstrator.work').href)).arrayBuffer()
    const response = await agent.uploadBlob(new Uint8Array(buffer), {
        encoding: 'image/png',
    })
    await agent.post({
        text: text.text,
        facets: text.facets,
        langs: ['en', 'ja'],
        // リンクを埋め込み
        embed: {
            $type: 'app.bsky.embed.external',
            external: {
                uri: url.href,
                title: frontmatter.title,
                description: frontmatter.description,
                thumb: response.data.blob
            }
        }
    })
}