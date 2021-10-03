import { createUseStyles } from "react-jss";
import { useState } from "react";
import { useHistory } from "react-router";
import { BattlelineLocation } from "../../Locations";
import FadeIn from "react-fade-in/lib/FadeIn";
import {
  authOrg,
  authUser,
  deployContract,
  getKeys,
  getOrganization,
  getVault,
} from "../../api";

const useStyles = createUseStyles({
  cta: {
    background: "#D4D4D4",
    border: "1px solid #959595",
    borderRadius: "3px",
    cursor: "pointer",
    fontSize: "32px",
    fontWeight: 400,
    lineHeight: "38px",
    padding: "13px 43px",
  },
  ctaContainer: {
    display: "flex",
    marginTop: "165px",
  },
  description: {
    fontSize: "28px",
    fontWeight: 300,
    lineHeight: "34px",
    marginTop: "9px",
    maxWidth: "521px",
  },
  error: {
    color: "#FF0000",
    marginTop: "15px",
  },
  heading: {
    fontSize: "48px",
    fontWeight: 600,
    lineHeight: "59px",
  },
  input: {
    alignItems: "center",
    background: "#C4C4C4",
    display: "flex",
    padding: "5px",
    width: "306px",
    "& input": {
      background: "transparent",
      border: "none",
      fontSize: "32px",
      outline: "none",
      width: "100%",
    },
  },
  organization: {
    fontSize: "24px",
    fontWeight: 700,
    lineHeight: "29px",
  },
  preplayMessage: {
    fontSize: "24px",
    fontWeight: 400,
    lineHeight: "29px",
    margin: "60px 0px",
    maxWidth: "487px",
  },
  wrapper: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    height: "100vh",
  },
});

export default function Home() {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [password, setPassword] = useState("");
  const [play, setPlay] = useState(false);
  const [text, setText] = useState("");
  const styles = useStyles();

  const apiCall = async () => {
    const res = await fetch(
      // `https://ident.provide.services/api/v1/applications/${process.env.REACT_APP_APPLICATION_ID}/users`,
      // `https://ident.provide.services/api/v1/applications/${process.env.REACT_APP_APPLICATION_ID}/organizations`,
      // `https://vault.provide.services/api/v1/vaults/${process.env.REACT_APP_VAULT_ID}/keys`,
      // `https://ident.provide.services/api/v1/tokens`,
      "https://vault.provide.services/api/v1/vaults",
      {
        headers: {
          authorization: `bearer ${process.env.REACT_APP_USER_BEARER_TOKEN}`,
          "content-type": "application/json",
        },
        // method: "POST",
        // body: JSON.stringify({
        //   name: 'Vault 101',
        //   description: 'This is a test vault'
        // }),
      }
    );
    const data = await res.json();
    console.log("RES: ", data);
  };

  const login = async () => {
    try {
      const authRes = await authUser(email, password);
      if (
        authRes.message === "invalid email" ||
        authRes.message === "authentication failed with given credentials"
      ) {
        setError(true);
      } else {
        const { token } = authRes.token;
        const vaultRes = await getVault(token);
        const { id: vaultId } = vaultRes[0];
        const orgRes = await getOrganization(token);
        const { id } = orgRes[0];
        const { token: orgToken } = await authOrg(token, id);
        const keyRes = await getKeys(token, vaultId);
        const keys = keyRes
          .filter(({ spec }) => spec === "Ed25519" || spec === "secp256k1")
          .map(({ public_key, spec }) => ({
            public_key,
            spec,
          }));
        const res = await fetch(
          "https://nchain.provide.services/api/v1/networks?public=true",
          {
            headers: {
              authorization: `bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        const { id: rinkeby_id } = data[1];
        const payload = {
          id: rinkeby_id,
        };
        console.log("PAYLOAD: ", payload);
        const contractRes = await deployContract(token, rinkeby_id);
      }
    } catch (err) {
      setError(true);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.heading}>BATTLELINE</div>
      <div className={styles.description}>
        {play
          ? "Your Team"
          : "A Battleship style game built using the Baseline Protocol"}
      </div>
      {play && (
        <div className={styles.preplayMessage}>
          {/* Your team, or{" "}
          <span className={styles.organization}>organization</span>, will be a
          counterparty in the battlefield */}
          Enter email and password to play
        </div>
      )}
      {!play ? (
        <div className={styles.ctaContainer}>
          <div className={styles.cta} style={{ marginRight: "20px" }}>
            Learn More
          </div>
          <div
            className={styles.cta}
            style={{ width: "141px" }}
            onClick={() => setPlay(true)}
          >
            Play
          </div>
        </div>
      ) : (
        <>
          <div>Email </div>
          <div className={styles.input} style={{ marginTop: "10px" }}>
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="text"
              value={email}
            />
          </div>
          <div style={{ marginTop: "10px" }}>Password:</div>
          <div className={styles.input}>
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              value={password}
            />
          </div>
          {error && (
            <FadeIn>
              <div className={styles.error}>Invalid credentials.</div>
            </FadeIn>
          )}
          <div
            className={styles.cta}
            onClick={() => login()}
            style={{ marginTop: "20px" }}
          >
            Start
          </div>
        </>
        // <div>Enter Username and Password</div>
        // <div style={{ display: "flex", maxWidth: "487px" }}>
        //   <div className={styles.input}>
        //     <input
        //       onChange={(e) => setText(e.target.value)}
        //       value={text}
        //       type="text"
        //     />
        //   </div>
        //   <div
        //     className={styles.cta}
        //     onClick={() => history.push(BattlelineLocation)}
        //   >
        //     Next
        //   </div>
        // </div>
      )}
      {/* <div onClick={() => apiCall()}>Call</div> */}
    </div>
  );
}
