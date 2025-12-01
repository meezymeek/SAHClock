# SAHClock Template System Documentation

## Overview

The SAHClock template system allows users to save, browse, and apply different styling configurations to the countdown clock. This system consists of three main components:

1. **Template Storage** (`templates.json`)
2. **GitHub Actions Workflow** (`.github/workflows/save-template.yml`)
3. **Template Selector UI** (integrated in `index.html` and `widget-wizard.html`)

## System Architecture

### 1. Template Storage (`templates.json`)

Location: Root directory of the project

Structure:
```json
{
  "templates": [
    {
      "id": "unique-id",
      "name": "Template Name",
      "author": "Author Name",
      "created": "YYYY-MM-DD",
      "lastModified": "YYYY-MM-DD (optional, added when template is updated)",
      "description": "Template description",
      "config": {
        "theme": "gray|dark|custom",
        "size": "compact|medium|large",
        "showLogo": true|false,
        "logoUrl": "https://example.com/logo.png",
        "logoHeight": "80px",
        "showTitle": true|false,
        "showSubtitle": true|false,
        "showDescription": true|false,
        "showHashtag": true|false,
        "showCTA": true|false,
        "ctaText": "Button text",
        "ctaUrl": "https://example.com",
        "ctaButtonBg": "#4a4a4a",
        "ctaButtonText": "#ffffff",
        "showCTA2": true|false,
        "cta2Text": "Button text",
        "cta2Url": "https://example.com",
        "cta2ButtonBg": "#5a5a5a",
        "cta2ButtonText": "#ffffff",
        "colors": {
          "panelBackground": "#3d3d3d",
          "panelText": "#ffffff",
          "title": "#3d3d3d",
          "subtitle": "#555555",
          "description": "#555555",
          "hashtag": "#3d3d3d",
          "labels": "#888888",
          "containerBackground": "#f0f0f0"
        }
      }
    }
  ]
}
```

### 2. Cloudflare Worker API

**File:** `cloudflare-worker/save-template-worker.js`

**Endpoint:** `https://api.savehempclock.com`

**Method:** POST with JSON body

**Request Body:**
```json
{
  "name": "Template Name",
  "author": "Author Name (optional)",
  "description": "Template description (optional)",
  "config": { /* template configuration object */ }
}
```

**Process:**
1. Validates the template data
2. Fetches current `templates.json` from GitHub via API
3. Generates a unique template ID based on name and timestamp
4. Appends the new template to the templates array
5. Commits changes directly to GitHub repository
6. Optionally triggers email notification webhook (if configured)
7. Returns success response with template ID

**Required Environment Variables:**
- `GITHUB_TOKEN` - Personal Access Token with repo write permissions
- `GITHUB_OWNER` - Repository owner (e.g., "meezymeek")
- `GITHUB_REPO` - Repository name (e.g., "SAHClock")
- `EMAIL_WEBHOOK_URL` - (Optional) Webhook URL for email notifications

**Response Time:** ~2-3 seconds (immediate feedback to user)

**Deployment:** See `cloudflare-worker/DEPLOYMENT.md` for complete setup instructions

### 3. Widget Wizard (`widget-wizard.html`)

**Template Loader:**
- Dropdown at top of configuration panel
- Displays all available templates from `templates.json`
- Shows author name for non-System templates (e.g., "D8D (by Hayden Meek)")
- Loads template configuration into form when selected
- Allows users to modify loaded templates before applying

**Customization Options:**
- **Logo Settings:** URL and height
- **Custom Colors:** 8 color pickers for complete customization
- **CTA Button:** Text, URL, background color, text color
- **CTA2 Button (Hemp News):** Text, URL, background color, text color
- **Show/Hide Elements:** Logo, Title, Subtitle, Description, Hashtag, CTA, CTA2
- **Size:** Compact, Medium, Large
- **Animation:** Simple or Flip animation

**Save Template Feature:**
1. **Button:** Green "Save as Template" button next to "Copy to Clipboard"
2. **Modal:** Appears when user clicks "Save as Template"
3. **Form Fields:**
   - Template Name (required)
   - Author Name (optional)
   - Description (optional)
4. **Process:** 
   - POSTs template data to Cloudflare Worker API at `https://api.savehempclock.com`
   - Shows real-time status (saving, success, error)
   - Returns template ID on success
   - Displays 5-10 minute deployment notice for GitHub Pages rebuild
   - Auto-closes modal after 5 seconds on success

**Update Template Feature:**
1. **Button:** Orange "Update '[Template Name]'" button (appears between "Copy to Clipboard" and "Save as Template")
2. **Visibility:** Only shows when a user-created template is loaded (not for System templates)
3. **Confirmation:** Shows confirmation dialog explaining the update will overwrite the existing template
4. **Process:**
   - POSTs update request to Cloudflare Worker API with `action: 'update'` and `templateId`
   - Updates only the template's `config` field
   - Adds `lastModified` date to the template
   - Preserves original `created` date, `name`, `author`, and `description`
   - Shows real-time status (updating, success, error)
   - Button changes to "✓ Updated!" with green background on success
   - Displays deployment notice (5-10 minutes for GitHub Pages rebuild)
   - Resets button state after 3 seconds

### 4. Main Site Template Selector (`index.html`)

**Components:**

1. **Template Button** (Palette icon)
   - Position: Left of the widget wizard button (right: 140px)
   - Opens template selector modal on click
   - Styled to match other floating action buttons

2. **Template Modal**
   - Displays all available templates in a grid layout
   - Shows template name, author, and description
   - Highlights currently applied template
   - "Apply Template" button for each template

3. **Logo Support:**
   - Hidden `<img>` element with `countdown-logo` class
   - Shows when template has `showLogo: true` and `logoUrl`
   - Respects `logoHeight` configuration

4. **JavaScript Functionality:**
   - Fetches templates from `templates.json` on page load
   - Checks localStorage for previously selected template
   - Auto-applies saved template on page load
   - Applies all template configurations:
     * CSS variables for flip panel colors (persists through animations)
     * Logo display and customization
     * Custom colors for all elements
     * CTA button customization (text, URL, colors)
     * CTA2 button customization and visibility
     * Element visibility (title, subtitle, description, hashtag, CTA, CTA2)
   - Persists template selection in localStorage

## Template Application Logic

When a template is applied, the system updates:

### CSS Variables (Critical for Flip Animations)
The system uses CSS variables to maintain custom colors through Flip library animations:
```css
:root {
  --panel-bg: #3d3d3d;
  --panel-text: #ffffff;
}
```
These variables are applied using `document.documentElement.style.setProperty()` and persist across dynamically created DOM elements.

### Theme Colors
- **Gray Theme (default):**
  - CSS variables: `--panel-bg: #3d3d3d`, `--panel-text: #ffffff`
  - Body background: `linear-gradient(135deg, #e0e0e0 0%, #c0c0c0 100%)`
  - Container background: `#f0f0f0`
  - Text colors: `#3d3d3d`, `#555`

- **Dark Theme:**
  - CSS variables: `--panel-bg: #1a1a1a`, `--panel-text: #ffffff`
  - Body background: `linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%)`
  - Container background: `#2a2a2a`
  - Text colors: `#f0f0f0`, `#c0c0c0`

- **Custom Theme:**
  - CSS variables set from `config.colors.panelBackground` and `config.colors.panelText`
  - All colors customizable via `config.colors` object
  - 8 color options: panel background/text, title, subtitle, description, hashtag, labels, container background

### Logo Customization
- Display controlled by `showLogo` boolean
- Image source from `logoUrl`
- Height from `logoHeight` (CSS value like "80px", "5em")

### CTA Button Customization
- **Primary CTA:**
  - Text: `ctaText`
  - URL: `ctaUrl`
  - Background color: `ctaButtonBg`
  - Text color: `ctaButtonText`

- **Secondary CTA2 (Hemp News):**
  - Visibility: `showCTA2`
  - Text: `cta2Text`
  - URL: `cta2Url`
  - Background color: `cta2ButtonBg`
  - Text color: `cta2ButtonText`

### Element Visibility
- Logo (`showLogo`)
- Title (`showTitle`)
- Subtitle (`showSubtitle`)
- Description (`showDescription`)
- Hashtag (`showHashtag`)
- CTA Button (`showCTA`)
- CTA2 Button (`showCTA2`)

## User Flow

### Updating an Existing Template

1. User opens `widget-wizard.html`
2. Selects an existing user-created template from dropdown (e.g., "D8D")
3. "Update 'D8D'" button appears (orange button between Copy and Save buttons)
4. User modifies configuration (e.g., fixes wrong button link)
5. Clicks "Update 'D8D'" button
6. Confirmation dialog appears: "Update the 'D8D' template? This will overwrite..."
7. User confirms
8. Widget wizard POSTs update to `https://api.savehempclock.com`:
   ```json
   {
     "action": "update",
     "templateId": "d8d-1764015868485",
     "config": { /* updated configuration */ }
   }
   ```
9. Cloudflare Worker:
   - Validates update request
   - Fetches current `templates.json`
   - Finds template by ID
   - Updates template's `config` field
   - Adds/updates `lastModified` field with current date
   - Commits changes to GitHub with message "Update widget template: D8D"
   - Returns success response
10. User sees real-time status:
    - "Updating..." (button disabled)
    - "✓ Updated!" (green background)
    - Alert: "Template 'D8D' updated successfully! Note: 5-10 minutes..."
11. Button resets after 3 seconds
12. Changes available after GitHub Pages rebuild (~5-10 minutes)

**Total API time:** ~2-3 seconds ✨

**Key Features:**
- No modal form needed (uses existing loaded template)
- Simple confirmation dialog
- Sends `action: 'update'` with `templateId`
- Preserves original template metadata (name, author, created date)
- Only updates `config` and adds `lastModified` date
- Only available for user-created templates (System templates are protected)

### Saving a Template (Automated via Cloudflare Worker)

1. User configures widget in `widget-wizard.html`
   - Optionally loads existing template as starting point
   - Customizes logo, colors, buttons, visibility options
2. Clicks "Save as Template" button
3. Modal appears with form fields
4. Fills in template metadata:
   - Name (required)
   - Author (optional, defaults to "Anonymous")
   - Description (optional)
5. Clicks "Save" button in modal
6. Widget wizard POSTs template data to `https://api.savehempclock.com`
7. Cloudflare Worker:
   - Validates template data (name and config required)
   - Fetches current `templates.json` from GitHub via API
   - Generates unique ID: `{name-slug}-{timestamp}`
   - Appends new template to array
   - Commits changes directly to GitHub repository
   - Optionally triggers email notification webhook
   - Returns success response with template ID
8. User sees real-time status updates:
   - "Saving template..." (yellow background)
   - "✓ Template saved successfully!" with ID (green background)
   - "⏱️ Note: It may take 5-10 minutes for your template to appear..." (deployment notice)
9. Modal auto-closes after 5 seconds
10. Template available to all users after GitHub Pages rebuild (~5-10 minutes)

**Total API time:** ~2-3 seconds ✨

**Requirements:**
- Cloudflare Worker deployed at `api.savehempclock.com`
- Worker environment variables configured:
  * `GITHUB_TOKEN` - Personal Access Token with repo write access
  * `GITHUB_OWNER` - Repository owner
  * `GITHUB_REPO` - Repository name
  * `EMAIL_WEBHOOK_URL` - (Optional) for notifications
- See `cloudflare-worker/DEPLOYMENT.md` for complete setup instructions

### Applying a Template

1. User visits `index.html`
2. If a template was previously selected:
   - System loads saved template ID from localStorage
   - Automatically applies that template's styling

3. To select a different template:
   - Click the palette button (left of widget button)
   - Browse available templates in modal
   - Click "Apply Template" on desired template
   - Template styling is applied immediately
   - Selection is saved to localStorage

4. Template persists across:
   - Page reloads
   - Browser sessions (until localStorage is cleared)

## LocalStorage Keys

- `selectedTemplate` - Stores the currently selected template ID

## API Endpoints Used

- `GET templates.json` - Fetches all available templates

## Default Templates

System templates provided by default:

1. **Gray Default**
   - ID: `gray-default`
   - Original monochromatic gray theme
   - Shows: Title, Subtitle, Description, Hashtag
   - Hides: Logo, CTA buttons

2. **Dark Minimal**
   - ID: `dark-minimal`
   - Dark theme with minimal text
   - Shows: Title, Subtitle, Hashtag
   - Hides: Logo, Description, CTA buttons

Example community template with full customization:

3. **D8D w/ Hemp News Button**
   - ID: `d8d-w-hemp-news-button-1764015868485`
   - Author: Hayden Meek
   - Custom theme with brand colors
   - Logo: Delta 8 Denton branding
   - Custom colors for all elements
   - Both CTA buttons enabled with custom styling
   - Demonstrates full feature set including CTA2

## Future Enhancements

### High Priority
1. Add direct API integration in widget wizard to trigger GitHub workflow
2. Add template preview thumbnails
3. Add "Reset to Default" button

### Medium Priority
1. Add template search/filter functionality
2. Add ability to edit/delete templates
3. Add template categories/tags
4. Add template rating system

### Low Priority
1. Add template sharing via URL
2. Add custom color picker for advanced users
3. Add animation preset options
4. Export/import template configurations

## Testing Checklist

### Template System
- [x] Templates load correctly from `templates.json`
- [x] Template selector button appears and is clickable
- [x] Template modal opens and displays all templates
- [x] Template cards render with correct information
- [x] Currently applied template is highlighted
- [x] Template styling applies correctly (colors, visibility)
- [x] Template selection saves to localStorage
- [x] Template auto-loads on page refresh
- [x] Modal closes when clicking outside
- [x] Modal closes when clicking X button

### Logo Support
- [x] Logo displays when `showLogo: true` and `logoUrl` provided
- [x] Logo respects custom `logoHeight` setting
- [x] Logo hides when `showLogo: false`

### Custom Colors
- [x] CSS variables (--panel-bg, --panel-text) persist through animations
- [x] Custom colors apply to all 8 configurable elements
- [x] Colors work with both simple and animated widgets

### CTA Buttons
- [x] Primary CTA button customizable (text, URL, colors)
- [x] CTA2 button (Hemp News) shows/hides based on `showCTA2`
- [x] CTA2 button fully customizable (text, URL, colors)
- [x] Both buttons render independently

### Template Saving
- [x] Cloudflare Worker API endpoint operational
- [x] Template saves in ~2-3 seconds
- [x] Unique template IDs generated correctly
- [x] GitHub commits successful
- [x] User receives success/error feedback
- [x] Form clears after successful save

### Template Updating
- [ ] Update button only shows for user-created templates
- [ ] Update button hidden for System templates
- [ ] Update button text shows correct template name
- [ ] Confirmation dialog displays before update
- [ ] Update request succeeds in ~2-3 seconds
- [ ] Template config updates correctly
- [ ] lastModified field added/updated
- [ ] Original metadata preserved (name, author, created)
- [ ] User receives success/error feedback
- [ ] Button state resets after update

### Widget Integration
- [x] Widget wizard loads templates in dropdown
- [x] Template loader populates all form fields
- [x] Modified templates work in preview
- [x] Generated code includes all customizations
- [x] Both simple and animated widgets support all features

### Cross-Browser & Mobile
- [ ] Template system works on Chrome, Firefox, Safari, Edge
- [ ] Mobile responsive design functions correctly
- [ ] Touch interactions work on mobile devices

## Troubleshooting

### Templates Not Loading
- Check browser console for fetch errors
- Verify `templates.json` exists in root directory
- Verify JSON syntax is valid

### Template Not Applying
- Check browser console for JavaScript errors
- Verify template config structure matches expected format
- Clear localStorage and try again

### Template Not Persisting
- Check if localStorage is enabled in browser
- Check if localStorage quota is exceeded
- Verify template ID is being saved correctly

## Maintenance

### Adding a New Template
1. Run the GitHub Actions workflow with new template details
2. Verify template appears in `templates.json`
3. Test template on main site
4. Update documentation if new config options are added

### Updating an Existing Template (via Widget Wizard)
1. Open widget wizard and select the template to update
2. Make desired changes to the configuration
3. Click "Update '[Template Name]'" button
4. Confirm the update in the dialog
5. Wait ~2-3 seconds for API response
6. Template updates with `lastModified` date added
7. Changes available after GitHub Pages rebuild (~5-10 minutes)

### Modifying Existing Templates (Direct Edit)
1. Directly edit `templates.json`
2. Commit changes
3. Deploy to production
4. Test on main site

### Removing a Template
1. Remove template object from `templates.json`
2. Commit changes
3. Deploy to production
4. Note: Users who had this template selected will revert to default

## Security Considerations

- Template configurations only affect CSS/display properties
- No executable code is stored in templates
- Cloudflare Worker validates all input data
- GitHub API access requires Personal Access Token
- CORS headers configured for browser security
- Email notifications sent to webhook (if configured)
- Template IDs include timestamp to prevent collisions
- GitHub commits attributed to "SAHClock Template Bot"

## Performance Notes

- `templates.json` is fetched once on page load
- Template application is client-side only (no server requests after initial load)
- LocalStorage is checked on every page load
- Modal template cards are generated dynamically (no performance impact when closed)
- CSS variables provide zero-overhead color persistence
- Cloudflare Worker runs on edge network (~2-3 second response time)
- GitHub Pages rebuild takes 5-10 minutes after template save
