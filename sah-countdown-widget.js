/**
 * Save American Hemp Countdown Widget
 * Embeddable countdown clock for any website
 * Version: 1.0.0
 */

(function(window) {
  'use strict';

  // Preset themes
  const THEMES = {
    gray: {
      panelBackground: '#3d3d3d',
      panelText: '#ffffff',
      title: '#3d3d3d',
      subtitle: '#555555',
      description: '#555555',
      hashtag: '#3d3d3d',
      labels: '#888888',
      containerBackground: '#f0f0f0'
    },
    dark: {
      panelBackground: '#1a1a1a',
      panelText: '#ffffff',
      title: '#ffffff',
      subtitle: '#cccccc',
      description: '#aaaaaa',
      hashtag: '#ffffff',
      labels: '#888888',
      containerBackground: '#2d2d2d'
    },
    light: {
      panelBackground: '#ffffff',
      panelText: '#2d2d2d',
      title: '#2d2d2d',
      subtitle: '#555555',
      description: '#666666',
      hashtag: '#2d2d2d',
      labels: '#999999',
      containerBackground: '#ffffff'
    }
  };

  // Target date
  const TARGET_DATE = new Date('2026-11-12T00:00:00').getTime();

  const SAHCountdown = {
    instances: [],

    init: function(options) {
      const self = this;
      
      // Ensure DOM is ready before initializing
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          self.initWidget(options);
        });
        return null; // Will initialize when DOM is ready
      } else {
        return self.initWidget(options);
      }
    },

    initWidget: function(options) {
      const config = this.mergeConfig(options);
      const container = document.querySelector(config.container);
      
      if (!container) {
        console.error('SAH Countdown: Container not found:', config.container);
        return;
      }

      const instance = {
        container: container,
        config: config,
        interval: null
      };

      this.render(instance);
      this.startCountdown(instance);
      this.instances.push(instance);

      return instance;
    },

    mergeConfig: function(options) {
      const defaults = {
        container: '#sah-countdown',
        theme: 'gray',
        showTitle: true,
        showSubtitle: true,
        showDescription: true,
        showHashtag: true,
        showCTA: false,
        size: 'medium', // compact, medium, large
        colors: {}
      };

      const config = Object.assign({}, defaults, options);
      
      // Merge theme colors with custom colors
      const themeColors = THEMES[config.theme] || THEMES.gray;
      config.colors = Object.assign({}, themeColors, config.colors);

      return config;
    },

    render: function(instance) {
      const { config, container } = instance;
      const { colors } = config;

      // Size multipliers
      const sizeMultipliers = {
        compact: 0.7,
        medium: 1,
        large: 1.3
      };
      const sizeMultiplier = sizeMultipliers[config.size] || 1;

      // Generate unique ID for this widget instance
      const widgetId = 'sah-widget-' + Math.random().toString(36).substr(2, 9);

      // Inject responsive styles
      const styleId = 'sah-style-' + widgetId;
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        #${widgetId} .sah-digit {
          font-size: ${4 * sizeMultiplier}em;
        }
        #${widgetId} h1 {
          font-size: ${3.125 * sizeMultiplier}em;
        }
        #${widgetId} h2 {
          font-size: ${1.5 * sizeMultiplier}em;
        }
        #${widgetId} h3 {
          font-size: ${1.8 * sizeMultiplier}em;
        }
        
        @media (max-width: 768px) {
          #${widgetId} .sah-countdown-widget {
            padding: ${25 * sizeMultiplier}px ${30 * sizeMultiplier}px !important;
          }
          #${widgetId} .sah-digit {
            font-size: ${2.8 * sizeMultiplier}em !important;
          }
          #${widgetId} h1 {
            font-size: ${2.25 * sizeMultiplier}em !important;
          }
          #${widgetId} h2 {
            font-size: ${1.2 * sizeMultiplier}em !important;
          }
          #${widgetId} h3 {
            font-size: ${1.5 * sizeMultiplier}em !important;
          }
          #${widgetId} .sah-time-row {
            gap: ${15 * sizeMultiplier}px !important;
          }
        }
        
        @media (max-width: 480px) {
          #${widgetId} .sah-countdown-widget {
            padding: ${20 * sizeMultiplier}px ${15 * sizeMultiplier}px !important;
          }
          #${widgetId} .sah-digit {
            font-size: ${2.2 * sizeMultiplier}em !important;
            padding: 0.12em 0.25em !important;
          }
          #${widgetId} h1 {
            font-size: ${1.75 * sizeMultiplier}em !important;
          }
          #${widgetId} h2 {
            font-size: ${1 * sizeMultiplier}em !important;
          }
          #${widgetId} h3 {
            font-size: ${1.3 * sizeMultiplier}em !important;
          }
          #${widgetId} .sah-time-row {
            gap: ${10 * sizeMultiplier}px !important;
          }
          #${widgetId} .sah-countdown-display {
            gap: ${12 * sizeMultiplier}px !important;
          }
        }
      `;
      document.head.appendChild(style);
      instance.styleId = styleId;

      const html = `
        <div id="${widgetId}">
        <div class="sah-countdown-widget" style="
          background: ${colors.containerBackground};
          padding: ${40 * sizeMultiplier}px ${60 * sizeMultiplier}px;
          border-radius: 10px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
          font-family: Arial, sans-serif;
          max-width: 100%;
          box-sizing: border-box;
        ">
          ${config.showTitle ? `
            <h1 style="
              font-size: ${3.125 * sizeMultiplier}em;
              font-weight: bold;
              color: ${colors.title};
              text-align: center;
              margin: 0 0 ${10 * sizeMultiplier}px 0;
            ">Save American Hemp</h1>
          ` : ''}

          <div class="sah-countdown-display" style="
            display: flex;
            flex-direction: column;
            gap: ${25 * sizeMultiplier}px;
            align-items: center;
          ">
            <!-- Days Row -->
            <div class="sah-days-row" style="
              width: 100%;
              display: flex;
              justify-content: center;
            ">
              <div class="sah-digit-group">
                <div class="sah-digits" data-unit="days" style="
                  display: flex;
                  gap: ${4 * sizeMultiplier}px;
                ">
                  <div class="sah-digit" style="
                    background-color: ${colors.panelBackground};
                    color: ${colors.panelText};
                    font-size: ${4 * sizeMultiplier}em;
                    font-weight: bold;
                    padding: ${0.15 * sizeMultiplier}em ${0.3 * sizeMultiplier}em;
                    border-radius: 0.15em;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
                    min-width: 1.2em;
                    text-align: center;
                    line-height: 1.3;
                  ">0</div>
                  <div class="sah-digit" style="
                    background-color: ${colors.panelBackground};
                    color: ${colors.panelText};
                    font-size: ${4 * sizeMultiplier}em;
                    font-weight: bold;
                    padding: ${0.15 * sizeMultiplier}em ${0.3 * sizeMultiplier}em;
                    border-radius: 0.15em;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
                    min-width: 1.2em;
                    text-align: center;
                    line-height: 1.3;
                  ">0</div>
                  <div class="sah-digit" style="
                    background-color: ${colors.panelBackground};
                    color: ${colors.panelText};
                    font-size: ${4 * sizeMultiplier}em;
                    font-weight: bold;
                    padding: ${0.15 * sizeMultiplier}em ${0.3 * sizeMultiplier}em;
                    border-radius: 0.15em;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
                    min-width: 1.2em;
                    text-align: center;
                    line-height: 1.3;
                  ">0</div>
                </div>
                <div class="sah-label" style="
                  margin-top: ${15 * sizeMultiplier}px;
                  font-size: ${0.85 * sizeMultiplier}em;
                  color: ${colors.labels};
                  text-transform: uppercase;
                  letter-spacing: 3px;
                  font-weight: 600;
                  text-align: center;
                ">DAYS</div>
              </div>
            </div>

            <!-- Time Row -->
            <div class="sah-time-row" style="
              display: flex;
              gap: ${30 * sizeMultiplier}px;
              justify-content: center;
              align-items: center;
              flex-wrap: wrap;
            ">
              <!-- Hours -->
              <div class="sah-digit-group">
                <div class="sah-digits" data-unit="hours" style="display: flex; gap: ${4 * sizeMultiplier}px;">
                  <div class="sah-digit" style="
                    background-color: ${colors.panelBackground};
                    color: ${colors.panelText};
                    font-size: ${4 * sizeMultiplier}em;
                    font-weight: bold;
                    padding: ${0.15 * sizeMultiplier}em ${0.3 * sizeMultiplier}em;
                    border-radius: 0.15em;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
                    min-width: 1.2em;
                    text-align: center;
                    line-height: 1.3;
                  ">0</div>
                  <div class="sah-digit" style="
                    background-color: ${colors.panelBackground};
                    color: ${colors.panelText};
                    font-size: ${4 * sizeMultiplier}em;
                    font-weight: bold;
                    padding: ${0.15 * sizeMultiplier}em ${0.3 * sizeMultiplier}em;
                    border-radius: 0.15em;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
                    min-width: 1.2em;
                    text-align: center;
                    line-height: 1.3;
                  ">0</div>
                </div>
                <div class="sah-label" style="
                  margin-top: ${15 * sizeMultiplier}px;
                  font-size: ${0.85 * sizeMultiplier}em;
                  color: ${colors.labels};
                  text-transform: uppercase;
                  letter-spacing: 3px;
                  font-weight: 600;
                  text-align: center;
                ">HOURS</div>
              </div>

              <!-- Minutes -->
              <div class="sah-digit-group">
                <div class="sah-digits" data-unit="minutes" style="display: flex; gap: ${4 * sizeMultiplier}px;">
                  <div class="sah-digit" style="
                    background-color: ${colors.panelBackground};
                    color: ${colors.panelText};
                    font-size: ${4 * sizeMultiplier}em;
                    font-weight: bold;
                    padding: ${0.15 * sizeMultiplier}em ${0.3 * sizeMultiplier}em;
                    border-radius: 0.15em;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
                    min-width: 1.2em;
                    text-align: center;
                    line-height: 1.3;
                  ">0</div>
                  <div class="sah-digit" style="
                    background-color: ${colors.panelBackground};
                    color: ${colors.panelText};
                    font-size: ${4 * sizeMultiplier}em;
                    font-weight: bold;
                    padding: ${0.15 * sizeMultiplier}em ${0.3 * sizeMultiplier}em;
                    border-radius: 0.15em;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
                    min-width: 1.2em;
                    text-align: center;
                    line-height: 1.3;
                  ">0</div>
                </div>
                <div class="sah-label" style="
                  margin-top: ${15 * sizeMultiplier}px;
                  font-size: ${0.85 * sizeMultiplier}em;
                  color: ${colors.labels};
                  text-transform: uppercase;
                  letter-spacing: 3px;
                  font-weight: 600;
                  text-align: center;
                ">MINUTES</div>
              </div>

              <!-- Seconds -->
              <div class="sah-digit-group">
                <div class="sah-digits" data-unit="seconds" style="display: flex; gap: ${4 * sizeMultiplier}px;">
                  <div class="sah-digit" style="
                    background-color: ${colors.panelBackground};
                    color: ${colors.panelText};
                    font-size: ${4 * sizeMultiplier}em;
                    font-weight: bold;
                    padding: ${0.15 * sizeMultiplier}em ${0.3 * sizeMultiplier}em;
                    border-radius: 0.15em;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
                    min-width: 1.2em;
                    text-align: center;
                    line-height: 1.3;
                  ">0</div>
                  <div class="sah-digit" style="
                    background-color: ${colors.panelBackground};
                    color: ${colors.panelText};
                    font-size: ${4 * sizeMultiplier}em;
                    font-weight: bold;
                    padding: ${0.15 * sizeMultiplier}em ${0.3 * sizeMultiplier}em;
                    border-radius: 0.15em;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
                    min-width: 1.2em;
                    text-align: center;
                    line-height: 1.3;
                  ">0</div>
                </div>
                <div class="sah-label" style="
                  margin-top: ${15 * sizeMultiplier}px;
                  font-size: ${0.85 * sizeMultiplier}em;
                  color: ${colors.labels};
                  text-transform: uppercase;
                  letter-spacing: 3px;
                  font-weight: 600;
                  text-align: center;
                ">SECONDS</div>
              </div>
            </div>
          </div>

          ${config.showSubtitle ? `
            <h2 style="
              font-size: ${1.5 * sizeMultiplier}em;
              font-weight: 600;
              color: ${colors.subtitle};
              text-align: center;
              margin: ${10 * sizeMultiplier}px 0 0 0;
            ">Until Hemp is ILLEGAL</h2>
          ` : ''}

          ${config.showDescription ? `
            <div style="
              font-size: ${1.05 * sizeMultiplier}em;
              line-height: 1.8;
              color: ${colors.description};
              text-align: left;
              margin: ${20 * sizeMultiplier}px auto 0;
              max-width: 700px;
            ">
              <p style="margin: 0 0 ${15 * sizeMultiplier}px 0;">
                A harmful federal hemp rule is on the horizon—but it's not final. We still have the power to stop it. If you value this industry, your access, or the jobs it supports, now is the moment to act. Contact your legislators and tell them this rule is the wrong move for America. Your voice can change the outcome.
              </p>
            </div>
          ` : ''}

          ${config.showHashtag ? `
            <h3 style="
              font-size: ${1.8 * sizeMultiplier}em;
              font-weight: 700;
              color: ${colors.hashtag};
              text-align: center;
              margin: ${25 * sizeMultiplier}px 0 0 0;
            ">#SAVEAMERICANHEMP</h3>
          ` : ''}

          ${config.showCTA ? `
            <div style="
              display: flex;
              flex-direction: column;
              gap: 15px;
              margin-top: 30px;
              width: 100%;
              max-width: 400px;
              margin-left: auto;
              margin-right: auto;
            ">
              <a href="https://texashempbusinesscouncil.com/zip/" target="_blank" rel="noopener noreferrer" style="
                display: inline-block;
                padding: 15px 30px;
                background: linear-gradient(135deg, #4a4a4a 0%, #2d2d2d 100%);
                color: white;
                text-decoration: none;
                font-size: 1.1em;
                font-weight: 700;
                text-align: center;
                border-radius: 8px;
                text-transform: uppercase;
                letter-spacing: 1px;
              ">Contact Your Legislators</a>
            </div>
          ` : ''}
        </div>
        </div>
      `;

      container.innerHTML = html;
      instance.widgetId = widgetId;
    },

    startCountdown: function(instance) {
      const update = () => {
        const now = new Date().getTime();
        const distance = TARGET_DATE - now;

        if (distance < 0) {
          this.updateDisplay(instance, 0, 0, 0, 0);
          if (instance.interval) {
            clearInterval(instance.interval);
          }
          return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        this.updateDisplay(instance, days, hours, minutes, seconds);
      };

      update();
      instance.interval = setInterval(update, 1000);
    },

    updateDisplay: function(instance, days, hours, minutes, seconds) {
      const container = instance.container;
      
      // Update days (3 digits)
      const daysStr = String(days).padStart(3, '0');
      const daysDigits = container.querySelectorAll('[data-unit="days"] .sah-digit');
      if (daysDigits.length === 3) {
        daysDigits[0].textContent = daysStr[0];
        daysDigits[1].textContent = daysStr[1];
        daysDigits[2].textContent = daysStr[2];
      }

      // Update hours (2 digits)
      const hoursStr = String(hours).padStart(2, '0');
      const hoursDigits = container.querySelectorAll('[data-unit="hours"] .sah-digit');
      if (hoursDigits.length === 2) {
        hoursDigits[0].textContent = hoursStr[0];
        hoursDigits[1].textContent = hoursStr[1];
      }

      // Update minutes (2 digits)
      const minutesStr = String(minutes).padStart(2, '0');
      const minutesDigits = container.querySelectorAll('[data-unit="minutes"] .sah-digit');
      if (minutesDigits.length === 2) {
        minutesDigits[0].textContent = minutesStr[0];
        minutesDigits[1].textContent = minutesStr[1];
      }

      // Update seconds (2 digits)
      const secondsStr = String(seconds).padStart(2, '0');
      const secondsDigits = container.querySelectorAll('[data-unit="seconds"] .sah-digit');
      if (secondsDigits.length === 2) {
        secondsDigits[0].textContent = secondsStr[0];
        secondsDigits[1].textContent = secondsStr[1];
      }
    },

    destroy: function(instance) {
      if (instance && instance.interval) {
        clearInterval(instance.interval);
      }
      if (instance && instance.container) {
        instance.container.innerHTML = '';
      }
      if (instance && instance.styleId) {
        const style = document.getElementById(instance.styleId);
        if (style) style.remove();
      }
    }
  };

  // Expose to global scope
  window.SAHCountdown = SAHCountdown;

})(window);
