# TablissNG

TablissNG is a fork of [Tabliss](https://github.com/joelshepherd/tabliss), a customizable new tab page for browsers.

## Load Locally In Chromium

Install dependencies:

```sh
pnpm install
```

Build the Chromium extension:

```sh
pnpm run build:chromium
```

Open your browser extensions page:

```text
chrome://extensions
```

For Brave, use:

```text
brave://extensions
```

Enable **Developer mode**, click **Load unpacked**, then select:

```text
dist/chromium
```

After making code changes, rebuild with `pnpm run build:chromium`, then reload the extension from the extensions page.
