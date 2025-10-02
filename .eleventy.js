const fs = require("fs");
const passthroughFiles = [
  "css",
  "js",
  "images",
  "fonts",
  "docs",
  "animations",
  "site.webmanifest",
  "robots.txt",
  "sitemap.xml",
  "favicon.svg",
  "blog.html",
  "index_second.html",
  "style.css",
  "style-2.css",
  "sw.js",
  "sw-optimized.js",
  "performance-test.html",
  "test-flip-cards.html",
  "_headers",
  "animations",
  "partials"
];

module.exports = function (eleventyConfig) {
  const unique = new Set(passthroughFiles);
  for (const item of unique) {
    if (fs.existsSync(item)) {
      eleventyConfig.addPassthroughCopy(item);
    }
  }

  return {
    dir: {
      input: "src/pages",
      includes: "../templates",
      data: "../data",
      output: "dist"
    },
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
};
