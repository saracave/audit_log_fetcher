# Audit Log Fetcher

This script fetches audit logs from the LaunchDarkly API and saves them to a CSV file. This tool is designed for external customers.

## Setup

1. **Install Node.js** (if not already installed) from [https://nodejs.org/](https://nodejs.org/)
2. **Extract the ZIP file**
3. **Run the following commands:**

```sh
npm install  # Install dependencies
npm start    # Run the script
```

## How It Works

- Enter your desired date range using the "AFTER_TIMESTAMP" and "beforeTimestamp" fields in Unix epoch milliseconds format (milliseconds since January 1, 1970 UTC)
- Example: March 1, 2025 00:00:00 UTC = 1740751200000
- You can use websites like https://www.epochconverter.com/ to convert between dates and timestamps
- Fetches audit logs **10 at a time**
- Saves all logs to `audit_logs.csv`
- Handles rate limiting (retrying when necessary)

Enjoy! 🚀
