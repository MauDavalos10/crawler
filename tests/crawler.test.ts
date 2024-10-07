import HackerNewsCrawler from "../src/crawler";

describe("HackerNewsCrawler", () => {
  let crawler: HackerNewsCrawler;

  beforeEach(async () => {
    crawler = new HackerNewsCrawler();
    await crawler.initialize();
  });

  afterEach(async () => {
    await crawler.close();
  });

  test("Crawl method should return 30 entries", async () => {
    const entries = await crawler.crawl();
    expect(entries.length).toBe(30);
  });
});
