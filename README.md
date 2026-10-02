<div align="center">

# NEO-KINETIC

### AERO DRIFT SPORTSWEAR — Storefront Prototype

A static, responsive e-commerce storefront featuring a scroll-scrubbed campaign video, a product catalog, a persistent browser cart, and a demo checkout flow.

![Status](https://img.shields.io/badge/status-prototype-orange)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-663399?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)
![Dependencies](https://img.shields.io/badge/dependencies-none-brightgreen)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Architecture Notes](#architecture-notes)
- [Demo Limitations](#demo-limitations)
- [Production Readiness Checklist](#production-readiness-checklist)
- [Roadmap](#roadmap)
- [Author](#author)

---

## Overview

**NEO-KINETIC** is a front-end storefront prototype for a futuristic sportswear brand. It pairs a cinematic, scroll-driven campaign video with a clean product catalog and a fully functional client-side shopping experience.

The project is intentionally framework-free and build-free: it runs from any static file server, making it easy to review, demo, and extend.

---

## Features

| Feature | Description |
| --- | --- |
| **Scroll-scrubbed campaign video** | Video playback is driven by scroll position, creating an immersive brand narrative as the user moves down the page. |
| **Product catalog** | Products are defined as structured data in a single module, so the catalog can be updated without touching markup. |
| **Persistent cart** | Cart contents are saved in the browser's local storage and survive page reloads. |
| **Demo checkout** | A complete front-end checkout flow for demonstrating the purchase journey. |
| **Responsive design** | Layout, typography, and components adapt across desktop, tablet, and mobile viewports. |
| **Zero dependencies** | Plain HTML, CSS, and JavaScript. No bundler, package manager, or build step required. |

---

## Tech Stack

- **HTML5** — semantic page structure and entry point
- **CSS3** — responsive layout, typography, and component styling
- **Vanilla JavaScript** — catalog data, video scrubbing, cart logic, and storefront interactions
- **H.264 MP4** — browser-compatible campaign video asset

---

## Project Structure

```text
NEO-KINETIC-AERO-DRIFTSPORTSWEAR/
├── index.html                      # Storefront structure and entry point
├── css/
│   └── styles.css                  # Responsive layout, typography, component styles
├── js/
│   ├── products.js                 # Product catalog data
│   └── app.js                      # Video scrubbing and storefront interactions
├── assets/
│   └── video/
│       ├── campaign-scroll.mp4     # Browser-compatible H.264 background video
│       └── campaign-original.mp4   # Original source video
└── README.md
```

---

## Getting Started

### Prerequisites

- A modern browser (Chrome, Edge, Firefox, or Safari)
- Any static HTTP server. The example below uses Ruby, which is preinstalled on macOS.

### Run Locally

1. Clone the repository:

   ```bash
   git clone https://github.com/Sabin78910/NEO-KINETIC-AERO-DRIFTSPORTSWEAR.git
   cd NEO-KINETIC-AERO-DRIFTSPORTSWEAR
   ```

2. Start a static server from the project root:

   ```bash
   ruby -run -e httpd . -p 8000
   ```

3. Open [http://localhost:8000](http://localhost:8000) in your browser.

> **Important:** Serve the project from its root directory and avoid opening `index.html` directly via `file://`. The campaign video is loaded as a local asset, and scroll scrubbing depends on it being served over HTTP.

<details>
<summary><strong>Alternative servers</strong></summary>

```bash
# Python 3
python3 -m http.server 8000

# Node.js
npx serve . -l 8000
```

</details>

---

## Architecture Notes

- **Data-driven catalog:** `js/products.js` holds all product data. Add or edit products there to update the storefront.
- **Interaction layer:** `js/app.js` manages video scrubbing, cart state, and UI behavior.
- **Persistence:** Cart state is stored client-side via `localStorage`, scoped to the user's browser.
- **Video handling:** Two video files are included. `campaign-scroll.mp4` is the H.264 encode used by the page for broad browser compatibility. `campaign-original.mp4` is retained as the source master.

---

## Demo Limitations

This project is a **front-end prototype** and is not production-ready as shipped.

- Cart contents are stored in browser local storage only.
- Checkout, newsletter signup, shipping, and support content are **demonstrations**.
- **No payment or customer data is transmitted** or stored on any server.
- Policies and legal copy are placeholders.

---

## Production Readiness Checklist

Before launching, connect a commerce backend and complete the following:

- [ ] Integrate a commerce platform or API (catalog, inventory, orders)
- [ ] Integrate a PCI-compliant payment provider
- [ ] Implement real shipping rates, tax calculation, and order confirmation
- [ ] Wire newsletter signup to an email service provider
- [ ] Publish reviewed privacy policy, terms of service, shipping, and returns policies
- [ ] Add cookie and consent handling where required by law
- [ ] Run accessibility (WCAG), performance, and cross-browser audits
- [ ] Optimize video delivery (CDN hosting, compression, poster frame)
- [ ] Add analytics and error monitoring

---

## Roadmap

- [ ] Product detail pages and variant selection (size, color)
- [ ] Search, filtering, and sorting
- [ ] Reduced-motion fallback for the scroll-scrubbed video
- [ ] Automated testing and CI
- [ ] Deployment via GitHub Pages or a static hosting provider

---

## Author

**Sabin Khanal**
GitHub: [@Sabin78910](https://github.com/Sabin78910)

---

<div align="center">
<sub>NEO-KINETIC is a prototype project. All product names, copy, and media are for demonstration purposes.</sub>
</div>
