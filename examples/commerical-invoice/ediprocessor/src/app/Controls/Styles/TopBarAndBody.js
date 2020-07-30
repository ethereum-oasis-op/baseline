export const TopBarAndBody = {
  root: {
    display: "grid",
    height: "100%",
    width: "100%",
    gridTemplateRows: "max-content 1fr",
    gridAutoColumns: "1fr",
    gridTemplateAreas: '"topBar" "body"',
    position: "relative",
    boxSizing: "border-box",
  },
  topBar: {
    gridArea: "topBar",
    position: "relative",
  },
  body: {
    gridArea: "body",
    position: "relative",
  },
};
