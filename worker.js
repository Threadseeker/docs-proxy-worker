const HOST = "";

export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === "/robots.txt") {
      // Return a robots.txt that disallows all crawling
      return new Response("User-agent: *\nDisallow: /", {
        status: 200,
        headers: { "Content-Type": "text/plain" },
      });
    }

    let targetUrl;

    if (url.pathname === "/_docs/openapi.json") {
      // Proxy to the OpenAPI JSON endpoint
      targetUrl = `${HOST}/_docs/openapi.json`;
    } else {
      // Proxy to Scalar documentation page
      targetUrl = `${HOST}/_docs/scalar${url.search}`;
    }

    try {
      const response = await fetch(targetUrl, {
        method: request.method,
        headers: request.headers,
        body: request.method !== "GET" ? request.body : null,
      });

      // Check if the response is HTML
      const contentType = response.headers.get("Content-Type") || "";
      if (contentType.includes("text/html")) {
        let text = await response.text();

        // Inject <meta name="robots" content="noindex"> inside <head>
        text = text.replace(
          /<head[^>]*>/i,
          (match) => `${match}\n<meta name="robots" content="noindex">`
        );

        return new Response(text, {
          status: response.status,
          headers: { ...Object.fromEntries(response.headers), "Content-Type": "text/html" },
        });
      }

      // Return other responses (JSON, CSS, etc.) as-is
      return new Response(response.body, {
        status: response.status,
        headers: response.headers,
      });
    } catch (error) {
      return new Response("Proxy error: Unable to fetch resource", { status: 502 });
    }
  },
};
