# Logan Legal Solutions — Website

A professional consumer-rights advocacy website with complaint filing via WhatsApp & Telegram.

## Quick Start

1. Open `config.js` and update your real contact details:
   - Phone number (with country code)
   - Email address
   - Telegram username
   - Instagram link

2. Replace `assets/lawyer-photo.svg` with your real photo:
   - Save as `assets/lawyer-photo.jpg` (or `.png`)
   - Update `photoPath` in `config.js`

3. Open the site:
   - Double-click `index.html`, or
   - Run a local server: `npx serve .`

## Features

- Left sidebar with photo, phone, email & Instagram
- 8 complaint categories in a responsive grid
- Modal form for issue details + phone number
- One-click send to **WhatsApp** or **Telegram**
- Mobile-friendly with slide-out sidebar

## File Structure

```
logesh-legal-solutions/
├── index.html      # Main page
├── styles.css      # All styling
├── script.js       # Interactions & messaging
├── config.js       # ← Edit your contact info here
└── assets/
    └── lawyer-photo.svg
```
