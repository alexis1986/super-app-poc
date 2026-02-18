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
    entry: './index.js',
    resolve: {
      ...Repack.getResolveOptions(platform),
    },
    output: {
      path: path.join(__dirname, 'build/generated', platform),
      uniqueName: 'AppA',
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
        devServer: {
          enabled: mode === 'development',
          port: 8081,
        },
      }),
      new Repack.plugins.ModuleFederationPluginV2({
        name: 'AppA',
        dts: false,
        remotes: {
          SharedModule:
            'SharedModule@http://10.0.2.2:9000/mf-manifest.json',
        },
        shared: {
          react: {singleton: true, eager: true, requiredVersion: '18.3.1'},
          'react-native': {singleton: true, eager: true, requiredVersion: '0.76.5'},
        },
      }),
    ],
  });
};
