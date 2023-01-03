## Glue42 Windows

In order for windows created from external WPF or WinForms apps to become Glue42 Windows, they must first be registered via the .NET Window Management API.

Registering your .NET apps as Glue42 Windows must happen at the correct moment - when the process of creating and rendering your window has completed and you have a reference to its handle. For WPF apps, you should register the window in the [`Loaded`](https://docs.microsoft.com/en-us/dotnet/api/system.windows.frameworkelement.loaded?view=windowsdesktop-6.0) event, for WinForms apps - using the [`OnShown()`](https://docs.microsoft.com/en-us/dotnet/api/system.windows.forms.form.onshown?view=windowsdesktop-6.0) method. If you are using custom UI frameworks, you should make sure to choose an event where you are certain that all your components have been properly rendered and you have the window handle. If you try to register a Glue42 Window too early, the registration may fail or may interfere with the process of creating and rendering the components of your .NET app.

*Note that you should make sure you are running [**Glue42 Enterprise**](https://glue42.com/enterprise/) and your Glue42 enabled .NET apps with matching user privileges (e.g., when debugging). Otherwise, window registration will fail - your app window won't be sticky and another transparent sticky window will be visible, looking as if the borders of your app window have been separated from the window itself. If you are running your app as an Elevated administrator (e.g., from Visual Studio, or any IDE, which runs in an elevated state), then you must also run [**Glue42 Enterprise**](https://glue42.com/enterprise/) in an elevated state, if possible. Another solution for matching the user privilege states of [**Glue42 Enterprise**](https://glue42.com/enterprise/) and your app when debugging is to put `Debugger.Launch()` in the app code and start the app by launching its EXE file from the Windows Explorer. This will cause the app to run with standard user privileges.*

## Window Options

You can set several window configuration options during window registration. To create an instance with window options, use:

```csharp
var glueWindowOptions = new GlueWindowOptions();
```

If the app is started by [**Glue42 Enterprise**](https://glue42.com/enterprise/), you can get any window startup options (regarding the app bounds, Layout, etc.) by using:

```csharp
var glueWindowOptions = glue.GlueWindows.GetStartupOptions() ?? new GlueWindowOptions();
```

### Window Type

To set the type of the window:

```csharp
// Create a flat window.
glueWindowOptions.WithType(GlueWindowType.Flat);

// Create a tab window.
glueWindowOptions.WithType(GlueWindowType.Tab);
```

### Window Title

To set the title of the window:

```csharp
glueWindowOptions.WithTitle("My Window");
```

## Registering Windows

To register a window as a Glue42 Window, use the `RegisterWindow()` method passing the window object as a first parameter and a window options object as a second:

```csharp
IGlueWindow glueWindow = await glue.GlueWindows.RegisterWindow(this, glueWindowOptions);
```

### WPF Windows

*Note that it is mandatory for an external WPF app to have an `app.manifest` file with the following section:*

```xml
<application xmlns="urn:schemas-microsoft-com:asm.v3">
    <windowsSettings>
        <dpiAware xmlns="http://schemas.microsoft.com/SMI/2005/WindowsSettings">true/PM</dpiAware>
    </windowsSettings>
</application>
```
You can register a WPF window right after its creation. You can do this either in the window code or from an external component. To register a WPF window, use:

```csharp
// Register the window by using `this` window as a first parameter.
IGlueWindow glueWindow = await glue.GlueWindows.RegisterWindow(this, glueWindowOptions);
```

Full example:

```csharp
// Get and set window options.
var glueWindowOptions = glue.GlueWindows.GetStartupOptions() ?? new GlueWindowOptions();

glueWindowOptions.WithType(GlueWindowType.Tab);

glueWindowOptions.WithTitle("My Window");

// Register the window.
IGlueWindow glueWindow = await glue.GlueWindows.RegisterWindow(this, glueWindowOptions);
```

WPF windows are automatically unregistered when they are closed. If you want to manually unregister a window at a different point in time, use:

```csharp
glueWindow.Unregister();
```

*See the .NET [WPF window registration example](https://github.com/Glue42/net-examples/tree/master/wpf-sw) on GitHub.*

### WinForms Windows

You can register a WinForms window by using its handle:

```csharp
// Get and set window options.
var glueWindowOptions = glue.GlueWindows.GetStartupOptions() ?? new GlueWindowOptions();

glueWindowOptions.WithType(GlueWindowType.Flat);

glueWindowOptions.WithTitle("My Window");

// Register the window by using its handle as a first parameter.
IGlueWindow glueWindow = await glue.GlueWindows.RegisterWindow(this.Handle, glueWindowOptions);
```

WinForms windows don't support automatic unregistration. You should explicitly call `Unregister()` when the window is closed:

```csharp
glueWindow.Unregister();
```

## Registering Windows as App Instances

The .NET Window Management library allows WPF and WinForms apps to announce the windows initiated by them as Glue42 app instances (see also [App Management](../../../application-management/net/index.html)). This is necessary when you have a [multi window app](../../../application-management/net/index.html#multi_window_apps) and its windows are registered as Glue42 apps - then the multi window app becomes responsible for notifying [**Glue42 Enterprise**](https://glue42.com/enterprise/) about new app instances.

The `RegisterAppWindow()` method registers the window both as a Glue42 Window and as a Glue42 app instance. It accepts the WPF window object (or the WinForms window handle), the Glue42 app object, the app name and an app options builder as arguments:

```csharp
var placement = new GlueWindowScreenPlacement();

glue.GlueWindows.RegisterAppWindow(myWindow, myApp, myWindowAppName,
        // Specify app options.
        builder => builder
        .WithPlacement(placement)
        .WithType(GlueWindowType.Tab));
```

*For more details on multi window app support, see [App Management > Multi Window Apps](../../../application-management/net/index.html#multi_window_apps) and the .NET [Multi Window Demo example](https://github.com/Glue42/net-examples/tree/master/multiwindow-demo) on GitHub.*

## Window Operations

Once an app window is registered, the Window Management API will accept full control over the window positioning, sizing and visibility. The app shouldn't use native methods (e.g., WPF or WinForms calls) to control the window as this will interfere with the Glue42 Window Management.

You can perform operations on the current window and on any other registered window.

### Window App Instance

The window object offers access to the host app instance, connecting the Window Management API with the [App Management API](../../../application-management/net/index.html):

```csharp
IAppManagerApplication appInstance = targetWindow.Instance;
```

### Current Window

To get a reference to the current window, use:

```csharp
IGDWindow myWindow = await glue.GlueWindows.RegisterWindow(this, glueWindowOptions);
```

### Title

To set the window title, use:

```csharp
myWindow.Title = "New title";
```

### Size and Position

To change the bounds of the window, use:

```csharp
// Set the window bounds - left, top, width, height.
var newWindowBounds = new GlueWindowBounds(10, 10, 200, 200);

myWindow.Bounds = newWindowBounds;
```

### Visibility

To hide the window, use:

```csharp
myWindow.IsVisible = false;
```

### Handling Other Windows

The .NET Window Management API allows you to find all Glue42 Windows and manipulate them.

#### Finding Windows

To find all Glue42 Windows, use the `GetGDWindows()` method of the .NET Window Management API:

```csharp
IGDWindow[] allWindows = await glue.GlueWindows.GetGDWindows();
```

To await your newly registered window to be published to the window collection, use:

```csharp
IGDWindow myWindow = await glue.GlueWindows.RegisterWindow(this, glueWindowOptions);

await glue.GlueWindows.AwaitWindow(window => window.Id == myWindow.Id);

// The collection will now contain `myWindow`.
IGDWindow[] allWindows = await glue.GlueWindows.GetGDWindows();
```

To find a window by ID, use:

```csharp
var targetWindowId = "29476_0";
IGDWindow[] allWindows = await glue.GlueWindows.GetGDWindows();
IGDWindow targetWindow = allWindows.FirstOrDefault(window => window.Descriptor.Id == targetWindowId);
```

To find a window by name, use:

```csharp
var targetWindowName = "target-window";
IGDWindow[] allWindows = await glue.GlueWindows.GetGDWindows();
IGDWindow targetWindow = windows.FirstOrDefault(window => window.Descriptor.Name == targetWindowName);
```

To find the main window of an app instance by app instance ID, use:

```csharp
var instanceId = "29476_1";
IGDWindow mainWindow = await glue.GlueWindows.AwaitWindow(window => window.Id == instanceId);
```

To find all windows of any app, use:

```csharp
var appName = "client-list";
IEnumerable<IGDWindow> appWindows = (await glue.GlueWindows.GetGdWindows())
    .Where(window => window.Descriptor.Name == appName);
```

To find all windows of the current app, use:

```csharp
var appWindows = glue.GlueWindows.OwnWindows;
```

### Updating Windows

To manipulate any Glue42 Window, use the `Update()` method of the window instance.

#### Window Title

```csharp
IGDWindow[] allWindows = await glue.GlueWindows.GetGDWindows();
var newTitle = "New Title";
IGDWindow targetWindow = allWindows.FirstOrDefault((window) =>
{
    return window.Descriptor.Name == "My Window";
});

await targetWindow.Update((window) =>
{
	window.SetTitle((titleOptions) => titleOptions.Title = newTitle);
});
```

#### Hiding a Window

```csharp
await targetWindow.Update((window) =>
{
	window.Hide();
});
```

#### Showing a Window

```csharp
await targetWindow.Update((window) =>
{
	window.Show();
});
```

#### Closing a Window

```csharp
await targetWindow.Update((window) =>
{
	window.Close();
});
```

## Window Events

The .NET Window Management API offers methods for listening for Glue42 Window events. To get notified for window events, use the `Subscribe()` method directly on an API level or on a window instance.

The example below demonstrates subscribing for an event by using `Subscribe()` on an API level:

```csharp
var subscription = glue.GlueWindows.Subscribe(
    // Reference to the window for which to receive event notifications.
    targetWindow,
    // The lambda specifies for which window property to receive event notifications.
    p => p.Title,
    // Event handler.
    (descriptor, eventType, propertyChangedName, newPropertyValue, oldValue) =>
        {
            var title = descriptor.Title;
        }
);
```

To stop listening for any window event, use the `Dispose()` method of the subscription object returned by `Subscribe()`:

```csharp
subscription.Dispose();
```

Some of the available window events are described below. The examples demonstrate how to subscribe for them through the window instance.

### Title

To get notified when the window title changes:

```csharp
var subscription = window.Subscribe(
    EventType.TitleChanged,
    (descriptor, eventType) =>
        {
            var title = descriptor.Title;
        }
);
```

### Bounds

To get notified when the window bounds change:

```csharp
var subscription = window.Subscribe(
    EventType.BoundsChanged,
    (descriptor, eventType) =>
        {
            var bounds = descriptor.Bounds;
        }
);
```

### Visibility

To get notified when the window visibility changes:

```csharp
var subscription = window.Subscribe(
    EventType.VisibilityChanged,
    (descriptor, eventType) =>
        {
            var isVisible = descriptor.isVisible;
        }
);
```

### Frame Color

To get notified when the window frame color changes:

```csharp
var subscription = window.Subscribe(
    EventType.FrameColorChanged,
    (descriptor, eventType) =>
        {
            var frameColor = descriptor.FrameColor;
        }
);
```

## Frame Buttons

The Window Management API allows placing custom buttons in the frame area of the window and handling clicks on them.

To add a frame button, use the `Update()` method of a Glue42 Window instance. The following example demonstrates how to add a frame button, specify an icon for it and handle clicks on it:

```csharp
glueWindow.Update(windowUpdate => windowUpdate.AddButton(button =>
    {
        button.ButtonId = "btn" + Guid.NewGuid().ToString("N");
        // To set a button icon, you can also use `button.ImageBase64` and supply the respective Base64-encoded string.
        button.Image = Image.FromFile("button-image.png");
        button.OnClickAction = (@event, buttonInfo) =>
        {
            // Handle button clicks.
        };
    }));
```

## WPF Example

This is a minimalistic WPF example that registers its main window as a Glue42 Window.

*See the .NET [WPF example](https://github.com/Glue42/net-examples/tree/master/wpf-sw) on GitHub.*

In `App.xaml` initialize Glue42:

```csharp
public partial class App : Application
{
    public static Glue42 Glue;

    protected override void OnStartup(StartupEventArgs e)
    {
        base.OnStartup(e);

        Glue = new Glue42();
        Glue.Initialize("MyDemo");
    }
```

In `MainWindow.xaml.cs` register the window:

```csharp
public partial class MainWindow : Window
{
    public MainWindow()
    {
        InitializeComponent();

        var glueWindowOptions = App.Glue.GlueWindows.GetStartupOptions() ?? new GlueWindowOptions();
        glueWindowOptions.WithType(GlueWindowType.Flat);
        glueWindowOptions.WithTitle("Example Window");

        // Register the window.
        App.Glue.GlueWindows.RegisterWindow(this, glueWindowOptions)
            .ContinueWith(r =>
            {
                IGlueWindow glueWindow = r.Result;
            });
    }
}
```