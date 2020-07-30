import _ from "lodash";
import { compose, ah, sh, WithRedux } from "common-data/datahelper";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import React from "react";

export const comparePaths = (
  path,
  current,
  previous,
  defaultValue,
  transfrom
) => {
  let cur = _.get(current, path, defaultValue);
  let pre = _.get(previous, path, defaultValue);

  if (_.isFunction(transfrom)) {
    cur = transfrom(_, cur);
    pre = transfrom(_, pre);
  }

  return {
    Current: cur,
    Previous: pre,
    HasChanged: cur !== pre,
  };
};

export function WithComponentState(options) {
  const outerWrapper = (lopts) => {
    return (WrappedComponent) => {
      const opts = _.merge(
        {
          propName: "AppData",
          clearOnUnmount: true,
        },
        lopts
      );

      if (_.isString(opts.stateKey) === false) {
        throw Error("Component State Wrapper must be passed a dataName prop!");
      }

      const appStateKey = `${opts.stateKey}_ComponentData`;

      class internalPlain extends React.Component {
        componentWillUnmount() {
          if (opts.clearOnUnmount === true) {
            const { AppStateClearValue } = this.props;
            AppStateClearValue(appStateKey);
          }
        }

        render() {
          const wrapperProps = {};

          const {
            AppData,
            AppStateSetValue,
            AppStateClearValue,
            AppStateAppendArray,
            AppStateUpdateArray,
            AppStateClearArray,
            ...rest
          } = this.props;

          wrapperProps.SetAppValue = (prop, value) => {
            AppStateSetValue(appStateKey, prop, value);
          };
          wrapperProps.ClearAppArray = (prop) => {
            AppStateClearArray(appStateKey, prop);
          };
          wrapperProps.UpdateAppArray = (
            prop,
            filterFunction,
            updateFunction,
            modifyFunction
          ) => {
            AppStateUpdateArray(
              appStateKey,
              prop,
              filterFunction,
              updateFunction,
              modifyFunction
            );
          };
          wrapperProps.AppendAppArray = (prop, value) => {
            AppStateAppendArray(appStateKey, prop, value);
          };
          wrapperProps.ClearAppValue = (prop) => {
            AppStateClearValue(appStateKey, prop);
          };
          wrapperProps[opts.propName || "AppData"] = AppData;

          return (
            <WrappedComponent
              {...wrapperProps}
              {...rest}
              StateKey={appStateKey}
            />
          );
        }
      }

      const internal = compose(
        WithRedux(
          [sh.AppState.GetValues(appStateKey)],
          [
            ah.AppState.SetValue,
            ah.AppState.ClearValue,
            ah.AppState.AppendArrayValue,
            ah.AppState.ClearArrayValue,
            ah.AppState.UpdateArrayValue,
          ]
        )
      )(internalPlain);

      return internal;
    };
  };

  if (_.isFunction(options)) {
    return outerWrapper({})(options);
  }

  return outerWrapper(options);
}

export const WithMediaQuery = (queries = []) => (Component) => (props) => {
  const mediaProps = {};
  queries.forEach((q) => {
    mediaProps[q[0]] = useMediaQuery(q[1]);
  });
  return <Component {...mediaProps} {...props} />;
};
