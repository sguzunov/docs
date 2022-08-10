## Configuration

It is possible to configure the [Layouts](../../../../reference/glue/latest/layouts/index.html) library by using the `layouts` property of the optional [`Config`](../../../../reference/glue/latest/glue/index.html#Config-layouts) object passed during the initialization of the Glue42 JavaScript library. The Layouts library supports several [modes](../../../../reference/glue/latest/layouts/index.html#Mode) of initialization. It can also be configured whether to auto save the context of individual windows and for which Layout types (Global, App Default, Workspace) to save it.

Below is an example of configuring the Layouts library:

```javascript
const config = {
    layouts: {
        mode: "full",
        // Individual window context will be saved only when saving the specified types of Layouts.
        autoSaveWindowContext: ["Global", "Workspace"]
    }
};

window.glue = await Glue(config);
```

The different modes of the Layouts library restrict or enable certain functionalities. In `"slim"` mode, Layouts can't be manipulated (created, removed, renamed) and Layout events aren't available, but custom context data can still be saved. In `"full"` mode, all functionalities are available.

The `layouts` object has the following properties:

| Property | Type | Description |
|----------|------|-------------|
| `mode` | `"full"` \| `"slim"` \| `"fullWaitSnapshot"` | In `"full"` mode, all Layout functionalities are available. In `"slim"` mode, Layout events aren't tracked and Layouts can't be manipulated. The `"fullWaitSnapshot"` mode is the same as the `"full"` mode, except that the Layouts library will notify that it is ready a little later - when a snapshot of the available Layouts has been received. |
| `autoSaveWindowContext` | `boolean` \| [`LayoutType[]`](../../../../reference/glue/latest/layouts/index.html#LayoutType) | If `true`, window context will be saved for all Layout types. If an array of Layout types is passed instead, window context will be saved only for the specified Layout types. Possible Layout types are `"Global"`, `"ApplicationDefault"` and `"Workspace"`. |

## Layout Operations

The Layouts API is accessible through the [`glue.layouts`](../../../../reference/glue/latest/layouts/index.html) object.

### Current Global Layout

To get the currently restored Global Layout, use the [`getCurrentLayout()`](../../../../reference/glue/latest/layouts/index.html#API-getCurrentLayout) method:

```javascript
const currentLayout = await glue.layouts.getCurrentLayout();
```

### Listing All Layouts

To get a collection of all currently available [`Layout`](../../../../reference/glue/latest/layouts/index.html#Layout) objects, use the [`list()`](../../../../reference/glue/latest/layouts/index.html#API-list) method:

```javascript
const layouts = glue.layouts.list();
```

*The `list()` method isn't available in `"slim"` mode. Use [`export()`](#layout_operations-exporting_and_importing) instead.*

### All Layouts by Type

To get all Layouts by type, use the [`getAll()`](../../../../reference/glue/latest/layouts/index.html#API-getAll) method and pass a [`LayoutType`](../../../../reference/glue/latest/layouts/index.html#LayoutType). It returns a collection of [`LayoutSummary`](../../../../reference/glue/latest/layouts/index.html#LayoutSummary) objects, which don't contain the extensive objects describing the actual [`Layout`](../../../../reference/glue/latest/layouts/index.html#Layout) components:

```javascript
const allGlobalLayouts = await glue.layouts.getAll("Global");
```

### Specific Layout

To get a specific Layout, use the [`get()`](../../../../reference/glue/latest/layouts/index.html#API-get) method and provide the name of the Layout and the [`LayoutType`](../../../../reference/glue/latest/layouts/index.html#LayoutType) as arguments. Returns the requested [`Layout`](../../../../reference/glue/latest/layouts/index.html#Layout) object or `undefined` if a Layout with the specified name and type doesn't exist:

```javascript
const name = "My Layout";
const type = "Global";

const myLayout = await glue.layouts.get(name, type);
```

### Saving and Restoring

To save a Layout, use the [`save()`](../../../../reference/glue/latest/layouts/index.html#API-save) method and pass a [`NewLayoutOptions`](../../../../reference/glue/latest/layouts/index.html#NewLayoutOptions) object with a required `name` property. Note that if a Layout with that name already exists, it will be replaced. This method returns the saved [`Layout`](../../../../reference/glue/latest/layouts/index.html#Layout) object:

```javascript
const layoutConfig = {
    name: "My Layout",
    // Optionally specify a Layout type. The default is "Global".
    type: "Workspace"
};

const savedLayout = await glue.layouts.save(layoutConfig);
```

To restore a Layout, use the [`restore()`](../../../../reference/glue/latest/layouts/index.html#API-restore) method and pass a [`RestoreOptions`](../../../../reference/glue/latest/layouts/index.html#RestoreOptions) object specifying the name of the Layout (required) and other restore options:

```javascript
const restoreOptions = {
    name: "My Layout",
    // Specify whether to close all running apps before restoring the Layout.
    // The default is `true` for Global Layouts.
    closeRunningInstance: false
};

await glue.layouts.restore(restoreOptions);
```

### Removing

To remove a Layout, use the [`remove()`](../../../../reference/glue/latest/layouts/index.html#API-remove) method. You must pass the [`LayoutType`](../../../../reference/glue/latest/layouts/index.html#LayoutType) and the name of the Layout as arguments:

```javascript
await glue.layouts.remove("Global", "My Layout");
```

### Exporting and Importing

You can export all currently available [`Layout`](../../../../reference/glue/latest/layouts/index.html#Layout) objects with the [`export()`](../../../../reference/glue/latest/layouts/index.html#API-export) method. Exported Layouts can be stored to a database and then be used as restore points, or can be sent to another user and imported on their machine.

```javascript
const layouts = await glue.layouts.export();
```

*The `export()` method (as opposed to `list()`) is available in all modes if you need to get a collection of all Layouts.*

To import exported Layouts, use the [`import()`](../../../../reference/glue/latest/layouts/index.html#API-import) method. Pass the collection of [`Layout`](../../../../reference/glue/latest/layouts/index.html#Layout) objects to import and specify an [`ImportMode`](../../../../reference/glue/latest/layouts/index.html#ImportMode):

```javascript
const mode = "merge";

await glue.layouts.import(layouts, mode);
```

The [`ImportMode`](../../../../reference/glue/latest/layouts/index.html#ImportMode) controls the import behavior. If set to `"replace"` (default), all existing Layouts will be removed. If set to `"merge"`, the Layouts will be imported and merged with the existing Layouts.

## Layout Events

The Layouts API allows your app to react to Layout events - adding, removing, updating or renaming a Layout. Use the returned unsubscribe function to stop receiving notifications about the respective event.

### Added

To subscribe for the event which fires when a Layout is added, use the [`onAdded()`](../../../../reference/glue/latest/layouts/index.html#API-onAdded) method:

```javascript
glue.layouts.onAdded(console.log);
```

### Removed

To subscribe for the event which fires when a Layout is removed, use the [`onRemoved()`](../../../../reference/glue/latest/layouts/index.html#API-onRemoved) method:

```javascript
glue.layouts.onRemoved(console.log);
```

### Changed

To subscribe for the event which fires when a Layout is changed, use the [`onChanged()`](../../../../reference/glue/latest/layouts/index.html#API-onChanged) method:

```javascript
glue.layouts.onChanged(console.log);
```

### Renamed

To subscribe for the event which fires when a Layout is renamed, use the [`onRenamed()`](../../../../reference/glue/latest/layouts/index.html#API-onRenamed) method:

```javascript
glue.layouts.onRenamed(console.log);
```

## Saving and Updating Context

When a Layout is saved, apps can store context data in it. When the Layout is restored, the context data is also restored and returned to the apps. Context data can be saved in all Layout types.

*Note that saving large volumes of custom data as window context (e.g., thousands of lines of table data) can lead to significant delays when saving a Layout. A Layout usually contains several (in some cases - many) apps and/or Workspaces (which can also contain many apps) and if one or more of the apps saves large amounts of context data each time a Layout is saved, this will significantly slow down the saving process. The methods for saving custom context work best with smaller amounts of data. If your app needs to save large amounts of data, you have to think about how to design this process better - for instance, you may store IDs, indices, etc., as context data, save the actual data to a database and when you restore the Layout, fetch the data using the data IDs saved as window context.*

### Saving Context Data

To save context data, apps can subscribe for Layout save requests using the [`onSaveRequested()`](../../../../reference/glue/latest/layouts/index.html#API-onSaveRequested) method. A Layout save request event is fired when the user attempts to save a Layout or close a window, Workspace, etc. The on `onSaveRequested()` method accepts a callback which will be invoked when a Layout save request is triggered. The callback will receive as an argument a [`SaveRequestContext`](../../../../reference/glue/latest/layouts/index.html#SaveRequestContext) object containing the Layout name, type and context. Use it to determine the type of the Layout and instruct your app to react accordingly:

```javascript
const saveRequestHandler = (requestInfo) => {
    // Get the Layout type.
    const layoutType = requestInfo.layoutType;

    // Return different context data depending on the Layout type.
    if (layoutType === "ApplicationDefault") {
        return { windowContext: { gridWidth: 42 } };

    } else if (layoutType === "Global") {
        return { windowContext: { gridWidth: 420 } };

    } else {
        // Return if not interested in other Layout types.
        return;
    };
};

glue.layouts.onSaveRequested(saveRequestHandler);
```

The callback must return a [`SaveRequestResponse`](../../../../reference/glue/latest/layouts/index.html#SaveRequestResponse) object that has a [`windowContext`](../../../../reference/glue/latest/layouts/index.html#SaveRequestResponse-windowContext) property.

After the Layout has been restored, the saved context data will be available in the window context:

```javascript
// Extracting previously saved data from the window context.
const windowContext = await glue.windows.my().getContext();
const gridWidth = windowContext.gridWidth;
```

### Updating App Default Context

To manually update the context of the current window in its App Default Layout, use the `updateDefaultContext()` method:

```javascript
const context = { glue: 42 };

await glue.layouts.updateDefaultContext(context);
```

### Updating Context of Apps in Global Layouts

To update the context that will be saved for the current app in the currently loaded Global Layout, use the [`updateAppContextInCurrent()`](../../../../reference/glue/latest/layouts/index.html#API-updateAppContextInCurrent) method. This method allows you to update the saved context for the current app in the Layout without having to save the entire Layout:

```javascript
const context = { glue: 42 };

await glue.layouts.updateAppContextInCurrent(context);
```

## Default Global Layout

[**Glue42 Enterprise**](https://glue42.com/enterprise/) allows you to specify a default Global Layout that will be automatically loaded on start. You can get, set and clear the default Global Layout programmatically.

To get the current default Global Layout, use the [`getDefaultGlobal()`](../../../../reference/glue/latest/layouts/index.html#API-getDefaultGlobal) method:

```javascript
// May return `undefined` if no default Global Layout has been set.
const defaultLayout = await glue.layouts.getDefaultGlobal();
```

To set a default Global Layout, use the [`setDefaultGlobal()`](../../../../reference/glue/latest/layouts/index.html#API-setDefaultGlobal) method:

```javascript
glue.layouts.setDefaultGlobal("My Layout");
```

To clear the default Global Layout, use the [`clearDefaultGlobal()`](../../../../reference/glue/latest/layouts/index.html#API-clearDefaultGlobal) method:

```javascript
glue.layouts.clearDefaultGlobal();
```

## Reference

For a complete list of the available Layouts API methods and properties, see the [Layouts API Reference Documentation](../../../../reference/glue/latest/layouts/index.html).