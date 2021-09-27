# Overview 

Delphi 7

The Glue42 Channels are enabled by default when registering a form as a Glue42 window. The form will receive notifications about channel changes and updates via the `HandleChannelChanged` and `HandleChannelData` callback methods of the `IGlueWindowEventHandler` handler which the form must implement (see also [WindowManagement](TODO:link)).  

When the Glue42 Channel support is enabled for a registered window, a Channel selector box is available in the window title bar.  


# Handling Notifications About Channel Changes and Updates  

## The user changes the channel via the channel selection box  
When the user changes the channel via the channel selection box in the window's title bar, the `HandleChannelChanged` method is invoked.  

```delphicurrent
function TMainForm.HandleChannelChanged(const glueWindow: IGlueWindow; const channel: IGlueContext; prevChannel: GlueContext): HResult;
begin
  if not Assigned(channel) then
  begin
    // previous channel deselected, no new channel selected
    ...
  end  
  else
  begin
    // new channel selected
    ...
  end;
  Result := S_OK;
end;
```

## Data in the currently selected channel is updated  
When the data in the currently selected channel is updated or the user selects a new channel via the channel selection box in the window's title bar, the `HandleChannelData` method is invoked.  

```delphi
function TMainForm.HandleChannelData(const glueWindow: IGlueWindow; const channelUpdate: IGlueContextUpdate): HResult;
var
  channel: IGlueContext;
  data: TGlueContextValueArray;
begin
  channel := channelUpdate.GetContext();
  // get the channel data in a native data structure
  rawData := channel.GetData();
  data := SA_AsTranslatedContextValues(rawData);
  ...
  SafeArrayDestroy(rawData);
  Result := S_OK;
end;
```

# Channel Selection Box  
The channel selection box in the window's title bar is visible by default when the window is registered with channel support enabled.  

You can use the `GetChannelSupport` method to determine if the channel selection box is currently visible and the `SetChannelSupport` method to set the visibility of the box.  

```delphi
  // toggle the visibility of the channel selector
  if  glueWin.GetChannelSupport() then
    glueWin.SetChannelSupport(False)
  else
    glueWin.SetChannelSupport(True);
```

Note that the `SetChannelSupport` method only hides or shows the channel selection box and does not enable or disable the channel support. This can be done only during window registration.  