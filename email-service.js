// Reusable EmailJS Service for Static Website

const EmailService = {
  initialized: false,

  async init() {
    if (this.initialized) return;

    // Retrieve config
    const config = window.EMAILJS_CONFIG;
    if (!config || !config.PUBLIC_KEY || config.PUBLIC_KEY === "YOUR_PUBLIC_KEY") {
      throw new Error("EmailJS Public Key is not configured in config.js");
    }

    // Load EmailJS Browser SDK dynamically from CDN if not already present
    if (!window.emailjs) {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }

    window.emailjs.init({
      publicKey: config.PUBLIC_KEY,
    });
    this.initialized = true;
  },

  async sendFeedback(name, email, message) {
    // Ensure service is initialized
    await this.init();

    const config = window.EMAILJS_CONFIG;
    if (!config || !config.SERVICE_ID || !config.TEMPLATE_ID || 
        config.SERVICE_ID === "YOUR_SERVICE_ID" || config.TEMPLATE_ID === "YOUR_TEMPLATE_ID") {
      throw new Error("EmailJS Service ID or Template ID is not configured in config.js");
    }

    const payload = {
      name: name,
      email: email || "Not Provided",
      message: message,
      time: new Date().toLocaleString(),
      page: window.location.href
    };

    return window.emailjs.send(config.SERVICE_ID, config.TEMPLATE_ID, payload);
  }
};

// Export to window for vanilla JS scope access
window.EmailService = EmailService;
