# Dinova Shopify theme

Custom Shopify theme for Dinova, built on Shopify's [Horizon](https://github.com/Shopify/horizon) theme (v4.2.0).

- Dinova's own sections and blocks are prefixed `dinova-` so they stay separate from Horizon's files.
- The `main` branch is connected to the Shopify store through Shopify's GitHub integration, so every push here syncs to that theme.
- Local preview: `shopify theme dev --store <store>.myshopify.com`
- Lint: `shopify theme check`

## Changes to Horizon's own files

Keep this list current so Horizon updates can be merged safely.

| File | Change |
|---|---|
| `sections/header.liquid` | `dinova_force_drawer` setting and `data-force-drawer` attribute |
| `assets/utilities.js`, `layout/theme.liquid` | Header uses the drawer menu when `data-force-drawer` is set |
| `snippets/header-drawer.liquid` | "Menu" + diamond trigger for the menu drawer |
| `snippets/header-actions.liquid` | Plain account link instead of the `<shopify-account>` popover |
| `assets/icon-cart.svg` | Basket cart icon |
| `snippets/stylesheets.liquid` | Loads `assets/dinova.css` |
