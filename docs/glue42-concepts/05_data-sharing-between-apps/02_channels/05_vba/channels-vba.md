## Overview

The Glue42 Channels are enabled by default when registering a VBA window as a Glue42 Window. You have to provide handler implementations for the Channel related events that will be raised due to interaction with the Glue42 Window instance - [changing Channels](#handling_channel_change) and [handling Channel data updates](#subscribing_for_channel_updates). When the Glue42 Channels are enabled, a Channel Selector box is available in the window title bar.

To check whether the Channel Selector is visible, use the [`GetChannelSupport`](../../../../getting-started/how-to/glue42-enable-your-app/vba/index.html#classes-gluewindow-getchannelsupport) method of a [`GlueWindow`](../../../../getting-started/how-to/glue42-enable-your-app/vba/index.html#classes-gluewindow) instance. To hide or show the Channel Selector, use the [`SetChannelSupport`](../../../../getting-started/how-to/glue42-enable-your-app/vba/index.html#classes-gluewindow-setchannelsupport) method.

*Note that currently the `SetChannelSupport` method only hides or shows the Channel Selector, but doesn't enable or disable the Channel support. This can be done only during window registration.*

```vbnet
' Hiding the Channel selector.
GlueWin.SetChannelSupport False
```

## Handling Channel Change

The [`HandleChannelChanged`](../../../../getting-started/how-to/glue42-enable-your-app/vba/index.html#classes-gluewindow-handlechannelchanged) event is raised when the user changes the Channel using the Channel selection box in the window title bar. Use its handler to enable your app to react to Channel changes:

```vbnet
Private Sub GlueWin_HandleChannelChanged(ByVal GlueWindow As IGlueWindow, ByVal ChannelContext As IGlueContext, ByVal PrevChannelName As String)
    On Error GoTo HandleErrors

    Dim ChannelDataDynValue
    Dim NewData
    Dim NewChannelName As String

    If channel Is Nothing Then
        ' Do something when the user deselects a Channel.
        ...
    Else
        ChannelDataDynValue = ChannelContext.GetReflectData("")
        NewChannelName = ChannelDataDynValue("name")
        NewData = ChannelDataDynValue("data")
        ' Do something when the user selects a new Channel.
        ...
    End If
    Exit Sub

    HandleErrors:
    ' Handle exceptions.

End Sub
```

## Subscribing for Channel Updates

To subscribe for Channel data updates, use the [`HandleChannelData`](../../../../getting-started/how-to/glue42-enable-your-app/vba/index.html#classes-gluewindow-handlechanneldata) event which is raised in two cases:
- when the data in the currently selected Channel is updated;
- after the [`HandleChannelChanged`](../../../../getting-started/how-to/glue42-enable-your-app/vba/index.html#classes-gluewindow-handlechannelchanged) event, when the user switches to another Channel;

```vbnet
Private Sub GlueWin_HandleChannelData(ByVal GlueWindow As IGlueWindow, ByVal ChannelUpdate As IGlueContextUpdate)
    On Error GoTo HandleErrors

    Dim ChannelDataDynValue
    Dim Data
    Dim ChannelName As String

    ChannelDataDynValue = ChannelUpdate.GetContext.GetReflectData("")
    ChannelName = ChannelDataDynValue("name")
    Data = ChannelDataDynValue("data")
    ' Do something with the new data.
    ...
    Exit Sub

    HandleErrors:
    ' Handle exceptions.

End Sub
```

## Publishing Data

To publish data to a Channel, you must update the shared context object dedicated the respective Channel. For details on how to update a shared context object, see the [`Shared Contexts > Updating a Context`](../../shared-contexts/vba/index.html#updating_a_context) section.

*Note that you must only update the value of the `"data"` property of the context object. The `"name"` and `"meta"` properties must not be modified, because they are specifically set for each Channel.*