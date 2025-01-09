// stackbit.config.ts
import { defineStackbitConfig, SiteMapEntry } from "@stackbit/types";
import { GitContentSource } from "@stackbit/cms-git";

export default defineStackbitConfig({
  contentSources: [
    new GitContentSource({
      rootPath: __dirname,
      contentDirs: ["content"],
      models: [
        {
          name: "Page",
          type: "page",
          // Static URL path derived from the "slug" field
          urlPath: "/{slug}",
          filePath: "content/pages/{slug}.json",
          fields: [{ name: "title", type: "string", required: true }]
        },
        {
          name: "Blog",
          type: "page",
          urlPath: "/blog/{slug}",
          filePath: "content/blog/{slug}.json",
          fields: [{ name: "title", type: "string", required: true }]
        }
      ],
    })
  ],
  siteMap: ({ documents, models }) => {
    // 1. Filter all page models
    const pageModels = models.filter((m) => m.type === "page");

    return documents
      // 2. Filter all documents which are of a page model
      .filter((d) => pageModels.some((m) => m.name === d.modelName))
      // 3. Map each document to a SiteMapEntry
      .map((document) => {
        // Map the model name to its corresponding URL
        const urlModel = (() => {
          switch (document.modelName) {
            case "Page":
              return "page";
            case "Blog":
              return "blog";
            default:
              return null;
          }
        })();

        return urlModel
          ? {
              stableId: document.id,
              urlPath: `/${urlModel}/${document.slug}`,
              document,
              isHomePage: document.slug === "home",
            }
          : null;
      })
      .filter(Boolean) as SiteMapEntry[];
  },
});
