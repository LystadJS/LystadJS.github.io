/* One bounded registry request, shared by portfolio and geographic tags. */
(() => {
  "use strict";
  if (window.JSLResearchRegistry) return;
  const url = "https://raw.githubusercontent.com/LystadJS/research-registry/main/dist/research-registry.json";
  const repositoryIndex = "https://github.com/LystadJS?tab=repositories";
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  const ready = fetch(url, { signal: controller.signal })
    .then(response => {
      if (!response.ok) throw new Error(`Research registry request failed: ${response.status}`);
      return response.json();
    })
    .then(data => {
      if (!data || data.schema_version !== "1.0") throw new Error("Unsupported research registry schema");
      return data;
    })
    .catch(() => null)
    .finally(() => clearTimeout(timeout));

  window.JSLResearchRegistry = {
    url,
    repositoryIndex,
    ready,
    resolveFrom(registry, kind, id) {
      const candidate = registry?.[kind]?.[id]?.url;
      if (typeof candidate !== "string") return null;
      try {
        const parsed = new URL(candidate);
        return parsed.protocol === "https:" && parsed.hostname === "github.com"
          && !parsed.username && !parsed.password ? parsed.href : null;
      } catch {
        return null;
      }
    }
  };
})();
