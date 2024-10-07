import HackerNewsCrawler from "./crawler";

async function main() {
  console.time("Total execution time");
  const crawler = new HackerNewsCrawler();
  await crawler.initialize();

  try {
    console.log("Crawling Process Started...");
    console.time("Crawl time");
    const entries = await crawler.crawl();
    console.timeEnd("Crawl time");
    console.log(`Crawled ${entries.length} entries`);

    console.log("\nFiltering entries with more than 5 words in title:");
    console.time("Long filter time");
    const longTitles = await crawler.filterEntries("long");
    console.timeEnd("Long filter time");
    console.log(longTitles);

    console.log("\nFiltering entries with 5 or fewer words in title:");
    console.time("Short filter time");
    const shortTitles = await crawler.filterEntries("short");
    console.timeEnd("Short filter time");
    console.log(shortTitles);
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    await crawler.close();
    console.timeEnd("Total execution time");
  }
}

main();
