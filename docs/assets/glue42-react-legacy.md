## The Glux Library

The **Glux** package is an opinionated library providing Redux bindings for the Glue42 JavaScript library. With **Glux** you can start using Glue42 features in your `React`/`Redux` apps.

**Glux** is available as an `npm` package, which requires the Glue42 JavaScript and Redux libraries installed. To install the packages, navigate to the root directory of your project and run: 

```cmd
npm install --save @glue42/glux @glue42/desktop redux
```

Your `package.json` file should now have entries similar to these:

```json
{
  "dependencies": {
    "@glue42/desktop": "^4.5.7",
    "@glue42/glux": "0.0.1-alpha.1",
    "redux": "^4.0.4"
  }
}
```

*Keep in mind that the versions of the dependencies will probably be different from the example here due to newer package releases.*

## Adding the Glux Reducer

Add the **Glux** reducer to your root reducer. Note that the key used for the **Glux** reducer **must** be named `glue`:

```javascript
// reducers.js

import { createStore, combineReducers } from "redux";
import { glueReducer } from "@glue42/glux";
 
export const createRootReducer = () =>
  combineReducers({
    glue: glueReducer   // this key MUST be named "glue"
  });
```

## Adding the Glux Middleware

To apply the **Glux** middleware, call the `glueMiddleware()` factory function with a `Glue42` configuration object:

```javascript
// configureStore.js

import { applyMiddleware, createStore } from "redux"
import { glueMiddleware } from "@glue42/glux"
import { createRootReducer } from "./reducers"

// Glue42 configuration object
const glueConfig = {
    appManager: "full",
    windows: true,
    logger: true
}
 
const middlewares = [
    // this is where the Glue42 library is initialized
    glueMiddleware(glueConfig)  
]
 
export const configureStore = (initialState) {
    const store = createStore(
        createRootReducer(),
        initialState,
        applyMiddleware(...middlewares)
    )
 
    return store
}
```

## Usage Example

Now you can start using Glue42 idiomatically in the context of React and Redux via selectors and actions:

```javascript
import { actions, selectors} from "@glue42/glux";
 
const Applications = ({ startApplication, applications }) => (
  <table>
    {applications.map(application => (
        <tr>
            <td> {application.name} </td>
            <td>
                <button onClick={() => {startApplication(application)}}>
                    Start
                </button>
            </td>
        </tr>
    )}
  </table>
)
 
export default connect(
    state => ({
        applications: selectors.getApplications(state)
    }),
    dispatch => ({ ...bindActionCreators(actions, dispatch) })
)(Applications)
```