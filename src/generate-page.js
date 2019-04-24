const path = require("path");
const PageBuilder = require("webpage-templates").Demopage;

const DEST_DIR = path.resolve(__dirname, "..", "docs");
const PAGE_DATA_PATH = path.resolve(__dirname, "config", "page-data.json");
const minified = true;

PageBuilder.build(DEST_DIR, PAGE_DATA_PATH, !minified);