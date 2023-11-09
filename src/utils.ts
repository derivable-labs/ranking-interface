export const cutAddress = (tx: String):String => {
    return `${tx.slice(0,6)}...${tx.slice(-6)}`
}