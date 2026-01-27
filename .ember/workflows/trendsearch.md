## Goal
Gather trend data from various sources and use it to determine new articles to post on AetherView.

## Process
First, call the following webhook to get the current trending topics on Reddit that relate to AetherView fields of interest.
 - Webhook URL: https://n8n.pistachio.blueshroomhomestead.com/webhook/reddit-trends
Then, iterate through each of the following urls and use BrowserMCP to retrieve the trend data they provide.
 - https://trends.google.com/trending?geo=US&hl=en-US&category=18
 - https://trends.google.com/trending?geo=US&hl=en-US&category=10
 - https://trends.google.com/trending?geo=US&hl=en-US&category=3
 - https://getdaytrends.com/united-states/
 - https://trends24.in/united-states/
 - https://youtube.trends24.in/united-states#group-science-and-technology
Finally, synthesize the data from these various sources to come up with 5 new article topics for AetherView.  These topics must be carefully selected to provide valuable information relating to the Metaverse, Virtual Realitiy, Web3, and Blockchain; and they must also be tuned to show up in search results and draw people to the AetherView website.

## Rules
 * Follow the process step-by-step.
 * Remember that AetherView's focus is providing an unbiased perspective on developing metaverse technologies.
 * DO NOT create or modify any files on this computer or via MCP servers.
 * Return the suggested article topics to the user in the following format:
##### <number>) <topic title>
  - Overview: <overview based on research; purpose/perspective/goal of article>
  - Reasoning: <summary of reasoning why this article is appropriate for AetherView and why it should generate traffic>