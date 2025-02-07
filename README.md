# docs-proxy-worker

To hide our backend service hostname but expose the auto-generated API docs at the same time, [Threadseeker](https://threadseeker.app) uses [Cloudflare Worker](https://workers.cloudflare.com/) as a reverse proxy for the API docs. This repo provides you the worker soucre code we're using for [doc.threadseeker.app](https://doc.threadseeker.app).

## Features
- Display your OpenAPI document while hiding the real API hostnames
- Proxy the OpenAPI.json request indiviually
- Disallow bots to index by setting `/robots.txt` and injecting `noindex` into `<head>`

## Setup

For the completed guide, visit [Cloudflare Doc](https://developers.cloudflare.com/workers/get-started/guide/).

Create a new worker project:
```bash
npm create cloudflare@latest -- doc-proxy-worker
cd doc-proxy-worker
```

Copy `worker.js` and paste the content into `src/index.js`, and replace the `API_HOST` with your real backend hostname.

## Development

```bash
npx wrangler dev
```

## Deploy
To deploy the local worker to your Cloudflare account:

```bash
npx wrangler deploy
```

Complete the login steps and your worker will be avaliable on cloud.
