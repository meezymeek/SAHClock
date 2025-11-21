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

## Technical Stack
- **Frontend**: Pure HTML/CSS/JavaScript (no build process)
- **Clock Animation**: [Flip library v1.8.2](https://github.com/pqina/flip)
- **Screenshot**: html2canvas for browser-side captures
- **Automation**: GitHub Actions + Playwright for server-side generation
- **Hosting**: GitHub Pages with custom domain

## Local Development
Simply open `index.html` in a browser - no build step required.

## Credits
Created by [Hayden Meek](https://www.instagram.com/meezymeek/)

## Campaign
Learn more about the Save American Hemp campaign at the [Texas Hemp Business Council](https://texashempbusinesscouncil.com/).
