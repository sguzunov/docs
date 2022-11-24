## Overview

[FDC3](https://fdc3.finos.org/) aims at developing specific protocols and classifications in order to advance the ability of desktop apps in financial workflows to interoperate in a plug-and-play fashion without prior bilateral agreements.

## FDC3 for Glue42 Enterprise

<glue42 name="addClass" class="colorSection" element="p" text="Available since Glue42 Enterprise 3.9">

Below are explained the specifics for running an FDC3 compliant app within [**Glue42 Enterprise**](https://glue42.com/enterprise/) and using the [`@glue42/fdc3`](https://www.npmjs.com/package/@glue42/fdc3) library which provides a Glue42 implementation of the FDC3 standards. For more detailed information on the FDC3 standards and APIs, see the [FDC3 documentation](https://fdc3.finos.org/docs/fdc3-intro).

*Note that support for the FDC3 2.0 standard is available since Glue42 Enterprise 3.17. The examples in the following sections follow the FDC3 2.0 standard.*

### App Configuration

To use your FDC3-compliant app in [**Glue42 Enterprise**](https://glue42.com/enterprise/), you must create an [app configuration](../../developers/configuration/application/index.html) file for it.

The following example demonstrates a minimal configuration for a Glue42 enabled app:

```json
{
    "title": "My FDC3 App",
    "type": "window",
    "name": "my-fdc3-app",
    "details": {
        "url": "https://my-fdc3-app.com",
        "height": 800,
        "width": 600
    }
}
```

*For more information on configuring your apps for [**Glue42 Enterprise**](https://glue42.com/enterprise/), see the [Developers > Configuration > Application](../../developers/configuration/application/index.html) section.*

*Note that currently, FDC3 1.2 app configuration standards are supported by [**Glue42 Enterprise**](https://glue42.com/enterprise/), so you can also supply the above Glue42 configuration as a string value to the `"manifest"` top-level key of an [FDC3 app configuration](https://fdc3.finos.org/schemas/1.2/app-directory#tag/Application).*

### Library Usage

The [`@glue42/fdc3`](https://www.npmjs.com/package/@glue42/fdc3) library comes with [**Glue42 Enterprise**](https://glue42.com/enterprise/) and can be automatically injected in your app through configuration. The other option is to install and import the [`@glue42/fdc3`](https://www.npmjs.com/package/@glue42/fdc3) library manually in your app. In either case, it is important to note that the Glue42 FDC3 API implementation depends on the [`@glue42/desktop`](https://www.npmjs.com/package/@glue42/desktop) library which must be initialized with the appropriate settings in order for the [`@glue42/fdc3`](https://www.npmjs.com/package/@glue42/fdc3) library to function properly.

#### Direct Usage

To manually install the [`@glue42/fdc3`](https://www.npmjs.com/package/@glue42/fdc3) library, execute the following command:

```cmd
npm install @glue42/fdc3
```

To use the [`@glue42/fdc3`](https://www.npmjs.com/package/@glue42/fdc3) library in your apps, import it and initialize the [`@glue42/desktop`](https://www.npmjs.com/package/@glue42/desktop) library with the following configuration:

```javascript
import Glue from "@glue42/desktop";
import "@glue42/fdc3";

const config = {
    // This is needed for the default Intents Resolver UI app to work properly.
	appManager: "full",
    // This is necessary in order to use the FDC3 Channels.
	channels: true
};

await Glue(config);
```

*Note that the [`@glue42/desktop`](https://www.npmjs.com/package/@glue42/desktop) library can also be auto injected and auto initialized through system and app configuration. For more details, see the [How to Glue42 Enable Your App > JavaScript](../how-to/glue42-enable-your-app/javascript/index.html#auto_injecting_the_library) section.*

#### Auto Injection

You can use the [system configuration](../../developers/configuration/system/index.html) of [**Glue42 Enterprise**](https://glue42.com/enterprise/) to auto inject the FDC3 API and specify which apps to inject with it. Use the `"autoInjectFdc3"` property under the `"windows"` top-level key of the `system.json` file located in `%LocalAppData%\Tick42\GlueDesktop\config`.

The following example demonstrates how to enable injecting the [`@glue42/fdc3`](https://www.npmjs.com/package/@glue42/fdc3) library for all apps:

```json
{
    "windows": {
        "autoInjectFdc3": {
            "enabled": true,
            "version": "*"
        }
    }
}
```

The `"autoInjectFdc3"` object has the following properties:

| Property | Type | Description |
|----------|------|-------------|
| `"enabled"` | `boolean` | If `true`, will enable auto injection of the [`@glue42/fdc3`](https://www.npmjs.com/package/@glue42/fdc3) library in all Glue42 enabled apps. |
| `"version"` | `string` | Version of the [`@glue42/fdc3`](https://www.npmjs.com/package/@glue42/fdc3) library which to inject. |
| `"rest"` | `string` | URL to a REST service which will be polled for the latest [`@glue42/fdc3`](https://www.npmjs.com/package/@glue42/fdc3) version on startup. |
| `"whitelist"` | `string[]` | List of app names in which the [`@glue42/fdc3`](https://www.npmjs.com/package/@glue42/fdc3) library will be injected. |
| `"blacklist"` | `string[]` | List of app names in which the [`@glue42/fdc3`](https://www.npmjs.com/package/@glue42/fdc3) library won't be injected. |

Now the FDC3 API will be available as an `fdc3` object attached to the global `window` object:

```javascript
const contextType = "Glue42.Contact";
const handler = context => console.log(`Context: ${JSON.stringify(context)}`);

await fdc3.addContextListener(contextType, handler);
```

*Note that the [`@glue42/fdc3`](https://www.npmjs.com/package/@glue42/fdc3) library depends on the [`@glue42/desktop`](https://www.npmjs.com/package/@glue42/desktop) library which must be initialized with the appropriate settings. For more details, see the [Direct Usage](#fdc3_for_glue42_enterprise-library_usage-direct_usage) section.*

You can disable injecting the [`@glue42/fdc3`](https://www.npmjs.com/package/@glue42/fdc3) library for an individual app through [app configuration](../../developers/configuration/application/index.html) by using the `"autoInjectFdc3"` property of the `"details"` top-level key:

```json
{
    "title": "My Non-FDC3 App",
    "type": "window",
    "name": "my-non-fdc3-app",
    "details": {
        "url": "https://my-non-fdc3-app.com",
        "autoInjectFdc3": {
            "enabled": false
        }
    }
}
```

### Intents

The [FDC3 Intents](https://fdc3.finos.org/docs/intents/overview) concept serves the purpose of enabling the creation of cross-app workflows on the desktop. An app declares an Intent through configuration. An Intent specifies what action the app can execute and with what data structure it can work.

Intents can be defined both in the `"intents"` top-level array of a Glue42 [app configuration](../../developers/configuration/application/index.html) file, or using the `"intents"` property in an [FDC3 app configuration](https://fdc3.finos.org/schemas/2.0/app-directory#tag/Application) file.

Below is an example definition of an Intent in the configuration of a Glue42 enabled app:

```json
{
    "intents": [
        {
            "name": "ShowChart",
            "displayName": "BBG Instrument Chart",
            "contexts": ["Instrument"]
        }
    ]
}
```

| Property | Description |
|----------|-------------|
| `"name"` | **Required.** The name of the Intent. |
| `"displayName"` | The human readable name of the Intent. Can be used in context menus, etc., to visualize the Intent. |
| `"contexts"` | The type of predefined data structures that the app can work with (see [FDC3 Contexts](https://fdc3.finos.org/docs/context/overview)). |

*For more information on using Intents, see the [FDC3 Intents API](https://fdc3.finos.org/docs/intents/overview).*

A default Intents Resolver UI app is available since Glue42 Enterprise 3.17. The Intents Resolver UI allows users to choose which app to use for handling a raised [Intent](../../glue42-concepts/intents/overview/index.html):

![Intents Resolver](../../images/intents/intents-resolver.png)

*For more details on how to enable or disable the Intents Resolver UI, or on how to create your own custom Intents Resolver App, see the [Intents > Intents Resolver](../../glue42-concepts/intents/overview/index.html#intents_resolver) section.*

### Channels

An [FDC3 Channel](https://fdc3.finos.org/docs/api/ref/Channel) is a named context object that an app can join in order to share and update context data and also be alerted when the context data changes. By [specification](https://fdc3.finos.org/docs/api/spec#context-channels), Channels can either be well-known system Channels or Channels created by apps. On a UI level, Channels can be represented by colors and names.

All system defined Channels in [**Glue42 Enterprise**](https://glue42.com/enterprise/) can be found in the `channels.json` file located in the `%LocalAppData%\Tick42\GlueDesktop\config` folder. There you can define as many custom Channels as you need. For instance, to add a purple Channel to the existing list of system Channels, add the following configuration:

```json
{
    "name": "Purple",
    "meta": {
        "color": "#6400b0"
    }
}
```

*For more details, see the [Developers > Configuration > Channels](../../developers/configuration/channels/index.html) section.*

To add a Channel Selector (UI component from which the user can manually switch between Channels) to your window, set `"allowChannels"` to `true` in your [app configuration](../../developers/configuration/application/index.html) file under the `"details"` top-level key:

```json
{
    "title": "Client List 🔗",
    "type": "window",
    "name": "channelsclientlist",
    "icon": "https://dev-enterprise-demos.tick42.com/resources/icons/clients.ico",
    "details": {
        "url": "https://dev-enterprise-demos.tick42.com/client-list-portfolio-contact/#/clientlist",
        "mode": "tab",
        "allowChannels": true
    }
}
```

To be able to use the FDC3 Channels, the [`@glue42/desktop`](https://www.npmjs.com/package/@glue42/desktop) library (on which the [`@glue42/fdc3`](https://www.npmjs.com/package/@glue42/fdc3) library depends) must be initialized with enabled Glue42 [Channels](../../glue42-concepts/data-sharing-between-apps/channels/overview/index.html). For more details, see the [Library Usage > Direct Usage](#fdc3_for_glue42_enterprise-library_usage-direct_usage) section.

*For more information on using Channels, see the [FDC3 Channels API](https://fdc3.finos.org/docs/api/ref/Channel).*

### App Directory

The goal of the [FDC3 App Directory](https://fdc3.finos.org/docs/app-directory/overview) REST service is to provide trusted identity for desktop apps. App definitions are provided by one or more App Directory REST services where user entitlements and security can also be handled.

*For more details on the FDC3 app configuration standards, see the [FDC3 Application](https://fdc3.finos.org/schemas/2.0/app-directory#tag/Application) schema.*

To configure [**Glue42 Enterprise**](https://glue42.com/enterprise/) to retrieve app definitions from [remote app stores](../../glue42-concepts/application-management/overview/index.html#app_stores-remote), add a new entry to the `"appStores"` top-level key of the `system.json` file located in the `%LOCALAPPDATA%\Tick42\GlueDesktop\config` folder:

```json
{
    "appStores": [
        {
            "type": "rest",
            "details": {
                "url": "http://localhost:3000/appd/v1/apps/search",
                "auth": "no-auth",
                "pollInterval": 30000,
                "enablePersistentCache": true,
                "cacheFolder": "%LocalAppData%/Tick42/UserData/%GLUE-ENV%-%GLUE-REGION%/gcsCache/"
            }
        }
    ]
}
```

*For more details on configuring remote app stores, see [App Stores > Remote](../../glue42-concepts/application-management/overview/index.html#app_stores-remote).*

According to the [FDC3 App Directory specifications](https://fdc3.finos.org/schemas/2.0/app-directory), the remote store must return app definitions in the following response shape:

```json
{
    "applications": [
        // List of app definition objects.
        {}, {}
    ]
}
```

*For a reference implementation of the FDC3 App Directory, see the [Node.js REST Config Example](https://github.com/Glue42/rest-config-example-node-js) on GitHub.*

*For more information on using App Directory, see the [FDC3 App Directory documentation](https://fdc3.finos.org/docs/app-directory/overview).*