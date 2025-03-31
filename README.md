# Audit Log Fetcher

This script fetches audit logs from the LaunchDarkly API and saves them to a CSV file.

## Setup

1. **Install Node.js** (if not already installed) from [https://nodejs.org/](https://nodejs.org/)
2. **Extract the ZIP file**
3. **Run the following commands:**

```sh
npm install  # Install dependencies
npm start    # Run the script
```

## How It Works

- Fetches audit logs **10 at a time**.
- Saves logs to `audit_logs.csv`.
- Handles rate limiting (retrying when necessary).

Enjoy! 🚀
