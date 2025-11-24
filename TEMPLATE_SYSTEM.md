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
      "description": "Template description",
      "config": {
        "theme": "gray|dark",
        "size": "small|medium|large",
        "showLogo": true|false,
        "showTitle": true|false,
        "showSubtitle": true|false,
        "showDescription": true|false,
        "showHashtag": true|false,
        "showCTA": true|false
      }
    }
  ]
}
```

### 2. GitHub Actions Workflow

**File:** `.github/workflows/save-template.yml`

**Trigger:** Manual workflow dispatch via GitHub API

**Inputs:**
- `templateName` (required) - Name of the template
- `templateAuthor` (required) - Author's name
- `templateDescription` (required) - Template description
- `templateConfig` (required) - JSON configuration object

**Process:**
1. Validates the template configuration JSON
2. Generates a unique template ID based on name and timestamp
3. Appends the new template to `templates.json`
4. Commits and pushes changes
5. Sends email notification to hayden.meek@grumpygears.com

**Required Secrets:**
- `EMAIL_USERNAME` - SMTP username for email notifications
- `EMAIL_PASSWORD` - SMTP password for email notifications

### 3. Widget Wizard (`widget-wizard.html`)

**Save Template Feature:**

1. **Button:** Green "Save as Template" button in the preview section
2. **Modal:** Appears when user clicks "Save as Template"
3. **Form Fields:**
   - Template Name (required)
   - Author Name (required)
   - Description (required)
4. **Process:** Currently shows manual instructions for running the GitHub workflow

**Future Enhancement:** Add direct API integration to trigger GitHub workflow automatically

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

3. **JavaScript Functionality:**
   - Fetches templates from `templates.json` on page load
   - Checks localStorage for previously selected template
   - Auto-applies saved template on page load
   - Applies template styling when user selects a template
   - Persists template selection in localStorage

## Template Application Logic

When a template is applied, the system updates:

### Theme Colors
- **Gray Theme (default):**
  - Body background: `linear-gradient(135deg, #e0e0e0 0%, #c0c0c0 100%)`
  - Container background: `#f0f0f0`
  - Text colors: `#3d3d3d`, `#555`
  - Flip panels: `#3d3d3d`

- **Dark Theme:**
  - Body background: `linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%)`
  - Container background: `#2a2a2a`
  - Text colors: `#f0f0f0`, `#c0c0c0`
  - Flip panels: `#1a1a1a`

### Element Visibility
- Title (`showTitle`)
- Subtitle (`showSubtitle`)
- Description (`showDescription`)
- Hashtag (`showHashtag`)
- CTA Buttons (`showCTA`)

## User Flow

### Saving a Template (Current Process)

1. User configures widget in `widget-wizard.html`
2. Clicks "Save as Template" button
3. Fills in template metadata (name, author, description)
4. Follows manual instructions to trigger GitHub workflow:
   - Go to GitHub Actions tab
   - Select "Save Template" workflow
   - Click "Run workflow"
   - Enter template details
   - Submit

5. GitHub Actions workflow:
   - Validates input
   - Appends to `templates.json`
   - Commits changes
   - Sends email notification

6. Template is now available for all users

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

Two system templates are provided by default:

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

- [x] Templates load correctly from `templates.json`
- [x] Template selector button appears and is clickable
- [x] Template modal opens and displays all templates
- [x] Template cards render with correct information
- [x] Currently applied template is highlighted
- [ ] Template styling applies correctly (colors, visibility)
- [ ] Template selection saves to localStorage
- [ ] Template auto-loads on page refresh
- [ ] Modal closes when clicking outside
- [ ] Modal closes when clicking X button
- [ ] Works on mobile devices
- [ ] Works across different browsers

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

### Modifying Existing Templates
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
- GitHub workflow requires authentication
- Email notifications are sent to predetermined address only

## Performance Notes

- `templates.json` is fetched once on page load
- Template application is client-side only (no server requests)
- LocalStorage is checked on every page load
- Modal template cards are generated dynamically (no performance impact when closed)
