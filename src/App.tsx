import { getRank } from "ranking-tools";
import { useEffect, useState } from "react";
import { cutAddress } from "./utils";
function App() {
  const [rank, setRanking] = useState<{ address: string; balance: string }[]>(
    []
  );
  const [illegalWallets, setIllegalWallets] = useState<
    { address: String; reason: String; txHash: String }[]
  >([]);
  const [status, setStatus] = useState<string[]>([]);
  useEffect(() => {
    console.log("request");
    getRank(
      (fromBlock, toBlock) => {
        console.log(fromBlock, toBlock);
        setStatus([
          ...status,
          `Retrieving in-progress logs from block ${fromBlock} to block ${toBlock}...`,
        ]);
      },
      (numLogs) => {
        console.log(numLogs);
        setStatus([...status, `Received ${numLogs} logs`]);
      },
      (participatingWallets, illegalWallets) => {
        console.log(participatingWallets, illegalWallets);
        setStatus([
          ...status,
          `Identified ${participatingWallets.length} participating wallets`,
          `Detected ${illegalWallets.length} illegal wallets`,
        ]);
        setIllegalWallets(illegalWallets);
      }
    )
      .then((res) => {
        setRanking(res?.results || []);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [setRanking, setIllegalWallets, setStatus]);
  return (
    <div style={{ background: "" }}>
      {rank.length !== 0 ? <p>------- Participate Wallets -------</p> : ''}
      {rank.length !== 0
        ? rank.map((r, _) => {
            return (
              <div>
                <p style={{ color: _ >= 15 ? "gray" : "black" }}>
                  <code>{_ + 1}. {r.address.substring(0,10)}..{r.address.substring(34)} = $ {Number(r.balance).toFixed(0)}</code>
                </p>
              </div>
            );
          })
        : ""}
      {illegalWallets.length !== 0 ? <p>------- Illegal Wallets -------</p> : ''}
      {illegalWallets.length !== 0
        ? illegalWallets.map((r, _) => {
            return (
              <div>
                <p style={{ color: _ >= 15 ? "gray" : "black" }}>
                  Tx: <a href={`https://bscscan.com/tx/${r.txHash}`}>
                    {cutAddress(r.txHash)}
                  </a> | {r.address} | {r.reason}
                </p>
              </div>
            );
          })
        : ""}
      {status.length !== 0 ? <p>------- Loading Status -------</p> : ''}
      {status.map((s, _) => {
        return (
          <p>
            {_ + 1}. {s}
          </p>
        );
      })}
    </div>
  );
}

export default App;
