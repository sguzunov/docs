## Overview

The Glue42 COM library allows you to Glue42 enable your Delphi applications, integrate them with other Glue42 enabled applications in [Glue42 Enterprise](https://glue42.com/enterprise/) and use Glue42 functionality in them. To access Glue42 functionalities in your Delphi application, you have to reference and initialize the Glue42 COM library. All files necessary for Glue42 enabling your Delphi application are a part of the SDK bundle of [Glue42 Enterprise](https://glue42.com/enterprise/) located in the `%LocalAppData%\Tick42\GlueSDK\GlueCOM` folder. Currently, the Glue42 COM library supports Delphi 7 and Delphi 10.

## Using the Glue42 COM Library

### Referencing

To use any [Glue42 Enterprise](https://glue42.com/enterprise/) functionality, you need to add the following units to your Delphi project:

- `GlueCOM_TLB.pas` - declarations for the Glue42 COM type library;
- `mscorlib_TLB.pas` - declarations for the Microsoft Common Object Runtime library (the Glue42 COM type library depends on it);
- `GlueHelper.pas` - Delphi native types for wrapping low-level COM functionality;

*Note that you must not import the Glue42 COM type library (`GlueCOM.dll`) directly into your project. The provided `GlueCOM_TLB` unit has been modified to use specific alignment for some records. Importing the Glue42 COM type library will overwrite these required modifications.*

### Initialization

Initialize the Glue42 interface in the application main form by following these steps:

1. Import the `GlueCOM_TLB` unit:

```delphi
uses
  GlueCOM_TLB;
```

2. Declare a variable to hold the Glue42 COM object and a procedure to perform the initialization:

```delphi
type
  TMainForm = class(TForm)

  private
    // The Glue42 entry point handle.
    G42: IGlue42;
  protected
    procedure InitializeGlue;
```

3. Implement the initialization:

```delphi
procedure TMainForm.InitializeGlue;
var
  inst: GlueInstance;
  cfg: GlueConfiguration;
begin
  try
    // Create the Glue42 COM object.
    G42 := CoGlue42.Create() as IGlue42;

    // Configure own identity.
    ZeroMemory(@inst, sizeof(inst));
    inst.ApplicationName := 'MyDelphiApp';
    inst.Metadata := nil;
    ZeroMemory(@cfg, sizeof(cfg));
    cfg.AppDefinitionTitle := 'My Delphi App';
    G42.OverrideConfiguration(cfg);

    // Initialize and start Glue42.
    G42.Start(inst);
  except
    on E: Exception do
    begin
      // Handle errors.
    end;
  end;
end;
```

4. You can invoke `InitializeGlue` in the `OnCreate` event handler and perform cleanup in the `OnClose` event handler for the form:

```delphi
procedure TMainForm.FormCreate(Sender: TObject);
begin
  InitializeGlue;
end;

procedure TMainForm.FormClose(Sender: TObject; var Action: TCloseAction);
begin
  if Assigned(G42) then
  begin
    G42.Stop;
  end;
end;
```

## Application Configuration

To add your Delphi application to the [Glue42 Enterprise](https://glue42.com/enterprise/) Application Manager, you need to define a `.json` configuration file and add it to the application configuration store (remote or local). You can add an application configuration file in the `%LocalAppData%\Tick42\UserData\<ENV-REG>\apps` folder to publish your application locally. `<ENV-REG>` in the link should be replaced with the environment and region folder name used for the deployment of your [Glue42 Enterprise](https://glue42.com/enterprise/) - e.g., `T42-DEMO`. This way, your files will not be erased or overwritten, in case you decide to upgrade or change your [Glue42 Enterprise](https://glue42.com/enterprise/) version.

Application configuration example:

```json
{
    "title": "My Delphi App",
    "type": "exe",
    "name": "my-delphi-app",
    "icon": "https://example.com/delphi-logo.jpg",
    "details": {
        "path": "%GDDIR%/../Demos/DelphiDemo/",
        "command": "MyDelphiApp.exe",
        "parameters": " --mode=1"
    }
}
```

| Property | Description |
|----------|-------------|
| `"type"` | Must be `"exe"`. |
| `"path"` | The path to the application - relative or absolute. You can also use the **%GDDIR%** environment variable, which points to the [Glue42 Enterprise](https://glue42.com/enterprise/) installation folder. |
| `"command"` | The actual command to execute (the EXE file name). |
| `"parameters"` | Specifies command line arguments. |

*Note that the definition should be a valid JSON file (you should either use a forward slash or escape the backslash).*

## Glue42 Delphi Concepts

### Glue42 Time

## Glue42 Helper Unit

The `GlueHelper` unit contains native [type definitions](#glue42_helper_unit-types) and additional helper classes and methods facilitating the use of the Glue42 COM library. 

It is recommended to use the [conversion functions](#conversion_functions) provided in the `GlueHelper` unit to transform the parameters or return values from a `PSafeArray` to native types and vice-versa:

- The functions in the `Create[type]_SA` format can be used to transform various native types to a `PSafeArray`. The returned values need to be destroyed with `SafeArrayDestroy` when no longer needed.  

- The functions in the `SA_As[type]` format can be used to transform a `PSafeArray` to various native types.  

### Types  

#### Array Types  

The following array types are defined in the `GlueHelper` unit:  

| Array | Type |
|-------|------|
| `GlueContextArray` | [GlueContext](#types-gluecontext) |
| `GlueContextValueArray` | [GlueContextValue](#types-gluecontextvalue) |
| `GlueStreamSubscriberArray` | [IGlueStreamSubscriber](#interfaces-igluestreamsubscriber) |
| `GlueValueArray` | [GlueValue](#types-gluevalue) |
| `TDateTimeArray` | `TDateTime` |
| `TDoubleArray` | `Double` |
| `TGlueContextValueArray` | [TGlueContextValue](#tgluecontextvalue) |
| `TGlueInstanceArray` | [GlueInstance](#types-glueinstance) |
| `TGlueInvocationResultArray` | [GlueInvocationResult](#types-glueinvocationresult) |
| `TGlueMethodArray` | [GlueMethod](#types-gluemethod) |
| `TGlueValueArray` | [TGlueValue](#tgluevalue) (pointer) |
| `TInt64Array` | `Int64` |
| `TIntArray` | `Integer` |
| `TStrArray` | `String` |
| `TWideStringArray` | `WideString` |
| `TWordBoolArray` | `WordBool` |

#### Pointer Types  

The following pointer types are defined in the `GlueHelper` unit:  

| Type | Points to |
|------|-----------|
| `PGlueContextValue` | [GlueContextValue](#types-gluecontextvalue) |
| `PGlueInvocationResult` | [GlueInvocationResult](#types-glueinvocationresult) |
| `PGlueMethod` | [GlueMethod](#types-gluemethod) |
| `PGlueResult` | [GlueResult](#types-glueresult) |
| `PGlueValue` | [GlueValue](#types-gluevalue) |
| `PTGlueValue` | [TGlueValue](#tgluevalue) |

#### Native Record Types  

##### TGlueContextValue   

This is a translated version (i.e. not using `PSafeArray` directly or indirectly) of [GlueContextValue](#types-gluecontextvalue) representing a name-value pair.

**Properties**

| Name | Type | Description |
|------|------|-------------|
| `Name` | `WideString` | Name associated with the value. |
| `Value` | `PTGlueValue` | Pointer to [TGlueValue](#tgluevalue). |

##### TGlueValue  

This is a translated version (i.e. not using `PSafeArray` directly or indirectly) of [GlueValue](#types-gluevalue) representing an elementary or composite value.  

**Properties**

| Name | Type | Description |
|------|------|-------------|
| `GlueType` | [GlueValueType](#enums-gluevaluetype) | Type of the Glue42 value. |
| `IsArray` | `WordBool` | Indicates whether the value is an array. |

The following properties will be initialized according to `GlueType` and `IsArray`:  

| Name | Type | Description |
|------|------|-------------|
| `BoolValue` | `WordBool` | Boolean value. |
| `LongValue` | `Int64` | Integer value. |
| `DoubleValue` | `Double` | Double-precision floating-point value. |
| `StringValue` | `WideString` | String value. |
| `BoolArray` | `TWordBoolArray` | Array of `WordBool` values. |
| `LongArray` | `TInt64Array` | Array of `Int64` values. |
| `DoubleArray` | `TDoubleArray` | Array of `Double` values. |
| `StringArray` | `TStrArray` | Array of `String` values. |
| `DateTimeArray` | `TDateTimeArray` | Array of `TDateTime` values. |
| `Tuple` | `TGlueValueArray` | Array of `TGlueValue` values. |
| `CompositeValue` | `TGlueContextValueArray` | Array of [TGlueContextValue](#tgluecontextvalue) values. |

### Working with PSafeArray  

The GlueHelper unit provides a set of functions which can be used to convert from/to `PSafeArray` which is widely used when sending or receiving data from Glue.  

#### Summary  

The table below summarizes the available functions to convert from/to `PSafeArray`, based on the content type.  

|Array type|Array of|from `PSafeArray`|to `PSafeArray`|
|:---------|:-------|:---------------:|:-------------:|
|`TDoubleArray`|`Double`|SA_AsDoubleArray|CreateArray_SA|
|`TInt64Array`|`Int64`|SA_AsInt64Array|CreateArray_SA|
|`TStrArray`|`String`|SA_AsStringArray|CreateArray_SA|
|`TWideStringArray`|`WideString`|SA_AsWideStringArray|CreateArray_SA|
|`TWordBoolArray`|`WordBool`|SA_AsWordBoolArray|CreateArray_SA|
|`TDateTimeArray`|`TDateTime`|SA_AsDateTimeArray<br>Note: The safe array is of `Int64` values representing Glue time|n/a|
|`GlueStreamSubscriberArray`|[IGlueStreamSubscriber](#ext-iface-igluestreamsubscriber)|SA_AsGlueStreamSubscriberArray|n/a|
|`GlueContextArray`|[GlueContext](#ext-type-gluecontext)|SA_AsGlueContextArray|n/a|
|`GlueContextValueArray`|[GlueContextValue](#ext-type-gluecontextvalue)|SA_AsGlueContextValueArray|CreateContextValues_SA|
|`TGlueContextValueArray`|[TGlueContextValue](#helper-type-tgluecontextvalue)|SA_AsTranslatedContextValues|AsGlueContextValueArray, then<br>CreateContextValues_SA|
|`TGlueInstanceArray`|[GlueInstance](#ext-type-glueinstance)|SA_AsGlueInstanceArray|CreateInstanceArray_SA|
|`TGlueInvocationResultArray`|[GlueInvocationResult](#ext-type-glueinvocationresult)|SA_AsGlueInvocationResultArray|n/a|
|`TGlueMethodArray`|[GlueMethod](#ext-type-gluemethod)|SA_AsGlueMethodArray|n/a|
|`GlueValueArray`|[GlueValue](#ext-type-gluevalue)|SA_AsGlueValueArray|CreateTuple_SA|


#### Conversion Functions

All conversion functions take a single parameter of the type to be converted.  
The returned `PSafeArray`'s need to be destroyed with `SafeArrayDestroy` when no longer needed.  

|Function|Parameter Type|Return Type|Array of type|
|:---|:---|:---|:---|
|AsGlueContextValueArray|`TGlueContextValueArray`|`GlueContextValueArray`|[GlueContextValue](#ext-type-gluecontextvalue)|
|CreateArray_SA|`TDoubleArray`|`PSafeArray`|`Double`|
|CreateArray_SA|`TInt64Array`|`PSafeArray`|`Int64`|
|CreateArray_SA|`TStrArray`|`PSafeArray`|`String`|
|CreateArray_SA|`TWideStringArray`|`PSafeArray`|`WideString`|
|CreateArray_SA|`TWordBoolArray`|`PSafeArray`|`WordBool`|
|CreateContextValues_SA|`GlueContextValueArray`|`PSafeArray`|[GlueContextValue](#ext-type-gluecontextvalue)|
|CreateTuple_SA|`GlueValueArray`|`PSafeArray`|[GlueValue](#ext-type-gluevalue)|
|SA_AsDateTimeArray|`PSafeArray`|`TDateTimeArray`|`TDateTime`|
|SA_AsDoubleArray|`PSafeArray`|`TDoubleArray`|`Double`|
|SA_AsGlueContextArray|`PSafeArray`|`GlueContextArray`|[GlueContext](#ext-type-gluecontext)|
|SA_AsGlueContextValueArray|`PSafeArray`|`GlueContextValueArray`|[GlueContextValue](#ext-type-gluecontextvalue)|
|SA_AsGlueInstanceArray|`PSafeArray`|`TGlueInstanceArray`|[GlueInstance](#ext-type-glueinstance)|
|SA_AsGlueInvocationResultArray|`PSafeArray`|`TGlueInvocationResultArray`|[GlueInvocationResult](#ext-type-glueinvocationresult)|
|SA_AsGlueMethodArray|`PSafeArray`|`TGlueMethodArray`|[GlueMethod](#ext-type-gluemethod)|
|SA_AsGlueStreamSubscriberArray|`PSafeArray`|`GlueStreamSubscriberArray`|[IGlueStreamSubscriber](#ext-iface-igluestreamsubscriber)|
|SA_AsGlueValueArray|`PSafeArray`|`GlueValueArray`|[GlueValue](#ext-type-gluevalue)|
|SA_AsInt64Array|`PSafeArray`|`TInt64Array`|`Int64`|
|SA_AsStringArray|`PSafeArray`|`TStrArray`|`String`|
|SA_AsTranslatedContextValues|`PSafeArray`|`TGlueContextValueArray`|[TGlueContextValue](#helper-type-tgluecontextvalue)|
|SA_AsWideStringArray|`PSafeArray`|`TWideStringArray`|`WideString`|
|SA_AsWordBoolArray|`PSafeArray`|`TWordBoolArray`|`WordBool`|

#### Functions for creating Glue42 values and context values  

- `CreateContextValue`  
This function is used to create a [TGlueContextValue](#helper-type-tgluecontextvalue) representing a name-value pair. This can be put in a `TGlueContextValueArray` that can eventually be converted to a `PSafeArray` so that it can be sent to Glue.  

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`Name`|`string`|String representing the name in the name-value pair.|
|`Value`|[TGlueValue](#helper-type-tgluevalue)|The value of the name-value pair.|

Return value: [TGlueContextValue](#helper-type-tgluecontextvalue)  

- `CreateValue` 
This is a set of overloaded functions for creating [TGlueValue](#helper-type-tgluevalue)'s out of various types.  
The overloads accepting arrays will create composite values.  
The following types are currently accepted as the sole parameter of the functions:  
- `Double`  
- `Int64`  
- `Integer`  
- `String`  
- `TDoubleArray`  
- `TInt64Array`  
- `TStrArray`  

Return value: [TGlueValue](#helper-type-tgluevalue)  

- `CreateComposite`  
This function creates a composite value out of a `TGlueContextValueArray`.  

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`Value`|`TGlueContextValueArray`|An array of [TGlueContextValue](#helper-type-tgluecontextvalue)'s representing the contents of the composite value.|
|`IsArray`|`Bool`|Specifies if the created composite value is an array.|

Return value: [TGlueValue](#helper-type-tgluevalue)  

- `CreateTuple`  
This function creates a composite value representing a tuple, i.e. an array of (possibly) heterogeneous elements.  

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`Value`|`TGlueValueArray`|An array of [TGlueValue](#helper-type-tgluevalue)'s representing the elements of the tuple.|

Return value: [TGlueValue](#helper-type-tgluevalue)  

### Helper classes for handling events  
This is a set of classes which implement callback interfaces, aimed at simplifying the implementation of callback event handlers.

#### TGlueRequestHandler  
This class implements the `IGlueRequestHandler` interface which invokes a callback whenever a registered Glue42 method is invoked.  
The class constructor accepts the following parameters:  

| Name | Type | Description |
|------|------|-------------|
|`Cookie`|`TCallbackCookie`|Optional pointer to custom data which will be passed to the callback procedure.|
|`handlerLambda`|`TRequestHandlerLambda`|The procedure which will be invoked when the associated Glue42 method is invoked.|

The callback procedure must have the following signature:  
```delphi
TRequestHandlerLambda = procedure(Sender: TGlueRequestHandler;
    Method: GlueMethod;
    Instance: GlueInstance;
    Args: GlueContextValueArray;
    callback: IGlueServerMethodResultCallback;
    Cookie: TCallbackCookie;
    argsSA: PSafeArray) of object;
```

#### TGlueResultHandler  
This class implements the `IGlueInvocationResultHandler` interface which invokes a callback when the result(s) of a Glue42 method invocation become available.  
The class constructor accepts the following parameters:  

| Name | Type | Description |
|------|------|-------------|
|`Cookie`|`TCallbackCookie`|Optional pointer to custom data which will be passed to the callback procedure.|
|`handlerLambda`|`TResultHandlerLambda`|The procedure which will be invoked when the results of the associated Glue42 method invocation become avaialble.|

The callback procedure must have the following signature:  
```delphi
TResultHandlerLambda = procedure(Sender: TGlueResultHandler;
    GlueResult: TGlueInvocationResultArray;
    Cookie: TCallbackCookie;
    const correlationId: WideString) of object;
```

#### TGlueStreamHandler  
This class implements the `IGlueStreamHandler` interface which invokes callbacks for streaming method related events.  
The class constructor accepts the following parameter:  

| Name | Type | Description |
|------|------|-------------|
|`dataLambda`|`TStreamDataLambda`|The procedure which will be invoked when data is pushed on the stream to the subscriber.|

The callback procedure must have the following signature:  
```delphi
TStreamDataLambda = procedure(Method: GlueMethod;
    data: GlueContextValueArray;
    dataAsSA: PSafeArray) of object;
```

## COM/Delphi Reference

This reference describes the components in the Glue42 COM library relevant to Delphi.

*Note that the library also contains components that are not intended to be directly used by Delphi applications.*

# Types

## <a id="type-glueappdefinition"></a> __GlueAppDefinition__ type
Definition of a child application to be registered with Glue.  

### Properties

| Name | Type | Description |
|------|------|-------------|
|`Category`|`WideString`|Application category|
|`Name`|`WideString`|Application name under which the app will be registered with Glue |
|`title`|`WideString`|Application title, as it will appear in the Glue Application Manager|

## <a id="type-glueconfiguration"></a> __GlueConfiguration__ type
Used to override the default Glue configuration.  
See also:  
* [IGlue42](#iface-iglue42).[OverrideConfiguration](#iface-iglue42-overrideconfiguration)

### Properties

| Name | Type | Description |
|------|------|-------------|
|`LoggingConfigurationPath`|`WideString`|Logging configuration path|
|`GWUri`|`WideString`|Glue Gateway URI|
|`AppDefinitionStartup`|`WideString`|Application startup file|
|`AppDefinitionStartupArgs`|`WideString`|Application startup arguments|
|`AppDefinitionTitle`|`WideString`|Application Title|

## <a id="type-gluecontext"></a> __GlueContext__ type

### Properties

| Name | Type | Description |
|------|------|-------------|
|`Name`|`WideString`|Name of the Glue context|
|`Id`|`WideString`|Identifier of the Glue context|

## <a id="type-gluecontextvalue"></a> __GlueContextValue__ type

This type represents a name-value pair.  

### Properties

| Name | Type | Description |
|------|------|-------------|
|`Name`|`WideString`|Name associated with the value|
|`Value`|[GlueValue](#type-gluevalue)|The Glue value|


## <a id="type-glueinstance"></a> __GlueInstance__ type

Describes the identity of a Glue instance - i.e. how the instance is seen by other Glue peers.  

### Properties

| Name | Type | Description |
|------|------|-------------|
|`InstanceId`|`WideString`|Identifier of the Glue instance|
|`Version`|`WideString`|Version reported by the application instance|
|`MachineName`|`WideString`|Machine (network) name|
|`ProcessId`|`Integer`|Process Id (PID)|
|`ProcessStartTime`|`Int64`|Glue time when the process was started|
|`UserName`|`WideString`|User name associated with the process|
|`ApplicationName`|`WideString`|Glue application name|
|`Environment`|`WideString`|Glue environment|
|`Region`|`WideString`|Glue region|
|`ServiceName`|`WideString`|Glue service name|
|`MetricsRepositoryId`|`WideString`|Glue metrics repository identifier|
|`Metadata`|`PSafeArray`|Optional array of [GlueContextValue](#type-gluecontextvalue)'s providing additional information about the instance|

## <a id="type-glueinvocationresult"></a> __GlueInvocationResult__ type

### Properties  

| Name | Type | Description |
|------|------|-------------|
|`Method`|[GlueMethod](#type-gluemethod)|Information about the Glue interop method returning the result|
|`Result`|[GlueResult](#type-glueresult)|The result returned by the method| 

## <a id="type-gluemethod"></a> __GlueMethod__ type

### Properties  

| Name | Type | Description |
|------|------|-------------|
|`Name`|`WideString`|Method name|
|`Input`|`WideString`|Input signature|
|`Output`|`WideString`|Output signature|
|`Instance`|[GlueInstance](#type-glueinstance)|Information about the Glue application instance that registered the method|
|`RegistrationCookie`|`WideString`|Method registration cookie|
|`Flags`|[GlueMethodFlags](#enum-gluemethodflags)|Method flags|
|`ObjectTypes`|`PSafeArray`|Optional array of `WideString`'s providing additional information about the method|

## <a id="type-glueresult"></a> __GlueResult__ type

### Properties  

| Name | Type | Description |
|------|------|-------------|
|`Values`|`PSafeArray`|An array of [GlueContextValue](#type-gluecontextvalue)'s representing the result value.|
|`Status`|[GlueMethodInvocationStatus](#enum-gluemethodinvocationstatus)|Status of the method invocation|
|`Message`|`WideString`|Message related to the method invocation status|
|`LogDetails`|`WideString`|Log details related to the result|

## <a id="type-gluevalue"></a> __GlueValue__ type

This type represents an elementary or compisite value.

### Properties  

| Name | Type | Description |
|------|------|-------------|
|`GlueType`|[GlueValueType](#enum-gluevaluetype)|Type of the Glue value.|
|`IsArray`|`WordBool`|Indicates if the value is an array.|

The following properties will be initialized according to `GlueType` and `IsArray`:

| Name | Type | Description |
|------|------|-------------|
|`BoolValue`|`WordBool`|The boolean value.|
|`LongValue`|`Int64`|The integer value.|
|`DoubleValue`|`Double`|The double-precision floating-point value.|
|`StringValue`|`WideString`|The string value.|
|`BoolArray`|`PSafeArray`|Array of `WordBool`'s.|
|`LongArray`|`PSafeArray`|Array of `Int64`'s.|
|`DoubleArray`|`PSafeArray`|Array of `Double`'s.|
|`StringArray`|`PSafeArray`|Array of `WideString`'s.|
|`Tuple`|`PSafeArray`|Array of [GlueValue](#type-gluevalue)'s.|
|`CompositeValue`|`PSafeArray`|Array of [GlueContextValue](#type-gluecontextvalue)'s.|

# Enums

## <a id="enum-glueinstanceidentity"></a> __GlueInstanceIdentity__ enum

|Name|Value|Hex|Binary|
|----|:---:|:-:|:----:|
|`GlueInstanceIdentity_None`|0|00|00000000|
|`GlueInstanceIdentity_MachineName`|1|01|00000001|
|`GlueInstanceIdentity_ApplicationName`|2|02|00000010|
|`GlueInstanceIdentity_UserName`|4|04|00000100|
|`GlueInstanceIdentity_Instance`|7|07|00000111|
|`GlueInstanceIdentity_Environment`|8|08|00001000|
|`GlueInstanceIdentity_Region`|16|10|00010000|
|`GlueInstanceIdentity_LocalizedInstance`|31|1F|00011111|
|`GlueInstanceIdentity_ServiceName`|32|20|00100000|
|`GlueInstanceIdentity_Full`|63|3F|00111111|
|`GlueInstanceIdentity_Pid`|64|40|01000000|
|`GlueInstanceIdentity_InstanceId`|128|80|10000000|

## <a id="enum-gluemethodflags"></a> __GlueMethodFlags__ enum

|Name|Value|Hex|Binary|
|----|:---:|:-:|:----:|
|`GlueMethodFlags_None`|0|00|00000000|
|`GlueMethodFlags_ReturnsResult`|1|01|00000001|
|`GlueMethodFlags_IsGuiOperation`|2|02|00000010|
|`GlueMethodFlags_IsUserSpecific`|4|04|00000100|
|`GlueMethodFlags_IsMachineSpecific`|8|08|00001000|
|`GlueMethodFlags_OutsideDomain`|16|10|00010000|
|`GlueMethodFlags_SupportsStreaming`|32|20|00100000|

## <a id="enum-gluemethodinvocationstatus"></a> __GlueMethodInvocationStatus__ enum

|Name|Value|
|----|:--:|
|`GlueMethodInvocationStatus_Succeeded`|0|
|`GlueMethodInvocationStatus_Failed`|1|
|`GlueMethodInvocationStatus_TimedOut`|2|
|`GlueMethodInvocationStatus_NotAvailable`|3|
|`GlueMethodInvocationStatus_Started`|4|

## <a id="enum-gluestate"></a> __GlueState__ enum

|Name|Value|
|----|:--:|
|`GlueState_Unknown`|0|
|`GlueState_Pending`|1|
|`GlueState_Connected`|2|
|`GlueState_Disconnected`|3|
|`GlueState_Inactive`|4|

## <a id="enum-gluestreamstate"></a> __GlueStreamState__ enum

|Name|Value|
|----|:--:|
|`GlueStreamState_Pending`|0|
|`GlueStreamState_Stale`|1|
|`GlueStreamState_Opened`|2|
|`GlueStreamState_Closed`|3|
|`GlueStreamState_SubscriptionRejected`|4|
|`GlueStreamState_SubscriptionFailed`|5|

## <a id="enum-gluevaluetype"></a> __GlueValueType__ enum

|Name|Value|
|----|:--:|
|`GlueValueType_Bool`|0|
|`GlueValueType_Int`|1|
|`GlueValueType_Double`|2|
|`GlueValueType_Long`|3|
|`GlueValueType_String`|4|
|`GlueValueType_DateTime`|5|
|`GlueValueType_Tuple`|6|
|`GlueValueType_Composite`|7|

# Interfaces
## <a id="iface-iappannouncer"></a> __IAppAnnouncer__ interface

An instance of this is passed to the implementation of [IAppFactory](#iface-iappfactory).[CreateApp](#iface-iappfactory-createapp).  

### Methods

#### <a id="iface-iappannouncer-announceappcreationfailure"></a> AnnounceAppCreationFailure
Inform Glue that a new child application instance could not be created.  

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`error`|`WideString`|Text passed back to Glue as error message|

Return value: None  

#### <a id="iface-iappannouncer-registerappinstance"></a> RegisterAppInstance
Register a new child application instance with Glue.  

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`hwnd`|`Integer`|Handle to the window representing the Glue application instance|
|`glueApp`|[IGlueApp](#iface-iglueapp)|Object of class implementing the `IGlueApp` interface|

Return value: [IGlueWindow](#iface-igluewindow)  


## <a id="iface-iappfactory"></a> __IAppFactory__ interface
Implementing this interface allows an object to act as a child application factory.  
See also:  
* [IAppFactoryRegistry](#iface-iappfactoryregistry).[RegisterAppFactory](#iface-iappfactoryregistry-registerappfactory)

### Methods

#### <a id="iface-iappfactory-createapp"></a> CreateApp
This callback method is invoked when a new child application instance is to be created

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`appDefName`|`WideString`|Name under which the child application was registered|
|`state`|[GlueValue](#type-gluevalue)|Saved application state|
|`announcer`|[IAppAnnouncer](#iface-iappannouncer)|Announcer object, used to announce to Glue successfull application creation or failure|

Return value: `HResult`  
The implementation needs to return `S_OK`.  


## <a id="iface-iappfactoryregistry"></a> __IAppFactoryRegistry__ interface

### Methods

#### <a id="iface-iappfactoryregistry-registerappfactory"></a> RegisterAppFactory
Register an app factory as a creator of a child application with the provided definition.  

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`appDefinition`|[GlueAppDefinition](#type-glueappdefinition)|Defition of the app to register|
|`factory`|[IAppFactory](#iface-iappfactory)|Object of class implementing the `IAppFactory` interface|

Return value: None  


#### <a id="iface-iappfactoryregistry-registerappinstance"></a> RegisterAppInstance
Register an application instance with Glue.  

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`appDefName`|`WideString`|Application name|
|`glueWindow`|[IGlueWindow](#iface-igluewindow)|A registered Glue window|
|`glueApp`|[IGlueApp](#iface-iglueapp)|Object of class implementing the `IGlueApp` interface|

Return value: None

## <a id="iface-iglue42"></a> __IGlue42__ interface

You need to create a single object of this class in order to access __Glue__ functionality.

### <a id="iface-iglue42-properties"></a> Properties  


| Name | Type | Description |
|------|------|-------------|
|AppFactoryRegistry|[IAppFactoryRegistry](#iface-iappfactoryregistry)||


### Methods

#### <a id="iface-iglue42-buildandinvoke"></a> BuildAndInvoke
Invoke a Glue interop method of a single target or multiple targets.  

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`Method`|`WideString`|Name of the method to invoke|
|`builderCallback`|[IGlueContextBuilderCallback](#iface-igluecontextbuildercallback)|Object of class implementing the `IGlueContextBuilderCallback` interface. This can be used to build the method invocation arguments|
|`targets`|`PSafeArray`|Optional: allows filtering the invocation targets. If provided, this must be an array of [GlueInstance](#type-glueinstance)'s|
|`all`|`WordBool`|Indicates if the method should be invoked at all the matching targets that expose it, or only at the first one that matches.|
|`identity`|[GlueInstanceIdentity](#enum-glueinstanceidentity)|Specifies the identity properties to be matched when applying the `targets` filter|
|`resultHandler`|[IGlueInvocationResultHandler](#iface-iglueinvocationresulthandler)|Object of class implementing the `IGlueInvocationResultHandler` interface. This is used to handle the result(s) of the method invocation|
|`invocationTimeoutMsecs`|`Int64`|The method invocation will time out after the specified number of milliseconds. If the provided value is less than or equal to zero then a default timeout value will be used.|
|`correlationId`|`WideString`|Optional parameter which will be passed to the implementetion of [IGlueInvocationResultHandler](#iface-iglueinvocationresulthandler).[HandleResult](#iface-iglueinvocationresulthandler-handleresult)|

Return value: None  

#### <a id="iface-iglue42-buildgluecontextvalues"></a> BuildGlueContextValues
Create a `PSafeArray` of [GlueContextValue](#type-gluecontextvalue)'s using a callback method.  

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`contextBuilderCallback`|[IGlueContextBuilderCallback](#iface-igluecontextbuildercallback)|Object of class implementing the `IGlueContextBuilderCallback` interface|

Return value: `PSafeArray`  
An array of [GlueContextValue](#type-gluecontextvalue)'s.
The returned value needs to be destroyed with `SafeArrayDestroy` when no longer needed.  


#### <a id="iface-iglue42-getallinstances"></a> GetAllInstances

Get an array of all available Glue instances.  

Parameters: None  

Return value: `PSafeArray`  
An array of [GlueInstance](#type-glueinstance)'s.
The returned value needs to be destroyed with `SafeArrayDestroy` when no longer needed.  

#### <a id="iface-iglue42-getallmethods"></a> GetAllMethods

Get an array of available Glue interop methods of all available instances, including Streaming methods.  

Parameters: None  

Return value: `PSafeArray`  
An array of [GlueMethod](#type-gluemethod)'s.
The returned value needs to be destroyed with `SafeArrayDestroy` when no longer needed.  

#### <a id="iface-iglue42-getchannels"></a> GetChannels  

Get an array of the names of all available Glue channels.  

Parameters: None  

Return value: `PSafeArray`  
An array of `WideString`'s with the channel names.
The returned value needs to be destroyed with `SafeArrayDestroy` when no longer needed.  

#### <a id="iface-iglue42-getinstance"></a> GetInstance

Get the current Glue instance.  

Parameters: None  

Return value: [GlueInstance](#type-glueinstance)  
Contains information about the current Glue application instance.

#### <a id="iface-iglue42-getknowncontexts"></a> GetKnownContexts
Get an array of all available Glue contexts.  

Parameters: None  

Return value: `PSafeArray`  
An array of [GlueContext](#type-gluecontext)'s.
The returned value needs to be destroyed with `SafeArrayDestroy` when no longer needed.  

#### <a id="iface-iglue42-getmethodnamesfortarget"></a> GetMethodNamesForTarget
Get the method names exposed by applications.  

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`targetRegex`|`WideString`|Optional regular expression for filtering by application name. An empty string will match all application names.|

Return value: `PSafeArray`  
An array of `WideString`'s with the method names.
The returned value needs to be destroyed with `SafeArrayDestroy` when no longer needed.  

#### <a id="iface-iglue42-getmethodsforinstance"></a> GetMethodsForInstance

Get the methods exposed by matching application instance(s).  

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`Instance`|[GlueInstance](#type-glueinstance)|A Glue instance with one or more properties set to the values to match|
|`identity`|[GlueInstanceIdentity](#enum-glueinstanceidentity)| Specifies which of the properties set in the `Instance` parameter are to be matched|

Return value: `PSafeArray`  
An array of [GlueMethod](#type-gluemethod)'s.
The returned value needs to be destroyed with `SafeArrayDestroy` when no longer needed.  

#### <a id="iface-iglue42-gettargets"></a> GetTargets
Get the names of all active applications (targets) currently exposing interop methods.  

Parameters: None  

Return value: `PSafeArray`  
An array of `WideString`'s with the application names.
The returned value needs to be destroyed with `SafeArrayDestroy` when no longer needed.  

#### <a id="iface-iglue42-invokemethod"></a> InvokeMethod
Invoke a Glue interop method of a specific single target.

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`Method`|[GlueMethod](#type-gluemethod)|Information about the method to invoke|
|`invocationArgs`|`PSafeArray`|Method invocation arguments. This must be an array of [GlueContextValue](#type-gluecontextvalue)'s|
|`resultHandler`|[IGlueInvocationResultHandler](#iface-iglueinvocationresulthandler)|Object of class implementing the `IGlueInvocationResultHandler` interface. This is used to handle the result(s) of the method invocation|
|`invocationTimeoutMsecs`|`Int64`|The method invocation will time out after the specified number of milliseconds. If the provided value is less than or equal to zero then a default timeout value will be used.|
|`correlationId`|`WideString`|Optional parameter which will be passed to the implementetion of [IGlueInvocationResultHandler](#iface-iglueinvocationresulthandler).[HandleResult](#iface-iglueinvocationresulthandler-handleresult)|

Return value: None  

#### <a id="iface-iglue42-invokemethods"></a> InvokeMethods
Invoke a Glue interop method at a single or multiple targets.

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`Method`|`WideString`|Method name|
|`invocationArgs`|`PSafeArray`|Method invocation arguments. This must be an array of [GlueContextValue](#type-gluecontextvalue)'s|
|`targets`|`PSafeArray`|Optional: allows filtering the invocation targets. If provided, this must be an array of [GlueInstance](#type-glueinstance)'s|
|`all`|`WordBool`|Indicates if the method should be invoked at all the matching targets that expose it, or only at the first one that matches.|
|`identity`|[GlueInstanceIdentity](#enum-glueinstanceidentity)|Specifies the identity properties to be matched when applying the `targets` filter|
|`resultHandler`|[IGlueInvocationResultHandler](#iface-iglueinvocationresulthandler)|Object of class implementing the `IGlueInvocationResultHandler` interface. This is used to handle the result(s) of the method invocation|
|`invocationTimeoutMsecs`|`Int64`|The method invocation will time out after the specified number of milliseconds.  If the provided value is less than or equal to zero then a default timeout value will be used.|
|`correlationId`|`WideString`|Optional parameter which will be passed to the implementetion of [IGlueInvocationResultHandler](#iface-iglueinvocationresulthandler).[HandleResult](#iface-iglueinvocationresulthandler-handleresult)|


Return value: None  

#### <a id="iface-iglue42-invokesync"></a> InvokeSync
Invoke a Glue interop method synchronously.  

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`methodName`|`WideString`|Name of the method to invoke|
|`argsAsJson`|`WideString`|Arguments to pass to the method, in JSON format|
|`resultFieldPath`|`WideString`|Optional field path. If provided, the return value will be the value of the specified field within the whole result structure.|
|`targetRegex`|`WideString`|Optional regular expression for filtering targets by application name. If provided, the method will be invoked at all targets with application name matching the regular expression. If not provided, the method will be invoked at a single target.|

Return value: `WideString`  
The string represents the Return value(s) from the method invocation, in JSON format.  

#### <a id="iface-iglue42-jsontovariant"></a> JsonToVariant
Convert a JSON string into a variant array.  

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`json`|`WideString`|The JSON string to convert|

Return value: `PSafeArray`  
An array of variants.
The returned value needs to be destroyed with `SafeArrayDestroy` when no longer needed.  


#### <a id="iface-iglue42-log"></a> Log
Output a message to the Glue log.  

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`level`|`Byte`|Log level. The following values are accepted:<br> 0 = Trace<br>1 = Debug<br>2 = Info<br>3 = Warn<br>4 = Error<br>5 = Fatal|
|`Message`|`WideString`|The message text to log|

Return value: None  

#### <a id="iface-iglue42-overrideconfiguration"></a> OverrideConfiguration
Override the default Glue configuration.  
This method needs to be invoked before invoking the [Start](#iface-iglue42-start) method, otherwise it will have no effect.  

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`configuration`|[GlueConfiguration](#type-glueconfiguration)|The configuration to use|

Return value: None

#### <a id="iface-iglue42-registergluewindow"></a> RegisterGlueWindow
Initiate the registration of a window as a Glue window and set the related event handler.  

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`hwnd`|Integer|Handle of the window to register.|
|`windowEventHandler`|`IGlueWindowEventHandler`|An object of class implementing the [IGlueWindowEventHandler](#iface-igluewindoweventhandler) interface.|

Return value: [IGlueWindow](#iface-igluewindow)  
An object representing the registered Glue window.
> Note: The returned value should not be used to interact with the Glue window until the [HandleWindowReady](#iface-igluewindoweventhandler-handlewindowready) callback method is invoked (i.e. the registration is complete). 


#### <a id="iface-iglue42-registergluewindowwithsettings"></a> RegisterGlueWindowWithSettings
Initiate the registration of a window as a Glue window with specific settings and set the related event handler.  

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`hwnd`|Integer|Handle of the window to register.|
|`settings`|[IGlueWindowSettings](#iface-igluewindowsettings)|An object of `IGlueWindowSettings` containing the settings to use during the window registration.|
|`windowEventHandler`|`IGlueWindowEventHandler`|An object of class implementing the [IGlueWindowEventHandler](#iface-igluewindoweventhandler) interface.|

Return value: [GlueWindow](#vba-class-gluewindow)
> Note: The returned value should not be used to interact with the Glue window until the [HandleWindowReady](#iface-igluewindoweventhandler-handlewindowready) callback method is invoked (i.e. the registration is complete). 



#### <a id="iface-iglue42-registermethod"></a> RegisterMethod
Register a Glue method (invocation endpoint).  

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`methodName`|`WideString`|Method name to register|
|`requestHandler`|`IGlueRequestHandler`|An object of class implementing the [IGlueRequestHandler](#iface-igluerequesthandler) interface|
|`Input`|`WideString`|Optional input signature|
|`Output`|`WideString`|Optional output signature|
|`ObjectTypes`|`PSafeArray`|Optional array of `WideString`'s providing additional information about the method|

Return value: [GlueMethod](#type-gluemethod)  
An object describing the registered Glue method.  
The Return value can be used to unregister the method using [UnregisterMethod](#iface-iglue42-unregistermethod).  


#### <a id="iface-iglue42-registerstartupgluewindow"></a> RegisterStartupGlueWindow
Initiate the registration of a window as a Glue window and set the related event handler. Use/load the default startup options, if any.  

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`hwnd`|Integer|Handle of the window to register.|
|`windowEventHandler`|`IGlueWindowEventHandler`|An object of class implementing the [IGlueWindowEventHandler](#iface-igluewindoweventhandler) interface.|

Return value: [IGlueWindow](#iface-igluewindow)  
An object representing the registered Glue window.
> Note: The returned value should not be used to interact with the Glue window until the [HandleWindowReady](#iface-igluewindoweventhandler-handlewindowready) callback method is invoked (i.e. the registration is complete). 


#### <a id="iface-iglue42-registerstartupgluewindowwithsettings"></a> RegisterStartupGlueWindowWithSettings
Initiate the registration of a window as a Glue window with specific settings and set the related event handler.  Use/load the default startup options, if any.

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`hwnd`|Integer|Handle of the window to register.|
|`settings`|[IGlueWindowSettings](#iface-igluewindowsettings)|An object of `IGlueWindowSettings` containing the settings to use during the window registration.|
|`windowEventHandler`|`IGlueWindowEventHandler`|An object of class implementing the [IGlueWindowEventHandler](#iface-igluewindoweventhandler) interface.|

Return value: [GlueWindow](#vba-class-gluewindow)
> Note: The returned value should not be used to interact with the Glue window until the [HandleWindowReady](#iface-igluewindoweventhandler-handlewindowready) callback method is invoked (i.e. the registration is complete). 



#### <a id="iface-iglue42-registerstream"></a> RegisterStream
Register a Glue stream (streaming method), setting the related subscribtiob handler.  

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`streamName`|`WideString`|Name of the stream to register|
|`subscriptionHandler`|[IGlueSubscriptionHandler](#iface-igluesubscriptionhandler)|An object of class implementing the `IGlueSubscriptionHandler` interface. This is used to handle incoming subscription requests.|
|`Input`|`WideString`|Optional input signature|
|`Output`|`WideString`|Optional output signature|
|`ObjectTypes`|`PSafeArray`|Optional array of `WideString`'s providing additional information about the method|
|`out stream`|[IGlueStream](#iface-igluestream)|Output parameter. An object representing the newly created stream|

Return value: [GlueMethod](#type-gluemethod)  
An object describing the registered Glue streaming method.  
The Return value can be used to unregister the streaming method using [UnregisterMethod](#iface-iglue42-unregistermethod).  

#### <a id="iface-iglue42-setchanneldata"></a> SetChannelData
Set the value of a field (member) in an existing Glue channel.  

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`channel`|`WideString`|The channel name.|
|`fieldPath`|`WideString`|Path to the field in javascript notation, e.g. `'data.objectL1.objectL2.field01'`|
|`data`|`WideString`|A string representing the value to set|

Return value: None  

Notes:
* If any of the intermediate objects specified in `fieldPath` (e.g. `objectL1`) or the field itself (e.g. `field01`) do not exist in the JSON tree, they will be automatically created.
* If any of the intermediate objects specified in `fieldPath` already exist in the JSON tree but are not objects, the call will fail.
* If the field specified `fieldPath` (e.g. `field01`) already exists in the JSON tree, its value will be replaced. This will work also when the existing `field01` is an object.


#### <a id="iface-iglue42-SetLogConfigurationPath"></a> SetLogConfigurationPath
Set (override) the Glue logging confgiguration path.
This method needs to be invoked before invoking the [Start](#iface-iglue42-start) method, otherwise it will have no effect.  

See Also:  
* [IGlue42](#iface-iglue42).[OverrideConfiguration](#iface-iglue42-overrideconfiguration)  

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`logConfigPath`|`WideString`|Path to the Glue logging configuration.|

Return value: None  

#### <a id="iface-iglue42-start"></a> Start
Connect to the Glue gateway and announce the application instance.
Connection to the Glue gateway is necessary for using any Glue42 functionality.  

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`Instance`|[GlueInstance](#type-glueinstance)|Describes the identity to use when announcing the Glue application instance|

Return value: None  

#### <a id="iface-iglue42-startwithappname"></a> StartWithAppName
Connect to the Glue gateway and announce the application instance.
Connection to the Glue gateway is necessary for using any Glue42 functionality.  

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`ApplicationName`|`WideString`|The application name to use when announcing the Glue application instance|

Return value: None  

Notes:  
* Invoking this method is equivalent to invoking the [Start](#iface-iglue42-start) method with only the `ApplicationName` property of the `Instance` parameter initialized;


#### <a id="iface-iglue42-start"></a> Stop
Disconnect from the Glue gateway, shutting down all communication.

Parameters: None  

Return value: None  

#### <a id="iface-iglue42-subscribe"></a> Subscribe
Subscribe an object of class implementing the [IGlueEvents](#iface-iglueevents) interface for receiving various notifications from Glue.  

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`handler`|[IGlueEvents](#iface-iglueevents)|Object of class implementing the `IGlueEvents` interface|

Return value: None  

#### <a id="iface-iglue42-subscribegluecontext"></a> SubscribeGlueContext
Subscribe to a Glue context.  

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`contextName`|`WideString`|Name of the context. If the context does not exist it will be automatically created.|
|`handler`|[IGlueContextHandler](#iface-igluecontexthandler)|Object of class implementing the `IGlueContextHandler` interface|

Return value: None  


#### <a id="iface-iglue42-subscribestream"></a> SubscribeStream
Subscribe to a Glue stream (send a subscription request) of a specific Glue application instance and set the related stream event handler.  

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`stream`|[GlueMethod](#type-gluemethod)|Description of the Glue streaming method to subscribe to. The properties `stream.Name` and `stream.Instance.InstanceId` must be initialized with the stream name and instance id of the Glue application publishing the stream respectively.|
|`subscriptionRequestArgs`|`PSafeArray`|An array of [GlueContextValue](#type-gluecontextvalue)'s. representing the arguments to pass with the subscription request.|
|`streamHandler`|[IGlueStreamHandler](#iface-igluestreamhandler)|Object of class implementing the `IGlueStreamHandler` interface which will receive the stream event notifications.|
|`subscriptionTimeoutMsecs`|`Int64`|The subscription request will time out after the specified number of milliseconds. If the provided value is less than or equal to zero then a default timeout value will be used.|

Return value: None  

#### <a id="iface-iglue42-subscribestreams"></a> SubscribeStreams
Subscribe to a Glue stream or streams registered by one or more Glue applications and set the related stream event handler.  

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`streamName`|`WideString`|Name of the Glue stream to subscribe to.|
|`subscriptionRequestArgs`|`PSafeArray`|An array of [GlueContextValue](#type-gluecontextvalue)'s. representing the arguments to pass with the subscription request(s).|
|`targets`|`PSafeArray`|Optional: allows filtering the subscription targets. If provided, this must be an array of [GlueInstance](#type-glueinstance)'s|
|`all`|`WordBool`|Indicates if the subscription request should be sent to all the matching targets, or only to the first one that matches.|
|`identity`|[GlueInstanceIdentity](#enum-glueinstanceidentity)|Specifies the identity properties to be matched when applying the `targets` filter|
|`streamHandler`|[IGlueStreamHandler](#iface-igluestreamhandler)|Object of class implementing the `IGlueStreamHandler` interface which will receive the stream event notifications.|
|`invocationTimeoutMsecs`|`Int64`|The subscription request(s) will time out after the specified number of milliseconds. If the provided value is less than or equal to zero then a default timeout value will be used.|

Return value: None  

#### <a id="iface-iglue42-subscribestreamsfiltertargets"></a> SubscribeStreamsFilterTargets
Subscribe to a Glue stream or streams registered by one or more Glue applications and set the related stream event handler. Subscription targets can be filtered by name.

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`streamName`|`WideString`|Name of the Glue stream to subscribe to.|
|`subscriptionRequestArgs`|`PSafeArray`|An array of [GlueContextValue](#type-gluecontextvalue)'s. representing the arguments to pass with the subscription request(s).|
|`targetRegex`|`WideString`|Optional regular expression for filtering targets by application name. An empty string will match all application names.|
|`all`|`WordBool`|Indicates if the subscription request should be sent to all the matching targets, or only to the first one that matches.|
|`streamHandler`|[IGlueStreamHandler](#iface-igluestreamhandler)|Object of class implementing the `IGlueStreamHandler` interface which will receive the stream event notifications.|
|`invocationTimeoutMsecs`|`Int64`|The subscription request(s) will time out after the specified number of milliseconds. If the provided value is less than or equal to zero then a default timeout value will be used.|

Return value: None 

#### <a id="iface-iglue42-unregistermethod"></a> UnregisterMethod
Unregister a Glue method (invocation endpoint).  

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`Method`|[GlueMethod](#type-gluemethod)|Description of the method to unregister. This must be the value returned by [RegisterMethod](#iface-iglue42-registermethod) or [RegisterStream](#iface-iglue42-registerstream).|

Return value: None  

#### <a id="iface-iglue42-unsubscribe"></a> Unsubscribe
Cancel a subscription created with the [Subscribe](#iface-iglue42-subscribe) method.  

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`handler`|[IGlueEvents](#iface-iglueevents)|Object of class implementing the `IGlueEvents` interface. This must be the same object previously passed to the `Subscribe` method|

Return value: None  

#### <a id="iface-iglue42-othermethods"></a> Other Methods
The following methods of IGlue42 exposed in the COM library are not intended to be used in Delphi:


* AddCorrelationInterest
* CloseResource
* CreateGlueData
* CreateGlueValues
* CreateMethodInvocator
* CreateServerMethod
* CreateServerStream
* CreateStreamConsumer
* G4O_XL_OpenSheet
* GetGlueContext
* InvokeAsync
* InvokeVariantData
* RegisterGlueWindowInSink
* RegisterMethodInSink
* RegisterSingleBranchStream
* RegisterStreamInSink
* RegisterVariantMethodInSink
* RegisterVoidMethodInSink
* SubscribeChannel
* SubscribeStreamInSink
* TranslateVbObject
* YieldCallbackData
* YieldCallbackVariantData



## <a id="iface-iglueapp"></a> __IGlueApp__ interface
Implementing this interface allows an object to be registered as a Glue application instance.  
See also:  
* [IAppAnnouncer](#iface-iappannouncer).[RegisterAppInstance](#iface-iappannouncer-registerappinstance)
* [IAppFactoryRegistry](#iface-iappfactoryregistry).[RegisterAppInstance](#iface-iappfactoryregistry-registerappinstance)

### Methods

#### <a id="iface-iglueapp-initialize"></a> Initialize

This callback method is invoked when the child application is being initialized.  

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`state`|[GlueValue](#type-gluevalue)|A previously saved application state|
|`glueWindow`|[IGlueWindow](#iface-igluewindow)|The registered Glue window for the application|

Return value: `HResult`  
The implementation needs to return `S_OK`.  

#### <a id="iface-iglueapp-savestate"></a> SaveState

This callback method is invoked when Glue needs to save the application state.  

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`out pRetVal`|[GlueValue](#type-gluevalue)|Output parameter. The implementation may initialize `pRetVal` with the application state to be saved|

Return value: `HResult`  
The implementation needs to return `S_OK`.  

#### <a id="iface-iglueapp-shutdown"></a> Shutdown

This callback method is invoked when Glue is shutting down.

Parameters: None  

Return value: `HResult`  
The implementation needs to return `S_OK`.  

## <a id="iface-igluecontext"></a> __IGlueContext__ interface

### Methods

#### <a id="iface-igluecontext-buildandsetcontextdata"></a> BuildAndSetContextData

Set new (replace) context data using a callback method.  

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`builderCallback`|[IGlueContextBuilderCallback](#iface-igluecontextbuildercallback)|Object of class implementing the `IGlueContextBuilderCallback` interface|

Return value: None  

#### <a id="iface-igluecontext-buildandupdatecontextdata"></a> BuildAndUpdateContextData

Update context data using a callback method.  

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`builderCallback`|[IGlueContextBuilderCallback](#iface-igluecontextbuildercallback)|Object of class implementing the `IGlueContextBuilderCallback` interface|

Return value: None

#### <a id="iface-igluecontext-close"></a> Close

Unsubscribe from the associated Glue context.

Parameters: None  

Return value: None  

#### <a id="iface-igluecontext-getcontextinfo"></a> GetContextInfo

Get information about the context.  

Parameters: None  

Return value: [GlueContext](#type-gluecontext)  

#### <a id="iface-igluecontext-getdata"></a> GetData

Get context data.  

Parameters: None  

Return value: `PSafeArray`  
An array of [GlueContextValue](#type-gluecontextvalue)'s.
The returned value needs to be destroyed with `SafeArrayDestroy` when no longer needed.  


#### <a id="iface-igluecontext-getreflectdata"></a> GetReflectData

The method `GetReflectData` is not intended to be used in Delphi.

#### <a id="iface-igluecontext-open"></a> Open

The method `Open` is not intended to be used in Delphi.


#### <a id="iface-igluecontext-setcontextdata"></a> SetContextData

Set new (replace) context data.

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`data`|`PSafeArray`|An array of [GlueContextValue](#type-gluecontextvalue)'s representing the new context data.|

Return value: None  

#### <a id="iface-igluecontext-setvalue"></a> SetValue

The method `SetValue` is not intended to be used in Delphi.


#### <a id="iface-igluecontext-updatecontextdata"></a> UpdateContextData

Update context data.

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`data`|`PSafeArray`|An array of [GlueContextValue](#type-gluecontextvalue)'s representing the new context data.|

Return value: None  


## <a id="iface-igluecontextbuilder"></a> __IGlueContextBuilder__ interface

An instance of this is passed as a parameter to the implementation of [IGlueContextBuilderCallback](#iface-igluecontextbuildercallback).[Build](#iface-igluecontextbuildercallback-build).  

### Methods

#### <a id="iface-igluecontextbuilder-addbool"></a> AddBool

Add a boolean value to the context data.

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`Name`|`WideString`|Name associated with the context value|
|`Value`|`WordBool`|The value to add|

Return value: None  

#### <a id="iface-igluecontextbuilder-addboolarray"></a> AddBoolArray

Add an array of boolean values to the context data.

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`Name`|`WideString`|Name associated with the context value|
|`Value`|`PSafeArray`|An array of `WordBool` values|

Return value: None  

#### <a id="iface-igluecontextbuilder-addcomposite"></a> AddComposite

Add a composite value to the context data.  

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`Name`|`WideString`|Name associated with the context value|
|`composite`|`PSafeArray`|The composite value as a `PSafeArray`|
|`IsArray`|`WordBool`|Indicates if the composite value is an array|

Return value: None  

#### <a id="iface-igluecontextbuilder-addcontextvalue"></a> AddContextValue

Add a value represented as `GlueContextValue` to the context data.  

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`GlueContextValue`|[GlueContextValue](#type-gluecontextvalue)|The `GlueContextValue` to add|

Return value: None  

#### <a id="iface-igluecontextbuilder-adddatetime"></a> AddDatetime

Add a datetime value to the context data.  

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`Name`|`WideString`|Name associated with the context value|
|`Value`|`Int64`|An integer representation of Glue time. This is defined as the number of milliseconds since the Unix epoch i.e. 1970-01-01 00:00:00 UTC|

Return value: None  


#### <a id="iface-igluecontextbuilder-adddatetimearray"></a> AddDatetimeArray

Add an array of datetime values to the context data.  

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`Name`|`WideString`|Name associated with the context value|
|`Value`|`PSafeArray`|An array of `Int64` values representing Glue time|

Return value: None  

#### <a id="iface-igluecontextbuilder-adddouble"></a> AddDouble

Add a double-precision floating-point value to the context data.

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`Name`|`WideString`|Name associated with the context value|
|`Value`|`Double`|The value to add|

Return value: None  

#### <a id="iface-igluecontextbuilder-adddoublearray"></a> AddDoubleArray

Add an array of double-precision floating-point values to the context data.  

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`Name`|`WideString`|Name associated with the context value|
|`Value`|`PSafeArray`|An array of `Double` values|

Return value: None  

#### <a id="iface-igluecontextbuilder-addgluevalue"></a> AddGlueValue

Add a value represented as `GlueValue` to the context data.  

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`Name`|`WideString`|Name associated with the context value|
|`Value`|[GlueValue](#type-gluevalue)|The value to add|

Return value: None  

#### <a id="iface-igluecontextbuilder-addint"></a> AddInt

Add an integer value to the context data.  

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`Name`|`WideString`|Name associated with the context value|
|`Value`|`Integer`|The value to add|

Return value: None  

#### <a id="iface-igluecontextbuilder-addintarray"></a> AddIntArray

Add an array of integer values to the context data.  

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`Name`|`WideString`|Name associated with the context value|
|`Value`|`PSafeArray`|An array of `Integer` values|

Return value: None  

#### <a id="iface-igluecontextbuilder-addlong"></a> AddLong

Add a long integer value to the context data.  

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`Name`|`WideString`|Name associated with the context value|
|`Value`|`Int64`|The value to add|

Return value: None  

#### <a id="iface-igluecontextbuilder-addlongarray"></a> AddLongArray

Add an array of long integer values to the context data.  

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`Name`|`WideString`|Name associated with the context value|
|`Value`|`PSafeArray`|An array of `Int64` values|

Return value: None  


#### <a id="iface-igluecontextbuilder-addstring"></a> AddString

Add a string value to the context data.  

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`Name`|`WideString`|Name associated with the context value|
|`Value`|`WideString`|The value to add|

Return value: None  

#### <a id="iface-igluecontextbuilder-addstringarray"></a> AddStringArray

Add an array of string values to the context data.  

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`Name`|`WideString`|Name associated with the context value|
|`Value`|`PSafeArray`|An array of `WideString` values|

Return value: None  

#### <a id="iface-igluecontextbuilder-addtuple"></a> AddTuple

Add a tuple of values to the context data.  

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`Name`|`WideString`|Name associated with the context value|
|`Tuple`|`PSafeArray`|Array of [GlueValue](#type-gluevalue)'s.|

Return value: None  

#### <a id="iface-igluecontextbuilder-addtuplevalue"></a> AddTupleValue

Add a tuple of values represented as `GlueValue` to the context data.

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`Name`|`WideString`|Name associated with the context value|
|`Value`|[GlueValue](#type-gluevalue)|The value representing the tuple|

Return value: None  

#### <a id="iface-igluecontextbuilder-buildcomposite"></a> BuildComposite

Build a value using a callback method and add it to the context data.

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`Name`|`WideString`|Name associated with the context value|
|`callback`|[IGlueContextBuilderCallback](#iface-igluecontextbuildercallback)|Object of class implementing the `IGlueContextBuilderCallback` interface|
|`IsArray`|`WordBool`|Indicates if the value is an array|

Return value: None

#### <a id="iface-igluecontextbuilder-buildtuple"></a> BuildTuple

Build a tuple value using a callback method and add it to the context data.  

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`Name`|`WideString`|Name associated with the context value|
|`callback`|[IGlueContextBuilderCallback](#iface-igluecontextbuildercallback)|Object of class implementing the `IGlueContextBuilderCallback` interface|

Return value: None  

#### <a id="iface-igluecontextbuilder-clear"></a> Clear

Clear all context data.  

Parameters: None  

Return value: None  

## <a id="iface-igluecontextbuildercallback"></a> __IGlueContextBuilderCallback__ interface

### Methods

#### <a id="iface-igluecontextbuildercallback-build"></a> Build

This callback method is invoked when context data needs to be built. This happens when a method requiring an `IGlueContextBuilderCallback` implementation is used (e.g. [BuildAndSetContextData](#iface-igluecontext-buildandsetcontextdata)).  

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`builder`|[IGlueContextBuilder](#iface-igluecontextbuilder)|An instance of `IGlueContextBuilder` which can be used to build the context data|

Return value: `HResult`  
The implementation needs to return `S_OK`.  

## <a id="iface-igluecontexthandler"></a> __IGlueContextHandler__ interface

Implementing this interface allows an object to receive notifications about changes in a Glue context.  
See also:
* [IGlue42](#iface-iglue42).[SubscribeGlueContext](#iface-iglue42-subscribegluecontext)

### Methods

#### <a id="iface-igluecontexthandler-handlecontext"></a> HandleContext

This callback method is invoked when a Glue context subscription is activated via [SubscribeGlueContext](#iface-iglue42-subscribegluecontext).  

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`context`|[IGlueContext](#iface-igluecontext)|This can be used to set/update context data.|

Return value: `HResult`  
The implementation needs to return `S_OK`.  

#### <a id="iface-igluecontexthandler-handlecontextupdate"></a> HandleContextUpdate

This callback method is invoked when the associated context has been updated.

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`contextUpdate`|[IGlueContextUpdate](#iface-igluecontextupdate)|This object can be used to obtain information about the Glue context update|

Return value: `HResult`  
The implementation needs to return `S_OK`.  

## <a id="iface-igluecontextupdate"></a> __IGlueContextUpdate__ interface

### Methods

#### <a id="iface-igluecontextupdate-getadded"></a> GetAdded

Get an array of values which have been added to the context.  

Parameters: None  

Return value: `PSafeArray`  
An array of [GlueContextValue](#type-gluecontextvalue)'s.
The returned value needs to be destroyed with `SafeArrayDestroy` when no longer needed.  

#### <a id="iface-igluecontextupdate-getremoved"></a> GetContext

Get the context which has been updated.  

Parameters: None  

Return value: [IGlueContext](#iface-igluecontext)  

#### <a id="iface-igluecontextupdate-getremoved"></a> GetRemoved

Get an array of the names of the properties which have been removed from the context.  

Parameters: None  

Return value: `PSafeArray`  
An array of `WideString`'s.
The returned value needs to be destroyed with `SafeArrayDestroy` when no longer needed.  

#### <a id="iface-igluecontextupdate-getremoved"></a> GetUpdated

Get an array of values which have been updated in the context.  

Parameters: None  

Return value: `PSafeArray`  
An array of [GlueContextValue](#type-gluecontextvalue)'s.
The returned value needs to be destroyed with `SafeArrayDestroy` when no longer needed.  

## <a id="iface-iglueevents"></a> __IGlueEvents__ interface
Implementing this interface allows an object to receive notifications about various Glue events.  

See also:  
* [IGlue42](#iface-iglue42).[Subsribe](#iface-iglue42-subscribe) 

### Methods

#### <a id="iface-iglueevents-handleconnectionstatus"></a> HandleConnectionStatus

This callback method is invoked when the Glue connection status has changed.  

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`state`|[GlueState](#enum-gluestate)|The new Glue connection state|
|`Message`|`WideString`|Message text related to the connection status change|
|`date`|`Int64`|Glue time when the connection status changed|

Return value: `HResult`  
The implementation needs to return `S_OK`.  

#### <a id="iface-iglueevents-handlegluecontext"></a> HandleGlueContext

This callback method is invoked when a new Glue context has been created.  

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`context`|[GlueContext](#type-gluecontext)|Information about the Glue context associated with the event|
|`created`|`WordBool`|Indicates whether the context is newly created|

Return value: `HResult`  
The implementation needs to return `S_OK`.  

#### <a id="iface-iglueevents-handleinstancestatus"></a> HandleInstanceStatus

This callback method is invoked when a Glue application instance appears or disappears.  

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`Instance`|[GlueInstance](#type-glueinstance)|Information about the Glue application instance associated with the event|
|`active`|`WordBool`|Indicates whether the application instance is now active|

Return value: `HResult`  
The implementation needs to return `S_OK`.  

#### <a id="iface-iglueevents-handlemethodstatus"></a> HandleMethodStatus

This callback method is invoked when a Glue interop method (invokation endpoint) has been registered or unregistered by an application instance.  

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`Method`|[GlueMethod](#type-gluemethod)|Information about the Glue interop method associated with the event|
|`active`|`WordBool`|Indicates whether the Glue interop method is now active|

Return value: `HResult`  
The implementation needs to return `S_OK`.  


#### <a id="iface-iglueevents-handleexception"></a> HandleException

This callback method is invoked when an exception is raised during Glue operation.  

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`ex`|`_Exception`|An `_Exception` object as defined in the `mscorlib` type library.|

Return value: `HResult`  
The implementation needs to return `S_OK`.  

## <a id="iface-iglueinvocationresulthandler"></a> __IGlueInvocationResultHandler__ interface
Implementing this interface allows an object to handle method invocation results.  
See also:  
* [IGlue42](#iface-iglue42).[BuildAndInvoke](#iface-iglue42-buildandinvoke)
* [IGlue42](#iface-iglue42).[InvokeMethod](#iface-iglue42-invokemethod)
* [IGlue42](#iface-iglue42).[InvokeMethods](#iface-iglue42-invokemethods)


### Methods

#### <a id="iface-iglueinvocationresulthandler-handleresult"></a> HandleResult

This callback method is invoked when a Glue interop method invocation has completed.  

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`invocationResult`|`PSafeArray`|An array of [GlueInvocationResult](#type-glueinvocationresult)'s|
|`correlationId`|`WideString`|Correlation Id passed when the method was invoked|

Return value: `HResult`  
The implementation needs to return `S_OK`.  

## <a id="iface-igluerequesthandler"></a> __IGlueRequestHandler__ interface

Implementing this interface allows an object to handle method invocation requests.  
See also:  
* [IGlue42](#iface-iglue42).[RegisterMethod](#iface-iglue42-registermethod)

### Methods

#### <a id="iface-igluerequesthandler-handleinvocationrequest"></a> HandleInvocationRequest

This callback method is invoked when a registered Glue method is invoked.  

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`Method`|[GlueMethod](#type-gluemethod)|Information about the Glue method being invoked|
|`caller`|[GlueInstance](#type-glueinstance)|Information about the Glue application instance that invoked the method|
|`requestValues`|`PSafeArray`|An array of [GlueContextValue](#type-gluecontextvalue)'s. representing the method invocation arguments|
|`resultCallback`|[IGlueServerMethodResultCallback](#iface-iglueservermethodresultcallback)|Object of class implementing the `IGlueServerMethodResultCallback` interface. This can be used to send the result of the method invocation to the caller application instance|

Return value: `HResult`  
The implementation needs to return `S_OK`.  

## <a id="iface-iglueservermethodresultcallback"></a> __IGlueServerMethodResultCallback__ interface

An instance of this is passed to the implementation of [IGlueRequestHandler](#iface-igluerequesthandler).[HandleInvocationRequest](#iface-igluerequesthandler-handleinvocationrequest)


### Methods

#### <a id="iface-iglueservermethodresultcallback-sendresult"></a> SendResult

Send the result of a method invocation to the caller application instance.  

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`Result`|[GlueResult](#type-glueresult)|The result to send back to the caller|

Return value: None  

## <a id="iface-iglueserversubscriptioncallback"></a> __IGlueServerSubscriptionCallback__ interface

An instance of this is passed to the implementation of [IGlueSubscriptionHandler](#iface-igluesubscriptionhandler).[HandleSubscriptionRequest](#iface-igluesubscriptionhandler-handlesubscriptionrequest)

### Methods

#### <a id="iface-iglueserversubscriptioncallback-accept"></a> Accept

Accept a Glue stream subscription request.  

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`branch`|`WideString`|Optional branch key (name) on which the subscriber will be registered. If the specified branch does not exist it will be created.|
|`Result`|[GlueResult](#type-glueresult)|Subscription result information to be sent back to the subscriber.|

Return value: [IGlueStreamBranch](#iface-igluestreambranch)  
An instance of `IGlueStreamBranch` representing the branch on which the subscriber was registered.  
If the `branch` parameter is emtpy, the default (unnamed) branch for the stream wil be returned.  

#### <a id="iface-iglueserversubscriptioncallback-reject"></a> Reject

Reject a Glue stream subscription request.  

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`Result`|[GlueResult](#type-glueresult)|Rejection information to be sent back to the application requesting subscription.|

Return value: None  

## <a id="iface-igluestream"></a> __IGlueStream__ interface

Represents a Glue streaming interop method.

### Methods

#### <a id="iface-igluestream-closebranch"></a> CloseBranch

Close a stream branch.  
This will disconnect (unsubscribe) all subscribers to the branch and remove the branch from the stream.  

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`branch`|`WideString`|Name of the branch to close|

Return value: None  

#### <a id="iface-igluestream-closestream"></a> CloseStream

Close a stream.  
This will disconnect (unsubscribe) all subscribers to the stream, on any branch. All branches will be removed from the stream.  

Parameters: None  

Return value: None  

#### <a id="iface-igluestream-getbranch"></a> GetBranch

Get an existing stream branch.  



| Name | Type | Description |
|------|------|-------------|
|`branchKey`|`WideString`|The key (name) of the branch to get|

Return value: [IGlueStreamBranch](#iface-igluestreambranch)  
This can be used to perform stream actions specific to the branch.  

#### <a id="iface-igluestream-getbranchkeys"></a> GetBranchKeys

Get the keys (names) of the available branches for the stream.  

Parameters: None  

Return value: `PSafeArray`  
An array of `WideString`'s with the names of the available branches.
The returned value needs to be destroyed with `SafeArrayDestroy` when no longer needed.  

#### <a id="iface-igluestream-push"></a> Push

Push data on a stream.  

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`data`|`PSafeArray`|An array of [GlueContextValue](#type-gluecontextvalue)'s representing the data to be pushed on the stream.|
|`branch`|`WideString`|Optional branch name on which to push the data. The branch must have been created previously. If not specified, the data will be broadcast to all subscribers.|

Return value: None  


## <a id="iface-igluestreambranch"></a> __IGlueStreamBranch__ interface

Represents a branch of a Glue streaming interop method.  

### Methods

#### <a id="iface-igluestreambranch-close"></a> Close

Close a stream branch.  
This will disconnect (unsubscribe) all subscribers to the branch and remove the branch from the stream.  

Parameters: None  

Return value: None  

#### <a id="iface-igluestreambranch-getkey"></a> GetKey

Get the key (name) of the branch.  

Parameters: None  

Return value: `WideString`
A string containing the key (name) of the branch.  

#### <a id="iface-igluestreambranch-getstream"></a> GetStream

Get the Glue stream which owns the branch.  

Parameters: None  

Return value: [IGlueStream](#iface-igluestream)  
An instance representing the Glue stream which owns the branch.  

#### <a id="iface-igluestreambranch-getsubscribers"></a> GetSubscribers

Get the subscribers to the stream branch.  

Parameters: None  

Return value: `PSafeArray`  
An array of [IGlueStreamSubscriber](#iface-igluestreamsubscriber)'s, representing all current subscribers to the branch stream.
The returned value needs to be destroyed with `SafeArrayDestroy` when no longer needed.  

#### <a id="iface-igluestreambranch-push"></a> Push

Push data on the stream branch.  

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`data`|`PSafeArray`|An array of [GlueContextValue](#type-gluecontextvalue)'s representing the data to be pushed to the stream branch.|

Return value: None  

## <a id="iface-igluestreamhandler"></a> __IGlueStreamHandler__ interface

Implementing this interface allows an object to receive notifications about Glue stream events.  
See also:
* [IGlue42](#iface-iglue42).[SubscribeStream](#iface-iglue42-subscribestream)
* [IGlue42](#iface-iglue42).[SubscribeStreams](#iface-iglue42-subscribestreams)


### Methods

#### <a id="iface-igluestreamhandler-handlestreamdata"></a> HandleStreamData

This callback method is invoked when data has been pushed (published) by the Glue streaming method to the subscriber.  

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`stream`|[GlueMethod](#type-gluemethod)|Information about the Glue streaming method that pushed the data.|
|`data`|`PSafeArray`|An array of [GlueContextValue](#type-gluecontextvalue)'s representing the data pushed by the streaming method.|

Return value: `HResult`  
The implementation needs to return `S_OK`.  

#### <a id="iface-igluestreamhandler-handlestreamstatus"></a> HandleStreamStatus

This callback method is invoked when the state of the Glue stream subscription has changed (e.g. accepted, rejected, closed, etc.)  

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`stream`|[GlueMethod](#type-gluemethod)|Information about the Glue streaming method related to the subscription.|
|`state`|[GlueStreamState](#enum-gluestreamstate)|The new state of the Glue stream subscription|
|`Message`|`WideString`|Message related to the subscription status change.|
|`dateTime`|`Int64`|Glue time when the subscription state changed.|

Return value: `HResult`  
The implementation needs to return `S_OK`.  

#### <a id="iface-igluestreamhandler-streamclosed"></a> StreamClosed

This callback method is invoked when the Glue stream associated with the subscription has been closed.  

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`stream`|[GlueMethod](#type-gluemethod)|Information about the Glue streaming method related to the subscription.|

Return value: `HResult`  
The implementation needs to return `S_OK`.  

#### <a id="iface-igluestreamhandler-subscriptionactivated"></a> SubscriptionActivated

This callback method is invoked when the subscription request has been dispatched to Glue.  

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`GlueStreamSubscription`|[IGlueStreamSubscription](#iface-igluestreamsubscription)|An instance of the stream subscription. This can later be used to close the subscription from the client side.|

Return value: `HResult`  
The implementation needs to return `S_OK`.  


## <a id="iface-igluestreamsubscriber"></a> __IGlueStreamSubscriber__ interface

### Methods

#### <a id="iface-igluestreamsubscriber-close"></a> Close

Disconnect (unsubscribe) the subscriber from the stream.  

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`data`|`PSafeArray`|An array of [GlueContextValue](#type-gluecontextvalue)'s. This parameter is currently ignored.|

Return value: None


#### <a id="iface-igluestreamsubscriber-getsubscriberinstance"></a> GetSubscriberInstance

Get the subscriber Glue application instance.  

Parameters: None  

Return value: [GlueInstance](#type-glueinstance)  
Description of the subscriber Glue application instance.  

#### <a id="iface-igluestreamsubscriber-push"></a> Push

Push data to the subscriber.

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`data`|`PSafeArray`|An array of [GlueContextValue](#type-gluecontextvalue)'s representing the data to be pushed to the subscriber.|

Return value: None  

## <a id="iface-igluestreamsubscription"></a> __IGlueStreamSubscription__ interface

### Methods

#### <a id="iface-igluestreamsubscription-close"></a> Close

Disconnect from the stream (cancel the subscription).  

Parameters: None  

Return value: None  

## <a id="iface-igluesubscriptionhandler"></a> __IGlueSubscriptionHandler__ interface

Implementing this interface allows an object to handle stream subscription events for a registered Glue stream.  
See also:  
* [IGlue42](#iface-iglue42).[RegisterStream](#iface-iglue42-registerstream)

### Methods

#### <a id="iface-igluesubscriptionhandler-handlesubscriber"></a> HandleSubscriber

This callback method is invoked when a new subscriber to the stream is accepted.  

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`subscriberInstance`|[GlueInstance](#type-glueinstance)|Description of the Glue application instance which subscribed to the stream|
|`glueStreamSubscriber`|[IGlueStreamSubscriber](#iface-igluestreamsubscriber)|An instance of `IGlueStreamSubscriber` representing the new subscriber|
|`requestValues`|`PSafeArray`|An array of [GlueContextValue](#type-gluecontextvalue)'s. representing the arguments passed with the subscription request|

Return value: `HResult`  
The implementation needs to return `S_OK`.  

#### <a id="iface-igluesubscriptionhandler-handlesubscriberlost"></a> HandleSubscriberLost

This callback method is invoked when a subscriber has unsubscribed from the stream.  
This also includes the cases where subscribers have been forcefully unsubscribed when `Close` was called for a subscriber, stream or stream branch.  

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`subscriberInstance`|[GlueInstance](#type-glueinstance)|Description of the Glue application instance which is no longer subscribed to the stream|
|`glueStreamSubscriber`|[IGlueStreamSubscriber](#iface-igluestreamsubscriber)|An instance of `IGlueStreamSubscriber` representing the subscriber lost.|

Return value: `HResult`  
The implementation needs to return `S_OK`.  


#### <a id="iface-igluesubscriptionhandler-handlesubscriptionrequest"></a> HandleSubscriptionRequest

This callback method is invoked when a Glue application instance requests to subscribe to the stream.  

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`stream`|[GlueMethod](#type-gluemethod)|Description of the Glue stream for which the subscription is requested.|
|`caller`|[GlueInstance](#type-glueinstance)|Description of the Glue application instance requesting to subscribe to the stream.|
|`requestValues`|`PSafeArray`|An array of [GlueContextValue](#type-gluecontextvalue)'s. representing the arguments passed with the subscription request.|
|`callback`|[IGlueServerSubscriptionCallback](#iface-iglueserversubscriptioncallback)|An instance of `IGlueServerSubscriptionCallback` which can be used to accept or reject the subscription request.|

Return value: `HResult`  
The implementation needs to return `S_OK`.  

## <a id="iface-igluewindow"></a> __IGlueWindow__ interface

### Methods

#### <a id="iface-igluewindow-getchannelsupport"></a> GetChannelSupport

Determine if the channel selector box is visible in the Glue window's title bar.  

Parameters: None  

Return value: `WordBool`  

#### <a id="iface-igluewindow-getid"></a> GetId

Obtain the Glue window identifier as a string.  

Parameters: None  
Return value: `WideString`  

#### <a id="iface-igluewindow-gettitle"></a> GetTitle

Get the Glue window title.

Parameters: None  

Return value: `WideString`  
    
#### <a id="iface-igluewindow-isvisible"></a> IsVisible

Determine if the Glue window is visible.  

Parameters: None  

Return value: `WordBool`  

#### <a id="iface-igluewindow-setchannelsupport"></a> SetChannelSupport

Hide or show the channel selector box in the Glue42 window title bar.  

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`showLink`|`WordBool`|Indicates whether the channel selector box is to be visible or not. Note that hiding or showing the channel selector box does not enable or disable channel support for the window - this can only be done during the window registration.|

Return value: None  

#### <a id="iface-igluewindow-settitle"></a> SetTitle

Set the Glue window title.  

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`title`|`WideString`|Text to set in the window title bar|

Return value: None  

#### <a id="iface-igluewindow-setvisible"></a> SetVisible

Makes the Glue window visible/invisible.  

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`visible`|`WordBool`|Indicates whether the window is to be visible.|

Return value: None  

#### <a id="iface-igluewindow-unregister"></a> Unregister

Unregister the Glue window.  

Parameters: None

Return value: None


## <a id="iface-igluewindoweventhandler"></a> __IGlueWindowEventHandler__ interface

Implementing this interface allows an object to receive channel change or update notifications for a registered Glue window.  
See also:  
* [IGlue42](#iface-iglue42).[RegisterGlueWindow](#iface-iglue42-registergluewindow)
* [IGlue42](#iface-iglue42).[RegisterGlueWindowWithSettings](#iface-iglue42-registergluewindowwithsettings)
* [IGlue42](#iface-iglue42).[RegisterStartupGlueWindow](#iface-iglue42-registerstartupgluewindow)
* [IGlue42](#iface-iglue42).[RegisterStartupGlueWindowWithSettings](#iface-iglue42-registerstartupgluewindowwithsettings)


### Methods

#### <a id="iface-igluewindoweventhandler-handlewindowready"></a> HandleWindowReady

This callback method is invoked when the Glue window registration has completed.  

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`glueWindow`|[IGlueWindow](#iface-igluewindow)|The registered Glue window.|

Return value: `HResult`  
The implementation needs to return `S_OK`.  

#### <a id="iface-igluewindoweventhandler-handlechannelchanged"></a> HandleChannelChanged

This callback method is invoked when the user changes the channel via the channel selection box in the window's title bar.  

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`glueWindow`|[IGlueWindow](#iface-igluewindow)|The registered Glue window for the application|
|`channel`|[IGlueContext](#iface-igluecontext)|Glue context of the newly selected channel|
|`prevChannel`|[GlueContext](#type-gluecontext)|Information about the previously selected channel|

Return value: `HResult`  
The implementation needs to return `S_OK`.  

#### <a id="iface-igluewindoweventhandler-handlechanneldata"></a> HandleChannelData

This callback method is invoked when the data in the currently selected channel has changed or when the user selects a new channel via the channel selection box in the window's title bar.  

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`glueWindow`|[IGlueWindow](#iface-igluewindow)|The registered Glue window for the application|
|`channelUpdate`|[IGlueContextUpdate](#iface-igluecontextupdate)|This object can be used to obtain information about the Glue context update|

Return value: `HResult`  
The implementation needs to return `S_OK`.  

#### <a id="iface-igluewindoweventhandler-handlewindowdestroyed"></a> HandleWindowDestroyed

This callback method is invoked when the Glue window is being destroyed.  

Parameters:  

| Name | Type | Description |
|------|------|-------------|
|`glueWindow`|[IGlueWindow](#iface-igluewindow)|The registered Glue window for the application.|

Return value: `HResult`  
The implementation needs to return `S_OK`.  

## <a id="iface-igluewindowsettings"></a> __IGlueWindowSettings__ interface

Contains properties representing the settings to use during window registration.
See also:  
* [IGlue42](#iface-iglue42).[RegisterGlueWindowWithSettings](#iface-iglue42-registergluewindowwithsettings)

### Properties
|Name|Type|Default Value|Description|
|----|----|-------------|-----------|
|`AllowTabClose`|`WordBool`|`True`|Specifies whether the Glue tab will have a "Close" box (✖).  <br>This setting is only applicable when the window type is set to `"Tab"`.|
|`AllowUnstick`|`WordBool`|`True`|Specifies whether the window can be unsticked from other windows once sticked. (Currently unused)|
|`Channel`|`WideString`|`''`|Specifies the channel to be initially selected. No channel is selected by default.|
|`ChannelSupport`|`WordBool`|`False`|Specifies whether the window will have channel support enabled.|
|`FrameColor`|`WideString`|`''`|The color of the window frame. (Currently unused)|
|`Icon`|`WideString`|`''`|Icon for the application. (Currently unused)|
|`IsStricky`|`WordBool`|`True`|Specifies whether the window can be sticked to other Glue windows.|
|`MaxHeight`|`Integer`|`0`|Specifies the maximum height (in pixels) to which the window can be resized. A value of `0` means no limit. The height of window title bar is not included.|
|`Maximizable`|`Integer`|`True`|Specifies whether the window will have a "Maximize" box.|
|`MaxWidth`|`Integer`|`0`|Specifies the maximum width (in pixels) to which the window can be resized. A value of `0` means no limit.|
|`MinHeight`|`Integer`|`0`|Specifies the minimum height (in pixels) to which the window can be resized. The height of window title bar is not included.|
|`Minimizable`|`WordBool`|`True`|Specifies whether the window will have a "Minimize" box.|
|`MinWidth`|`Integer`|`0`|Specifies the minimum width (in pixels) to which the window can be resized.||
|`ShowTaskbarIcon`|`WordBool`|`True`|Specifies whether the window should have an icon/tab visible on the taskbar.|
|`StandardButtons`|`WideString`|`''`|Optional list of comma-separated values specifying which command buttons will be available in the window title bar. See comments below.|
|`SynchronousDestroy`|`WordBool`|`False`|VBA applications must always set this value to `True`.|
|`Title`|`WideString`|`''`|Specifies the window title. If an empty string is provided, the initial window title will be set to the name of the Glue application registering the window.|
|`Type`|`WideString`|`'Flat'`|Specifies the window type. The available types are `"Flat"` and  `"Tab"`|

#### StandardButtons
The `StandardButtons` property specifies which command buttons will be available in the window title bar. A comma-separated list of the following values may be provided:

|Value|Meaning|
|-----|-------|
|`'None'`|No command buttons will be shown. This is used to hide all command buttons and cannot be combined with other values.|
|`'LockUnlock'`|Show the "Lock/Unlock" button.|
|`'Extract'`|Show the "Extract" button.|
|`'Collapse'`|Show the "Collapse" button.|
|`'Minimize'`|Show the "Minimize" button. Works in conjunction with the `Minimizable` property which must also be set to `True` for the button to be visible.|
|`'Maximize'`|Show the "Maximize". Works in conjunction with the `Maximizable` property which must also be set to `True` for the button to be visible.|
|`'Close'`|Show the "Close" button.|
|`'Default'` or `''`|Equivalent to `'Collapse,Minimize,Maximize,Close'`|