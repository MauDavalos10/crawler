import puppeteer, { Browser, Page } from "puppeteer";
import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import { HackerNewsEntry, UsageData } from "./types";

class HackerNewsCrawler {
  private url: string;
  private dbName: string;
  private db!: Database<sqlite3.Database, sqlite3.Statement>;
  private browser!: Browser;

  constructor() {
    this.url = "https://news.ycombinator.com/";
    this.dbName = "hacker_news.db";
  }

  async initialize(): Promise<void> {
    this.db = await open({
      filename: this.dbName,
      driver: sqlite3.Database,
    });

    await this.createTables();
    this.browser = await puppeteer.launch();
  }

  private async createTables(): Promise<void> {
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        number INTEGER,
        title TEXT,
        points INTEGER,
        comments INTEGER
      )
    `);

    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS usage_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT,
        filter_applied TEXT,
        execution_time REAL
      )
    `);
  }

  async crawl(): Promise<HackerNewsEntry[]> {
    const page: Page = await this.browser.newPage();
    await page.goto(this.url, { waitUntil: "networkidle0" });

    const entries: HackerNewsEntry[] = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll(".athing"));
      return items.slice(0, 30).map((item, index) => {
        const titleElement = item.querySelector(".titleline > a");
        const subtext = item.nextElementSibling?.querySelector(".subtext");
        const pointsElement = subtext?.querySelector(".score");
        const commentsElement = subtext?.querySelector("a:last-child");

        return {
          number: index + 1,
          title: titleElement?.textContent?.trim() || "",
          points: pointsElement
            ? parseInt(pointsElement.textContent || "0")
            : 0,
          comments:
            commentsElement && commentsElement.textContent?.includes("comment")
              ? parseInt(commentsElement.textContent)
              : 0,
        };
      });
    });

    await this.saveEntries(entries);
    await page.close();
    return entries;
  }

  private async saveEntries(entries: HackerNewsEntry[]): Promise<void> {
    const statement = await this.db.prepare(
      "INSERT INTO entries (number, title, points, comments) VALUES (?, ?, ?, ?)",
    );
    for (const entry of entries) {
      await statement.run(
        entry.number,
        entry.title,
        entry.points,
        entry.comments,
      );
    }
    await statement.finalize();
  }

  async filterEntries(filter: "long" | "short"): Promise<HackerNewsEntry[]> {
    const startTime = process.hrtime();

    let query: string;
    if (filter === "long") {
      query = `
        SELECT * FROM entries 
        WHERE (LENGTH(title) - LENGTH(REPLACE(title, ' ', '')) + 1) > 5 
        ORDER BY comments DESC
      `;
    } else {
      query = `
        SELECT * FROM entries 
        WHERE (LENGTH(title) - LENGTH(REPLACE(title, ' ', '')) + 1) <= 5 
        ORDER BY points DESC
      `;
    }

    const result = await this.db.all<HackerNewsEntry[]>(query);

    const endTime = process.hrtime(startTime);
    const executionTime = endTime[0] + endTime[1] / 1e9;

    await this.logUsage(filter, executionTime);
    return result;
  }

  private async logUsage(filter: string, executionTime: number): Promise<void> {
    await this.db.run(
      "INSERT INTO usage_data (timestamp, filter_applied, execution_time) VALUES (?, ?, ?)",
      new Date().toISOString(),
      filter,
      executionTime,
    );
  }

  async close(): Promise<void> {
    await this.db.close();
    await this.browser.close();
  }
}

export default HackerNewsCrawler;
