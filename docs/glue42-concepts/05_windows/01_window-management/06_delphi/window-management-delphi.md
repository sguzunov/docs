## Register From as a Glue Window
To enable registration as a Glue Window, the form class needs to implement the `IGlueWindowEventHandler` interface.

```delphi
TMainForm = class(TForm, IGlueWindowEventHandler)
...
private
    // the Glue42 entrypoint handle
    G42: IGlue42;
    // the Glue Window handle
    glueWindow: IGlueWindow;
protected
    // implements IGlueWindowEventHandler - channel updates
    // for a registered Glue Window
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
    // register the glue window
    glueWindow := G42.RegisterGlueWindow(Self.Handle, Self);
    ...
```

Unregister the Glue window when the form is closed.
```delphi
procedure TMainForm.FormClose(Sender: TObject; var Action: TCloseAction);
begin
  if Assigned(glueWindow) then
  begin
    glueWindow.Unregister;
  end;

  ...

end;
```

Implement the functions of the `IGlueWindowEventHandler` interface. Here is a minimal implementation in case we are not interested in handling notifications for Glue channel updates:

```delphi


function TMainForm.HandleWindowDestroyed(const glueWindow: IGlueWindow): HResult;
begin
  Result := S_OK;
end;
```