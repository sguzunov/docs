## Using the JavaScript Library

[**Glue42 Enterprise**](https://glue42.com/enterprise/) provides several options for Glue42 enabling your apps. You can either [auto inject](#auto_injecting_the_library) (and optionally auto initialize) the Glue42 JavaScript library in your apps, or reference it (either as an [NPM module](#referencing_the_library-from_an_npm_module), or as a [standalone JavaScript file](#referencing_the_library-from_a_javascript_file)) and then [initialize](#initializing_the_library) it. Both approaches have their respective advantages and disadvantages. Usually, it is recommended to choose a global approach for all your Glue42 enabled apps (in some cases, there may be hundreds of Glue42 enabled apps in use) based on what best suits your needs and requirements.

Auto injecting the library is the way to go if you need all your Glue42 enabled apps to use the same version of the library and have the option to be easily updated to the latest version of Glue42 JavaScript. Updating the library in all apps can be accomplished simply by redeploying [**Glue42 Enterprise**](https://glue42.com/enterprise/) - all Glue42 enabled apps will be automatically injected with the new version of the library, saving you the effort to update them one by one. Another option is to use a REST service providing the latest versions of Glue42 JavaScript. Apps with auto injected Glue42, however, won't be Glue42 enabled in the browser, which is something to consider if you need to use them in a browser. Auto injection may not work well for you in some other cases as well, depending on your production and deployment model.

Using the Glue42 JavaScript library as a standalone file or as an NPM package has its advantages too - your apps can use a different version of the library, if necessary. Also, your apps can be Glue42 enabled in a browser. This, of course, means that updating the library can be a tedious and slow process, especially if you have many Glue42 enabled apps, the majority of which need to use a different version of the library.

Below you can explore both options for using the Glue42 JavaScript library.

## Referencing the Library

### From a JavaScript File

The Glue42 JavaScript library is available as a single JavaScript file, which you can include in your web apps using a `<script>` tag. If you are using a Glue42 installer, you can find the JavaScript files in `%LOCALAPPDATA%\Tick42\GlueSDK\GlueJS\js`.

```html
<script type="text/javascript" src="desktop.umd.js"></script>
```

When deploying your app in production, it is recommended to always reference a specific minified version:

```html
<script type="text/javascript" src="desktop.umd.min.js"></script>
```

### Using the Glue42 CDN

You can alternatively point to Glue42 JavaScript NPM packages and files via the [Glue42 CDN](https://cdn.glue42.com/) by using URLs in the format:

```html
https://cdn.glue42.com/:package@:version/:file
```

- Using the latest version: `https://cdn.glue42.com/desktop@latest`;
- Using a fixed version: `https://cdn.glue42.com/desktop@5.11.2`
- Using a specific file different from the one defined in the `package.json`: `https://cdn.glue42.com/browse/desktop@5.11.2/dist/desktop.umd.min.js`
- To see all available versions and files, append `/` to the URL: `https://cdn.glue42.com/desktop/`

### From an NPM Module

The Glue42 JavaScript library is also available as an NPM package, which you can include as a dependency in your project and import in your code. The currently available packages are [`@glue42/core`](https://www.npmjs.com/package/@glue42/core) and [`@glue42/desktop`](https://www.npmjs.com/package/@glue42/desktop). The Core package is a subset of the Desktop package and offers basic functionalities for sharing data between apps ([Interop](../../../../glue42-concepts/data-sharing-between-apps/interop/overview/index.html), [Shared Contexts](../../../../glue42-concepts/data-sharing-between-apps/shared-contexts/overview/index.html), [Pub/Sub](../../../../glue42-concepts/data-sharing-between-apps/pub-sub/overview/index.html), [Metrics](../../../../glue42-concepts/metrics/overview/index.html)), while the Desktop package offers additional options for sharing data between apps ([Channels](../../../../glue42-concepts/data-sharing-between-apps/channels/overview/index.html)), as well as advanced window management functionalities ([App Management](../../../../glue42-concepts/application-management/overview/index.html), [Layouts](../../../../glue42-concepts/windows/layouts/overview/index.html), [Window Management](../../../../glue42-concepts/windows/window-management/overview/index.html)).

To include any of the packages as a dependency in your project, navigate to the root directory of your project and run:

```cmd
npm install @glue42/desktop
```

Your `package.json` file now should have an entry similar to this:

```json
{
    "dependencies": {
        "@glue42/desktop": "^5.9.0"
    }
}
```

## Initializing the Library

When included, the JavaScript library will register a global factory function called `Glue()`. It should be invoked with an *optional* configuration object to initialize the library. The factory function will resolve with the initialized `glue` API object.

Initialization in a Glue42 window:

```javascript
import Glue from "@glue42/desktop";

// You don't need to specify any configuration.
const initializeGlue42 = async () => {
    window.glue = await Glue();
};

initializeGlue42().catch(console.error);
```

Initialization in a browser:

```html
<script type="text/javascript" src="desktop.umd.min.js"></script>

<script type="text/javascript">
    const initializeGlue42 = async () => {
        const config = {
            application: "MyWebApplication",
            gateway: {
                protocolVersion: 3,
                ws: "<GATEWAY_URL>"
            },
            auth: {
                username: "<YOUR_USERNAME>",
                password: "<YOUR_PASSWORD>"
            }
        };
        window.glue = await Glue(config);
    };

    initializeGlue42().catch(console.error);
</script>
```

You can customize the Glue42 configuration object by specifying which Glue42 libraries your app needs, and what level of features your app requires from these libraries. See the [**Glue42 Enterprise**](https://glue42.com/enterprise/) [Reference documentation](../../../../reference/glue/latest/glue/index.html) for details.

## Auto Injecting the Library

Auto injection can be configured on a system level and can be overridden on an app level (with some limitations). You can also optionally specify whether you want to auto initialize the library after injection.

### System Level Auto Injection

To enable auto injection on a system level, edit the `"autoInjectAPI"` property under the `"windows"` top-level key in the `system.json` file of [**Glue42 Enterprise**](https://glue42.com/enterprise/), located in `%LocalAppData%\Tick42\GlueDesktop\config`:

```json
{
    "windows": {
        "autoInjectAPI":{
            "enabled": true,
            "version": "5.11.2",
            "autoInit": false
        }
    }
}
```

| Property | Description |
|----------|-------------|
| `"enabled"` | **Required**. Whether to enable auto injecting the library. |
| `"version"` | **Required**. Specify a version of the library to inject. It is recommended to use a specific version and avoid wildcard versions (e.g., `5.11.*` or `5.*.*`). |
| `"autoInit"` | *Optional*. Whether to initialize the library. Can accept either a `boolean` value or a [`Config`](../../../../reference/glue/latest/glue/index.html#Config) object with which to initialize the library. |

You can see what versions of the Glue42 JavaScript library are available for auto injection in the `%LocalAppData%\Tick42\GlueDesktop\assets\glue42` folder. If you specify a version which isn't available, [**Glue42 Enterprise**](https://glue42.com/enterprise/) will continue working normally without injecting a library in the apps running in it.

If the library is injected but *not* auto initialized, you can use the injected `Glue()` factory function in the `window` object to initialize it and pass a custom [`Config`](../../../../reference/glue/latest/glue/index.html#Config) object to it, if needed:

```javascript
const initializeGlue42 = async () => {
    // Enabling the Channels API.
    const config = { channels: true };

    window.glue = await Glue(config);

    console.log(`Glue42 JS version ${glue.version} has been successfully initialized!`);
    console.log(`Channels are ${glue.channels ? "enabled" : "disabled"}.`);
};

initializeGlue42().catch(console.error);
```

If the library is injected *and* auto initialized, you should use the injected `gluePromise` in the `window` object to wait for the Glue42 API:

```javascript
await gluePromise.catch(console.error);

// The returned `glue` object is assigned to the global `window` object.
if (window.glue) {
    console.log(`Glue42 JS version ${glue.version} has been successfully initialized!`);

    // Channels are disabled by default. If you haven't specified a custom initialization object that enables
    // the Channels API in the `autoInit` property under `autoInjectAPI` (e.g., "autoInit": { "channels": true }),
    // then the check below will return `false`.
    console.log(`Channels are ${glue.channels ? "enabled" : "disabled"}.`);
};
```

### Auto Injection Filtering

You can whitelist and blacklist apps on a system level to control which apps should be auto injected with the library and which should use their own version of the library instead.

- all whitelisted apps will be auto injected with the library, all other apps won't be auto injected:

```json
{
    "windows": {
        "autoInjectAPI":{
            "enabled": true,
            "version": "5.9.0",
            "autoInit": false,
            "whitelist": ["clientlist"]
        }
    }
}
```

- blacklisted apps won't be auto injected with the library, all other apps will be auto injected:

```json
{
    "windows": {
        "autoInjectAPI":{
            "enabled": true,
            "version": "5.9.0",
            "autoInit": false,
            "blacklist": ["clientlist"]
        }
    }
}
```

If an app is both in the whitelist and the blacklist, it will be auto injected with the library.

### App Level Auto Injection

If auto injection of the library is disabled on a system level, it can't be enabled on an app level. If auto injection is enabled on a system level, then each app can opt out of it. Apps can specify whether the auto injected library will be auto initialized or not, but can't specify which version of the library to be auto injected - this is possible only on a system level. If an app needs to use a different version of the library than the auto injected one, you should disable auto injection in the app configuration and reference a version of the library file in your app instead.

To configure auto injection on an app level, edit (or add) the `"autoInjectAPI"` property under the `"details"` top-level key of the app configuration file.

*For more details on how to create an app definition and where the app configuration files should be stored, see the [App Configuration](#app_configuration) section below or the [Developers > Configuration > Application](../../../../developers/configuration/application/index.html#app_configuration) section.*

Below is an example configuration for auto injection on an app level:

```json
{
    "details": {
        "autoInjectAPI":{
            "enabled": true,
            "autoInit": false
        }
    }
}
```

| Property | Description |
|----------|-------------|
| `"enabled"` | **Required**. Whether to enable or disable auto injection. |
| `"autoInit"` | *Optional*. Whether to initialize the library. Can accept either a `boolean` value or a [`Config`](../../../../reference/glue/latest/glue/index.html#Config) object with which to initialize the library. |

### Auto Initialization

Auto initialization of the injected library can be specified globally in the `system.json` file, or can be overridden on an app level in the app configuration file. To enable or disable auto initialization of the library, set the `"autoInit"` property under `"autoInjectAPI"` to `true` or `false` respectively.

If you want to auto initialize your app with a custom initialization [`Config`](../../../../reference/glue/latest/glue/index.html#Config) object, simply specify the initialization options object instead of assigning a `boolean` value to `"autoInit"`.

Below is an example configuration that will auto initialize an app with [Channels](../../../../glue42-concepts/data-sharing-between-apps/channels/javascript/index.html) enabled:

```json
{
    "autoInjectAPI":{
        "enabled": true,
        "autoInit": {
            "channels": true
        }
    }
}
```

## App Configuration

To add your JavaScript app to the [Glue42 Toolbar](../../../../glue42-concepts/glue42-toolbar/index.html), you must create a JSON file with app configuration. Place this file in the `%LocalAppData%\Tick42\UserData\<ENV>-<REG>\apps` folder, where `<ENV>-<REG>` must be replaced with the environment and region of your [**Glue42 Enterprise**](https://glue42.com/enterprise/) copy (e.g., `T42-DEMO`).

The following is an example configuration for a JavaScript app:

```json
{
    "name": "my-app",
    "title": "My App",
    "type": "window",
    "details": {
        "url": "https://example.com/my-app/",
        "mode": "tab",
        "width": 500,
        "height": 400
    }
}
```

The `"name"`, `"type"` and `"url"` properties are required and `"type"` must be set to `"window"`. The `"url"` property points to the location of the web app.

*For more details, see the [Developers > Configuration > Application](../../../../developers/configuration/application/index.html) section.*

*See the [JavaScript examples](https://github.com/Glue42/js-examples) on GitHub which demonstrate various [**Glue42 Enterprise**](https://glue42.com/enterprise/) features.*

## Glue42 JavaScript Concepts

Once the Glue42 JavaScript library has been initialized, your app has access to all Glue42 functionalities. For more detailed information on the different Glue42 concepts and APIs, see:

- [App Management](../../../../glue42-concepts/application-management/javascript/index.html)
- [App Preferences](../../../../glue42-concepts/app-preferences/javascript/index.html)
- [Intents](../../../../glue42-concepts/intents/javascript/index.html)
- [Shared Contexts](../../../../glue42-concepts/data-sharing-between-apps/shared-contexts/javascript/index.html)
- [Channels](../../../../glue42-concepts/data-sharing-between-apps/channels/javascript/index.html)
- [Interop](../../../../glue42-concepts/data-sharing-between-apps/interop/javascript/index.html)
- [Pub/Sub](../../../../glue42-concepts/data-sharing-between-apps/pub-sub/javascript/index.html)
- [Window Management](../../../../glue42-concepts/windows/window-management/javascript/index.html)
- [Workspaces](../../../../glue42-concepts/windows/workspaces/javascript/index.html)
- [Layouts](../../../../glue42-concepts/windows/layouts/javascript/index.html)
- [Notifications](../../../../glue42-concepts/notifications/javascript/index.html)
- [Global Search](../../../../glue42-concepts/global-search/index.html)
- [Metrics](../../../../glue42-concepts/metrics/javascript/index.html)
- [Hotkeys](../../../../glue42-concepts/glue42-platform-features/index.html#hotkeys)
- [Zooming](../../../../glue42-concepts/glue42-platform-features/index.html#zooming)
- [Displays](../../../../glue42-concepts/glue42-platform-features/index.html#displays)
- [Logging](../../../../glue42-concepts/glue42-platform-features/index.html#logging)

## Reference

For a complete list of the available JavaScript APIs, see the [Glue42 JavaScript Reference Documentation](../../../../reference/glue/latest/glue/index.html).
