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

  test("FilterEntries should return entries with more than 5 words for long filter", async () => {
    await crawler.crawl();
    const longEntries = await crawler.filterEntries("long");
    longEntries.forEach((entry) => {
      const wordCount = entry.title
        .split(/\s+/)
        .filter((word) => word.length > 0).length;
      expect(wordCount).toBeGreaterThan(5);
    });
  });

  test("FilterEntries should return entries with 5 or fewer words for short filter", async () => {
    await crawler.crawl();
    const shortEntries = await crawler.filterEntries("short");
    shortEntries.forEach((entry) => {
      const wordCount = entry.title
        .split(/\s+/)
        .filter((word) => word.length > 0).length;
      expect(wordCount).toBeLessThanOrEqual(5);
    });
  });
});
