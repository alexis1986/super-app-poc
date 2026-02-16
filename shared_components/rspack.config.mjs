import * as Repack from '@callstack/repack';
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default env => {
  const {mode = 'development', platform = 'android'} = env;

  return Repack.defineRspackConfig({
    mode,
    context: __dirname,
    entry: {},
    resolve: {
      ...Repack.getResolveOptions(platform),
    },
    output: {
      path: path.join(__dirname, 'build/generated', platform),
      publicPath: 'http://10.0.2.2:9000/',
      uniqueName: 'SharedComponents',
    },
    module: {
      rules: [
        {
          test: /\.[cm]?[jt]sx?$/,
          use: '@callstack/repack/babel-swc-loader',
        },
        ...Repack.getAssetTransformRules(),
      ],
    },
    plugins: [
      new Repack.RepackPlugin({
        context: __dirname,
        mode,
        platform,
      }),
      new Repack.plugins.ModuleFederationPluginV2({
        name: 'SharedComponents',
        filename: 'SharedComponents.container.bundle',
        dts: false,
        exposes: {
          './DesignSystem': './src/design-system/index.ts',
          './Login': './src/components/Login.tsx',
        },
        shared: {
          react: {singleton: true, eager: false},
          'react-native': {singleton: true, eager: false},
        },
      }),
    ],
  });
};
