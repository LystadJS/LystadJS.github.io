(() => {
  "use strict";

  const REGISTRY_URL = "https://raw.githubusercontent.com/LystadJS/research-registry/main/dist/research-registry.json";
  const REPOSITORY_INDEX = "https://github.com/LystadJS?tab=repositories";

  let registryPromise;

  function load() {
    if (!registryPromise) {
      registryPromise = fetch(REGISTRY_URL, { cache: "no-store" })
        .then(response => {
          if (!response.ok) throw new Error(`Research registry request failed: ${response.status}`);
          return response.json();
        })
        .then(data => {
          if (!data || data.schema_version !== "1.0") {
            throw new Error("Unsupported or missing research registry schema");
          }
          return data;
        })
        .catch(error => {
          console.warn("Research registry unavailable; repository links will use fallback destinations.", error);
          return null;
        });
    }
    return registryPromise;
  }

  function resolveFrom(registry, kind, id) {
    if (!registry) return null;
    const collection = registry[kind];
    if (!collection || !collection[id]) return null;
    return collection[id].url || null;
  }

  window.JSLResearchRegistry = {
    url: REGISTRY_URL,
    repositoryIndex: REPOSITORY_INDEX,
    ready: load(),
    load,
    resolve(kind, id) {
      return load().then(registry => resolveFrom(registry, kind, id));
    },
    resolveFrom
  };
})();
