## Overview

The Bloomberg Terminal has built-in functions which execute various kinds of data analyses on markets or securities. The Glue42 Bloomberg Connector API allows you to control the behavior of the Bloomberg Terminal panels by invoking Bloomberg functions with a custom set of arguments:

```csharp
(Composite runFunctionResult) 
T42.BBG.RunFunction (String mnemonic, String panel, String[] properties, String[] securities, String tails)
```

- `mnemonic` - the Bloomberg function mnemonic;
- `panel` - on which Bloomberg panel to execute the function (possible values are from 1 to 4);
- `properties` - additional properties that can be specified when running the function;
- `securities` - for which securities to execute the function;
- `tails` - optional parameters passed to the function to tailor the panel output;

Below is an example of invoking a Bloomberg function named `"DVD"` via the Glue42 JavaScript [Interop](../../../../glue42-concepts/data-sharing-between-apps/interop/javascript/index.html) API. The function will be executed in panel `"2"` of the Bloomberg Terminal for the `"IBM US Equity"` security.

```javascript
glue.interop.invoke(
    "T42.BBG.RunFunction", 
    { 
        mnemonic: "DVD", 
        panel: "2", 
        securities: ["IBM US Equity"] 
    });
``` 