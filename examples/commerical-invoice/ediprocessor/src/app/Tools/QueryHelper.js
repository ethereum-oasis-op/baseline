import _ from "lodash";
import { compose, ah, sh, WithRedux } from "common-data/datahelper";
import React from "react";
import axios from "axios";
import { withSnackbar } from "notistack";

export const displayRuleMessages = (enqueueSnackbar) => {
  return (messages) => {
    if (_.isArray(messages) === false) {
      enqueueSnackbar("Submit Failed!  Error is not Collection", {
        variant: "error",
      });
    } else {
      const ruleMessages = _.filter(messages, { Type: "Rule" });

      if (ruleMessages.length > 0) {
        _.each(ruleMessages, (rm) => {
          enqueueSnackbar(rm.Message, {
            variant: "warning",
          });
        });
      }
    }
  };
};

export function WithQuery(options) {
  const outerWrapper = (lopts) => {
    return (WrappedComponent) => {
      const opts = _.merge(
        {
          propName: "QueryData",
          clearOnUnmount: true,
        },
        lopts
      );

      if (_.isString(opts.stateKey) === false) {
        throw Error("Query Wrapper must be passed a dataName prop!");
      }

      const appStateKey = `${opts.stateKey}_QueryData`;

      class internalPlain extends React.Component {
        getQueryProps = _.once(() => {
          const {
            AppStateSetValue,
            AppStateClearValue,
            AppStateAppendArray,
            AppStateUpdateArray,
            AppStateClearArray,
            enqueueSnackbar,
          } = this.props;

          const ret = {};

          _.forEach(opts.actions, (a) => {
            if (ret[a.prop]) {
              throw new Error(
                "Query Wrapper action prop name already assigned!"
              );
            }

            if ((a.mapIsArray === true) & (_.isString(a.map) === true)) {
              ret[`${a.map}Update`] = (
                filterFunction,
                updateFunction,
                modifyFunction
              ) => {
                AppStateUpdateArray(
                  appStateKey,
                  a.map,
                  filterFunction,
                  updateFunction,
                  modifyFunction
                );
              };
              ret[`${a.map}Append`] = (values) => {
                AppStateAppendArray(appStateKey, a.map, values);
              };
              ret[`${a.map}Clear`] = () => {
                AppStateClearArray(opts);
              };
            } else if (_.isString(a.map) === true) {
              ret[`${a.map}Set`] = (value) => {
                AppStateSetValue(appStateKey, a.map, value);
              };
              ret[`${a.map}Clear`] = () => {
                AppStateClearValue(appStateKey, a.map);
              };
            }

            ret[a.prop] = (data, loadMore = false) => {
              const { AppData } = this.props;

              AppStateSetValue(appStateKey, `${a.prop}Loading`, true);

              let queryParams;
              if (a.mapIsArray === true) {
                queryParams = _.merge({ Skip: 0 }, data);
              } else {
                queryParams = _.merge({}, data);
              }

              if (
                loadMore === true &&
                (_.isString(a.map) || _.isFunction(a.map))
              ) {
                queryParams.Skip = (AppData[`${a.prop}SkipCount`] || 0) + 1;
              }

              const lastCallCount = AppData[`${a.prop}CallCount`] || 0;

              const webCall = new Promise((resolve, reject) => {
                axios({
                  url: a.url,
                  data: queryParams,
                  crossDomain: true,
                  method: "post",
                  //   headers: {
                  //     token: Storage.Get('SecToken') || ''
                  //   }
                })
                  .then((resp) => {
                    if (resp.data.Status !== "Success") {
                      _.each(resp.data.Messages, (m) => {
                        if (m.Type === "Info") {
                          enqueueSnackbar(m.Message, {
                            variant: "info",
                          });
                        } else if (m.Type === "Warning") {
                          enqueueSnackbar(m.Message, {
                            variant: "warning",
                          });
                        } else if (m.Type === "Rule") {
                          if (m.Field === "_error") {
                            enqueueSnackbar(m.Message, {
                              variant: "error",
                            });
                          }
                        } else if (m.Type !== "Rule") {
                          enqueueSnackbar(m.Message, {
                            variant: "error",
                          });
                        }
                      });
                      AppStateSetValue(appStateKey, `${a.prop}Loading`, false);
                      reject(resp.data.Messages);
                    } else {
                      // process only the info and warning messages if any
                      _.each(resp.data.Messages, (m) => {
                        if (m.Type === "Info") {
                          enqueueSnackbar(m.Message, {
                            variant: "info",
                          });
                        } else if (m.Type === "Warning") {
                          enqueueSnackbar(m.Message, {
                            variant: "warning",
                          });
                        } else if (m.Type === "Error") {
                          enqueueSnackbar(m.Message, {
                            variant: "error",
                          });
                        }
                      });

                      if (_.isString(a.map)) {
                        if (queryParams.Skip > 0) {
                          AppStateAppendArray(
                            appStateKey,
                            a.map,
                            resp.data.ReturnValue
                          );
                        } else {
                          AppStateSetValue(
                            appStateKey,
                            a.map,
                            resp.data.ReturnValue
                          );
                        }

                        if (a.mapIsArray === true) {
                          if (
                            resp.data.ReturnValue.length === queryParams.Limit
                          ) {
                            AppStateSetValue(
                              appStateKey,
                              `${a.map}HasMore`,
                              true
                            );
                          } else {
                            AppStateSetValue(
                              appStateKey,
                              `${a.map}HasMore`,
                              false
                            );
                          }
                        }

                        AppStateSetValue(
                          appStateKey,
                          `${a.prop}SkipCount`,
                          queryParams.Skip
                        );
                      } else if (_.isFunction(a.map)) {
                        const mapResult = a.map(
                          resp.data.ReturnValue,
                          queryParams.Skip
                        );
                        if (!_.isEmpty(mapResult)) {
                          _.forEach(_.keys(mapResult), (k) => {
                            AppStateSetValue(appStateKey, k, mapResult[k]);
                          });
                        }
                        AppStateSetValue(
                          appStateKey,
                          `${a.prop}SkipCount`,
                          queryParams.Skip
                        );
                      }

                      AppStateSetValue(appStateKey, `${a.prop}Loading`, false);
                      AppStateSetValue(
                        appStateKey,
                        `${a.prop}CallCount`,
                        lastCallCount + 1
                      );

                      resolve({
                        data: resp.data.ReturnValue,
                        extra: resp.data.ExtraData,
                      });
                    }
                  })
                  .catch((err) => {
                    const { status } = err.response;
                    if (status === 401) {
                      // store.dispatch(ClearSettings())
                      // store.dispatch(ClearUser())
                      // store.dispatch(CloseDrawer('all'))
                      // store.dispatch(ClearAccount())
                      // sendToURL(store.dispatch)('/Login')
                      // ShowError('Invalid Authentication Token! Please login again.')
                      enqueueSnackbar(
                        "Invalid Authentication Token! Please login again.",
                        {
                          variant: "error",
                        }
                      );
                      reject([
                        {
                          Type: "Authentication",
                          Message:
                            "Invalid Authentication Token! Please login again.",
                        },
                      ]); //eslint-disable-line
                    } else {
                      enqueueSnackbar(
                        (err || {}).message || "Unexpected Error :(",
                        {
                          variant: "error",
                        }
                      );
                      reject(err);
                    }
                    AppStateSetValue(appStateKey, `${a.prop}Loading`, false);
                  });
              });
              return webCall;
            };
          });

          return ret;
        });

        render() {
          const { AppData, enqueueSnackbar } = this.props;

          const queryProps = this.getQueryProps();
          const wrapperProps = { ...queryProps };
          wrapperProps[opts.propName] = AppData;
          wrapperProps.displayRuleMessages = displayRuleMessages(
            enqueueSnackbar
          );

          return <WrappedComponent {...this.props} {...wrapperProps} />;
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
        ),
        withSnackbar
      )(internalPlain);

      return internal;
    };
  };

  if (_.isFunction(options)) {
    return outerWrapper({})(options);
  }

  return outerWrapper(options);
}
