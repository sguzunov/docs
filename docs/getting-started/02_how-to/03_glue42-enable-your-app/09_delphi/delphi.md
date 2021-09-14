## Overview

The Glue42 COM library allows you to Glue42 enable your Delphi applications, integrate them with other Glue42 enabled applications in **Glue42 Enterprise** and use Glue42 functionality in them. To access Glue42 functionalities in your Delphi application, you have to reference and initialize the Glue42 COM library. All files necessary for Glue42 enabling your Delphi application are a part of the SDK bundle of **Glue42 Enterprise** located in the `%LocalAppData%\Tick42\GlueSDK\GlueCOM` folder. Currently, the Glue42 COM library supports Delphi 7 and Delphi 10.

## Using the Glue42 COM Library

### Referencing

To use any **Glue42 Enterprise** functionality, you need to add the following units to your Delphi project:

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

4. You can invoke `InitializeGlue()` in the `OnCreate` event handler and perform cleanup in the `OnClose` event handler for the form:

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

To add your Delphi application to the **Glue42 Enterprise** Application Manager, you need to define a `.json` configuration file and add it to the application configuration store (remote or local). You can add an application configuration file in the `%LocalAppData%\Tick42\UserData\<ENV-REG>\apps` folder to publish your application locally. `<ENV-REG>` in the link should be replaced with the environment and region folder name used for the deployment of your **Glue42 Enterprise** - e.g., `T42-DEMO`. This way, your files will not be erased or overwritten, in case you decide to upgrade or change your **Glue42 Enterprise** version.

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

- `type` should be `exe`;
- `path` is the path to the executable file. It can be relative or absolute. You can also use the **%GDDIR%** environment variable, which points to the **Glue42 Enterprise** installation folder; 
- `command` is the actual command to execute (the `.exe` file name);
- `parameters` holds command line arguments passed to the executable;

*Note that the definition should be a valid `.json` file (you should either use forward slash or escape the backslash).*

## Glue42 Delphi Concepts

### Glue42 Time

## Glue42 Helper Unit

The `GlueHelper` unit contains native [type definitions](#) and additional helper classes and methods facilitating the use of the Glue42 COM library. 

It is recommended to use the [conversion functions](#conversion_functions) provided in the `GlueHelper` unit to transform the parameters or return values from a `PSafeArray` to native types and vice-versa:

- The functions in the `Create[type]_SA` format can be used to transform various native types to a `PSafeArray`. The returned values need to be destroyed with `SafeArrayDestroy` when no longer needed.  

- The functions in the `SA_As[type]` format can be used to transform a `PSafeArray` to various native types.  

### Types

#### Arrays

The following array types are defined in the `GlueHelper` unit:  

| Array | Type |
|-------|------|
| `GlueContextArray` | [`GlueContext`](#types-gluecontext) |
| `GlueContextValueArray` | [`GlueContextValue`](#types-gluecontextvalue) |
| `GlueValueArray` | [`GlueValue`](#types-gluevalue) |
| `TDateTimeArray` | `TDateTime` |
| `TDoubleArray` | `Double` |
| `TGlueContextValueArray` | [`TGlueContextValue`](#tgluecontextvalue) |
| `TGlueInstanceArray` | [`GlueInstance`](#types-glueinstance) |
| `TGlueInvocationResultArray` | [`GlueInvocationResult`](#types-glueinvocationresult) |
| `TGlueMethodArray` | [`GlueMethod`](#types-gluemethod) |
| `TGlueValueArray` | [`PTGlueValue`](#tgluevalue) |
| `TInt64Array` | `Int64` |
| `TIntArray` | `Integer` |
| `TStrArray` | `String` |
| `TWideStringArray` | `WideString` |
| `TWordBoolArray` | `WordBool` |

#### Pointers

The following pointer types are defined in the `GlueHelper` unit:  

| Type | Points to |
|------|-------------|
| `PGlueContextValue` | [`GlueContextValue`](#types-gluecontextvalue) |
| `PGlueInvocationResult` | [`GlueInvocationResult`](#types-glueinvocationresult) |
| `PGlueMethod` | [`GlueMethod`](#types-gluemethod) |
| `PGlueResult` | [`GlueResult`](#types-glueresult) |
| `PGlueValue` | [`GlueValue`](#types-gluevalue) |
| `PStr` | `String` |
| `PTGlueValue` | [`TGlueValue`](#tgluevalue) |
| `PVarRecord` | [`TVarRecord`](#tvarrecord) |
| `PVOID` | `Pointer` (synonym) |

### Conversion Functions

The `GlueHelper` unit provides a set of functions which can be used to convert from/to a `PSafeArray`. Operations with `PSafeArray`s are used extensively when sending or receiving data from Glue42.  

#### Summary

The table below summarizes the available conversion functions:

| Array Type | Element Type | From | To |
|------------|--------------|------|----|
| `TDoubleArray` | `Double` | [SA_AsDoubleArray](#saasdoublearray) | [CreateArray_SA](#createarraysa) |
| `TInt64Array` | `Int64` | [SA_AsInt64Array](#saasint64array) | [CreateArray_SA](#createarraysa) |
| `TStrArray` | `String` | [SA_AsStringArray](#saasstringarray) | [CreateArray_SA](#createarraysa) |
| `TWideStringArray` | `WideString` | [SA_AsWideStringArray](#saaswidestringarray) | [CreateArray_SA](#createarraysa) |
| `TWordBoolArray` | `WordBool` | [SA_AsWordBoolArray](#saaswordboolarray) | [CreateArray_SA](#createarraysa) |
| `TDateTimeArray` | `TDateTime` | [SA_AsDateTimeArray](#saasdatetimearray) (consists of `Int64` values representing [Glue42 time](#glue42_delphi_concepts-glue42_time)) | `-` |
| `-` | [IGlueStreamSubscriber](#ext-iface-igluestreamsubscriber) | `-` | `-` |
| `GlueContextArray` | [GlueContext](#types-gluecontext) | [SA_AsGlueContextArray](#saasgluecontextarray) | `-` |
| `GlueContextValueArray` | [GlueContextValue](#types-gluecontextvalue) | [SA_AsGlueContextValueArray](#saasgluecontextvaluearray) | [CreateContextValues_SA](#createcontextvaluessa) |
| `TGlueInstanceArray` | [GlueInstance](#types-glueinstance) | [SA_AsGlueInstanceArray](#saasglueinstancearray) | [CreateInstanceArray_SA](#createinstancearraysa) |
| `TGlueInvocationResultArray` | [GlueInvocationResult](#types-glueinvocationresult) | [SA_AsGlueInvocationResultArray](#saasglueinvocationresultarray) | `-` |
| `TGlueMethodArray` | [GlueMethod](#types-gluemethod) | [SA_AsGlueMethodArray](#saasgluemethodarray) | `-` |
| `GlueValueArray` | [GlueValue](#types-gluevalue) | [SA_AsGlueValueArray](#saasgluevaluearray) | [CreateTuple_SA](#createtuplesa) |

##### CreateArray_SA

This is a set of overloaded functions taking an array of a native type as input and returning a `PSafeArray`.  

*Parameters:*

Each of the overloaded functions takes a single parameter of one of the following types:

- `TDoubleArray` - array of `Double`;
- `TInt64Array` - array of `Int64`;
- `TStrArray` - array of `String`;
- `TWideStringArray` - array of `WideString`;
- `TWordBoolArray` - array of `WordBool`;

*Return value:* `PSafeArray`

The return value is a pointer to a safe array of the corresponding type. The returned value must be destroyed with `SafeArrayDestroy` when no longer needed.

##### CreateContextValues_SA

Creates a `PSafeArray` from an array of [`GlueContextValue`](#types-gluecontextvalue) objects.

*Parameters:*

Single parameter of type `GlueContextValueArray`.

*Return value:* `PSafeArray`

The returned value must be destroyed with `SafeArrayDestroy` when no longer needed.

##### CreateInstanceArray_SA

Creates a `PSafeArray` from an array of [`GlueInstance`](#types-glueinstance) objects.

*Parameters:*

Single parameter of type `TGlueInstanceArray`.

*Return value:* `PSafeArray`

The returned value must be destroyed with `SafeArrayDestroy` when no longer needed.

##### CreateTuple_SA

Creates a `PSafeArray` from an array of [`GlueValue`](#types-gluevalue) objects.

*Parameters:*

Single parameter of type `GlueValueArray`.

*Return value:* `PSafeArray`

The returned value must be destroyed with `SafeArrayDestroy` when no longer needed.

##### SA_AsDateTimeArray

Converts `PSafeArray` to an array of `TDateTime` objects.

*Parameters:*

Single parameter of type `PSafeArray` containing `Int64` values representing [Glue42 time](#glue42_delphi_concepts-glue42_time).

*Return value:* `TDateTimeArray`

##### SA_AsDoubleArray

Converts a `PSafeArray` to an array of `Double` values.

*Parameters:*

Single parameter of type `PSafeArray` containing `Double` values.

*Return value:* `TDoubleArray`

##### SA_AsGlueContextArray

Converts a `PSafeArray` to an array of [`GlueContext`](#types-gluecontext) objects.

*Parameters:*

Single parameter of type `PSafeArray` containing `GlueContext` values.

*Return value:* `GlueContextArray`

##### SA_AsGlueContextValueArray

Converts a `PSafeArray` to an array of [`GlueContextValue`](#types-gluecontextvalue) objects.

*Parameters:*

Single parameter of type `PSafeArray` containing `GlueContextValue` values.

*Return value:* `GlueContextValueArray`

##### SA_AsGlueInstanceArray

Converts a `PSafeArray` to an array of [`GlueInstance`](#types-glueinstance) objects.

*Parameters:*

Single parameter of type `PSafeArray` containing `GlueInstance` values.

*Return value:* `TGlueInstanceArray`

##### SA_AsGlueInvocationResultArray

Converts a `PSafeArray` to an array of [`GlueInvocationResult`](#types-glueinvocationresult) objects.

*Parameters:*

Single parameter of type `PSafeArray` containing `GlueInvocationResult` values.

*Return value:* `TGlueInvocationResultArray`

##### SA_AsGlueMethodArray

Converts a `PSafeArray` to an array of [`GlueMethod`](#types-gluemethod) objects.

*Parameters:*

Single parameter of type `PSafeArray` representing the array of `GlueMethod` values.

*Return value:* `TGlueMethodArray`

##### SA_AsGlueValueArray

Converts a `PSafeArray` to an array of [`GlueValue`](#types-gluevalue) objects.

*Parameters:*

Single parameter of type `PSafeArray` representing an array of `GlueValue` objects.

*Return value:* `GlueValueArray`

##### SA_AsInt64Array

Converts a `PSafeArray` to an array of `Int64` values.

*Parameters:*

Single parameter of type `PSafeArray` containing `Int64` values.

*Return value:* `TInt64Array`

##### SA_AsStringArray

Converts a `PSafeArray` to an array of `String` values.

*Parameters:*

Single parameter of type `PSafeArray` containing `String` values.

*Return value:* `TStrArray`

##### SA_AsWideStringArray

Converts a `PSafeArray` to an array of `WideString` values.

*Parameters:*

Single parameter of type `PSafeArray` containing `WideString` values.

*Return value:* `TWideStringArray`

##### SA_AsWordBoolArray

Converts a `PSafeArray` to an array of `WordBool` values.

*Parameters:*

Single parameter of type `PSafeArray` containing `WordBool` values.

*Return value:* `TWordBoolArray`

## COM/Delphi Reference

This reference describes the components in the Glue42 COM library relevant to Delphi.

*Note that the library also contains components that are not intended to be directly used by Delphi applications.*

## Enums

### GlueInstanceIdentity

| Name | Value | Hex | Binary |
|------|-------|-----|--------|
| `GlueInstanceIdentity_None` | 0 | 00 | 00000000 |
| `GlueInstanceIdentity_MachineName` | 1 | 01 | 00000001 |
| `GlueInstanceIdentity_ApplicationName` | 2 | 02 | 00000010 |
| `GlueInstanceIdentity_UserName` | 4 | 04 | 00000100 |
| `GlueInstanceIdentity_Instance` | 7 | 07 | 00000111 |
| `GlueInstanceIdentity_Environment` | 8 | 08 | 00001000 |
| `GlueInstanceIdentity_Region` | 16 | 10 | 00010000 |
| `GlueInstanceIdentity_LocalizedInstance` | 31 | 1F | 00011111 |
| `GlueInstanceIdentity_ServiceName` | 32 | 20 | 00100000 |
| `GlueInstanceIdentity_Full` | 63 | 3F | 00111111 |
| `GlueInstanceIdentity_Pid` | 64 | 40 | 01000000 |
| `GlueInstanceIdentity_InstanceId` | 128 | 80 | 10000000 |

### GlueMethodFlags

| Name | Value | Hex | Binary |
|------|-------|-----|--------|
| `GlueMethodFlags_None` | 0 | 00 | 00000000 |
| `GlueMethodFlags_ReturnsResult` | 1 | 01 | 00000001 |
| `GlueMethodFlags_IsGuiOperation` | 2 | 02 | 00000010 |
| `GlueMethodFlags_IsUserSpecific` | 4 | 04 | 00000100 |
| `GlueMethodFlags_IsMachineSpecific` | 8 | 08 | 00001000 |
| `GlueMethodFlags_OutsideDomain` | 16 | 10 | 00010000 |
| `GlueMethodFlags_SupportsStreaming` | 32 | 20 | 00100000 |

### GlueMethodInvocationStatus

| Name | Value |
|------|------|
| `GlueMethodInvocationStatus_Succeeded` | 0 |
| `GlueMethodInvocationStatus_Failed` | 1 |
| `GlueMethodInvocationStatus_TimedOut` | 2 |
| `GlueMethodInvocationStatus_NotAvailable` | 3 |
| `GlueMethodInvocationStatus_Started` | 4 |

### GlueState

| Name | Value |
|------|------| 
| `GlueState_Unknown` | 0 |
| `GlueState_Pending` | 1 |
| `GlueState_Connected` | 2 |
| `GlueState_Disconnected` | 3 |
| `GlueState_Inactive` | 4 |

### GlueStreamState

| Name | Value |
|------|------|
| `GlueStreamState_Pending` | 0 |
| `GlueStreamState_Stale` | 1 |
| `GlueStreamState_Opened` | 2 |
| `GlueStreamState_Closed` | 3 |
| `GlueStreamState_SubscriptionRejected` | 4 |
| `GlueStreamState_SubscriptionFailed` | 5 |

### GlueValueType

| Name | Value |
|------|------|
| `GlueValueType_Bool` | 0 |
| `GlueValueType_Int` | 1 |
| `GlueValueType_Double` | 2 |
| `GlueValueType_Long` | 3 |
| `GlueValueType_String` | 4 |
| `GlueValueType_DateTime` | 5 |
| `GlueValueType_Tuple` | 6 |
| `GlueValueType_Composite` | 7 |

## Types

### GlueAppDefinition

Definition of a child application to be registered in Glue42.  

**Properties**

| Name | Type | Description |
|------|------|-------------|
| `Category` | `WideString` | Application category. |
| `Name` | `WideString` | Application name under which the app will be registered in Glue42. |
| `title` | `WideString` | Application title as it will appear in the Glue42 Application Manager. |

### GlueConfiguration

Used for overriding the default Glue42 configuration. See also [`IGlue42`](#interfaces-iglue42) and [`OverrideConfiguration`](#overrideconfiguration)

**Properties**

| Name | Type | Description |
|------|------|-------------|
| `LoggingConfigurationPath` | `WideString` | Logging configuration path |
| `GWUri` | `WideString` | Glue Gateway URI |
| `AppDefinitionStartup` | `WideString` | Application startup file |
| `AppDefinitionStartupArgs` | `WideString` | Application startup arguments |
| `AppDefinitionTitle` | `WideString` | Application Title |

### GlueContext

Describes a Glue42 context.

**Properties**

| Name | Type | Description |
|------|------|-------------|
| `Name` | `WideString` | Name of the Glue42 context. |
| `Id` | `WideString` | Identifier of the Glue42 context. |

### GlueContextValue

Describes a Glue42 context value.

**Properties**

| Name | Type | Description |
|------|------|-------------|
| `Name` | `WideString` | Name associated with the value. |
| `Value` | [`GlueValue`](#types-gluevalue) | The Glue42 value. |


### GlueInstance

Describes the identity of a Glue42 instance, i.e. how the instance is seen by other Glue42 peers.  

**Properties**

| Name | Type | Description |
|------|------|-------------|
| `InstanceId` | `WideString` | Identifier of the Glue42 instance. |
| `Version` | `WideString` | Version reported by the application instance. |
| `MachineName` | `WideString` | Machine (network) name. |
| `ProcessId` | `Integer` | Process ID (PID) |
| `ProcessStartTime` | `Int64` | Glue42 time when the process was started. |
| `UserName` | `WideString` | Username associated with the process. |
| `ApplicationName` | `WideString` | Glue42 application name. |
| `Environment` | `WideString` | Glue42 environment. |
| `Region` | `WideString` | Glue42 region. |
| `ServiceName` | `WideString` | Glue42 service name. |
| `MetricsRepositoryId` | `WideString` | Glue42 metrics repository identifier. |
| `Metadata` | `PSafeArray` | Optional array of [`GlueContextValue`](#types-gluecontextvalue) providing additional information about the instance. |

### GlueInvocationResult

Describes the result returned from invoking a Glue42 Interop method.

**Properties**  

| Name | Type | Description |
|------|------|-------------|
| `Method` | [`GlueMethod`](#types-gluemethod) | Information about the Glue42 Interop method. |
| `Result` | [`GlueResult`](#types-glueresult) | The result returned by the method. | 

### GlueMethod

Describes a Glue42 Interop method.

**Properties**  

| Name | Type | Description |
|------|------|-------------|
| `Name` | `WideString` | Method name. |
| `Input` | `WideString` | Input signature. |
| `Output` | `WideString` | Output signature. |
| `Instance` | [`GlueInstance`](#types-glueinstance) | Information about the Glue42 application instance that has registered the method. |
| `RegistrationCookie` | `WideString` | Method registration cookie. |
| `Flags` | [`GlueMethodFlags`](#enums-gluemethodflags) | Method flags. |
| `ObjectTypes` | `PSafeArray` | Array of `WideString` values specifying the types of objects that the method works with (e.g., `Instrument`, `Client`, etc.) |

### GlueResult

Describes the result returned by an Interop method or the result returned by the server when a stream subscription request has been accepted or rejected.

**Properties**  

| Name | Type | Description |
|------|------|-------------|
| `Values` | `PSafeArray` | An array of [`GlueContextValue`](#types-gluecontextvalue) objects representing the result value. |
| `Status` | [`GlueMethodInvocationStatus`](#enums-gluemethodinvocationstatus) | Status of the method invocation. |
| `Message` | `WideString` | Message related to the method invocation status. |
| `LogDetails` | `WideString` | Log details related to the result. |

### GlueValue

Describes Glue42 values.

**Properties**

| Name | Type | Description |
|------|------|-------------|
| `GlueType` | [`GlueValueType`](#enums-gluevaluetype) | Type of the Glue42 value. |
| `IsArray` | `WordBool` | Indicates whether the value is an array. |

The following properties will be initialized based on the values of `GlueType` and `IsArray`:

| Name | Type | Description |
|------|------|-------------|
| `BoolValue` | `WordBool` | Boolean value. |
| `LongValue` | `Int64` | Integer value. |
| `DoubleValue` | `Double` | Double-precision floating-point value. |
| `StringValue` | `WideString` | String value. |
| `BoolArray` | `PSafeArray` | Array of `WordBool`. |
| `LongArray` | `PSafeArray` | Array of `Int64`. |
| `DoubleArray` | `PSafeArray` | Array of `Double`. |
| `StringArray` | `PSafeArray` | Array of `WideString`. |
| `Tuple` | `PSafeArray` | Array of [`GlueValue`](#types-gluevalue). |
| `CompositeValue` | `PSafeArray` | Array of [`GlueContextValue`](#types-gluecontextvalue). |

## Interfaces

### IAppAnnouncer

An object instance implementing this interface is passed to the [`CreateApp`](#createapp) method of [`IAppFactory`](#interfaces-iappfactory).  

**Methods**

#### AnnounceAppCreationFailure

Informs Glue42 that a new child application instance could not be created.  

*Parameters:*

| Name | Type | Description |
|------|------|-------------|
| `error` | `WideString` | Error message passed back to Glue42. |

*Return value:* None

#### RegisterAppInstance

Registers a new child application instance in Glue42.  

*Parameters:*

| Name | Type | Description |
|------|------|-------------|
| `hwnd` | `Integer` | Handle to the window representing the Glue42 application instance. |
| `glueApp` | [`IGlueApp`](#interfaces-iglueapp) | Instance of a class implementing the `IGlueApp` interface. |

*Return value:* [`IGlueWindow`](#interfaces-igluewindow)  

### IAppFactory

Implementing this interface allows an object to act as a child application factory. The child applications created by this object will be registered as Glue42 applications. See also [`IAppFactoryRegistry`](#interfaces-iappfactoryregistry) and [`RegisterAppFactory`](#registerappfactory).

**Methods**

#### CreateApp

The object acting as a child application factory must provide an implementation for this callback method. It will be invoked when a new child application instance is to be created.

*Parameters:*

| Name | Type | Description |
|------|------|-------------|
| `appDefName` | `WideString` | Name with which the child application was registered. |
| `state` | [`GlueValue`](#types-gluevalue) | Saved application state. |
| `announcer` | [`IAppAnnouncer`](#interfaces-iappannouncer) | Announcer object used for announcing to Glue42 successful or failed application creation. |

*Return value:* `HResult`

The implementation must return `S_OK`.

### IAppFactoryRegistry

Implementing this interface allows an object to register factories for child applications and to register application instances in Glue42.

**Methods**

#### RegisterAppFactory

Registers an object implementing the [`IAppFactory`](#interfaces-iappfactory) interface as a child application factory. Definition for the registered application must be provided.

*Parameters:*

| Name | Type | Description |
|------|------|-------------|
| `appDefinition` | [`GlueAppDefinition`](#types-glueappdefinition) | Definition of the application that will be registered as a factory. |
| `factory` | [`IAppFactory`](#interfaces-iappfactory) | Instance of a class implementing the `IAppFactory` interface. |

*Return value:* None  

#### RegisterAppInstance

Registers an application instance in Glue42.

*Parameters:*

| Name | Type | Description |
|------|------|-------------|
| `appDefName` | `WideString` | Application name. |
| `glueWindow` | [`IGlueWindow`](#interfaces-igluewindow) | A registered Glue42 window. |
| `glueApp` | [`IGlueApp`](#interfaces-iglueapp) | Instance of a class implementing the `IGlueApp` interface. |

*Return value:* None

### IGlue42

Create an instance implementing this interface in order to access Glue42 functionality.

**Properties**

| Name | Type | Description |
|------|------|-------------|
| `AppFactoryRegistry` | [`IAppFactoryRegistry`](#interfaces-iappfactoryregistry)| The object registered as a child application factory. |

**Methods**

#### BuildAndInvoke

Invokes a Glue42 Interop method on a single or multiple targets.

*Parameters:*

| Name | Type | Description |
|------|------|-------------|
| `Method` | `WideString` | Name of the method to invoke. |
| `builderCallback` | [`IGlueContextBuilderCallback`](#interfaces-igluecontextbuildercallback) | Object of class implementing the `IGlueContextBuilderCallback` interface. It can be used to build the method invocation arguments. |
| `targets` | `PSafeArray` | *Optional.* Allows filtering the invocation targets. If provided, this must be an array of [`GlueInstance`](#types-glueinstance) objects. |
| `all` | `WordBool` | Indicates whether the method should be invoked on all targets exposing it or only on the first that has registered the method. |
| `identity` | [`GlueInstanceIdentity`](#enums-glueinstanceidentity) | Specifies the identity properties to be matched when applying the `targets` filter. |
| `resultHandler` | [`IGlueInvocationResultHandler`](#interfaces-iglueinvocationresulthandler) | Object of class implementing the `IGlueInvocationResultHandler` interface. Used for handling the result(s) of the method invocation. |
| `invocationTimeoutMsecs` | `Int64` | Time out for the method invocation (in ms). If the provided value is less than or equal to zero, a default timeout value will be used. |
| `correlationId` | `WideString` | *Optional.* Parameter that will be passed to the implementation of the [`HandleResult`](#handleresult) callback of [`IGlueInvocationResultHandler`](#interfaces-iglueinvocationresulthandler). |

*Return value:* None  

#### BuildGlueContextValues

Creates a `PSafeArray` of [`GlueContextValue`](#types-gluecontextvalue) using a callback method.

*Parameters:*  

| Name | Type | Description |
|------|------|-------------|
| `contextBuilderCallback` | [`IGlueContextBuilderCallback`](#interfaces-igluecontextbuildercallback) | Object of class implementing the `IGlueContextBuilderCallback` interface. |

*Return value:* `PSafeArray`

An array of [`GlueContextValue`](#types-gluecontextvalue) objects. The returned value must be destroyed with `SafeArrayDestroy` when no longer needed.

#### GetAllInstances

Gets an array of all available Glue42 instances.  

*Parameters:* None  

*Return value:* `PSafeArray`

An array of [`GlueInstance`](#types-glueinstance) objects. The returned value must be destroyed with `SafeArrayDestroy` when no longer needed.

#### GetAllMethods

Gets an array of all available Glue42 Interop methods, including streaming methods, offered by all Glue42 instances.

*Parameters:* None

*Return value:* `PSafeArray`

An array of [`GlueMethod`](#types-gluemethod) objects. The returned value must be destroyed with `SafeArrayDestroy` when no longer needed.

#### GetChannels  

Gets an array of the names of all available Glue42 Channels.  

*Parameters:* None

*Return value:* `PSafeArray`

An array of `WideString` values representing the Channel names. The returned value must be destroyed with `SafeArrayDestroy` when no longer needed.

#### GetInstance

Gets the current Glue42 instance.

*Parameters:* None

*Return value:* [`GlueInstance`](#types-glueinstance)

Contains information about the current Glue42 application instance.

#### GetKnownContexts

Gets an array of all available Glue42 contexts.  

*Parameters:* None

*Return value:* `PSafeArray`

An array of [`GlueContext`](#types-gluecontext) objects. The returned value needs to be destroyed with `SafeArrayDestroy` when no longer needed.  

#### GetMethodNamesForTarget

Gets the names of Interop methods exposed by Glue42 applications.  

*Parameters:*  

| Name | Type | Description |
|------|------|-------------|
| `targetRegex` | `WideString` | Optional regular expression for filtering by application name. An empty string will match all application names. |

*Return value:* `PSafeArray`

An array of `WideString` values representing the names of the available Interop methods. The returned value must be destroyed with `SafeArrayDestroy` when no longer needed.

#### GetMethodsForInstance

Gets the Interop methods exposed by the first matching application instance.  

*Parameters:*  

| Name | Type | Description |
|------|------|-------------|
| `Instance` | [`GlueInstance`](#types-glueinstance) | A Glue42 instance (an actual instance of a Glue42 application, or an object of type `GlueInstance`) with one or more initialized properties. |
| `identity` | [`GlueInstanceIdentity`](#enums-glueinstanceidentity) | Specifies which of the properties set in the `Instance` parameter are to be matched. |

*Return value:* `PSafeArray`

An array of [`GlueMethod`](#types-gluemethod) objects. The returned value must be destroyed with `SafeArrayDestroy` when no longer needed.

#### GetTargets

Gets the names of all active Glue42 enabled applications currently exposing Interop methods.  

*Parameters:* None

*Return value:* `PSafeArray`

An array of `WideString` values representing the application names. The returned value must be destroyed with `SafeArrayDestroy` when no longer needed.

#### InvokeMethod

Invokes a Glue42 Interop method on a specific target.

*Parameters:*  

| Name | Type | Description |
|------|------|-------------|
| `Method` | [`GlueMethod`](#types-gluemethod) | Information about the method to invoke. The `Instance` property of the `GlueMethod` object is used for determining the invocation target. |
| `invocationArgs` | `PSafeArray` | Method invocation arguments. This must be an array of [`GlueContextValue`](#types-gluecontextvalue) objects. |
| `resultHandler` | [IGlueInvocationResultHandler](#interfaces-iglueinvocationresulthandler) | Object of a class implementing the `IGlueInvocationResultHandler` interface. It is used for handling the result(s) of the method invocation. |
| `invocationTimeoutMsecs` | `Int64` | Time out for the method invocation (in ms). If the provided value is less than or equal to zero, a default timeout value will be used. |
| `correlationId` | `WideString` | *Optional.* Parameter that will be passed to the implementation of the [`HandleResult`](#handleresult) callback of [`IGlueInvocationResultHandler`](#interfaces-iglueinvocationresulthandler). |

*Return value:* None

#### InvokeMethods

Invokes a Glue42 Interop method on a single or multiple targets.

*Parameters:*  

| Name | Type | Description |
|------|------|-------------|
| `Method` | `WideString` | Name of the method to invoke. |
| `invocationArgs` | `PSafeArray` | Method invocation arguments. This must be an array of [`GlueContextValue`](#types-gluecontextvalue) objects. |
| `targets` | `PSafeArray` | *Optional.* Allows filtering the invocation targets. If provided, this must be an array of [`GlueInstance`](#types-glueinstance) objects. |
| `all` | `WordBool` | Indicates whether the method should be invoked on all targets exposing it or only on the first that has registered the method. |
| `identity` | [`GlueInstanceIdentity`](#enums-glueinstanceidentity) | Specifies which properties of the `GlueInstance` objects to be matched when applying the `targets` filter. |
| `resultHandler` | [`IGlueInvocationResultHandler`](#interfaces-iglueinvocationresulthandler) | Object of a class implementing the `IGlueInvocationResultHandler` interface. It is used for handling the result(s) of the method invocation. |
| `invocationTimeoutMsecs` | `Int64` | Time out for the method invocation (in ms). If the provided value is less than or equal to zero, a default timeout value will be used. |
| `correlationId` | `WideString` | *Optional.* Parameter that will be passed to the implementation of the [`HandleResult`](#handleresult) callback of [`IGlueInvocationResultHandler`](#interfaces-iglueinvocationresulthandler). |

*Return value:* None

#### InvokeSync

Invokes a Glue42 Interop method synchronously.  

*Parameters:*  

| Name | Type | Description |
|------|------|-------------|
| `methodName` | `WideString` | Name of the method to invoke. |
| `argsAsJson` | `WideString` | Arguments to pass to the method in JSON format |
| `resultFieldPath` | `WideString` | `-` |
| `targetRegex` | `WideString` | *Optional.* Regular expression for filtering targets by application name. If provided, the method will be invoked on all targets with application name matching the regular expression. If not provided, the method will be invoked on the first target that has registered the method. |

*Return value:* `WideString`

Represents the return value(s) from the method invocation in JSON format.  

#### JsonToVariant

Converts a JSON string into a `Variant` array.  

*Parameters:*

| Name | Type | Description |
|------|------|-------------|
| `json` | `WideString` | The JSON string to convert. |

*Return value:* `PSafeArray`

An array of `Variant` values. The returned value must be destroyed with `SafeArrayDestroy` when no longer needed.

#### Log

Outputs a message to the Glue42 log.

*Parameters:*  

| Name | Type | Description |
|------|------|-------------|
| `level` | `Byte` | Log level. The following values are accepted: `0` (trace), `1` (debug), `2` (info), `3` (warn), `4` (error), `5` (fatal) |
| `Message` | `WideString` | The message to log. |

*Return value:* None

#### OverrideConfiguration

Overrides the default Glue42 configuration. This method must be invoked before invoking the [`Start`](#start) method, otherwise it will have no effect.

*Parameters:*

| Name | Type | Description |
|------|------|-------------|
| `configuration` | [`GlueConfiguration`](#types-glueconfiguration) | Custom Glue42 configuration to use for overriding the default configuration. |

*Return value:* None

#### RegisterGlueWindow

Registers a window as a Glue42 Window and sets the related event handler.

*Parameters:*

| Name | Type | Description |
|------|------|-------------|
| `hwnd` | `Integer` | Handle to the window to register. |
| `windowEventHandler` | `IGlueWindowEventHandler` | An object of class implementing the [`IGlueWindowEventHandler`](#interfaces-igluewindoweventhandler) interface. Used for handling the events triggered by interactions with the Glue42 Window. |

*Return value:* [`IGlueWindow`](#interfaces-igluewindow)

An object representing the registered Glue42 Window. The returned value should not be used to interact with the Glue42 Window until the [`HandleWindowReady`](#handlewindowready) callback method has been invoked (i.e., the registration is complete).

#### RegisterGlueWindowWithSettings

Registers a window as a Glue42 Window with specific settings and sets the related event handler.

*Parameters:*

| Name | Type | Description |
|------|------|-------------|
| `hwnd` | `Integer` | Handle to the window to register. |
| `settings` | [`IGlueWindowSettings`](#interfaces-igluewindowsettings) | An object of class implementing the `IGlueWindowSettings` interface that contains the settings to use during the window registration. |
| `windowEventHandler` | `IGlueWindowEventHandler` | An object of class implementing the [`IGlueWindowEventHandler`](#interfaces-igluewindoweventhandler) interface. |

*Return value:* [`IGlueWindow`](#interfaces-igluewindow)

The returned value should not be used to interact with the Glue42 Window until the [`HandleWindowReady`](#handlewindowready) callback method has been invoked (i.e., the registration is complete).

#### RegisterMethod

Registers a Glue42 Interop method.

*Parameters:* 

| Name | Type | Description |
|------|------|-------------|
| `methodName` | `WideString` | Name for the method to register. |
| `requestHandler` | `IGlueRequestHandler` | An object of class implementing the [`IGlueRequestHandler`](#interfaces-igluerequesthandler) interface. Used for handling method invocation requests. |
| `Input` | `WideString` | *Optional.* Parameters signature. |
| `Output` | `WideString` | *Optional.* Returned result signature. |
| `ObjectTypes` | `PSafeArray` | *Optional.* Array of `WideString` values specifying the types of objects that the method works with (e.g., `Instrument`, `Client`, etc.) |

*Return value:* [`GlueMethod`](#types-gluemethod)

An object describing the registered Glue42 method. The returned value can be used to unregister the method using [`UnregisterMethod`](#unregistermethod).  

#### RegisterStartupGlueWindow

Registers a window as a Glue42 Window using the default startup options (if any) and sets the related event handler.

*Parameters:*  

| Name | Type | Description |
|------|------|-------------|
| `hwnd` | `Integer` | Handle to the window to register. |
| `windowEventHandler` | `IGlueWindowEventHandler` | An object of class implementing the [`IGlueWindowEventHandler`](#interfaces-igluewindoweventhandler) interface. Used for handling the events triggered by interactions with the Glue42 Window. |

*Return value:* [`IGlueWindow`](#interfaces-igluewindow)

An object representing the registered Glue42 Window. The returned value should not be used to interact with the Glue42 Window until the [`HandleWindowReady`](#handlewindowready) callback method has been invoked (i.e., the registration is complete).

#### RegisterStartupGlueWindowWithSettings

Registers a window as a Glue42 Window with specific settings and using the default startup options (if any) and sets the related event handler.

*Parameters:*  

| Name | Type | Description |
|------|------|-------------|
| `hwnd` | `Integer` | Handle to the window to register. |
| `settings` | [`IGlueWindowSettings`](#interfaces-igluewindowsettings) | An object of class implementing the `IGlueWindowSettings` interface that contains the settings to use during the window registration. |
| `windowEventHandler` | `IGlueWindowEventHandler` | An object of class implementing the [`IGlueWindowEventHandler`](#interfaces-igluewindoweventhandler) interface. |

*Return value:* [`IGlueWindow`](#interfaces-igluewindow)

The returned value should not be used to interact with the Glue42 Window until the [`HandleWindowReady`](#handlewindowready) callback method has been invoked (i.e., the registration is complete).

#### RegisterStream

Registers a Glue42 streaming method and sets the related subscription handler.  

*Parameters:*  

| Name | Type | Description |
|------|------|-------------|
| `streamName` | `WideString` | Name of the stream to register. |
| `subscriptionHandler` | [`IGlueSubscriptionHandler`](#interfaces-igluesubscriptionhandler) | An object of class implementing the `IGlueSubscriptionHandler` interface. Used for handling incoming subscription requests. |
| `Input` | `WideString` | *Optional.* Parameters signature. |
| `Output` | `WideString` | *Optional.* Result signature. |
| `ObjectTypes` | `PSafeArray` | *Optional.* Array of `WideString` values specifying the types of objects that the method works with (e.g., `Instrument`, `Client`, etc.) |
| `out stream` | [`IGlueStream`](#interfaces-igluestream) | Output parameter. An object representing the newly created stream. |

*Return value:* [`GlueMethod`](#types-gluemethod)

An object describing the registered Glue42 streaming method. The returned value can be used to unregister the streaming method using [`UnregisterMethod`](#interfaces-iglue42-unregistermethod).  

#### SetChannelData

Sets the value of a context field of an existing Glue42 Channel.  

*Parameters:*  

| Name | Type | Description |
|------|------|-------------|
| `channel` | `WideString` | The Channel name. |
| `fieldPath` | `WideString` | Path to the field in JavaScript notation - e.g., `'data.object1.object2.field1'`. |
| `data` | `WideString` | The value for the field. |

*Return value:* None

If any of the intermediate objects specified in `fieldPath` (e.g., `object1`) or the field itself (e.g., `field1`) do not exist in the JSON tree, they will be automatically created. If any of the intermediate objects specified in `fieldPath` already exist in the JSON tree, but are not objects, the call will fail. If the specified field already exists in the JSON tree, its value will be replaced. This works also when the existing field is an object.

#### SetLogConfigurationPath

Overrides the default Glue42 logging configuration path. This method must be invoked before invoking the [`Start`](#start) method, otherwise it will have no effect. See also [`IGlue42`](#interfaces-iglue42) and [`OverrideConfiguration`](#overrideconfiguration).  

*Parameters:*

| Name | Type | Description |
|------|------|-------------|
| `logConfigPath` | `WideString` | Path to the Glue42 logging configuration. |

*Return value:* None

#### Start

Connects to the Glue42 Gateway and announces the application instance. Connection to the Glue42 Gateway is necessary for using any Glue42 functionality.

*Parameters:*

| Name | Type | Description |
|------|------|-------------|
| `Instance` | [`GlueInstance`](#types-glueinstance) | Describes the identity to use when announcing the Glue42 application instance. |

*Return value:* None

#### StartWithAppName

Connects to the Glue42 Gateway and announces the application instance with the specified application name. Connection to the Glue42 Gateway is necessary for using any Glue42 functionality.  

*Parameters:*

| Name | Type | Description |
|------|------|-------------|
| `ApplicationName` | `WideString` | The application name to use when announcing the Glue42 application instance. |

*Return value:* None

Invoking this method is equivalent to invoking the [`Start`](#start) method with only the `ApplicationName` property of the `Instance` parameter initialized.

#### Stop

Disconnects from the Glue42 Gateway and shuts down all communication.

*Parameters:* None

*Return value:* None

#### Subscribe

Subscribes for receiving various event notifications from Glue42. For details on the events and event handlers, see [`IGlueEvents`](#interfaces-iglueevents).

*Parameters:*

| Name | Type | Description |
|------|------|-------------|
| `handler` | [IGlueEvents](#interfaces-iglueevents) | Object of class implementing the `IGlueEvents` interface. Used for handling Glue42 events. |

*Return value:* None

#### SubscribeGlueContext

Subscribes to a Glue42 shared context.

*Parameters:*

| Name | Type | Description |
|------|------|-------------|
| `contextName` | `WideString` | Name of the context to which to subscribe. If the context does not exist, it will be automatically created. |
| `handler` | [`IGlueContextHandler`](#interfaces-igluecontexthandler) | Object of class implementing the `IGlueContextHandler` interface. Used for handling contexts and context updates. |

*Return value:* None

#### SubscribeStream

Subscribes to a specific Glue42 stream by sending a subscription request and sets the related stream event handler.  

*Parameters:*  

| Name | Type | Description |
|------|------|-------------|
|`stream`|[GlueMethod](#types-gluemethod)|Description of the Glue streaming method to subscribe to. The properties `stream.Name` and `stream.Instance.InstanceId` must be initialized with the stream name and instance id of the Glue application publishing the stream respectively.|
|`subscriptionRequestArgs`|`PSafeArray`|An array of [GlueContextValue](#types-gluecontextvalue)'s. representing the arguments to pass with the subscription request.|
|`streamHandler`|[IGlueStreamHandler](#interfaces-igluestreamhandler)|Object of class implementing the `IGlueStreamHandler` interface which will receive the stream event notifications.|
|`subscriptionTimeoutMsecs`|`Int64`|The subscription request will time out after the specified number of milliseconds. If the provided value is less than or equal to zero then a default timeout value will be used.|

*Return value:* None  

#### SubscribeStreams
Subscribe to a Glue stream or streams registered by one or more Glue applications and set the related stream event handler.  

*Parameters:*  

| Name | Type | Description |
|------|------|-------------|
|`streamName`|`WideString`|Name of the Glue stream to subscribe to.|
|`subscriptionRequestArgs`|`PSafeArray`|An array of [GlueContextValue](#types-gluecontextvalue)'s. representing the arguments to pass with the subscription request(s).|
|`targets`|`PSafeArray`|Optional: allows filtering the subscription targets. If provided, this must be an array of [GlueInstance](#types-glueinstance)'s|
|`all`|`WordBool`|Indicates if the subscription request should be sent to all the matching targets, or only to the first one that matches.|
|`identity`|[GlueInstanceIdentity](#enums-glueinstanceidentity)|Specifies the identity properties to be matched when applying the `targets` filter|
|`streamHandler`|[IGlueStreamHandler](#interfaces-igluestreamhandler)|Object of class implementing the `IGlueStreamHandler` interface which will receive the stream event notifications.|
|`invocationTimeoutMsecs`|`Int64`|The subscription request(s) will time out after the specified number of milliseconds. If the provided value is less than or equal to zero then a default timeout value will be used.|

*Return value:* None  

#### SubscribeStreamsFilterTargets
Subscribe to a Glue stream or streams registered by one or more Glue applications and set the related stream event handler. Subscription targets can be filtered by name.

*Parameters:*  

| Name | Type | Description |
|------|------|-------------|
|`streamName`|`WideString`|Name of the Glue stream to subscribe to.|
|`subscriptionRequestArgs`|`PSafeArray`|An array of [GlueContextValue](#types-gluecontextvalue)'s. representing the arguments to pass with the subscription request(s).|
|`targetRegex`|`WideString`|Optional regular expression for filtering targets by application name. An empty string will match all application names.|
|`all`|`WordBool`|Indicates if the subscription request should be sent to all the matching targets, or only to the first one that matches.|
|`streamHandler`|[IGlueStreamHandler](#interfaces-igluestreamhandler)|Object of class implementing the `IGlueStreamHandler` interface which will receive the stream event notifications.|
|`invocationTimeoutMsecs`|`Int64`|The subscription request(s) will time out after the specified number of milliseconds. If the provided value is less than or equal to zero then a default timeout value will be used.|

*Return value:* None 

#### UnregisterMethod
Unregister a Glue method (invocation endpoint).  

*Parameters:*  

| Name | Type | Description |
|------|------|-------------|
|`Method`|[GlueMethod](#types-gluemethod)|Description of the method to unregister. This must be the value returned by [RegisterMethod](#interfaces-iglue42-registermethod) or [RegisterStream](#interfaces-iglue42-registerstream).|

*Return value:* None  

#### Unsubscribe
Cancel a subscription created with the [Subscribe](#interfaces-iglue42-subscribe) method.  

*Parameters:*  

| Name | Type | Description |
|------|------|-------------|
|`handler`|[IGlueEvents](#interfaces-iglueevents)|Object of class implementing the `IGlueEvents` interface. This must be the same object previously passed to the `Subscribe` method|

*Return value:* None  

#### Other Methods
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



### IGlueApp
Implementing this interface allows an object to be registered as a Glue application instance.  
See also:  
* [IAppAnnouncer](#interfaces-iappannouncer).[RegisterAppInstance](#interfaces-iappannouncer-registerappinstance)
* [IAppFactoryRegistry](#interfaces-iappfactoryregistry).[RegisterAppInstance](#interfaces-iappfactoryregistry-registerappinstance)

**Methods**

#### Initialize

This callback method is invoked when the child application is being initialized.  

*Parameters:*  

| Name | Type | Description |
|------|------|-------------|
|`state`|[GlueValue](#types-gluevalue)|A previously saved application state|
|`glueWindow`|[IGlueWindow](#interfaces-igluewindow)|The registered Glue window for the application|

*Return value:* `HResult`  
The implementation needs to return `S_OK`.  

#### SaveState

This callback method is invoked when Glue needs to save the application state.  

*Parameters:*  
| Name | Type | Description |
|------|------|-------------|
|`out pRetVal`|[GlueValue](#types-gluevalue)|Output parameter. The implementation may initialize `pRetVal` with the application state to be saved|

*Return value:* `HResult`  
The implementation needs to return `S_OK`.  

#### Shutdown

This callback method is invoked when Glue is shutting down.

*Parameters:* None  

*Return value:* `HResult`  
The implementation needs to return `S_OK`.  

### IGlueContext

**Methods**

#### BuildAndSetContextData

Set new (replace) context data using a callback method.  

*Parameters:*  

| Name | Type | Description |
|------|------|-------------|
|`builderCallback`|[IGlueContextBuilderCallback](#interfaces-igluecontextbuildercallback)|Object of class implementing the `IGlueContextBuilderCallback` interface|

*Return value:* None  

#### BuildAndUpdateContextData

Update context data using a callback method.  

*Parameters:*  

| Name | Type | Description |
|------|------|-------------|
|`builderCallback`|[IGlueContextBuilderCallback](#interfaces-igluecontextbuildercallback)|Object of class implementing the `IGlueContextBuilderCallback` interface|

*Return value:* None

#### Close

Unsubscribe from the associated Glue context.

*Parameters:* None  

*Return value:* None  

#### GetContextInfo

Get information about the context.  

*Parameters:* None  

*Return value:* [GlueContext](#types-gluecontext)  

#### GetData

Get context data.  

*Parameters:* None  

*Return value:* `PSafeArray`  
An array of [GlueContextValue](#types-gluecontextvalue)'s.
The returned value needs to be destroyed with `SafeArrayDestroy` when no longer needed.  


#### GetReflectData

The method `GetReflectData` is not intended to be used in Delphi.

#### Open

The method `Open` is not intended to be used in Delphi.


#### SetContextData

Set new (replace) context data.

*Parameters:*  

| Name | Type | Description |
|------|------|-------------|
|`data`|`PSafeArray`|An array of [GlueContextValue](#types-gluecontextvalue)'s representing the new context data.|

*Return value:* None  

#### SetValue

The method `SetValue` is not intended to be used in Delphi.


#### UpdateContextData

Update context data.

*Parameters:*  

| Name | Type | Description |
|------|------|-------------|
|`data`|`PSafeArray`|An array of [GlueContextValue](#types-gluecontextvalue)'s representing the new context data.|

*Return value:* None  


### IGlueContextBuilder

An instance of this is passed as a parameter to the implementation of [IGlueContextBuilderCallback](#interfaces-igluecontextbuildercallback).[Build](#interfaces-igluecontextbuildercallback-build).  

**Methods**

#### AddBool

Add a boolean value to the context data.

*Parameters:*  

| Name | Type | Description |
|------|------|-------------|
|`Name`|`WideString`|Name associated with the context value|
|`Value`|`WordBool`|The value to add|

*Return value:* None  

#### AddBoolArray

Add an array of boolean values to the context data.

*Parameters:*  

| Name | Type | Description |
|------|------|-------------|
|`Name`|`WideString`|Name associated with the context value|
|`Value`|`PSafeArray`|An array of `WordBool` values|

*Return value:* None  

#### AddComposite

Add a composite value to the context data.  

*Parameters:*  

| Name | Type | Description |
|------|------|-------------|
|`Name`|`WideString`|Name associated with the context value|
|`composite`|`PSafeArray`|The composite value as a `PSafeArray`|
|`IsArray`|`WordBool`|Indicates if the composite value is an array|

*Return value:* None  

#### AddContextValue

Add a value represented as `GlueContextValue` to the context data.  

*Parameters:*  

| Name | Type | Description |
|------|------|-------------|
|`GlueContextValue`|[GlueContextValue](#types-gluecontextvalue)|The `GlueContextValue` to add|

*Return value:* None  

#### AddDatetime

Add a datetime value to the context data.  

*Parameters:*  

| Name | Type | Description |
|------|------|-------------|
|`Name`|`WideString`|Name associated with the context value|
|`Value`|`Int64`|An integer representation of Glue time. This is defined as the number of milliseconds since the Unix epoch i.e. 1970-01-01 00:00:00 UTC|

*Return value:* None  


#### AddDatetimeArray

Add an array of datetime values to the context data.  

*Parameters:*  

| Name | Type | Description |
|------|------|-------------|
|`Name`|`WideString`|Name associated with the context value|
|`Value`|`PSafeArray`|An array of `Int64` values representing Glue time|

*Return value:* None  

#### AddDouble

Add a double-precision floating-point value to the context data.

*Parameters:*  

| Name | Type | Description |
|------|------|-------------|
|`Name`|`WideString`|Name associated with the context value|
|`Value`|`Double`|The value to add|

*Return value:* None  

#### AddDoubleArray

Add an array of double-precision floating-point values to the context data.  

*Parameters:*  

| Name | Type | Description |
|------|------|-------------|
|`Name`|`WideString`|Name associated with the context value|
|`Value`|`PSafeArray`|An array of `Double` values|

*Return value:* None  

#### AddGlueValue

Add a value represented as `GlueValue` to the context data.  

*Parameters:*  

| Name | Type | Description |
|------|------|-------------|
|`Name`|`WideString`|Name associated with the context value|
|`Value`|[GlueValue](#types-gluevalue)|The value to add|

*Return value:* None  

#### AddInt

Add an integer value to the context data.  

*Parameters:*  

| Name | Type | Description |
|------|------|-------------|
|`Name`|`WideString`|Name associated with the context value|
|`Value`|`Integer`|The value to add|

*Return value:* None  

#### AddIntArray

Add an array of integer values to the context data.  

*Parameters:*  

| Name | Type | Description |
|------|------|-------------|
|`Name`|`WideString`|Name associated with the context value|
|`Value`|`PSafeArray`|An array of `Integer` values|

*Return value:* None  

#### AddLong

Add a long integer value to the context data.  

*Parameters:*  

| Name | Type | Description |
|------|------|-------------|
|`Name`|`WideString`|Name associated with the context value|
|`Value`|`Int64`|The value to add|

*Return value:* None  

#### AddLongArray

Add an array of long integer values to the context data.  

*Parameters:*  

| Name | Type | Description |
|------|------|-------------|
|`Name`|`WideString`|Name associated with the context value|
|`Value`|`PSafeArray`|An array of `Int64` values|

*Return value:* None  


#### AddString

Add a string value to the context data.  

*Parameters:*  

| Name | Type | Description |
|------|------|-------------|
|`Name`|`WideString`|Name associated with the context value|
|`Value`|`WideString`|The value to add|

*Return value:* None  

#### AddStringArray

Add an array of string values to the context data.  

*Parameters:*  

| Name | Type | Description |
|------|------|-------------|
|`Name`|`WideString`|Name associated with the context value|
|`Value`|`PSafeArray`|An array of `WideString` values|

*Return value:* None  

#### AddTuple

Add a tuple of values to the context data.  

*Parameters:*  

| Name | Type | Description |
|------|------|-------------|
|`Name`|`WideString`|Name associated with the context value|
|`Tuple`|`PSafeArray`|Array of [GlueValue](#types-gluevalue)'s.|

*Return value:* None  

#### AddTupleValue

Add a tuple of values represented as `GlueValue` to the context data.

*Parameters:*  

| Name | Type | Description |
|------|------|-------------|
|`Name`|`WideString`|Name associated with the context value|
|`Value`|[GlueValue](#types-gluevalue)|The value representing the tuple|

*Return value:* None  

#### BuildComposite

Build a value using a callback method and add it to the context data.

*Parameters:*  

| Name | Type | Description |
|------|------|-------------|
|`Name`|`WideString`|Name associated with the context value|
|`callback`|[IGlueContextBuilderCallback](#interfaces-igluecontextbuildercallback)|Object of class implementing the `IGlueContextBuilderCallback` interface|
|`IsArray`|`WordBool`|Indicates if the value is an array|

*Return value:* None

#### BuildTuple

Build a tuple value using a callback method and add it to the context data.  

*Parameters:*  

| Name | Type | Description |
|------|------|-------------|
|`Name`|`WideString`|Name associated with the context value|
|`callback`|[IGlueContextBuilderCallback](#interfaces-igluecontextbuildercallback)|Object of class implementing the `IGlueContextBuilderCallback` interface|

*Return value:* None  

#### Clear

Clear all context data.  

*Parameters:* None  

*Return value:* None  

### IGlueContextBuilderCallback

**Methods**

#### Build

This callback method is invoked when context data needs to be built. This happens when a method requiring an `IGlueContextBuilderCallback` implementation is used (e.g. [BuildAndSetContextData](#interfaces-igluecontext-buildandsetcontextdata)).  

*Parameters:*  

| Name | Type | Description |
|------|------|-------------|
|`builder`|[IGlueContextBuilder](#interfaces-igluecontextbuilder)|An instance of `IGlueContextBuilder` which can be used to build the context data|

*Return value:* `HResult`  
The implementation needs to return `S_OK`.  

### IGlueContextHandler

Implementing this interface allows an object to receive notifications about changes in a Glue context.  
See also:
* [IGlue42](#interfaces-iglue42).[SubscribeGlueContext](#interfaces-iglue42-subscribegluecontext)

**Methods**

#### HandleContext

This callback method is invoked when a Glue context subscription is activated via  [SubscribeGlueContext](#interfaces-iglue42-subscribegluecontext).  

*Parameters:*  

| Name | Type | Description |
|------|------|-------------|
|`context`|[IGlueContext](#interfaces-igluecontext)|This can be used to set/update context data.|

*Return value:* `HResult`  
The implementation needs to return `S_OK`.  

#### HandleContextUpdate

This callback method is invoked when the associated context has been updated.

*Parameters:*  

| Name | Type | Description |
|------|------|-------------|
|`contextUpdate`|[IGlueContextUpdate](#interfaces-igluecontextupdate)|This object can be used to obtain information about the Glue context update|

*Return value:* `HResult`  
The implementation needs to return `S_OK`.  

### IGlueContextUpdate

**Methods**

#### GetAdded

Get an array of values which have been added to the context.  

*Parameters:* None  

*Return value:* `PSafeArray`  
An array of [GlueContextValue](#types-gluecontextvalue)'s.
The returned value needs to be destroyed with `SafeArrayDestroy` when no longer needed.  

#### GetContext

Get the context which has been updated.  

*Parameters:* None  

*Return value:* [IGlueContext](#interfaces-igluecontext)  

#### GetRemoved

Get an array of the names of the properties which have been removed from the context.  

*Parameters:* None  

*Return value:* `PSafeArray`  
An array of `WideString`'s.
The returned value needs to be destroyed with `SafeArrayDestroy` when no longer needed.  

#### GetUpdated

Get an array of values which have been updated in the context.  

*Parameters:* None  

*Return value:* `PSafeArray`  
An array of [GlueContextValue](#types-gluecontextvalue)'s.
The returned value needs to be destroyed with `SafeArrayDestroy` when no longer needed.  

### IGlueEvents
Implementing this interface allows an object to receive notifications about various Glue events.  

See also:  
* [IGlue42](#interfaces-iglue42).[Subsribe](#interfaces-iglue42-subscribe) 

**Methods**

#### HandleConnectionStatus

This callback method is invoked when the Glue connection status has changed.  

*Parameters:*  

| Name | Type | Description |
|------|------|-------------|
|`state`|[GlueState](#enums-gluestate)|The new Glue connection state|
|`Message`|`WideString`|Message text related to the connection status change|
|`date`|`Int64`|Glue time when the connection status changed|

*Return value:* `HResult`  
The implementation needs to return `S_OK`.  

#### HandleGlueContext

This callback method is invoked when a new Glue context has been created.  

*Parameters:*  

| Name | Type | Description |
|------|------|-------------|
|`context`|[GlueContext](#types-gluecontext)|Information about the Glue context associated with the event|
|`created`|`WordBool`|Indicates whether the context is newly created|

*Return value:* `HResult`  
The implementation needs to return `S_OK`.  

#### HandleInstanceStatus

This callback method is invoked when a Glue application instance appears or disappears.  

*Parameters:*  

| Name | Type | Description |
|------|------|-------------|
|`Instance`|[GlueInstance](#types-glueinstance)|Information about the Glue application instance associated with the event|
|`active`|`WordBool`|Indicates whether the application instance is now active|

*Return value:* `HResult`  
The implementation needs to return `S_OK`.  

#### HandleMethodStatus

This callback method is invoked when a Glue interop method (invokation endpoint) has been registered or unregistered by an application instance.  

*Parameters:*  

| Name | Type | Description |
|------|------|-------------|
|`Method`|[GlueMethod](#types-gluemethod)|Information about the Glue interop method associated with the event|
|`active`|`WordBool`|Indicates whether the Glue interop method is now active|

*Return value:* `HResult`  
The implementation needs to return `S_OK`.  


#### HandleException

This callback method is invoked when an exception is raised during Glue operation.  

*Parameters:*  

| Name | Type | Description |
|------|------|-------------|
|`ex`|`_Exception`|An `_Exception` object as defined in the `mscorlib` type library.|

*Return value:* `HResult`  
The implementation needs to return `S_OK`.  

### IGlueInvocationResultHandler
Implementing this interface allows an object to handle method invocation results.  
See also:  
* [IGlue42](#interfaces-iglue42).[BuildAndInvoke](#interfaces-iglue42-buildandinvoke)
* [IGlue42](#interfaces-iglue42).[InvokeMethod](#interfaces-iglue42-invokemethod)
* [IGlue42](#interfaces-iglue42).[InvokeMethods](#interfaces-iglue42-invokemethods)


**Methods**

#### HandleResult

This callback method is invoked when a Glue interop method invocation has completed.  

*Parameters:*  

| Name | Type | Description |
|------|------|-------------|
|`invocationResult`|`PSafeArray`|An array of [GlueInvocationResult](#types-glueinvocationresult)'s|
|`correlationId`|`WideString`|Correlation Id passed when the method was invoked|

*Return value:* `HResult`  
The implementation needs to return `S_OK`.  

### IGlueRequestHandler

Implementing this interface allows an object to handle method invocation requests.  
See also:  
* [IGlue42](#interfaces-iglue42).[RegisterMethod](#interfaces-iglue42-registermethod)

**Methods**

#### HandleInvocationRequest

This callback method is invoked when a registered Glue method is invoked.  

*Parameters:*  

| Name | Type | Description |
|------|------|-------------|
|`Method`|[GlueMethod](#types-gluemethod)|Information about the Glue method being invoked|
|`caller`|[GlueInstance](#types-glueinstance)|Information about the Glue application instance that invoked the method|
|`requestValues`|`PSafeArray`|An array of [GlueContextValue](#types-gluecontextvalue)'s. representing the method invocation arguments|
|`resultCallback`|[IGlueServerMethodResultCallback](#interfaces-iglueservermethodresultcallback)|Object of class implementing the `IGlueServerMethodResultCallback` interface. This can be used to send the result of the method invocation to the caller application instance|

*Return value:* `HResult`  
The implementation needs to return `S_OK`.  

### IGlueServerMethodResultCallback

An instance of this is passed to the implementation of [IGlueRequestHandler](#interfaces-igluerequesthandler).[HandleInvocationRequest](#interfaces-igluerequesthandler-handleinvocationrequest)


**Methods**

#### SendResult

Send the result of a method invocation to the caller application instance.  

*Parameters:*  

| Name | Type | Description |
|------|------|-------------|
|`Result`|[GlueResult](#types-glueresult)|The result to send back to the caller|

*Return value:* None  

### IGlueServerSubscriptionCallback

An instance of this is passed to the implementation of [IGlueSubscriptionHandler](#interfaces-igluesubscriptionhandler).[HandleSubscriptionRequest](#interfaces-igluesubscriptionhandler-handlesubscriptionrequest)

**Methods**

#### Accept

Accept a Glue stream subscription request.  

*Parameters:*  

| Name | Type | Description |
|------|------|-------------|
|`branch`|`WideString`|Optional branch key (name) on which the subscriber will be registered. If the specified branch does not exist it will be created.|
|`Result`|[GlueResult](#types-glueresult)|Subscription result information to be sent back to the subscriber.|

*Return value:* [IGlueStreamBranch](#interfaces-igluestreambranch)  
An instance of `IGlueStreamBranch` representing the branch on which the subscriber was registered.  
If the `branch` parameter is emtpy, the default (unnamed) branch for the stream wil be returned.  

#### Reject

Reject a Glue stream subscription request.  

*Parameters:*  

| Name | Type | Description |
|------|------|-------------|
|`Result`|[GlueResult](#types-glueresult)|Rejection information to be sent back to the application requesting subscription.|

*Return value:* None  

### IGlueStream

Represents a Glue streaming interop method.

**Methods**

#### CloseBranch

Close a stream branch.  
This will disconnect (unsubscribe) all subscribers to the branch and remove the branch from the stream.  

*Parameters:*  

| Name | Type | Description |
|------|------|-------------|
|`branch`|`WideString`|Name of the branch to close|

*Return value:* None  

#### CloseStream

Close a stream.  
This will disconnect (unsubscribe) all subscribers to the stream, on any branch. All branches will be removed from the stream.  

*Parameters:* None  

*Return value:* None  

#### GetBranch

Get an existing stream branch.  



| Name | Type | Description |
|------|------|-------------|
|`branchKey`|`WideString`|The key (name) of the branch to get|

*Return value:* [IGlueStreamBranch](#interfaces-igluestreambranch)  
This can be used to perform stream actions specific to the branch.  

#### GetBranchKeys

Get the keys (names) of the available branches for the stream.  

*Parameters:* None  

*Return value:* `PSafeArray`  
An array of `WideString`'s with the names of the available branches.
The returned value needs to be destroyed with `SafeArrayDestroy` when no longer needed.  

#### Push

Push data on a stream.  

*Parameters:*  

| Name | Type | Description |
|------|------|-------------|
|`data`|`PSafeArray`|An array of [GlueContextValue](#types-gluecontextvalue)'s representing the data to be pushed on the stream.|
|`branch`|`WideString`|Optional branch name on which to push the data. The branch must have been created previously.|

*Return value:* None  


### IGlueStreamBranch

Represents a branch of a Glue streaming interop method.  

**Methods**

#### Close

Close a stream branch.  
This will disconnect (unsubscribe) all subscribers to the branch and remove the branch from the stream.  

*Parameters:* None  

*Return value:* None  

#### GetKey

Get the key (name) of the branch.  

*Parameters:* None  

*Return value:* `WideString`
A string containing the key (name) of the branch.  

#### GetStream

Get the Glue stream which owns the branch.  

*Parameters:* None  

*Return value:* [IGlueStream](#interfaces-igluestream)  
An instance representing the Glue stream which owns the branch.  

#### GetSubscribers

Get the subscribers to the stream branch.  

*Parameters:* None  

*Return value:* `PSafeArray`  
An array of [IGlueStreamSubscriber](#interfaces-igluestreamsubscriber)'s, representing all current subscribers to the branch stream.
The returned value needs to be destroyed with `SafeArrayDestroy` when no longer needed.  

#### Push

Push data on the stream branch.  

*Parameters:*  

| Name | Type | Description |
|------|------|-------------|
|`data`|`PSafeArray`|An array of [GlueContextValue](#types-gluecontextvalue)'s representing the data to be pushed to the stream branch.|

*Return value:* None  

### IGlueStreamHandler

Implementing this interface allows an object to receive notifications about Glue stream events.  
See also:
* [IGlue42](#interfaces-iglue42).[SubscribeStream](#interfaces-iglue42-subscribestream)
* [IGlue42](#interfaces-iglue42).[SubscribeStreams](#interfaces-iglue42-subscribestreams)


**Methods**

#### HandleStreamData

This callback method is invoked when data has been pushed (published) by the Glue streaming method to the subscriber.  

*Parameters:*  

| Name | Type | Description |
|------|------|-------------|
|`stream`|[GlueMethod](#types-gluemethod)|Information about the Glue streaming method that pushed the data.|
|`data`|`PSafeArray`|An array of [GlueContextValue](#types-gluecontextvalue)'s representing the data pushed by the streaming method.|

*Return value:* `HResult`  
The implementation needs to return `S_OK`.  

#### HandleStreamStatus

This callback method is invoked when the state of the Glue stream subscription has changed (e.g. accepted, rejected, closed, etc.)  

*Parameters:*  

| Name | Type | Description |
|------|------|-------------|
|`stream`|[GlueMethod](#types-gluemethod)|Information about the Glue streaming method related to the subscription.|
|`state`|[GlueStreamState](#enums-gluestreamstate)|The new state of the Glue stream subscription|
|`Message`|`WideString`|Message related to the subscription status change.|
|`dateTime`|`Int64`|Glue time when the subscription state changed.|

*Return value:* `HResult`  
The implementation needs to return `S_OK`.  

#### StreamClosed

This callback method is invoked when the Glue stream associated with the subscription has been closed.  

*Parameters:*  

| Name | Type | Description |
|------|------|-------------|
|`stream`|[GlueMethod](#types-gluemethod)|Information about the Glue streaming method related to the subscription.|

*Return value:* `HResult`  
The implementation needs to return `S_OK`.  

#### SubscriptionActivated

This callback method is invoked when the subscription request has been dispatched to Glue.  

*Parameters:*  

| Name | Type | Description |
|------|------|-------------|
|`GlueStreamSubscription`|[IGlueStreamSubscription](#interfaces-igluestreamsubscription)|An instance of the stream subscription. This can later be used to close the subscription from the client side.|

*Return value:* `HResult`  
The implementation needs to return `S_OK`.  


### IGlueStreamSubscriber

**Methods**

#### Close

Disconnect (unsubscribe) the subscriber from the stream.  

*Parameters:*  

| Name | Type | Description |
|------|------|-------------|
|`data`|`PSafeArray`|An array of [GlueContextValue](#types-gluecontextvalue)'s. This parameter is currently ignored.|

*Return value:* None


#### GetSubscriberInstance

Get the subscriber Glue application instance.  

*Parameters:* None  

*Return value:* [GlueInstance](#types-glueinstance)  
Description of the subscriber Glue application instance.  

#### Push

Push data to the subscriber.

*Parameters:*  

| Name | Type | Description |
|------|------|-------------|
|`data`|`PSafeArray`|An array of [GlueContextValue](#types-gluecontextvalue)'s representing the data to be pushed to the subscriber.|

*Return value:* None  

### IGlueStreamSubscription

**Methods**

#### Close

Disconnect from the stream (cancel the subscription).  

*Parameters:* None  

*Return value:* None  

### IGlueSubscriptionHandler

Implementing this interface allows an object to handle stream subscription events for a registered Glue stream.  
See also:  
* [IGlue42](#interfaces-iglue42).[RegisterStream](#interfaces-iglue42-registerstream)

**Methods**

#### HandleSubscriber

This callback method is invoked when a new subscriber to the stream is accepted.  

*Parameters:*  

| Name | Type | Description |
|------|------|-------------|
|`subscriberInstance`|[GlueInstance](#types-glueinstance)|Description of the Glue application instance which subscribed to the stream|
|`glueStreamSubscriber`|[IGlueStreamSubscriber](#interfaces-igluestreamsubscriber)|An instance of `IGlueStreamSubscriber` representing the new subscriber|
|`requestValues`|`PSafeArray`|An array of [GlueContextValue](#types-gluecontextvalue)'s. representing the arguments passed with the subscription request|

*Return value:* `HResult`  
The implementation needs to return `S_OK`.  

#### HandleSubscriberLost

This callback method is invoked when a subscriber has unsubscribed from the stream.  
This also includes the cases where subscribers have been forcefully unsubscribed when `Close` was called for a subscriber, stream or stream branch.  

*Parameters:*  

| Name | Type | Description |
|------|------|-------------|
|`subscriberInstance`|[GlueInstance](#types-glueinstance)|Description of the Glue application instance which is no longer subscribed to the stream|
|`glueStreamSubscriber`|[IGlueStreamSubscriber](#interfaces-igluestreamsubscriber)|An instance of `IGlueStreamSubscriber` representing the subscriber lost.|

*Return value:* `HResult`  
The implementation needs to return `S_OK`.  


#### HandleSubscriptionRequest

This callback method is invoked when a Glue application instance requests to subscribe to the stream.  

*Parameters:*  

| Name | Type | Description |
|------|------|-------------|
|`stream`|[GlueMethod](#types-gluemethod)|Description of the Glue stream for which the subscription is requested.|
|`caller`|[GlueInstance](#types-glueinstance)|Description of the Glue application instance requesting to subscribe to the stream.|
|`requestValues`|`PSafeArray`|An array of [GlueContextValue](#types-gluecontextvalue)'s. representing the arguments passed with the subscription request.|
|`callback`|[IGlueServerSubscriptionCallback](#interfaces-iglueserversubscriptioncallback)|An instance of `IGlueServerSubscriptionCallback` which can be used to accept or reject the subscription request.|

*Return value:* `HResult`  
The implementation needs to return `S_OK`.  

### IGlueWindow

**Methods**

#### GetChannelSupport

Determine if the Glue window has channel support.  

*Parameters:* None  

*Return value:* `WordBool`  

#### GetId

Obtain the Glue window identifier as a string.  

*Parameters:* None  
*Return value:* `WideString`  

#### GetTitle

Get the Glue window title.

*Parameters:* None  

*Return value:* `WideString`  
    
#### IsVisible

Determine if the Glue window is visible.  

*Parameters:* None  

*Return value:* `WordBool`  

#### SetChannelSupport

Enable/Disable channel support for the Glue window.  

*Parameters:*  

| Name | Type | Description |
|------|------|-------------|
|`showLink`|`WordBool`|Indicates if channel support for the window is to be enabled/disabled. When enabled, a "link" icon will be shown in the Glue window's title bar|

*Return value:* None  

#### SetTitle

Set the Glue window title.  

*Parameters:*  

| Name | Type | Description |
|------|------|-------------|
|`title`|`WideString`|Text to set in the window title bar|

*Return value:* None  

#### SetVisible

Makes the Glue window visible/invisible.  

*Parameters:*  

| Name | Type | Description |
|------|------|-------------|
|`visible`|`WordBool`|Indicates whether the window is to be visible.|

*Return value:* None  

#### Unregister

Unregister the Glue window.  

*Parameters:* None

*Return value:* None


### IGlueWindowEventHandler

Implementing this interface allows an object to receive channel change or update notifications for a registered Glue window.  
See also:  
* [IGlue42](#interfaces-iglue42).[RegisterGlueWindow](#interfaces-iglue42-registergluewindow)
* [IGlue42](#interfaces-iglue42).[RegisterGlueWindowWithSettings](#interfaces-iglue42-registergluewindowwithsettings)
* [IGlue42](#interfaces-iglue42).[RegisterStartupGlueWindow](#interfaces-iglue42-registerstartupgluewindow)
* [IGlue42](#interfaces-iglue42).[RegisterStartupGlueWindowWithSettings](#interfaces-iglue42-registerstartupgluewindowwithsettings)


**Methods**

#### HandleWindowReady

This callback method is invoked when the Glue window registration has completed.  

*Parameters:*  

| Name | Type | Description |
|------|------|-------------|
|`glueWindow`|[IGlueWindow](#interfaces-igluewindow)|The registered Glue window.|

*Return value:* `HResult`  
The implementation needs to return `S_OK`.  

#### HandleChannelChanged

This callback method is invoked when the application channel has changed.  

*Parameters:*  

| Name | Type | Description |
|------|------|-------------|
|`glueWindow`|[IGlueWindow](#interfaces-igluewindow)|The registered Glue window for the application|
|`channel`|[IGlueContext](#interfaces-igluecontext)|Glue context of the newly selected channel|
|`prevChannel`|[GlueContext](#types-gluecontext)|Information about the previously selected channel|

*Return value:* `HResult`  
The implementation needs to return `S_OK`.  

#### HandleChannelData

This callback method is invoked when the data in the currently selected channel has changed.  

*Parameters:*  

| Name | Type | Description |
|------|------|-------------|
|`glueWindow`|[IGlueWindow](#interfaces-igluewindow)|The registered Glue window for the application|
|`channelUpdate`|[IGlueContextUpdate](#interfaces-igluecontextupdate)|This object can be used to obtain information about the Glue context update|

*Return value:* `HResult`  
The implementation needs to return `S_OK`.  

#### HandleWindowDestroyed

This callback method is invoked when the Glue window is being destroyed.  

*Parameters:*  

| Name | Type | Description |
|------|------|-------------|
|`glueWindow`|[IGlueWindow](#interfaces-igluewindow)|The registered Glue window for the application.|

*Return value:* `HResult`  
The implementation needs to return `S_OK`.  

### IGlueWindowSettings

Contains properties representing the settings to use during window registration.
See also:  
* [IGlue42](#interfaces-iglue42).[RegisterGlueWindowWithSettings](#interfaces-iglue42-registergluewindowwithsettings)

**Properties**
| Name | Type | Default Value | Description |
|------|------|---------------|-------------|
|`AllowMove`|`WordBool`|`True`|Specifies whether the window can be moved. TODO-no effect|
|`AllowResize`|`WordBool`|`True`|Specifies whether the window can be resized. TODO-no effect|
|`AllowTabClose`|`WordBool`|`True`|Specifies whether the Glue tab will have a "Close" box (�).  <br>This setting is only applicable when the window type is set to `"Tab"`.|
|`AllowUnstick`|`WordBool`|`True`|Specifies whether the window can be unsticked from other windows once sticked. TODO-no effect|
|`Channel`|`WideString`|`''`|Specifies the channel to be initially selected. No channel is selected by default.|
|`ChannelSupport`|`WordBool`|`False`|Specifies whether the window will have channel support enabled.|
|`FrameColor`|`WideString`|`''`|TODO-no effect|
|`Icon`|`WideString`|`''`|TODO-no effect|
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

| Value | Meaning |
|-------|---------|
|`'None'`|No command buttons will be shown. This is used to hide all command buttons and cannot be combined with other values.|
|`'LockUnlock'`|Show the "Lock/Unlock" button.|
|`'Extract'`|Show the "Extract" button.|
|`'Collapse'`|Show the "Collapse" button.|
|`'Minimize'`|Show the "Minimize" button. Works in conjunction with the `Minimizable` property which must also be set to `True` for the button to be visible.|
|`'Maximize'`|Show the "Maximize". Works in conjunction with the `Maximizable` property which must also be set to `True` for the button to be visible.|
|`'Close'`|Show the "Close" button.|
|`"Default"` or `''`|Equivalent to `'Collapse,Minimize,Maximize,Close'`|