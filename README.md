# NEO-KINETIC Storefront

A static, responsive storefront prototype with a scroll-scrubbed campaign video, product catalog, persistent browser cart, and demo checkout.

## Project layout

- `index.html` - storefront structure and entry point
- `css/styles.css` - responsive layout, typography, and component styles
- `js/products.js` - product catalog data
- `js/app.js` - video scrubbing and storefront interactions
- `assets/video/campaign-scroll.mp4` - browser-compatible H.264 background video
- `assets/video/campaign-original.mp4` - original source video

## Run locally

From this directory, start a static HTTP server:

```sh
ruby -run -e httpd . -p 8000
```

Then open <http://localhost:8000/>. The video is loaded as a local asset, so keep the server rooted at this project directory.

## Demo limitations

Cart contents are stored in browser local storage. Checkout, newsletter signup, shipping, and support content are front-end demonstrations only; no payment or customer data is transmitted. Connect a commerce backend and configure real policies before launch.
# NEO-KINETIC-AERO-DRIFTSPORTSWEAR
