# SAHClock - Save American Hemp Countdown Clock

A countdown clock for the Save American Hemp campaign, counting down to November 12, 2026.

## Live Site
🌐 [SAVEHEMPCLOCK.COM](https://savehempclock.com)

## Features

### 🕒 Dynamic Countdown
- Real-time flip clock animation counting down to November 12, 2026 midnight
- Fully responsive design for all screen sizes
- Classic monochromatic gray theme

### 📸 Instagram Screenshot Tool
- Floating camera button for manual screenshots
- Generates 1080x1350px images (Instagram 4:5 ratio)
- Automatically hides footer and CTA buttons in screenshots
- Uses static text mode to avoid flip animation artifacts

### 🖼️ Automated Social Media Previews
- GitHub Actions workflow updates `preview.png` every 5 minutes
- Open Graph and Twitter Card meta tags for rich social sharing
- Preview image automatically reflects current countdown state
- **Cache-busting**: Meta tag URLs update with timestamps to force social platforms to fetch fresh images
- Eliminates need for manual cache clearing in Facebook/Twitter debuggers

## How It Works

### Automated Preview Updates
A GitHub Actions workflow (`.github/workflows/update-preview.yml`) runs every 5 minutes to:
1. Visit the live site using Playwright headless browser
2. Capture the countdown in static mode (no animation artifacts)
3. Generate a 1080x1350px preview image
4. Commit and push `preview.png` to the repository
5. GitHub Pages serves the updated image for social media previews

### Manual Screenshot Button
Users can click the subtle camera icon in the bottom-right corner to:
- Download a clean screenshot of the current countdown
- Share on Instagram or other social platforms
- Create promotional materials

## Embedding the Widget

You can embed the countdown clock on any website using our JavaScript widget. Two versions are available:

### Widget Versions

**Simple Widget** (Recommended)
- Lightweight, fast loading
- No animations, instant number updates
- File: `sah-countdown-widget.js`

**Animated Widget**
- Includes flip clock animations
- Loads Flip library automatically (~50KB extra)
- File: `sah-countdown-widget-animated.js`

### Basic Usage

**Simple Version:**
```html
<div id="sah-countdown"></div>
<script src="https://savehempclock.com/sah-countdown-widget.js"></script>
<script>
  SAHCountdown.init({
    container: '#sah-countdown'
  });
</script>
```

**Animated Version:**
```html
<div id="sah-countdown"></div>
<script src="https://savehempclock.com/sah-countdown-widget-animated.js"></script>
<script>
  SAHCountdownAnimated.init({
    container: '#sah-countdown'
  });
</script>
```

### Customization Options

**Preset Themes:**
```javascript
SAHCountdown.init({
  container: '#sah-countdown',
  theme: 'dark' // Options: 'gray', 'dark', 'light'
});
```

**Custom Colors:**
```javascript
SAHCountdown.init({
  container: '#sah-countdown',
  colors: {
    panelBackground: '#006400',  // Dark green panels
    panelText: '#ffffff',        // White numbers
    title: '#228B22',           // Green title
    hashtag: '#228B22',         // Green hashtag
    containerBackground: '#f0fff0' // Light green background
  }
});
```

**Size Options:**
```javascript
SAHCountdown.init({
  container: '#sah-countdown',
  size: 'compact' // Options: 'compact', 'medium', 'large'
});
```

**Show/Hide Elements:**
```javascript
SAHCountdown.init({
  container: '#sah-countdown',
  showTitle: true,        // Show "Save American Hemp" title
  showSubtitle: true,     // Show "Until Hemp is ILLEGAL"
  showDescription: true,  // Show campaign description
  showHashtag: true,     // Show #SAVEAMERICANHEMP
  showCTA: false         // Show "Contact Legislators" button
});
```

### Widget Customization Wizard

Use our interactive wizard to generate custom embed code:
- 🔗 **[Widget Wizard](https://savehempclock.com/widget-wizard.html)**
- Configure all options visually
- Live preview of your customizations
- One-click copy to clipboard
- Access via the share button on the main site

See `widget-demo.html` for additional examples of all configurations.

## Technical Stack
- **Frontend**: Pure HTML/CSS/JavaScript (no build process)
- **Clock Animation**: [Flip library v1.8.2](https://github.com/pqina/flip) (main site)
- **Widget**: Pure JavaScript, no dependencies
- **Screenshot**: html2canvas for browser-side captures
- **Automation**: GitHub Actions + Playwright for server-side generation
- **Hosting**: GitHub Pages with custom domain

## Local Development
Simply open `index.html` or `widget-demo.html` in a browser - no build step required.

## Credits
Created by [Hayden Meek](https://www.instagram.com/meezymeek/)

## Campaign
Learn more about the Save American Hemp campaign at the [Texas Hemp Business Council](https://texashempbusinesscouncil.com/).
