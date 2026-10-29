# deadbeatncebs

A lightweight, three-page portfolio for an independent web designer. It uses plain HTML, CSS and vanilla JavaScript; there is no build step or framework.

## Replace these placeholders before launch

- **Project screenshots:** The portfolio uses the supplied full-page screenshots in `images/`: `thewillowtree.png`, `Kulancafe.png` and `deadbeatrecords.png`. The carousel and project thumbnails use these exact paths in the `projects` array at the top of `script.js`. The large preview preserves each image's aspect ratio inside a scrollable browser frame.
- **WhatsApp number:** The links use `27680380113` (South African international format, without a leading `+`). Update it in `index.html`, `services.html` and `contact.html` if your number changes. Update the pre-filled message in `contact.html` if you like.
- **Email address:** The email links use `cachednceba@gmail.com`. Update the links in all three HTML pages if your email changes.
- **Contact form:** Create a form in Formspree, set and verify `cachednceba@gmail.com` as its recipient, then replace `YOUR_FORMSPREE_FORM_ID` in the `action` URL in `contact.html` with the form ID from your Formspree dashboard. The form includes your visitor’s email for replies and a spam honeypot.
- **Project URLs:** All three screenshot projects are currently marked `live: false` and display as concept previews. Set a project's `live` value to `true` and add its real, full `https://` destination in the `url` field in `script.js` to show a Visit site link.

## Deploy

Publish this folder directly as a static site. The contact form submits to Formspree once its form ID is configured above.
