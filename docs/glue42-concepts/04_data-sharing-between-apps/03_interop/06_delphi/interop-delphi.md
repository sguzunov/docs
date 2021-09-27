Interop  
====
Delphi 7  

# Method Registration  
To expose a Glue42 method that can be invoked by other Glue42 enabled applications, you need to register the method in Glue42 and provide its implementation.  
The application must also implement the `IGlueRequestHandler` interface via which the method invocation requests are serviced. This can be simplified by using the `TGlueRequestHandler` class of the Glue42 Helper unit.  

## Registering methods  
You can register a method after Glue42 has been initialized.  
Here is an example of registering a method named "DelphiAdd":  
```delphi
TMainForm = class(TForm, IGlueContextHandler)
...
private
    // the Glue42 entrypoint handle
    G42: IGlue42;
    // the Add method handle
    methodAdd: GlueMethod;
protected
    // Implementation of the Add method
    procedure GlueMethodAdd(Sender: TGlueRequestHandler;
      Method: GlueMethod;
      Instance: GlueInstance;
      Args: GlueContextValueArray;
      callback: IGlueServerMethodResultCallback;
      Cookie: TCallbackCookie;
      argsSA: PSafeArray);
    ...
  procedure TMainForm.InitializeGlue;
    ...
    // init and start the Glue42
    G42.Start(inst);
    // register the Add method, create 
    // a handler linked to the the GlueMethodAdd procedure
    methodAdd := G42.RegisterMethod('DelphiAdd',
      TGlueRequestHandler.Create(nil,GlueMethodAdd),'','',nil);
    ...
```

## Method Implementation  
Here is a sample implementation of the "DelphiAdd" method:  

```delphi
// method implementation
procedure TMainForm.GlueMethodAdd(Sender: TGlueRequestHandler;
  Method: GlueMethod;
  Instance: GlueInstance;
  Args: GlueContextValueArray;
  callback: IGlueServerMethodResultCallback;
  Cookie: TCallbackCookie;
  argsSA: PSafeArray);
var
  I: Integer;
  a: Int64;
  b: Int64;
  aValid: WordBool;
  bValid: WordBool;
  errorMessage: WideString;
  gValue: GlueValue;
  gResult: GlueResult;
begin
  // validate the arguments
  aValid := False;
  bValid := False;
  for I := Low(Args) to High(Args) do
  begin
    gValue := Args[I].Value;
    if (Args[I].Name = 'a') and ((gValue.GlueType = GlueValueType_Int)
     or (gValue.GlueType = GlueValueType_Long)) then begin;
      a := gValue.LongValue;
      aValid := True;
    end;
    if (Args[I].Name = 'b') and ((gValue.GlueType = GlueValueType_Int)
     or (gValue.GlueType = GlueValueType_Long)) then begin;
      b := gValue.LongValue;
      bValid := True;
    end;
  end;
  if not aValid then
    errorMessage := 'Argument a is missing or invalid';
  if not bValid then
    errorMessage := 'Argument b is missing or invalid';

  ZeroMemory(@gResult, sizeof(gResult));

  // in case of invalid arguments send a failure via the callback
  if not (aValid and bValid) then begin
    gResult.Status := GlueMethodInvocationStatus_Failed;
    gResult.Message := errorMessage;
    callback.SendResult(gResult);
    Exit;
  end;

  // prepare the result as a PSafeArray and send it via the callback
  gResult.Values := CreateContextValues_SA(AsGlueContextValueArray([
    CreateContextValue('sum', CreateValue(a+b))
  ]));
  gResult.Status := GlueMethodInvocationStatus_Succeeded;
  callback.SendResult(gResult);
  SafeArrayDestroy(gResult.Values);
end;
```

# Method Invocation  
Below you can see examples of the steps you need to follow to invoke a Glue42 method.  

## Invoking Methods  
Glue42 methods can be invoked by using `InvokeMethods`. Any arguments passed to the method must be in a `PSafeArray`.  

```delphi
    // prepare the arguments in a PSafeArray
    psaArgs := CreateContextValues_SA(AsGlueContextValueArray([
      CreateContextValue('a', CreateValue(5)),
      CreateContextValue('b', CreateValue(6))
    ]));
    
    // invoke the method
    G42.InvokeMethods('DelphiAdd', psaArgs, nil, False,
      GlueInstanceIdentity_None, MethodAddHandler, 3000, '');
      
    SafeArrayDestroy(psaArgs);
```

## Handling Results  
To handle the results of method invocations, you need to implement the `IGlueInvocationResultHandler` interface via which the method invocation requests are serviced. This can be simplified by using the `TGlueResultHandler` class of the Glue42 Helper unit.

### Set up the result handler  

```delphi
TMainForm = class(TForm, IGlueContextHandler)
...
protected
    // Method invocation result handling
    MethodAddHandler: TGlueResultHandler;
    procedure HandleAddResult(Sender: TGlueResultHandler;
      GlueInvResults: TGlueInvocationResultArray;
      Cookie: TCallbackCookie;
      const correlationId: WideString);
      
    ...
  procedure TMainForm.InitializeGlue;
    ...
    // create a method handler linked to the HandleAddResult procedure
    MethodAddHandler := TGlueResultHandler.Create(nil,HandleAddResult);
    ...  
```

### Implement the result handler   
```delphi
procedure TMainForm.HandleAddResult(Sender: TGlueResultHandler;
    GlueInvResults: TGlueInvocationResultArray;
    Cookie: TCallbackCookie;
    const correlationId: WideString);
var
  gResult: GlueResult;
  data: TGlueContextValueArray;
  sum: Int64;    
begin
  gResult := GlueInvResults[0].result;
  if gResult.Status <> GlueMethodInvocationStatus_Succeeded then begin
    // Invocation failed, information may be available in gResult.Message
    Exit;
  end;

  // translate the result values
  data := SA_AsTranslatedContextValues(gResult.Values);
  if (Length(data) <> 1) or (data[0].Name <> 'sum') then begin
    // Unexpected result;
    Exit;
  end;

  sum := data[0].Value.LongValue;
end;
```

# Discovery  
Your application can discover registered Interop methods and streams and other applications (Interop servers) which offer them.  

## Listing All Methods and Streams  
You can use use `GetAllMethods` to find all registered Glue42 methods/streams:  

```delphi
var
  saMethods: PSafeArray;
  methods: array of GlueContext;
begin    
    saMethods := G42.GetAllMethods();
    methods := SA_AsGlueContextArray(saMethods);
    ...
    SafeArrayDestroy(saMethods);
end;    
```

## Listing Methods and Streams for Target  
You can use use `GetMethodNamesForTarget` to find all Glue42 methods/streams registered by specific application(s). The required argument represents a regular expression to match against registered application names.  
The following example shows how to list all methods and streams registered by applications with names starting with 'client':  

```delphi
var
  saMethods: PSafeArray;
  methods: array of GlueContext;
begin    
    saMethods := G42.GetMethodNamesForTarget('^client.*');
    methods := SA_AsGlueContextArray(saMethods);
    ...
    SafeArrayDestroy(saMethods);
end;    
```

## Listing All Interop Servers  
You can use `GetTargets` to get a list of the names of all applications offering Interop methods/streams:  

```delphi
var
  saTargetNames: PSafeArray;
  targetNames: TStrArray;
begin    
    saTargetNames := G42.GetTargets();
    targetNames := SA_AsStringArray(saTargetNames);
    ...
    SafeArrayDestroy(saTargetNames);
end;    
```

# Streaming  

## Overview  
Your application can publish events that can be observed by other applications, or it can provide real-time data (e.g., market data, news alerts, notifications, etc.) to other applications by publishing an Interop stream. Your application can also receive and react to these events and data by creating an Interop stream subscription.  

Applications that create and publish to Interop Streams are called __publishers__, and applications that subscribe to Interop Streams are called __subscribers__. An application can be both.  


Interop Streams are used extensively in Glue42 Enterprise products and APIs:  
* in Glue42 Windows - to publish notifications about window status change (events);  
* in application configuration settings - to publish application configuration changes, and notifications about application instance state change (events);  
* in the Glue42 Notification Service (GNS) Desktop Manager and GNS Interop Servers - to publish Notifications (real-time data);  
* in the Glue42 Search Service (GSS) Desktop Manager and GSS Interop Servers - to publish results for a type-ahead query about an entity (events);  
* in the Window Management, Application Management, and Activities APIs (events);  

# Publishing Stream Data  
To expose a data stream to which other applications can subscribe, you need to register a stream and provide implementations for handling the server side streaming events (subscription requests, added/removed subscribers). Once a stream has been successfully registered, the publishing application can start pushing data to it.  

## Creating Streams  
You can register streaming methods after Glue42 has been initialized.  For handling subscription requests you also need to implement the `IGlueSubscriptionHandler` interface.
Here is an example of registering a streaming method named "DelphiStream":  
```delphi
TMainForm = class(TForm, IGlueSubscriptionHandler)
...
private
    // the Glue42 entrypoint handle
    G42: IGlue42;
    // the stream and streaming method handles
    delphiStream: IGlueStream;
    deplhiStreamMethod: GlueMethod;
protected
    // implement IGlueSubscriptionHandler
    function HandleSubscriptionRequest(stream: GlueMethod;
      caller: GlueInstance;
      requestValues: PSafeArray;
      const callback: IGlueServerSubscriptionCallback): HResult; stdcall;

    function HandleSubscriber(subscriberInstance: GlueInstance;
      const glueStreamSubscriber: IGlueStreamSubscriber;
      requestValues: PSafeArray): HResult; stdcall;

    function HandleSubscriberLost(streamSubscriber: GlueInstance;
      const glueStreamSubscriber: IGlueStreamSubscriber): HResult; stdcall;
...
  procedure TMainForm.InitializeGlue;
...
    // init and start the Glue42
    G42.Start(inst);
    // register the stream
    delphiStreamMethod := G42.RegisterStream('DelphiStream', Self, '', '', nil, delphiStream);
...
```

## Accepting or Rejecting Subscription Requests  
Subscription requests can be accepted or rejected in the implementation of the `HandleSubscriptionRequest` callback method:  

```delphi
function TMainForm.HandleSubscriptionRequest(stream: GlueMethod;
  caller: GlueInstance;
  requestValues: PSafeArray;
  const callback: IGlueServerSubscriptionCallback): HResult; stdcall;
var
  reqArgs: GlueContextValueArray;
  gResult: GlueResult;
begin
  // get the request arguments passed by the caller
  reqArgs := SA_AsGlueContextValueArray(requestValues);
  if (Length(reqArgs) > 0) and (reqArgs[0].Name = 'rejectme') then begin
    ZeroMemory(@gResult, sizeof(gResult));
    gResult.Message := 'Rejected per request';
    callback.Reject(gResult);
    Result := S_OK;
    Exit;
  end;

  // accept the subscriber
  ZeroMemory(@gResult, sizeof(gResult));
  callback.Accept('',gResult);
  Result := S_OK;
end;
```
## Added or Removed Subscriptions  

The `HandleSubscriber` callback method is invoked when a new subsciber has been accepted.  
As new subscribers will not automatically get the data that has been previously published to the stream, this handler can be used to privately push some initial data to the new subscriber only.

```delphi
function TMainForm.HandleSubscriber(subscriberInstance: GlueInstance;
  const glueStreamSubscriber: IGlueStreamSubscriber;
  requestValues: PSafeArray): HResult; stdcall;
var
  psaData: PSafeArray;
begin

  // put the inital data into a PSafeArray
  psaData := CreateContextValues_SA(AsGlueContextValueArray([
     CreateContextValue('initialData', CreateValue('Welcome!'))
    ]));
  // push the data privately to the new subscriber
  glueStreamSubscriber.Push(psaData);
  SafeArrayDestroy(psaData);
  Result := S_OK;
end;
```

The `HandleSubscriberLost` callback method is invoked when a stream subscription has been terminated.  
Here is a minimal implementation:
```delphi
function TMainForm.HandleSubscriberLost(streamSubscriber: GlueInstance;
  const glueStreamSubscriber: IGlueStreamSubscriber): HResult; stdcall;
begin
  Result := S_OK;
end;
```

## Pushing Data  
You can push data to a stream by using `Push`. Data can be sent to all subscribers on the stream, or to a group of subscribers on a specific stream branch.

The example below demonstrates how to push data to all subscribers on a stream:  
```delphi
var
  psaData: PSafeArray;
  value01: TGlueContextValue;
  value02: TGlueContextValue;
begin
  value01 := CreateContextValue('instrument', CreateValue('GOOG'));
  value02 := CreateContextValue('price', CreateValue(1764.70));
  psaData := CreateContextValues_SA(AsGlueContextValueArray([value01,value02]));
  delphiStream.Push(psaData,'');
  SafeArrayDestroy(psaData);
end;
```

## Using Stream Branches 
Using stream branches allows you to group subscribers by any criterion and target stream data at specific groups of subscribers. Branches are distinguished by their name (key). Each GLue42 stream has a default (unnamed) branch on which it accepts subscribers and to which it pushes data if no branch is specified.

To accept a subscription on a branch, specify the branch name when accepting the subscription. If the branch does not exist, it will be automatically created:  

```delphi
function TMainForm.HandleSubscriptionRequest(stream: GlueMethod;
  caller: GlueInstance;
  requestValues: PSafeArray;
  const callback: IGlueServerSubscriptionCallback): HResult; stdcall;
var
  gResult: GlueResult;  
begin  
  // accept the subscriber on branch 'branch01'
  ZeroMemory(@gResult, sizeof(gResult));
  callback.Accept('branch01',gResult);
  Result := S_OK;
end;
```
To push data to subscribers on a specific branch, specify the branch name when using `Push`.  
>Note: the branch must have been previously created by accepting at least one subscriber on it.

```delphi
  delphiStream.Push(psaData,'branch01');
```

To list the names(keys) of the branches created, use `GetBranchKeys`:  
```delphi
var
  psaBranchNames: PSafeArray;
  branchNames: TStrArray;
begin
  psaBranchNames := delphiStream.GetBranchKeys();
  branchNames := SA_AsStringArray(psaBranchNames);
  ...
  SafeArrayDestroy(psaBranchNames);
end;
```

# Consuming Stream Data  
To consume stream data an application needs to subscribe to a stream and implement the implement the `IGlueStreamHandler` interface via which notofications about the stream related events are delivered. This can be simplified by using the `TGlueStreamHandler` class of the Glue42 Helper unit. 

## Subscribing to Streams  
Below is an example of how to subscribe to a stream and set up the related data handler.  

Here is an example of registering a streaming method named "DelphiStream":  
```delphi
TMainForm = class(TForm)
...
private
  // the Glue42 entrypoint handle
  G42: IGlue42;
protected
  // Stream data handling
  procedure HandleDelphiStreamData(Method: GlueMethod;
    data: GlueContextValueArray;
    dataAsSA: PSafeArray);

...
  procedure TMainForm.InitializeGlue;
  var
    streamMethod: GlueMethod;  
...
  // init and start the Glue42
  G42.Start(inst);

  // Subscribe to the stream named DelphiStream, create 
  // a stream data handler linked to the HandleDelphiStreamData procedure
  G42.SubscribeStreams('DelphiStream', nil, nil, false,
    GlueInstanceIdentity_None,
    TGlueStreamHandler.Create(HandleDelphiStreamData), 0);
...
```

## Handling Stream Data  
Here is an example of a stream data handling procedure:  
```delphi
procedure TMainForm.HandleDelphiStreamData(Method: GlueMethod;
  data: GlueContextValueArray;
  dataAsSA: PSafeArray);
var
  I: integer;
  gValue: GlueValue;
  initialData: WideString;  
  instrument: WideString;
  price: Double;
begin
  initialData := '';
  instrument := '';
  price := -1;
  for I := Low(data) to High(data) do
  begin
    gValue := data[I].Value;
    if data[I].Name = 'initialData' then begin
      initialData := gValue.StringValue;
    end;
    if data[I].Name = 'instrument' then begin
      instrument := gValue.StringValue;
    end;
    if data[I].Name = 'price' then begin
      if (gValue.GlueType = GlueValueType_Long)
      or (gValue.GlueType = GlueValueType_int) then begin
        price := gValue.LongValue;
      end;
      if gValue.GlueType = GlueValueType_Double then begin
        price := gValue.DoubleValue;
      end;
    end;
  end;

  // do something with the data
  ...
end;
```