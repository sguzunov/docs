Shared Contexts
====
Delphi 7  

# Opening or Creating a Context  
In order to use Glue42 contexts, you need to implement the `IGlueContextHandler` interface and activate a context subscription.  

## Activate a Context Subscription  
You can initiate a context subscription by using the `SubscribeGlueContext` method. If the context does not already exist a new empty context will be created implicitly:  

```delphi
TMainForm = class(TForm, IGlueContextHandler)
...
private
    // the Glue42 entrypoint handle
    G42: IGlue42;
    // the Glue Context handle
    myContext: IGlueContext;
protected
    // implement IGlueContextHandler
    function HandleContext(const context: IGlueContext): HResult; stdcall;
    function HandleContextUpdate(const contextUpdate: IGlueContextUpdate): HResult; stdcall;
    ...
  procedure TMainForm.InitializeGlue;
    ...
    // init and start the Glue42
    G42.Start(inst);
    // initiate the context subscription
    G42.SubscribeGlueContext('myContextName',Self);
    ...
```

## Implement the `IGlueContextHandler` interface  

### HandleContext  
This callback method is invoked when a Glue context subscription is activated.  
```delphi
function TMainForm.HandleContext(const context: IGlueContext): HResult; stdcall;
begin
  // store the handle to the context
  if context.GetContextInfo.Name = 'myContextName' then
    myContext := context;

  Result := S_OK;
end;
```

### HandleContextUpdate  
This callback method is invoked when the data in the associated context has been updated.  
```delphi
function TMainForm.HandleContextUpdate(const contextUpdate: IGlueContextUpdate): HResult; stdcall;
var
  context: IGlueContext;
  contextName: WideString;
  data: TGlueContextValueArray;
begin
  context := contextUpdate.GetContext();
  contextName := context.GetContextInfo.Name;
  // get the context data in a native data structure
  rawData := context.GetData();
  data := SA_AsTranslatedContextValues(rawData);
  ...
  SafeArrayDestroy(rawData);
  Result := S_OK;
end;
```

# Updating a Context  
Context data can be updated by using `SetContextData`.  
The data needs to be provided as a `PSafeArray` containing `GlueContextValue`'s.  

```delphi
var
  psaData: PSafeArray;
  nativeData: array[0..0] of TGlueContextValue;
  emails: array of TGlueValue;
begin
  // init the array of emails
  SetLength(emails,2);
  emails[0] := CreateValue('vernon.mullen@acme.com');
  emails[1] := CreateValue('vernon.d.mullen@acme.com');

  // create the data with native types
  nativeData[0] := CreateContextValue('contact', CreateComposite([
    CreateContextValue('name', CreateComposite([
      CreateContextValue('firstName', CreateValue('Vernon')),
      CreateContextValue('lastName', CreateValue('Mullen'))
    ],false)),
    CreateContextValue('displayName', CreateValue('Vernon Mullen')),
    CreateContextValue('emails', CreateTuple(emails))
  ],false));
  
  // pack the native data into a PSafeArray
  psaData := CreateContextValues_SA(AsGlueContextValueArray(nativeData));

  // update the context data
  context01.SetContextData(psaData);

  // cleanup
  SafeArrayDestroy(psaData);
end;
```

Here is the resulting context data set by the example above, represented in JSON:  
```json
{
  "contact": {
    "name": {
      "firstName": "Vernon",
      "lastName": "Mullen"
    },
    "displayName": "Vernon Mullen",
    "emails": [
      "vernon.mullen@acme.com",
      "vernon.d.mullen@acme.com"
    ]
  }
}
```
# Listing All Available Contexts  

You can use `GetKnownContexts` to obtain a list of all available contexts:  

```delphi
var
  saContexts: PSafeArray;
  contexts: array of GlueContext;
begin
    saContexts := G42.GetKnownContexts();
    contexts := SA_AsGlueContextArray(saContexts);
    ...
    SafeArrayDestroy(saContexts);
end;
```