// stackbit.config.ts
import { defineStackbitConfig } from "@stackbit/types";
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
          // Define the static URL path derived from the "slug" field
          urlPath: "/{slug}",
          filePath: "content/pages/{slug}.json",
          fields: [
            { name: "title", type: "string", required: true },
            { name: "description", type: "string", required: false },
            // Puedes añadir más campos según lo necesites
          ]
        }
      ]
    })
  ],
  siteMap: ({ documents, models }) => {
    const pageModels = models.filter((m) => m.type === "page");

    return documents
      .filter((d) => pageModels.some((m) => m.name === d.modelName))
      .map((document) => {
        const urlModel = (() => {
          switch (document.modelName) {
            case "Page":
              return "page";
            default:
              return null;
          }
        })();

        return urlModel
          ? {
              stableId: document.id,
              urlPath: `/${urlModel}/${document.slug}`,
              document,
              isHomePage: document.slug === "home"
            }
          : null;
      })
      .filter(Boolean);
  }
  
});

