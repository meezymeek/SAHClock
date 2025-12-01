/**
 * Cloudflare Worker: SAHClock Template Saver
 * 
 * This worker receives template submissions from the widget wizard and commits them
 * directly to the templates.json file in the GitHub repository.
 * 
 * Environment Variables Required:
 * - GITHUB_TOKEN: Personal Access Token with repo write permissions
 * - GITHUB_OWNER: Repository owner (e.g., "meezymeek")
 * - GITHUB_REPO: Repository name (e.g., "SAHClock")
 * - EMAIL_WEBHOOK_URL: Optional webhook URL for email notifications
 */

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request, env) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Only accept POST requests
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    try {
      // Parse request body
      const body = await request.json();
      const { action, templateId, name, author, description, config } = body;

      // Validate config structure
      if (!config || typeof config !== 'object') {
        return new Response(JSON.stringify({ error: 'Config must be an object' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Get current templates.json from GitHub
      const getFileUrl = `https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/contents/templates.json`;
      const getResponse = await fetch(getFileUrl, {
        headers: {
          'Authorization': `Bearer ${env.GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'SAHClock-Template-Worker',
        },
      });

      if (!getResponse.ok) {
        throw new Error(`Failed to fetch templates.json: ${getResponse.statusText}`);
      }

      const fileData = await getResponse.json();
      const currentContent = JSON.parse(atob(fileData.content));

      let resultTemplateId;
      let commitMessage;

      // Handle UPDATE action
      if (action === 'update') {
        if (!templateId) {
          return new Response(JSON.stringify({ error: 'Missing required field: templateId for update action' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // Find template by ID
        const templateIndex = currentContent.templates.findIndex(t => t.id === templateId);
        if (templateIndex === -1) {
          return new Response(JSON.stringify({ error: `Template not found: ${templateId}` }), {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // Update the template config and add lastModified date
        currentContent.templates[templateIndex].config = config;
        currentContent.templates[templateIndex].lastModified = new Date().toISOString().split('T')[0];

        resultTemplateId = templateId;
        commitMessage = `Update widget template: ${currentContent.templates[templateIndex].name}`;

      } else {
        // Handle CREATE action (default behavior)
        if (!name) {
          return new Response(JSON.stringify({ error: 'Missing required field: name' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // Generate unique template ID
        const timestamp = Date.now();
        const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + timestamp;

        // Create new template object
        const newTemplate = {
          id,
          name,
          author: author || 'Anonymous',
          created: new Date().toISOString().split('T')[0],
          description: description || '',
          config,
        };

        // Add to templates array
        currentContent.templates.push(newTemplate);

        resultTemplateId = id;
        commitMessage = `Add new widget template: ${name}`;
      }

      // Encode updated content
      const updatedContent = btoa(JSON.stringify(currentContent, null, 2));

      // Commit to GitHub
      const commitUrl = `https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/contents/templates.json`;
      const commitResponse = await fetch(commitUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${env.GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'SAHClock-Template-Worker',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: commitMessage,
          content: updatedContent,
          sha: fileData.sha,
          committer: {
            name: 'SAHClock Template Bot',
            email: 'bot@savehempclock.com',
          },
        }),
      });

      if (!commitResponse.ok) {
        const errorData = await commitResponse.text();
        throw new Error(`Failed to commit template: ${errorData}`);
      }

      // Optional: Trigger email notification webhook
      if (env.EMAIL_WEBHOOK_URL && action !== 'update') {
        try {
          await fetch(env.EMAIL_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              templateName: name,
              templateAuthor: author || 'Anonymous',
              templateDescription: description || '',
            }),
          });
        } catch (emailError) {
          console.error('Email notification failed:', emailError);
          // Don't fail the whole request if email fails
        }
      }

      // Return success
      return new Response(JSON.stringify({
        success: true,
        message: action === 'update' ? 'Template updated successfully!' : 'Template saved successfully!',
        templateId: resultTemplateId,
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } catch (error) {
      console.error('Error saving template:', error);
      return new Response(JSON.stringify({
        error: 'Failed to save template',
        details: error.message,
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  },
};
