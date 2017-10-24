## Development kit setting up
This project was bootstrapped with [Create React App](README_CRA.md).
Then do some addition configuration. See the [README_DEV_KIT_SETUP.md](README_DEV_KIT_SETUP.md)
Development Cheatsheet for this project. See the [README_DEV_CHEATSHEET.md](README_DEV_CHEATSHEET.md)



Table of contents
=================
<details> 

  - [Development kit setting up](#development-kit-setting-up)
    - [**About the dev kit:**](#about-the-dev-kit)
    - [Redux](#redux)
    - [Typescript config](#typescript-config)
    - [Assets loader](#assets-loader)
    - [Add Ant-design](#add-ant-design)
    - [Add CSS module](#add-css-module)
    - [Router](#router)
      - [use connected-react-router](#use-connected-react-router)
      - [react-router](#react-router)
      - [react-router-redux](#react-router-redux)
    - [Async with redux-saga](#async-with-redux-saga)
    - [Typescript definition](#typescript-definition)
      - [Use typings](#use-typings)
      - [Create your own definition](#create-your-own-definition)
    - [Unit test with JEST, Enzyme](#unit-test-with-jest-enzyme)
      - [JEST and Babel support issues:](#jest-and-babel-support-issues)
- [Optimize](#optimize)
    - [Analyzing the Bundle Size](#analyzing-the-bundle-size)
- [Webpack](#webpack)
      - [Loader will execute in order, from bottom to top](#loader-will-execute-in-order-from-bottom-to-top)
      - [style-loader vs css-loader](#style-loader-vs-css-loader)
    - [Webpack config: Allow spliting code into multiple bundle](#webpack-config-allow-spliting-code-into-multiple-bundle)
    - [Heroku deployment for Create React App](#heroku-deployment-for-create-react-app)

</details>


### **About the dev kit:**

* Redux:
    * store config
    * persist: 
        * with localforage, 
        * Can configure(define) blacklist/whitelist for persisting your data to local storage, from your component redux
        * ~~Allow offline mode by load data from localforage~~
        * ~~Remove persist data each build~~
    * redux-form —> Need consider once again because of Antd already has validation --> don't use it redux-form
    * short syntax with redux-action: https://redux-actions.js.org/docs/introduction/
    * saga for Async: 
        * redux-saga-routines --> Make saga routines more robust 
        * Can use offline Mock data, See the [README_DEV_CHEATSHEET.md](README_DEV_CHEATSHEET.md)
* Router: 
    * with separate routing config file and 
    * 404 page
    * Support enter url to go to current state: ?page=x&item=x
    * ~~A slim progress bar on top of page~~
* UI —> Ant design (MIT license)
    * UI
    * ~~Sass yaml style is ok~~
    * How to modify the theme --> Custom theme font-size to 14px
    * How to modify the CSS
    * CSS module and Sass instead of less
    * ~~Compile sass to css bundle file, do not enject to header~~
* ~~Webpack Commons chunk~~ https://webpack.github.io/docs/code-splitting.html#commons-chunk
* TypeScript
* ES6 babel: ESLint on prod only
* Multi language i18n —> ~~Using yaml~~
* ~~Controller component And view component segregation~~
* ~~SEO:~~
    * ~~React helmet~~
    * ~~Validate SEO with https://moz.com/blog/meta-data-templates-123 ~~
* Unit test
    * Use jest + enzyme
    * See more about [JEST with Airbnb](https://medium.com/airbnb-engineering/unlocking-test-performance-migrating-from-mocha-to-jest-2796c508ec50)
* ~~Debug with reactotron: https://github.com/infinitered/reactotron~~
* Some custom own Polyfills
* PERFORMANCE strategies:
    * ~~Allow caching API result at client / Or server? --> Find a best choice --> Might be the server~~
    * ~~Allow caching management on local storage, some case is not depend on server setting~~
    * ~~Chunk loading when the app was large~~
        * ~~Load component/module on demand, not load all at bundle.js, it will decrease file size~~
            * ~~webpack Prefetch: Fetch the module before it~~
* Developing:
    * ~~Add command line for generate a new page boiler plate for new screen, new component~~
    * ~~Separate dev, check syntax + convention, test, build script~~
        * ~~yarn start --> For dev~~
        * ~~yarn lint --> Use EsLint to scan bad code~~
        * ~~yarn test --> Run test~~
        * ~~yarn build --> Build a production release~~
* Debugging: 
    * ~~Configure Console.log() hidden in production mode~~
    * ~~Time traveler data from user to server~~
    * ~~Auto report bug by a bug managing system, work like mix-panel but is for bug tracking --> Extend to issue/bug tracker, and open-source~~
* Security:
    * Disable source map, prevent someone can see our client code
    * Disable redux inspection (already in configureAtore.js)
* README:
    * README.md
    * README_DEV_KIT_SETUP.md 
    * README_DEV_Cheatsheet.md
    
    
### Redux
Add `/src/base` folder that contain re-use source code

Change `index.js` sth like that:
```
rehydrationPromise.then(() => {
  ReactDOM.render(
    <Provider store={store}>
      {/*<SocketWrapper>*/}
      <App/>
      {/*</SocketWrapper>*/}
    </Provider>
    , document.querySelector('#root')
  );
  
  registerServiceWorker();
});
```

Remove some reducer in `rootReducer.js`

Install packages:
```
yarn add redux localforage redux-promise redux-thunk redux-persist-transform-filter redux-persist react-redux react-redux-i18n reduce-reducers redux-actions 
```

Webpack support decorator:
```
// Process JS with Babel.
{
    test: /\.(js|jsx)$/,
    include: paths.appSrc,
    loader: require.resolve('babel-loader'),
    options: {
    
    
      // ----- Begin Add support ------
      "presets": [ "react" ],
      "plugins": [
        "transform-decorators-legacy", // es6 support decorator
      ],
      // ----- End Add support ------
      
      
      // This is a feature of `babel-loader` for webpack (not Babel itself).
      // It enables caching results in ./node_modules/.cache/babel-loader/
      // directory for faster rebuilds.
      cacheDirectory: true,
    },
},
```
Then 
```
yarn add --dev babel-plugin-transform-decorators-legacy
```


### Typescript config
Create tsconfig.json in root dir.
```
{
  "compilerOptions": {
    "allowJs": true,
    "experimentalDecorators": true,
    "outDir": "./dist/",
    "sourceMap": false, // false to improve build performance
    "noImplicitAny": true,
    "module": "commonjs",
    "target": "es5",
    "jsx": "react",
    "lib": [ "es2015", "dom" ], // Support es2015, and dom for some dom base library
    "types" : [

    ]
  },
  "include": [
    "./src/**/*"
  ]
}
```


Follow the guide on official [typescript docs](https://www.typescriptlang.org/docs/handbook/react-&-webpack.html)
Specify that TS extension can be resolve in webpack config:
```
module.exports = {
    ...
    resolve: {
        ...
        extensions: [..., '.ts', '.tsx'],
        ...
    }
    ...
}
```

```
yarn add react react-dom @types/react @types/react-dom @types/redux-actions
yarn add --dev typescript awesome-typescript-loader source-map-loader
```


If you get any error:
>Module not found: Can't resolve './NotificationRedux' in '/Data/Workspace/source/campus-front-react/src/components/Notification'
The cause might be: You've forgot to register extension to resolve section


### Assets loader
NOTE that webpack 3 will support only these ext by default: bpm gif jpe?g png
If you have another extension, you need to manually add it to webpack config section:
```
{
    test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
    loader: require.resolve('url-loader'),
    options: {
        limit: 10000,
        name: 'static/media/[name].[hash:8].[ext]',
    },
},
```

### Add Ant-design

1. Install and try Ant 
https://ant.design/docs/react/use-with-create-react-app

2. Overwrite Ant themes

We need to overwrite default:
    font-size (Ant default is 12px, too small), 
    font-icon (Fonts/icons are served from the Alibaba CDN by default. You can download and serve them from your project or add them to your own CDN(recommended)), 
    color,
https://medium.com/@GeoffMiller/how-to-customize-ant-design-with-react-webpack-the-missing-guide-c6430f2db10f

```
yarn add --dev babel-plugin-import less-vars-to-js less less-loader css-loader style-loader
```

webpack.config.*.js
```
// for webpack 2


// Ant config
const fs  = require('fs');
const lessToJs = require('less-vars-to-js');
const myAntThemeVarsFile = '../src/ant-theme-vars.less'; // Relative to this config file
const antThemeVariables = lessToJs(fs.readFileSync(path.join(__dirname, myAntThemeVarsFile), 'utf8'));

// lessToJs does not support @icon-url: "some-string", so we are manually adding it to the produced themeVariables js object here
// antThemeVariables["@icon-url"] = "'//localhost:8080/fonts/iconfont'";
// End Ant config
...


module: {
  rules: [
    {
      loader: 'babel-loader',
      exclude: /node_modules/, // Why exclude ???
      test: /\.js$/,
      options: {
        presets: [...]
        plugins: [
          ['import', { libraryName: "antd", style: true }]
        ]
      },
    },
    ...
  ]
}

...
// webpack2.config.js
module: {
  rules: [
    ...
      // Begin Ant design config
      {
        test: /\.less$/,
        use: [
          {loader: "style-loader"},
          {loader: "css-loader"},
          {loader: "less-loader",
            options: {
              modifyVars: antThemeVariables
            }
          }
        ]
      },
      // End Ant design config
    ...
  ]
}
```

src/ant-theme-vars.less
```
// ant-default-vars.less
// Available theme variables can be found in
// https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less
// NOTE: You can not use "at character" in your comment, so plz be like this: <AT_char>icon-url: "'your-icon-font-path'"

@font-size-base: 14px;
```


### Add CSS module
```
yarn add sass-loader node-sass
```

webpack config:
```
  // Support Sass
  {
    test: /\.(scss|sass)$/,
    exclude: /\.module\.(scss|sass)$/,
    loader: 'style-loader!css-loader?importLoaders=1&-raw!sass-loader'
  },
  {
    test: /\.module\.(scss|sass)$/,
    loader: 'style-loader!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]&-raw!sass-loader'
  },
  // End Support Sass
```



### Router
Guide here: https://reacttraining.com/react-router/web/example/basic

See the `src/base/router` and `index.js`
```
yarn add react-router-dom react-transition-group
```

#### use connected-react-router
>**NOTE: --- connected-react-router has some freaking bug, so I do not use it anymore**
>***`Use react-router-redux instead`***

Use connected-react-router to sync with Redux. https://github.com/supasate/connected-react-router
```
yarn add connected-react-router
```

`configureStore.js`
```
import { createBrowserHistory } from 'history'
import { connectRouter, routerMiddleware } from 'connected-react-router'

const history = createBrowserHistory()

/** Compose & Middleware */
const enhancer = composeEnhancers(
  applyMiddleware(
    ...,
    routerMiddleware(history), // connected-react-router: for dispatching history actions
  ),
  ...
);

/**
 * Store creation
 */
export const store = createStore(
  connectRouter(history)(rootReducer), // Changed from `rootReducer,` to current code 
  undefined, 
  enhancer
);
```
Then configure your router:
AppRoute.jsx
```
import { createBrowserHistory } from 'history'
import { ConnectedRouter } from 'connected-react-router'

const history = createBrowserHistory();

render() {
    return <ConnectedRouter history={history}>
      <BrowserRouter>
      ...
      </BrowserRouter>
    </ConnectedRouter/>
}
```

Learn more about using connected router here: 
https://github.com/supasate/connected-react-router/blob/master/FAQ.md#how-to-navigate-with-redux-action
```
import { push as routerPush} from 'connected-react-router'
@connect(
  () => ({}),
  getAllMapper({}, {
    routerPush,
  })
)
export default class ProductCategory extends React.Component {
  handlePaginationChange = (page, perPage) => {
    this.props.routerPush(`/shop?page=${page}`);
  }
}
```
#### react-router
A guide and explanation here, include router for server side rendering or for React Native 
https://medium.com/@pshrmn/a-simple-react-router-v4-tutorial-7f23ff27adf

#### react-router-redux
At this time Aug 2017 with react-router v4, must use @next version
https://github.com/ReactTraining/react-router/tree/master/packages/react-router-redux
```
yarn add react-router-redux@next history
```


### Async with redux-saga
```
yarn add redux-saga axios
```

### Typescript definition
#### Use typings 
TODO: Move to Typescript flow cheatsheet
```
# install
yarn add typings --global

# find `react` module definition
typings search react

# find `react` module definition by exactly name
typings search --name react

>Viewing 2 of 2
>
>NAME  SOURCE HOMEPAGE                            DESCRIPTION VERSIONS UPDATED                 
>react dt     http://facebook.github.io/react/                2        2017-03-24T16:04:37.000Z
>react npm    https://www.npmjs.com/package/react             1        2017-01-04T20:08:36.000Z

# Install `react` module definition from `dt` source
typings install react --source dt --save

# It's will add `react` to typings.json and ./typings/modules/react
```

#### Create your own definition
Or: Generate .d.ts all to `any` type by dts-gen
```
pkg=redux-saga-routines
dts-gen -m $pkg
mv $pkg.d.ts ./typings/dts-gen
cat <<EOT >> ./typings/index.d.ts
/// <reference path="dts-gen/$pkg.d.ts" />
EOT
```
Or in short, use my bash script:
```
./typings-dts-gen redux-saga-routines
```



### Unit test with JEST, Enzyme
We'll testing component, it's props, state with some user simulated behavior.
NOTE that: JEST is for node env only
For DOM testing, you need to do Integration Test

https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#running-tests
```
# CRA already go with `jest`
# Install enzyme for testing the component rendering, it's state, props... 
# See more: http://airbnb.io/enzyme/index.html
yarn add enzyme react-test-renderer

# NOTE: For Mac OS user, you need to install watchman to allow jest working with your file system.
brew install watchman
```

#### JEST and Babel support issues:

1. Decorator
    > When running test's. Using Mobx with decorators is causing some troubles. Is there a way to being able to run test with code using decorators.
    
    -> got it working with a .babelrc file (or package.json > babel):
    https://github.com/facebookincubator/create-react-app/issues/167
    ```
    {
       "presets": ["react", "es2015"], // Or you don't need to use this, use the default of Create-react-app is good
       "plugins": ["transform-decorators-legacy", "transform-class-properties", "transform-object-rest-spread"] // Add this line to support
    }
    ```
    
    TODO: Test Another way might simpler:
    http://redux.js.org/docs/recipes/WritingTests.html


2. Legacy browser
    >matchMedia not present, legacy browsers require a polyfill
    
    To fix this issue add below snippet in test-setup.js
    ```
    window.matchMedia = window.matchMedia || function() {
        return {
            matches : false,
            addListener : function() {},
            removeListener: function() {}
        };
    };
    ```
    
    But, I strongly recommend to use a polyfill instead of above short fix, my choice:
    `src/polyfill/jest/matchMedia.js`

3. Source code relative path
    >Cannot find module '../../../helpers/AccountingHelper' from 'Topup.jsx'
    
    `ShopPage.test.js`
    ```
    import React from 'react';
    import { shallow } from 'enzyme';
    import ShopPage from './ShopPage';
    
    it('renders without crashing', () => {
      shallow(<ShopPage />);
    });
    ```
    
    The component structure is:
    `<ShopPage/>` > `<Topup/>`
    
    JEST might consider the root path is `src/ShopPage/`, not the `src/` folder :(
    To fix this:
    >TODO: TBW
    
    
    
# Optimize 
### Analyzing the Bundle Size
```
yarn add source-map-explorer
```
```
"scripts": {
+    "analyze": "source-map-explorer build/static/js/main.*",
     "start": "react-scripts start",
     "build": "react-scripts build",
     "test": "react-scripts test --env=jsdom",
```
Then `config/build.js:8` 
```
// Luatnd: Disable source-map for production build
const arrPickBy = function (a, callback) {
  for (var i = 0; i < a.length; i++) {
    if (callback(a[i], i)) {
      return a[i];
    }
  }
  
  // 8. Return false
  return null;
}

const args = process.argv.slice(2);
const shouldUseSourceMap = arrPickBy(args, (arg) => arg.indexOf('--source-map') !== -1);
process.env.GENERATE_SOURCEMAP = shouldUseSourceMap ? 'true' : 'false';
// End custom source map handle
```

Then build with  
```
yarn build -- --source-map
yarn analyze
```


# Webpack
NOTE:

#### Loader will execute in order, from bottom to top
For example, bellow config:

>The loader will **find** `.less` file, then **pass** it to `less-loader`, after that **pipeline** the result to `css-loader`.
>If empty CSS was return, fallback to `style-loader`

```
  {
    test: /\.less$/,
    loader: ExtractTextPlugin.extract(
      Object.assign(
        {
          fallback: require.resolve('style-loader'),
          use: [
            {loader: "css-loader"},
            {
              loader: "less-loader",
              options: {
                modifyVars: antThemeVariables
              }
            }
          ],
        },
        extractTextPluginOptions
      )
    )
  },
```

NOTE:
The order of `loader` can effect CSS priority,
You know that `The CSS rule was loaded after have higher priority if no !important notation was defined` right?
> So you must consider the order of CSS loader when configure webpack.prod.conf.js, 
> must be the same order as webpack.dev.conf.js
     
#### style-loader vs css-loader
https://stackoverflow.com/questions/34039826/webpack-style-loader-vs-css-loader

>The CSS loader takes a CSS file and returns the CSS with imports and url(...) resolved via webpack's require functionality:
 
> var css = require("css!./file.css");
> // => returns css code from file.css, resolves imports and url(...) 
> It doesn't actually do anything with the returned CSS.
 
> The style loader takes CSS and actually inserts it into the page so that the styles are active on the page.
 
> They perform different operations, but it's often useful to chain them together, like Unix pipes. For example, if you were using the Less CSS preprocessor, you could use
 
> require("style!css!less!./file.less")
 to
 
> Turn file.less into plain CSS with the Less loader
> Resolve all the imports and url(...)s in the CSS with the CSS loader
> Insert those styles into the page with the style loader




### Webpack config: Allow spliting code into multiple bundle
```
entry: {
    'config': require.resolve('../src/components/SEO/Seo.conf.js'),
    'app': [
      require.resolve('react-dev-utils/webpackHotDevClient'),
      require.resolve('./polyfills'),
      require.resolve('react-error-overlay'),
      paths.appIndexJs,
    ],
  },
```
```
filename: 'static/js/[name].bundle.js',
```
That will build 2 bundle file:
```
config.bundle.js
app.bundle.js
```
And add to index.html
```
<script src="/static/js/app.bundle.js"></script>
<script src="/static/js/config.bundle.js"></script>
```


### Heroku deployment for Create React App
https://github.com/mars/create-react-app-buildpack