export const checkClasses = (classes, props = {}) => {
  const classnames = {};

  if (classes) {
    Object.entries(classes).forEach(([cl, fn]) => {
      if (typeof fn === 'boolean') {
        classnames[cl] = fn;
      } else if (typeof fn === 'function') {
        const value =
          props && props.row && props.column && props.column.name
            ? props.row[props.column.name]
            : null;
        classnames[cl] = fn(value, props);
      } else {
        classnames[cl] = false;
      }
    });
  }
  return classnames;
};

export default {
  checkClasses,
};
