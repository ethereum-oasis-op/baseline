import { useMemo, useState } from "react";
import { createUseStyles } from "react-jss";
import CoordinateModal from "../../components/Modal/CoordinateModal";

const SQUARES = new Array(6).fill("").map((_) => new Array(6).fill(""));
const LETTERS = ["A", "B", "C", "D", "E", "F"];

const useStyles = createUseStyles({
  body: {
    fontSize: "24px",
    fontWeight: 400,
    lineHeight: "29px",
  },
  console: {
    background: "#666666",
    color: "#00FF85",
    fontWeight: 300,
    marginTop: "40x",
    minHeight: "327px",
    padding: "27px 14px",
  },
  container: {
    display: "flex",
    padding: "12px 31px",
    minHeight: "100vh",
  },
  coordinateBadge: {
    alignItems: "center",
    background: "#FFFFFF",
    border: "2px solid #666666",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    fontSize: "36px",
    fontWeight: 400,
    justifyContent: "center",
    lineHeight: "44px",
    padding: "6px",
    textAlign: "center",
  },
  cta: {
    border: "1px solid #959595",
    borderRadius: "3px",
    background: "#D4D4D4",
    cursor: "pointer",
    marginTop: "114px",
    padding: "14px 26px",
  },
  dot: {
    borderRadius: "50%",
    height: "28px",
    width: "28px",
  },
  enterCoordinates: {
    fontSize: "14px",
    fontWeight: 300,
    lineHeight: "24px",
  },
  heading: {
    fontSize: "42px",
    fontWeight: 500,
    lineHeight: "51px",
  },
  label: {
    fontSize: "32px",
    fontWeight: 300,
    lineHeight: "39px",
  },
  launchContainer: {
    background: "#C4C4C4",
    display: "flex",
    marginTop: "4px",
    padding: "12px",
  },
  launchCTA: {
    background: "#D4D4D4",
    fontSize: "25px",
    fontWeight: 400,
    lineHeight: "30px",
    padding: "18px 7px 21px 7px",
  },
  left: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    marginRight: "20px",
    width: "100%",
  },
  moveContainer: {
    border: "2px solid #000000",
    marginTop: "20px",
    padding: "6px 12px 12px 12px",
  },
  right: {
    flexShrink: 0,
    width: "267px",
  },
  row: {
    alignItems: "center",
    display: "flex",
    marginTop: "1px",
  },
  square: {
    alignItems: "center",
    border: "2px solid #666666",
    display: "flex",
    flexDirection: "column",
    height: "76px",
    justifyContent: "center",
    marginRight: "1px",
    width: "76px",
  },
  top: {
    fontSize: "28px",
    fontWeight: 400,
    marginBottom: "20px",
    textAlign: "center",
  },
});

export default function Game() {
  const [consoleMessages, setConsoleMessages] = useState(["ready"]);
  const [coordinate, setCoordinate] = useState({ col: null, row: null });
  const [selected, setSelected] = useState({ end: null, front: null });
  const [showConsole, setShowConsole] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [usedCoordinates, setUsedCoordinates] = useState([]);
  const [validPositions, setValidPositions] = useState([]);
  const styles = useStyles();

  const bothSelected = useMemo(() => {
    return selected.end && selected.front;
  }, [selected]);

  const coordinateSelected = useMemo(() => {
    return coordinate.col && coordinate.row;
  }, [coordinate]);

  //   const calculateValidPositions = (pos) => {
  //     const valid = [];
  //     for (let i = 1; i < 36; i++) {
  //       if (i == pos + 2 || i === pos - 2) {
  //         valid.push(i);
  //       }
  //     }
  //     setValidPositions(valid);
  //   };

  const handleSelect = (pos) => {
    selectPosition(pos);
    if (!selected.front) {
      // calculateValidPositions(pos);
    }
  };

  const launch = () => {
    setCoordinate({ col: null, row: null });
    setConsoleMessages([
      ...consoleMessages,
      `Launching ZKP ${coordinate.col}${coordinate.row}`,
    ]);
    const coordinateIndex = Number(
      [coordinate.col].toString().charCodeAt(0) - 65 + coordinate.row * 6
    );
    setUsedCoordinates(
      [...usedCoordinates, coordinateIndex].sort((a, b) => b - a)
    );
  };

  const isSelected = (index) => {
    return index === selected.end || index === selected.front;
  };

  const selectPosition = (index) => {
    if (index === selected.front) {
      setSelected({
        ...selected,
        front: null,
      });
    } else if (selected.front) {
      setSelected({
        ...selected,
        end: index,
      });
    } else {
      setSelected({
        ...selected,
        front: index,
      });
    }
  };

  const shipPath = (pos) => {
    if (!selected.front || !selected.end) return false;
    if (Math.abs(selected.front - selected.end) < 6) {
      if (selected.front <= selected.end) {
        if (pos >= selected.front && pos <= selected.end) {
          return true;
        }
      }
      if (selected.front >= selected.end) {
        if (pos >= selected.end && pos <= selected.front) {
          return true;
        }
      }
    } else {
      if (selected.front <= selected.end) {
        if (
          (pos + selected.front) % 6 === 1 &&
          pos >= selected.front &&
          pos <= selected.end
        ) {
          return true;
        }
      }
    }

    return false;
  };

  //   const validPositionHelper = (seen, pos) => {
  //     const stop = pos < 0 || pos > 36 || seen.includes(pos);
  //     // const invalid = pos + 1;
  //     // if(!invalid) {
  //     //     setValidPositions([...validPositions, pos]);
  //     // }
  //     if (stop) return;
  //     seen.push(pos);
  //     validPositionHelper(seen, pos - 1);
  //     validPositionHelper(seen, pos + 1);
  //   };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div>
          {SQUARES.map((row, index) => (
            <>
              <>
                {index === 0 && (
                  <div style={{ display: "flex" }}>
                    <div style={{ marginRight: "10px", width: "20px" }} />
                    {LETTERS.map((letter) => (
                      <div
                        className={styles.label}
                        style={{
                          marginRight: "5px",
                          width: "76px",
                          textAlign: "center",
                        }}
                      >
                        {letter}
                      </div>
                    ))}
                  </div>
                )}
              </>
              <div className={styles.row}>
                <div
                  className={styles.label}
                  style={{ marginRight: "10px", width: "20px" }}
                >
                  {index + 1}
                </div>
                {row.map((_, index2) => (
                  <>
                    <div
                      className={styles.square}
                      onClick={() =>
                        !bothSelected && handleSelect((index + 1) * 6 + index2)
                      }
                      style={{
                        background: shipPath((index + 1) * 6 + index2)
                          ? "#C4C4C4"
                          : "#FFFFFF",
                        cursor: !bothSelected ? "pointer" : "default",
                      }}
                    >
                      {isSelected((index + 1) * 6 + index2) && (
                        <div
                          className={styles.dot}
                          style={{ background: "#C4C4C4" }}
                        />
                      )}
                      {validPositions.includes((index + 1) * 6 + index2) && (
                        <div
                          className={styles.dot}
                          style={{ background: "#E5CF27" }}
                        />
                      )}
                      {usedCoordinates.includes((index + 1) * 6 + index2) && (
                        <div
                          className={styles.dot}
                          style={{ background: "#F72A2A" }}
                        />
                      )}
                    </div>
                  </>
                ))}
              </div>
            </>
          ))}
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.heading}>BATTLELINE</div>
        <div className={styles.moveContainer}>
          <div className={styles.top}>Place Ships</div>
          {!showConsole ? (
            <>
              <div className={styles.body}>
                Placing your ships adds their position to the system of record.{" "}
                <br />
                <br />
                Drag them to the desired location in your system of record
              </div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <div className={styles.cta} style={{ marginRight: "15px" }}>
                  Back
                </div>
                <div
                  className={styles.cta}
                  onClick={() => bothSelected && setShowConsole(true)}
                  style={{
                    cursor: bothSelected ? "pointer" : "default",
                    opacity: bothSelected ? 1 : 0.3,
                  }}
                >
                  Next
                </div>
              </div>
            </>
          ) : (
            <>
              <div className={styles.console}>
                {consoleMessages.map((message) => (
                  <div style={{ marginTop: "15px" }}>{message}</div>
                ))}
              </div>
              <div className={styles.launchContainer}>
                <div
                  className={styles.coordinateBadge}
                  onClick={() => setShowModal(true)}
                  style={{ marginRight: "10px" }}
                >
                  {coordinateSelected ? (
                    <div>{`${coordinate.col}${coordinate.row}`}</div>
                  ) : (
                    <div className={styles.enterCoordinates}>ENTER COORDS</div>
                  )}
                </div>
                <div
                  className={styles.launchCTA}
                  onClick={() => coordinateSelected && launch()}
                  style={{
                    cursor: coordinateSelected ? "pointe" : "default",
                    opacity: coordinateSelected ? 1 : 0.3,
                  }}
                >
                  Launch
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <CoordinateModal
        coordinate={coordinate}
        onClose={() => setShowModal(false)}
        open={showModal}
        setCoordinate={setCoordinate}
      />
    </div>
  );
}
