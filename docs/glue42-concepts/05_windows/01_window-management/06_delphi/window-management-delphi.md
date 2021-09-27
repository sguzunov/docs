Window Management
====
Delphi 7  

# Glue42 Windows  

Delphi 7 Form windows can be registered as Glue42 Windows after the Glue42 COM library has been initialized.

# Register From as a Glue Window
To enable registration as a Glue Window, the form class needs to implement the `IGlueWindowEventHandler` interface.

```delphi
TMainForm = class(TForm, IGlueWindowEventHandler)
...
private
    // the Glue42 entrypoint handle
    G42: IGlue42;
    // the Glue Window handle
    glueWin: IGlueWindow;
protected
    // implement IGlueWindowEventHandler
    function HandleWindowReady(const glueWindow: IGlueWindow): HResult; stdcall;
    function HandleChannelData(const glueWindow: IGlueWindow; const channelUpdate: IGlueContextUpdate): HResult; stdcall;
    function HandleChannelChanged(const glueWindow: IGlueWindow; const channel: IGlueContext; prevChannel: GlueContext): HResult; stdcall;
    function HandleWindowDestroyed(const glueWindow: IGlueWindow) : HResult; stdcall;

    ...
```
You can do the registration immediately after the Glue initialization.
```delphi
  procedure TMainForm.InitializeGlue;
    ...
    // init and start the Glue42
    G42.Start(inst);
    // start the registration of the glue window
    G42.RegisterGlueWindow(Self.Handle, Self);
    ...
```

Unregister the Glue window when the form is closed.
```delphi
procedure TMainForm.FormClose(Sender: TObject; var Action: TCloseAction);
begin
  if Assigned(glueWin) then
  begin
    glueWin.Unregister;
  end;

  ...

end;
```

# Window Events  

You need to provide implementations for the functions of the `IGlueWindowEventHandler` interface. Here is a minimal implementation in case we are not interested in handling notifications for Glue channel updates and the "Window Destroyed" event:  

```delphi
function TMainForm.HandleWindowReady(const glueWindow: IGlueWindow): HResult;
begin
  glueWin := glueWindow;
  Result := S_OK;
end;

function TMainForm.HandleChannelChanged(const glueWindow: IGlueWindow; const channel: IGlueContext; prevChannel: GlueContext): HResult;
begin
  Result := S_OK;
end;

function TMainForm.HandleChannelData(const glueWindow: IGlueWindow; const channelUpdate: IGlueContextUpdate): HResult;
begin
  Result := S_OK;
end;

function TMainForm.HandleWindowDestroyed(const glueWindow: IGlueWindow): HResult;
begin
  Result := S_OK;
end;
```

For more information about using Glue42 channels see [Channels](TODO:link).  

# Window Operations  

Once a Glue42 window has been registered, you can use the handle provided in the `HandleWindowReady` event to perform some operations on it.  

## Title  
To get the current window title, use the `GetTitle` method:  
```delphi
var
  winTitle: WideString;
...
  winTitle := glueWin.GetTitle();
```
To change the window title, use `SetTitle`:  
```delphi
  glueWin.SetTitle('New Window Title');
```

## Visibility  
To check whether the window is visible, use `IsVisible`. To hide or show a window, use `SetVisible` and pass a `WordBool` value as an argument:  

```delphi
  if glueWin.IsVisible() then
    glueWin.SetVisible(False)
  else
    glueWin.SetVisible(True);
```