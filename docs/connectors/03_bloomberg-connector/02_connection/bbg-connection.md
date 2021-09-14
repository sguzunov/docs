## Connection

To check whether the Glue42 Bloomberg Connector is connected to the Bloomberg Terminal (or the Bloomberg Simulator), use:

- Interop method name: `"T42.BBG.IsLoggedIn"`
- Accepts: `void`
- Returns: Boolean value showing whether the BBG Connector is connected to the BBG Terminal;

Example:

```javascript
const result = await glue.interop.invoke("T42.BBG.IsLoggedIn");
const isConnected = result.returned.Result;
```

To force reconnection of the Connector to the Bloomberg Terminal:

- Interop method name: `"T42.BBG.Reconnect"`
- Accepts: `void`
- Returns: Boolean value showing whether the BBG Connector has succeeded to reconnect to the BBG Terminal;

Example:

```javascript
const result = await glue.interop.invoke("T42.BBG.Reconnect");
const hasReconnected = result.returned.reconnected;
``` 