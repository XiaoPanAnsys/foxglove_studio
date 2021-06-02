// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
import { Configuration } from "webpack";

import { makeConfig } from "@foxglove/studio-base/webpack";

module.exports = {
  stories: ["../**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-essentials", "@storybook/addon-actions"],

  core: {
    builder: "webpack5",
  },

  // Carefully merge our main webpack config with the Storybook default config.
  // For the most part, our webpack config has already been designed to handle
  // all the imports and edge cases we need to support. However, at least some of
  // Storybook's config is required, for instance the HtmlWebpackPlugin that they
  // use to generate the main iframe page.
  webpackFinal: (config: Configuration): Configuration => {
    const studioWebpackConfig = makeConfig(
      undefined,
      { mode: config.mode },
      { allowUnusedVariables: true },
    );

    return {
      ...config,
      resolve: {
        ...studioWebpackConfig.resolve,
        alias: {
          ...studioWebpackConfig.resolve?.alias,
        },
      },
      module: studioWebpackConfig.module,
      plugins: (config.plugins ?? []).concat(studioWebpackConfig.plugins ?? []),
    };
  },
};
