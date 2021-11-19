import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";

// Entities
import { getPool } from "./pool";

// Generated
import { LP } from "../../generated/schema";
import { ERC20 } from "../../generated/Cafe/ERC20";

export function getLP(
  address: Address,
  poolId: BigInt,
  block: ethereum.Block
): LP {
  const pool = getPool(poolId, block);
  let lp = LP.load(address.toHex());

  if (lp === null) {
    const token = ERC20.bind(address);
    lp = new LP(address.toHex());
    lp.pool = pool.id;

    // Configuration
    lp.symbol = token.symbol();
    lp.name = token.name();
  }

  lp.timestamp = block.timestamp;
  lp.block = block.number;
  lp.save();

  return lp;
}
