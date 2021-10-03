import ReactModal from "react-modal";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    border: "none",
    borderRadius: "0px",
    zIndex: 100001,
    padding: 0,
  },
  overlay: {
    backgroundColor: "rgb(0,0,0,0.4)",
    border: "none",
    zIndex: 100000,
  },
};

ReactModal.setAppElement("#root");

export default function Modal({ children, onClose, open, style }) {
  const modalStyles = {
    content: { ...customStyles.content, ...style },
    overlay: { ...customStyles.overlay },
  };
  return (
    <ReactModal
      isOpen={open}
      onRequestClose={onClose}
      style={modalStyles}
      contentLabel="modal"
    >
      <div style={{ position: "relative" }}>{children}</div>
    </ReactModal>
  );
}
