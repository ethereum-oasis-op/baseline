import { useEffect, useMemo, useState } from "react";
import { createUseStyles } from "react-jss";
import Modal from ".";

const COLUMNS = ["A", "B", "C", "D", "E", "F"];
const ROWS = [1, 2, 3, 4, 5, 6];

const useStyles = createUseStyles({
  body: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    justifyContent: "space-between",
  },
  cta: {
    border: "1px solid #959595",
    borderRadius: "3px",
    background: "#D4D4D4",
    cursor: "pointer",
    marginTop: "114px",
    padding: "14px 26px",
  },
  ctaContainer: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
  },
  dropdowns: {
    display: "flex",
    justifyContent: "space-between",
    width: "400px",
  },
});

export default function CoordinateModal({
  coordinate,
  hitCoordinates,
  onClose,
  open,
  setCoordinate,
}) {
  const styles = useStyles();
  const [col, setCol] = useState(null);
  const [row, setRow] = useState(null);

  const handleSelect = () => {
    setCoordinate({ col, row });
    onClose();
  };

  const valid = useMemo(() => col && row, [col, row]);

  useEffect(() => {
    setCol(null);
    setRow(null);
  }, [open]);

  return (
    <Modal
      onClose={onClose}
      open={open}
      style={{
        background: "#FFFFFF",
        borderRadius: "8px",
        height: "400px",
        padding: "32px",
      }}
    >
      <div className={styles.body}>
        <div className={styles.dropdowns}>
          <div>
            <div>Column: </div>
            <select onChange={(e) => setCol(e.target.value)} value={col}>
              {COLUMNS.map((col) => (
                <option>{col}</option>
              ))}
            </select>
          </div>
          <div>
            <div>Row: </div>
            <select onChange={(e) => setRow(e.target.value)} value={row}>
              {ROWS.map((row) => (
                <option>{row}</option>
              ))}
            </select>
          </div>
        </div>
        <div className={styles.ctaContainer}>
          <div className={styles.cta} onClick={() => onClose()}>
            Cancel
          </div>
          <div
            className={styles.cta}
            onClick={() => valid && handleSelect()}
            style={{
              cursor: valid ? "pointer" : "default",
              opacity: valid ? 1 : 0.3,
            }}
          >
            Select
          </div>
        </div>
      </div>
    </Modal>
  );
}
