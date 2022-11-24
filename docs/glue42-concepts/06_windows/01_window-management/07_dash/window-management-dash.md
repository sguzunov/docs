## Opening Windows

The `Windows` component enables you to open new Glue42 Windows. Instantiate the component and assign an ID to it:

```python
import dash
import dash_glue42

​app = dash.Dash(__name__)
​
​app.layout = dash_glue42.Glue42(id="glue42", children=[
    dash_glue42.Windows(id="g42-windows")
])
```

To open a Glue42 Window, define a callback and pass the ID of the `Windows` component and its `open` property in the `Output`. For `Input` pass the ID and the property of the component that you want to trigger opening the window. When opening a new Glue42 Window, it is required to specify a unique name and a URL. Pass an `options` object if you want to specify window bounds, mode, etc.

For more details on the available window settings, see [Window Settings](#window_settings).

The following example demonstrates how to open a new window with specific bounds and a title when the user clicks a button:

```python
@app.callback(
    Output("g42-windows", "open"),
    Input("open-window", "n_clicks"),
    prevent_initial_call=True
)
def open_window(_):

    return {
        # Each Glue42 Window must have a unique name.
        "name": "glue42-docs",
        "url": "https://docs.glue42.com",
        "options": {
            "title": "Glue42 Docs",
            "width": 400,
            "height": 500,
        }
    }
```

*See the Dash [Window Management example](https://github.com/Glue42/glue-dash-example/tree/master/window-management) on GitHub.*

## Window Settings

You can specify settings per Glue42 Window either by using its [app configuration](../../../../developers/configuration/application/index.html) file, or by passing an `options` object when opening a new window.

- using the app configuration settings:

```json
{
    "type": "window",
    "name": "glue42-docs",
    "details": {
        "url": "https://docs.glue42.com",
        "height": 640,
        "width": 560,
        "left": 100,
        "top": 100,
        "mode": "flat",
        "title": "Glue42 Documentation",
        "backgroundColor": "#1a2b30",
        "focus": false
    }
}
```

- passing an `options` object when opening a new window:

```python
@app.callback(
    Output("g42-windows", "open"),
    Input("open-window", "n_clicks"),
    prevent_initial_call=True
)
def open_window(_):

    options = {
            "height": 640,
            "width": 560,
            "left": 100,
            "top": 100,
            "mode": "flat",
            "title": "Glue42 Documentation",
            "backgroundColor": "#1a2b30",
            "focus": False
        }

    return {
        "name": "glue42-docs",
        "url": "https://docs.glue42.com",
        "options": options
    }
```

All available window settings that can be passed via configuration or at runtime are described in the [app configuration schema](../../../../assets/configuration/application.json) under the `"windows"` key.