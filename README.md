**Hacker News Crawler**
This project extracts and filters the first 30 inputs of Hacker News website

**Architectural Decision Record (ADR)**
Title: Hacker News Crawler Architecture

The interviewer asked to develop a web crawler to extract and filter the first 30 entries from Hacker News (https://news.ycombinator.com/). The crawler should be able to perform specific filtering operations and store usage data. The solution needs to be efficient, maintainable, and testable.

**Decision:**

Language and Runtime:

Use TypeScript with Node.js
Argument: TypeScript provides static typing, improving code quality and maintainability. Node.js offers a rich ecosystem for web scraping and database operations.


Web Scraping Library:

Use Puppeteer
Argument: Puppeteer provides a high-level API to control Chrome/Chromium, allowing for robust scraping of dynamic content. It's particularly useful for sites that may require JavaScript execution.


Database:

Use SQLite
Argument: SQLite requires zero configuration, and is suitable for applications that don't need a separate database server. It's perfect for our use case of storing crawler results and usage data locally.


**Project Structure:**

Use a single class HackerNewsCrawler to encapsulate all functionality
Argument: This promotes encapsulation and makes the codebase easier to understand and maintain.


**Data Persistence Strategy:**

Store scraped entries in the database immediately after crawling
Implement filtering operations to work directly with the database
Argument: This approach allows for efficient repeated filtering operations without re-scraping the website.


**Error Handling and Logging:**

Implement try-catch blocks for database operations
Use console.error for logging errors
Argument: This ensures that errors are caught and logged, facilitating debugging and improving reliability.


**Testing Strategy:**

Use Mocha as the test runner and Chai for assertions
Implement unit tests for individual methods and integration tests for the entire crawling process
Argument: This combination provides a robust testing framework, allowing for comprehensive test coverage.



**Consequences:**

**Positive:**

TypeScript will help catch type-related errors early in the development process.
Puppeteer allows for reliable scraping of JavaScript-rendered content.
SQLite provides a simple, file-based database solution that doesn't require additional setup.
The single-class structure makes the codebase easy to understand and extend.
Storing entries in the database allows for efficient filtering operations.
The chosen testing strategy will help maintain code quality as the project evolves.

**Negative:**

Puppeteer may be overkill for simple static websites, potentially increasing the project's complexity and resource usage.
SQLite may not be suitable if the project scales to require concurrent access from multiple processes.
The single-class structure might become unwieldy if the project scope significantly expands.

**Risks:**

Changes to the Hacker News HTML structure could break the scraping logic.
Heavy usage might strain Hacker News servers, potentially leading to IP blocks.

**Mitigations:**

Implement robust error handling and logging to quickly identify and address scraping issues.
Add reasonable delays between requests and consider caching results to minimize server load.
If the project scope expands significantly, consider refactoring into a more modular structure.

**Tags:**
TypeScript, Node.js, Puppeteer, SQLite, Web Scraping, Testing

**Requirements**
Node.js (v14 or superior)

**Installation**
- Clone this repo.
- Run npm install to install dependencies


**Core Features**
- Extract the first 30 inputs of Hacker News website.
- Filter inputs with more than 5 words in the title, sorted by number of comments.
- Filter inputs with 5 or less words in the title, sorted by points.
- Store the result in a SQLiteDB