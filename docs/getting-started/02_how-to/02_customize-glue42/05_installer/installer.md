## Extensible Installer

### Configuration

The extensibility configuration file defines a number of extensibility points, representing stages of the installation flow, each of which can be populated with one or more extensibility items, representing tasks to perform or settings to change. These items are listed in the extensibility file with the following structure:

```json
{
    "<extensibility point 1>": [
        {
            "type": "<extensibility item type>",
            "args": {
                "<arg>": <value>,
                ...
            }
        },
        ...
    ],
    "<extensibility point 2>": [
        {
            "type": "<extensibility item type>",
            "args": {
                "<arg>": <value>,
                ...
            }
        },
        ...
    ],
    ...
}
```
In case of no arguments, an extensibility item can be shortened to just a string with its type:

```json
{
    "startup": [
        {
            "type": "unattended",
            "args": {}
        },
        ...
    ],
    ...
}

// Can be shortened to:
{
    "startup": [
        "unattended",
        ...
    ],
    ...
}
```

The table below lists all available extensibility points and the extensibility item types applicable to them:

| Extensibility Point | Extensibility Items |
|---------------------|---------------------|
| `startup` | Use the `uninstall`, `unattended` or `hidden` items to define the install process. Use the `license`, `logo` and `banner` items to specify a custom license file and custom logo and banner images. |
| `artifacts` | Use the [Glue42 Artifacts](#glue42_artifacts) as item types to control which artifacts to remove or make required. |
| `context` | Use the `setValue` item here to modify the installer window title, the download screen text, the folder name in the Windows Start Menu and more. |
| `shortcuts` | The `shortcut` item allows you to modify or remove predefined shortcuts for [Glue42 Artifacts](#glue42_artifacts) and also create brand new ones. |
| `welcome`, `previewAndConfirm`, `download`, `packages`, `uninstall` | These extensibility points are screens of the installer which represent stages of the install/uninstall process. Here you can use `run` items to run external programs, or `message` items to show messages to the user. |
| `finalizing` | Here you can use the `gdConfig` item to supply custom configuration files for **Glue42 Enterprise**. |
| `done` | This is the final installer screen. Use `showGD` and `launchGD` to open the folder containing the **Glue42 Enterprise** executable file or directly launch the **Glue42 Enterprise** executable file. Use the `exit` item to exit the install process with a specified exit code. |

The following is an example extensibility file content, listing some of the available extensibility points and items:

*Note that this is just for illustrative purposes. Some of the following settings don't make sense together.*

```json
{
    "startup": [
        // running the installer will uninstall Glue42 Enterprise by default
        "uninstall",

        // unattended installation/uninstallation
        "unattended",

        // NB: the installation can't run while certain applications are running,
        // e.g. a previous installation of Glue42 Enterprise, or Excel/Word/Outlook
        // (unless the corresponding plugin is disabled in the artifacts extensibility point)

        // By default, an unattended installer will exit with a non-zero exit code,
        // but you can make it retry by adding the following arguments:

        // - pop a message box for the user to dismiss (NB: this might cause
        // the installation to stall if there is no user present)
        // { "type": "unattended", "args": { "conflictHandling": "ask" } }

        // - retry 10 times, with an interval of 1 second
        // { "type": "unattended", "args": { "conflictHandling": "retry", "waitMs": 1000, "retries": 10 } }

        // hidden installation: similar to "unattended", but without showing a window
        "hidden",

        // use a predefined license file
        {
            "type": "license",
            "args": {
                // either path or url
                "file": "license.json",
                "url": "https://example.com/license.json"
            }
        },

        // logo to display in top-left corner
        {
            "type": "logo",
            "args": {
                // either path or url
                "file": "logo.png",
                "url": "https://example.com/logo.png",
                "onClick": "https://example.com/example"
            }
        },

        // large banner during installation
        {
            "type": "banner",
            "args": {
                // either path or url
                "file": "banner.png",
                "url": "https://example.com/banner.png",
                "onClick": "https://example.com/example"
            }
        }
    ],

    // change styling options
    "styles": [
        {
            "type": "color",
            "args": {
              "name": "Background",
              "value": "#eaeaea"
            }
        },
        {
            "type": "color",
            "args": {
              "name": "Foreground",
              "value": "#101010"
            }
        }
    ],

    // set various miscellaneous values
    "context": [
        {
            "type": "setValue",
            "args": {
                "name": "WindowName",
                "value": "ACME Interop Installer"
            }
        },
        // the ProductName value is used e.g. in the installer UI or when
        // creating a Control Panel uninstallation entry during installation
        {
            "type": "setValue",
            "args": {
                "name": "ProductName",
                "value": "ACME Interop Product"
            }
        }
        {
            "type": "setValue",
            "args": {
                "name": "StartMenuFolderName",
                "value": "ACME Interop Product"
            }
        },
        {
            "type": "setValue",
            "args": {
                "name": "BannerClickUrl",
                "value": "https://acme.test"
            }
        }
    ],

    "artifacts": [
        // don't install GlueXL artifact
        {
            "type": "GlueXL",
            "args": {
                "remove": true
            }
        },

        // make GlueOutlook artifact not selected by default;
        // in unattended installations, this is the same as "remove"
        {
            "type": "GlueOutlook",
            "args": {
                "checkedByDefault": false
            }
        },

        // make GlueWord artifact required
        {
            "type": "GlueWord",
            "args": {
                "required": true
            }
        }
    ],

    // modify or create shortcuts from the installer
    "shortcut": [
        {
            "type": "shortcut",
            "args": {
                "artifact": "GlueDesktop",
                "icon": "copy:acme.ico",
                "filename": "ACME Interop Product DEV",
                "desktop": false,
                "description": "ACME Interop Product DEV",
                "targetArguments": "-- config=config/system.json configOverrides config0=config/system-override-DEV.json"
            }
        },
        {
            "type": "shortcut",
            "args": {
                "artifact": "GlueDesktop",
                "icon": "copy:acme.ico",
                "filename": "ACME Interop Product UAT",
                "desktop": false,
                "description": "ACME Interop Product UAT",
                "targetArguments": "-- config=config/system.json configOverrides config0=config/system-override-UAT.json"
            }
        },
        {
            "type": "shortcut",
            "args": {
                "artifact": "GlueDesktop",
                "icon": "copy:acme.ico",
                "filename": "ACME Interop Product",
                "description": "ACME Interop Product",
                "targetArguments": "-- config=config/system.json configOverrides config0=config/system-override-PROD.json",
            }
        }
    ],

    // welcome screen
    "welcome": [
        {
            // run some script - depending on your purpose, you might want to either
            // do it here, or after the installation, in the "done" extensibility point
            "type": "run",
            "args": {
                "filename": "cmd.exe",
                "args": "/c somebatchfile.bat",
                // by default, exit code 0 is success,
                // while any other means error message, followed by installer exiting
                // you can override with "success" for success, any other string for error message
                // (error messages aren't shown in unattended installation to avoid stalling)
                "exitCode1": "There was an error validating your installation",
                "exitCode2": "There was an error contacting server",
                "exitCode3": "success",
                //other exit codes

                // whether to hide the started process
                "hide": true,

                // whether to hide the installer while the process is running
                "hideInstaller": false
            }
        }
    ],

    // ... other screens: downloadProgress, packages, previewAndConfirm, uninstall, ...

    "finalizing": [
        {
            "type": "gdConfig",
            "args": {
                // archive with custom config files for Glue42 Enterprise
                "file": "custom-config.zip",
                // If `false` (default), will merge the custom config files with the default ones from the installer
                // by replacing any default file with the respective custom config file with the same name.
                // If `true`, the default config files will be deleted and replaced by the specified custom config files.
                // This means that you must provide all required configuration files for Glue42 Enterprise to function properly.
                "wipe": false
            }
        }
    ],

    // final screen
    "done": [
        {
            // run a script after installation - you can use the %INSTALL_PATH%
            // environment variable to refer to the selected installation location
            "type": "run",
            "args": {
                "filename": "cmd.exe",
                "args": "/c copycustomfiles.bat",
                // by default, exit code 0 is success,
                // while any other means error message, followed by installer exiting
                // you can override with "success" for success, any other string for error message
                // (error messages aren't shown in unattended installation to avoid stalling)
                "exitCode1": "There was an error validating your installation",
                "exitCode2": "There was an error contacting server",
                "exitCode3": "success",
                //other exit codes

                // whether to hide the started process
                "hide": true,

                // whether to hide the installer while the process is running
                "hideInstaller": false
            }
        },

        // launch the Glue42 Enterprise executable
        "launchGD",

        // shows a message box
        {
            "type": "message",
            "args": {
                "text": "Don't forget to be awesome!",
                "title": "Reminder"
            }
        },

        // this is a good place to use a "run" item if something else needs to
        // happen after the installer is finished, e.g., run another installer
        // or copy custom files

        // exit from final screen without user having to click "Done"
        {
            "type": "exit",
            "args": {
                "exitCode": 0
            }
        }
    ]
}
```

## Installer UI

## Shortcuts

## Default Artifacts

## Custom Scripts

## Signing

## Unattended Mode

## Embedding the Client Key

## Example