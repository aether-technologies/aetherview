## Goal
Finalize an article for publishing on the AetherView website by converting Markdown content to the proper HTML format.

## Process
1. **Download and analyze content**:
   - Download the article from NextCloud using the NextCloud MCP Server
   - Analyze the article to extract key metadata (title, categories, tags, estimated read time)

2. **Prepare for HTML conversion**:
   - Examine the existing HTML template structure in www/articles directory
   - Create appropriate file naming convention (use kebab-case from the title)

3. **Structured conversion process**:
   - Create HTML file with proper DOCTYPE, meta tags, and title
   - Set up basic page structure (header, main content area, sidebar, footer)
   - Convert markdown headings to appropriate HTML heading tags
   - Convert markdown paragraphs, lists, and other elements to HTML
   - Add proper AetherView styling and navigation elements
   - Insert article metadata (author, date, categories, tags)

4. **Handle large articles efficiently**:
   - For very large articles, create the HTML file in multiple chunks to avoid token limits
   - First create the basic structure and header information
   - Then add the article body content in manageable sections
   - Finally add the sidebar, related posts, and footer elements

5. **Add finishing touches**:
   - Update the related articles section to link to other articles
   - Add sharing buttons and comment sections
   - Ensure all relative links are properly configured

## Rules
 * Currently, articles on AetherView do not have cover images, so don't worry about that
 * All articles on AetherView are written by Aethio
 * Use the current date for the publication date (format: Month DD, YYYY)
 * Estimate reading time based on word count (approx. 200 words per minute)
 * Include standard advertising placeholder slots at appropriate intervals
 * Maintain consistent HTML structure with existing articles
 * Ensure proper hyperlinking between related articles
 * Make article file names SEO-friendly using kebab-case format
 * Always validate the final HTML structure before completing the process

 * DO NOT modify or delete any files on this computer or via MCP servers other than those specified in the process.