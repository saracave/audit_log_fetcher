const axios = require('axios');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createArrayCsvWriter;

const API_TOKEN = "your-api-token-here";
const BASE_URL = "https://app.launchdarkly.com/api/v2/auditlog";
const AFTER_TIMESTAMP = "1740751200000";  // example start date March 1, 2025 00:00:00 UTC
let beforeTimestamp = "1742392799999";    // example end date March 20, 2025 23:59:59.999 UTC
let totalLogs = 0;

const csvWriter = createCsvWriter({
  path: 'audit_logs.csv',
  header: ["User", "Action", "Flag Name", "Timestamp", "Project", "Details"]
});

async function fetchLogs() {
  console.log("📥 Starting to fetch logs...");
  
  await csvWriter.writeRecords([]);

  while (true) {
    console.log(`📥 Fetching logs before timestamp: ${beforeTimestamp}...`);

    try {
      const response = await axios.get(`${BASE_URL}`, {
        params: {
          after: AFTER_TIMESTAMP,
          before: beforeTimestamp,
          limit: 10,
          spec: "proj/*:env/production:flag/*"
        },
        headers: {
          Authorization: `${API_TOKEN}`,
          Accept: "application/json"
        }
      });

      const data = response.data.items;
      if (data.length === 0) break;

      const logEntries = data.map(entry => [
        entry.member?.email || "Unknown",
        entry.titleVerb,
        entry.name,
        entry.date,
        entry.accesses?.[0]?.resource?.match(/proj\/(\w+)/)?.[1] || "N/A",
        entry.description || "No details"
      ]);

      await csvWriter.writeRecords(logEntries);

      totalLogs += data.length;
      console.log(`✅ Added ${data.length} logs. Total: ${totalLogs}. Fetching next batch...`);

      beforeTimestamp = data[data.length - 1].date;

      const globalRemaining = response.headers['x-ratelimit-global-remaining'];
      const routeRemaining = response.headers['x-ratelimit-route-remaining'];
      const resetTime = response.headers['x-ratelimit-reset'];
      const retryAfter = response.headers['retry-after'];

      if (globalRemaining == 0 || routeRemaining == 0) {
        const waitTime = Math.max((resetTime - Date.now()) / 1000, 5);
        console.log(`⚠️ Rate limit reached. Waiting ${waitTime} seconds...`);
        await new Promise(resolve => setTimeout(resolve, waitTime * 1000));
      }

    } catch (error) {
      if (error.response?.status === 429) {
        const retryAfter = error.response.headers['retry-after'] || 10;
        const waitTime = parseInt(retryAfter) + Math.floor(Math.random() * 3);
        console.log(`⚠️ Rate limited! Retrying after ${waitTime} seconds...`);
        await new Promise(resolve => setTimeout(resolve, waitTime * 1000));
      } else {
        console.error(`❌ Error: ${error.response?.status || error.message}`);
        break;
      }
    }
  }

  console.log(`🎉 Finished! All logs saved to audit_logs.csv. Total logs: ${totalLogs}.`);
}

fetchLogs();
