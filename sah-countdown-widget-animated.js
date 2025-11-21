/**
 * Save American Hemp Countdown Widget (Animated Version)
 * Embeddable countdown clock with flip animations for any website
 * Version: 1.0.0
 * Requires: Flip library (auto-loaded)
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

  const SAHCountdownAnimated = {
    instances: [],
    flipLibraryLoaded: false,
    loadCallbacks: [],

    loadFlipLibrary: function(callback) {
      // If already loaded, call callback immediately
      if (this.flipLibraryLoaded && window.Tick) {
        callback();
        return;
      }

      // Add to callbacks queue
      this.loadCallbacks.push(callback);

      // If already loading, don't load again
      if (this.loadCallbacks.length > 1) {
        return;
      }

      // Load CSS
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/@pqina/flip@1.8.2/dist/flip.min.css';
      document.head.appendChild(link);

      // Load JS
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@pqina/flip@1.8.2/dist/flip.min.js';
      script.onload = () => {
        this.flipLibraryLoaded = true;
        // Execute all callbacks
        this.loadCallbacks.forEach(cb => cb());
        this.loadCallbacks = [];
      };
      document.head.appendChild(script);
    },

    init: function(options) {
      const config = this.mergeConfig(options);
      const container = document.querySelector(config.container);
      
      if (!container) {
        console.error('SAH Countdown (Animated): Container not found:', config.container);
        return;
      }

      const instance = {
        container: container,
        config: config,
        interval: null,
        ticks: {
          days: null,
          hours: null,
          minutes: null,
          seconds: null
        }
      };

      this.instances.push(instance);

      // Load Flip library then render
      const self = this;
      this.loadFlipLibrary(() => {
        self.render(instance);
      });

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
        size: 'medium',
        colors: {}
      };

      const config = Object.assign({}, defaults, options);
      const themeColors = THEMES[config.theme] || THEMES.gray;
      config.colors = Object.assign({}, themeColors, config.colors);

      return config;
    },

    render: function(instance) {
      const { config, container } = instance;
      const { colors } = config;

      const sizeMultipliers = { compact: 0.7, medium: 1, large: 1.3 };
      const sizeMultiplier = sizeMultipliers[config.size] || 1;

      // Inject custom styles for this instance
      const styleId = 'sah-widget-style-' + Math.random().toString(36).substr(2, 9);
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        .${styleId} .tick-flip-panel {
          background-color: ${colors.panelBackground} !important;
          color: ${colors.panelText} !important;
        }
        .${styleId} .tick-credits,
        .${styleId} [class*="credits"],
        .${styleId} [class*="powered"],
        .${styleId} a[href*="pqina"] {
          display: none !important;
        }
      `;
      document.head.appendChild(style);
      instance.styleId = styleId;

      const html = `
        <div class="sah-countdown-widget ${styleId}" style="
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

          <div style="display: flex; flex-direction: column; gap: ${25 * sizeMultiplier}px; align-items: center;">
            <div style="width: 100%; display: flex; justify-content: center;">
              <div class="tick tick-days" data-value="000" style="font-size: ${4 * sizeMultiplier}em;">
                <div data-repeat="true">
                  <span data-view="flip"></span>
                </div>
                <div style="margin-top: ${15 * sizeMultiplier}px; font-size: ${0.21 * sizeMultiplier}em; color: ${colors.labels}; text-transform: uppercase; letter-spacing: 3px; font-weight: 600; text-align: center;">DAYS</div>
              </div>
            </div>
            <div style="display: flex; gap: ${30 * sizeMultiplier}px; justify-content: center; align-items: center; flex-wrap: wrap;">
              <div class="tick tick-hours" data-value="00" style="font-size: ${4 * sizeMultiplier}em;">
                <div data-repeat="true">
                  <span data-view="flip"></span>
                </div>
                <div style="margin-top: ${15 * sizeMultiplier}px; font-size: ${0.21 * sizeMultiplier}em; color: ${colors.labels}; text-transform: uppercase; letter-spacing: 3px; font-weight: 600; text-align: center;">HOURS</div>
              </div>
              <div class="tick tick-minutes" data-value="00" style="font-size: ${4 * sizeMultiplier}em;">
                <div data-repeat="true">
                  <span data-view="flip"></span>
                </div>
                <div style="margin-top: ${15 * sizeMultiplier}px; font-size: ${0.21 * sizeMultiplier}em; color: ${colors.labels}; text-transform: uppercase; letter-spacing: 3px; font-weight: 600; text-align: center;">MINUTES</div>
              </div>
              <div class="tick tick-seconds" data-value="00" style="font-size: ${4 * sizeMultiplier}em;">
                <div data-repeat="true">
                  <span data-view="flip"></span>
                </div>
                <div style="margin-top: ${15 * sizeMultiplier}px; font-size: ${0.21 * sizeMultiplier}em; color: ${colors.labels}; text-transform: uppercase; letter-spacing: 3px; font-weight: 600; text-align: center;">SECONDS</div>
              </div>
            </div>
          </div>

          ${config.showSubtitle ? `
            <h2 style="font-size: ${1.5 * sizeMultiplier}em; font-weight: 600; color: ${colors.subtitle}; text-align: center; margin: ${10 * sizeMultiplier}px 0 0 0;">Until Hemp is ILLEGAL</h2>
          ` : ''}

          ${config.showDescription ? `
            <div style="font-size: ${1.05 * sizeMultiplier}em; line-height: 1.8; color: ${colors.description}; text-align: left; margin: ${20 * sizeMultiplier}px auto 0; max-width: 700px;">
              <p style="margin: 0;">A harmful federal hemp rule is on the horizon—but it's not final. We still have the power to stop it. If you value this industry, your access, or the jobs it supports, now is the moment to act. Contact your legislators and tell them this rule is the wrong move for America. Your voice can change the outcome.</p>
            </div>
          ` : ''}

          ${config.showHashtag ? `
            <h3 style="font-size: ${1.8 * sizeMultiplier}em; font-weight: 700; color: ${colors.hashtag}; text-align: center; margin: ${25 * sizeMultiplier}px 0 0 0;">#SAVEAMERICANHEMP</h3>
          ` : ''}

          ${config.showCTA ? `
            <div style="margin-top: 30px; text-align: center;">
              <a href="https://texashempbusinesscouncil.com/zip/" target="_blank" style="display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #4a4a4a 0%, #2d2d2d 100%); color: white; text-decoration: none; font-size: 1.1em; font-weight: 700; border-radius: 8px; text-transform: uppercase; letter-spacing: 1px;">Contact Your Legislators</a>
            </div>
          ` : ''}
        </div>
      `;

      container.innerHTML = html;

      // Initialize Tick elements and wait for them to be ready
      const self = this;
      setTimeout(() => {
        const tickElements = container.querySelectorAll('.tick');
        tickElements.forEach(tick => {
          const tickInstance = Tick.DOM.create(tick);
          if (tick.classList.contains('tick-days')) {
            instance.ticks.days = tickInstance;
          } else if (tick.classList.contains('tick-hours')) {
            instance.ticks.hours = tickInstance;
          } else if (tick.classList.contains('tick-minutes')) {
            instance.ticks.minutes = tickInstance;
          } else if (tick.classList.contains('tick-seconds')) {
            instance.ticks.seconds = tickInstance;
          }
        });

        // Start countdown only after ticks are initialized
        setTimeout(() => {
          self.startCountdown(instance);
        }, 100);
      }, 100);
    },

    startCountdown: function(instance) {
      const self = this;
      const update = () => {
        const now = new Date().getTime();
        const distance = TARGET_DATE - now;

        if (distance < 0) {
          self.updateDisplay(instance, 0, 0, 0, 0);
          if (instance.interval) {
            clearInterval(instance.interval);
          }
          return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        self.updateDisplay(instance, days, hours, minutes, seconds);
      };

      // Update immediately
      update();
      instance.interval = setInterval(update, 1000);
    },

    updateDisplay: function(instance, days, hours, minutes, seconds) {
      try {
        if (instance.ticks.days && instance.ticks.days.value !== undefined) {
          instance.ticks.days.value = String(days).padStart(3, '0');
        }
        if (instance.ticks.hours && instance.ticks.hours.value !== undefined) {
          instance.ticks.hours.value = String(hours).padStart(2, '0');
        }
        if (instance.ticks.minutes && instance.ticks.minutes.value !== undefined) {
          instance.ticks.minutes.value = String(minutes).padStart(2, '0');
        }
        if (instance.ticks.seconds && instance.ticks.seconds.value !== undefined) {
          instance.ticks.seconds.value = String(seconds).padStart(2, '0');
        }
      } catch (error) {
        console.error('SAH Countdown (Animated): Error updating display', error);
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

  window.SAHCountdownAnimated = SAHCountdownAnimated;

})(window);
