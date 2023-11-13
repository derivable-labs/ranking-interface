import { getRank } from "ranking-tools";
import { useMemo, useState } from "react";
import { cutAddress } from "./utils";
function App() {
  const [rank, setRanking] = useState<{ address: string; balance: string }[]>(
    []
  );
  const [illegalWallets, setIllegalWallets] = useState<
    { address: String; reason: String; txHash: String }[]
  >([]);
  const [logsStatus, setLogsStatus] = useState<string>("");
  const [priceStatus, setPriceStatus] = useState<string>("");
  const [participationStatus, setParticipationStatus] = useState<string>("");
  const [computeStatus, setComputeStatus] = useState<string>("");
  useMemo(() => {
    console.log("request");
    getRank(
      (fromBlock, toBlock) => {
        setLogsStatus(
          `Retrieving in-progress logs from block ${fromBlock} to block ${toBlock}...`
        );
      },
      (numLogs) => {
        setLogsStatus(`Received ${numLogs} logs`);
      },
      // Price Inprogress
      (pools) => {
        setPriceStatus(
          `Processing price in-progress with ${pools.length} pools...`
        );
      },
      (poolsSpot) => {
        setPriceStatus("Price in-progress processing is successfully done.");
      },
      (participatingWallets, illegalWallets) => {
        console.log(participatingWallets, illegalWallets);
        setParticipationStatus(
          `Identified ${participatingWallets.length} participating wallets` +
            `\n Detected ${illegalWallets.length} illegal wallets`
        );
        setIllegalWallets(illegalWallets);
      },
      (computes) => {
        setComputeStatus(
          `Processing compute in-progress with ${computes.length} computes...`
        );
      },
      (computesValue) => {
        setComputeStatus(
          "Compute in-progress processing is successfully done."
        );
      }
    )
      .then((res) => {
        setRanking(res?.results || []);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [
    setRanking,
    setIllegalWallets,
    setComputeStatus,
    setLogsStatus,
    setParticipationStatus,
    setPriceStatus,
  ]);
  return (
    <div style={{ background: "" }}>
      {rank.length === 0 ? (
        <div>
          <p>------- Loading Status -------</p>
          <p> {logsStatus} </p>
          <p> {participationStatus} </p>
          <p> {priceStatus} </p>
          <p> {computeStatus} </p>
        </div>
      ) : (
        ""
      )}
      {rank.length !== 0 ? <p>------- Participate Wallets -------</p> : ""}
      {rank.length !== 0
        ? rank.map((r, _) => {
            return (
              <div>
                <p style={{ color: _ >= 15 ? "gray" : "black" }}>
                  <code>
                    {_ + 1}. {r.address.substring(0, 10)}..
                    {r.address.substring(34)} = $ {Number(r.balance).toFixed(0)}
                  </code>
                </p>
              </div>
            );
          })
        : ""}
      {illegalWallets.length !== 0 ? (
        <p>------- Illegal Wallets -------</p>
      ) : (
        ""
      )}
      {illegalWallets.length !== 0
        ? illegalWallets.map((r, _) => {
            return (
              <div>
                <p style={{ color: _ >= 15 ? "gray" : "black" }}>
                  Tx:{" "}
                  <a href={`https://bscscan.com/tx/${r.txHash}`}>
                    {cutAddress(r.txHash)}
                  </a>{" "}
                  | {r.address} | {r.reason}
                </p>
              </div>
            );
          })
        : ""}
    </div>
  );
}

export default App;
