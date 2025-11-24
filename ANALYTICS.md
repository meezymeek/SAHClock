# SAHClock Analytics Documentation

## Overview

The SAHClock website uses Google Analytics 4 (GA4) to track user behavior and measure the effectiveness of the Save American Hemp advocacy campaign. This document outlines all tracked events and how to interpret the data.

## Google Analytics Property

- **Measurement ID**: `G-RXB0JB41PZ`
- **Property Name**: Save American Hemp Clock
- **Website**: https://savehempclock.com

## Tracked Pages

1. **Main Site** (`index.html`) - The countdown clock landing page
2. **Widget Wizard** (`widget-wizard.html`) - Widget customization tool

## Custom Events

### 1. Screenshot Captured
**Event Name**: `screenshot_captured`

**Triggered When**: User downloads an Instagram-formatted screenshot

**Parameters**:
- `event_category`: "conversion"
- `event_label`: Template ID being used (e.g., "gray-default", "d8d-1764012596117")
- `device_type`: "mobile" or "desktop" (based on viewport width ≤768px)

**What It Tells You**:
- How many screenshots are being created
- Which templates are most popular for sharing
- Mobile vs desktop usage for this feature

**Dashboard View**: Events > screenshot_captured

---

### 2. Template Modal Opened
**Event Name**: `template_modal_opened`

**Triggered When**: User clicks the palette button to browse templates

**Parameters**:
- `event_category`: "engagement"
- `event_label`: "template_selector"

**What It Tells You**:
- How many users are exploring template options
- Engagement level with the template system

**Dashboard View**: Events > template_modal_opened

---

### 3. Template Selected
**Event Name**: `template_selected`

**Triggered When**: User applies a template from the template selector

**Parameters**:
- `event_category`: "engagement"
- `event_label`: Template name (e.g., "D8D", "Gray Default")
- `template_id`: Unique template identifier
- `template_author`: Creator of the template

**What It Tells You**:
- Which templates are most popular
- User preferences (dark vs light vs custom)
- Community template engagement

**Dashboard View**: Events > template_selected
**Useful Reports**: 
- Top templates by selection count
- Author performance metrics

---

### 4. CTA Button Click
**Event Name**: `cta_click`

**Triggered When**: User clicks "Contact Your Legislators" or "Hemp News" button

**Parameters**:
- `event_category`: "conversion"
- `event_label`: "contact_legislators" or "hemp_news"
- `template_id`: Template being used when clicked

**What It Tells You**:
- **Primary KPI**: How many users are taking action
- Effectiveness of different templates in driving action
- Which call-to-action resonates more

**Dashboard View**: Events > cta_click
**Critical Metric**: This measures actual advocacy engagement!

---

### 5. Template Loaded (Widget Wizard)
**Event Name**: `template_loaded`

**Triggered When**: User selects a template in the widget wizard dropdown

**Parameters**:
- `event_category`: "engagement"
- `event_label`: Template name
- `template_id`: Unique template identifier

**What It Tells You**:
- Which templates users customize
- Starting points for widget creation
- Template browsing behavior in wizard

**Dashboard View**: Events > template_loaded

---

### 6. Widget Code Copied
**Event Name**: `widget_code_copied`

**Triggered When**: User clicks "Copy to Clipboard" in widget wizard

**Parameters**:
- `event_category`: "conversion"
- `event_label`: Animation type ("simple" or "flip")
- `animation_type`: "simple" or "flip"
- `widget_size`: "compact", "medium", or "large"
- `template_id`: Template used
- `template_name`: Template name

**What It Tells You**:
- How many widgets are being embedded
- Animation preference (simple vs flip)
- Size preferences
- Template popularity for embeddin g

**Dashboard View**: Events > widget_code_copied
**Key Metric**: Indicates widget distribution success

---

### 7. Template Saved
**Event Name**: `template_saved`

**Triggered When**: User successfully saves a new template

**Parameters**:
- `event_category`: "conversion"
- `event_label`: Template name
- `template_id`: Newly generated template ID
- `template_author`: Author name or "Anonymous"

**What It Tells You**:
- Community engagement and contribution
- Template creation frequency
- Most active contributors

**Dashboard View**: Events > template_saved

---

## Automatic GA4 Metrics

GA4 automatically tracks these metrics without custom code:

### Traffic Metrics
- **Page Views**: How many times pages are loaded
- **Users**: Unique visitors
- **Sessions**: Visit sessions
- **Session Duration**: How long users stay
- **Bounce Rate**: Single-page visits

### Audience Data
- **Device Category**: Mobile, Desktop, Tablet
- **Operating System**: Windows, iOS, Android, etc.
- **Browser**: Chrome, Safari, Firefox, etc.
- **Screen Resolution**: Display sizes

### Geographic Data
- **Country**: Where users are located
- **Region/State**: US states, international regions
- **City**: City-level data

### Acquisition Data
- **Traffic Source**: Direct, Social, Referral, Search
- **Medium**: organic, social, referral, etc.
- **Campaign**: UTM campaign tracking (if used)

---

## Key Dashboards to Create

### 1. Advocacy Impact Dashboard
**Metrics**:
- Total CTA clicks (contact_legislators)
- CTA click rate (clicks / page views)
- Geographic distribution of clicks
- Device breakdown for activism

**Purpose**: Measure campaign effectiveness

### 2. Template Performance Dashboard
**Metrics**:
- Template selections by name
- Template author leaderboard
- Screenshot counts by template
- Widget embeds by template

**Purpose**: Understand what resonates with users

### 3. User Journey Dashboard
**Metrics**:
- Entry pages
- Page flow (index → wizard → template save)
- Exit pages
- Conversion funnels

**Purpose**: Optimize user experience

### 4. Content Sharing Dashboard
**Metrics**:
- Screenshot captures (mobile vs desktop)
- Template selections before screenshot
- Time to screenshot
- Widget code copies

**Purpose**: Measure viral potential

---

## How to Access Analytics

1. **Visit Google Analytics**: https://analytics.google.com
2. **Select Property**: "Save American Hemp Clock"
3. **View Reports**:
   - **Real-time**: See current activity
   - **Reports > Engagement > Events**: View all custom events
   - **Reports > User Attributes**: Demographic data
   - **Reports > Acquisition**: Traffic sources

---

## Custom Report Ideas

### Report 1: Action Funnel
```
Step 1: Page View (index.html)
Step 2: Template Modal Opened
Step 3: Template Selected
Step 4: CTA Click (CONVERSION!)
```

### Report 2: Widget Distribution Funnel
```
Step 1: Page View (widget-wizard.html)
Step 2: Template Loaded
Step 3: Widget Code Copied (CONVERSION!)
```

### Report 3: Template Popularity
```
Metric: template_selected count
Dimension: event_label (template name)
Secondary Dimension: template_author
```

### Report 4: Mobile Engagement
```
Filter: device_type = mobile
Metrics: screenshot_captured, cta_click
Compare: vs desktop performance
```

---

## Event Data Retention

- **Standard**: 2 months
- **Extended** (if configured): 14 months
- **Recommendation**: Export monthly reports for long-term analysis

---

## Privacy & Compliance

- **IP Anonymization**: Enabled by default in GA4
- **Cookie Usage**: GA4 uses cookies for user tracking
- **Data Control**: Admin can delete data via GA4 interface
- **GDPR Compliant**: GA4 includes privacy controls

---

## Monitoring Recommendations

### Daily Checks
- Real-time users
- CTA click count
- Screenshot captures

### Weekly Review
- Template selections (trending templates)
- Traffic sources (where users come from)
- Device breakdown (optimize for primary device)

### Monthly Analysis
- Total conversions (CTA clicks + widget embeds)
- Geographic spread of advocacy
- Template author contributions
- User engagement trends

---

## Event Naming Convention

All events follow this structure:
- **Event Name**: action_verb (e.g., `screenshot_captured`, `template_selected`)
- **Category**: Purpose (engagement, conversion)
- **Label**: Descriptive value (template name, button type)
- **Custom Parameters**: Additional context

---

## Troubleshooting

### Events Not Showing Up
1. Check that GA4 code is loaded (view source, look for gtag.js)
2. Wait 24-48 hours for data processing
3. Use GA4 DebugView for real-time validation
4. Check browser console for JavaScript errors

### To Test Analytics Immediately
1. Open Google Analytics
2. Navigate to: **Admin > DebugView**
3. Add `?debug_mode` to your URL
4. Trigger events (click buttons, etc.)
5. See events appear in DebugView in real-time

### Data Discrepancies
- GA4 uses machine learning to filter bot traffic
- Events may not match 1:1 with server logs
- Focus on trends, not exact numbers

---

## Advanced Features (Future)

### Potential Enhancements
1. **User-ID Tracking**: Track returning users across devices
2. **Enhanced Ecommerce**: Track template "purchases" (free but structured)
3. **Custom Dimensions**: Add user properties (template preference, visit frequency)
4. **Scroll Tracking**: See how far users scroll
5. **Video Events**: If video content added
6. **Form Tracking**: Track save template modal interactions

### UTM Campaign Tracking
Add UTM parameters to social media shares:
```
https://savehempclock.com?utm_source=instagram&utm_medium=social&utm_campaign=hemp_advocacy
```

This allows tracking which social posts drive traffic.

---

## Quick Reference: Event Names

| Event | Category | What It Measures |
|-------|----------|------------------|
| `screenshot_captured` | conversion | Instagram share generation |
| `template_modal_opened` | engagement | Template browsing interest |
| `template_selected` | engagement | Template application |
| `cta_click` | conversion | **Advocacy action** |
| `template_loaded` | engagement | Widget wizard template usage |
| `widget_code_copied` | conversion | Widget distribution |
| `template_saved` | conversion | Community contribution |

---

## Success Metrics

### Primary Goals
1. **Advocacy Engagement**: CTA clicks (contact legislators)
2. **Viral Spread**: Screenshot captures
3. **Widget Distribution**: Code copies

### Secondary Goals
1. Template system engagement
2. Community contributions (template saves)
3. User session duration
4. Geographic reach

---

## Support

For questions about analytics:
- **Google Analytics Help**: https://support.google.com/analytics
- **GA4 Documentation**: https://developers.google.com/analytics/devguides/collection/ga4
- **Repository Issues**: https://github.com/meezymeek/SAHClock/issues
