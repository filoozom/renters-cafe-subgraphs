import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";

// Entities
import { getCafe } from "./cafe";

// Generated
import { Pool } from "../../generated/schema";

export function getPool(poolId: BigInt, block: ethereum.Block): Pool {
  const cafe = getCafe(block);
  let pool = Pool.load(poolId.toString());

  if (pool === null) {
    pool = new Pool(poolId.toString());
    pool.cafe = cafe.id;

    // Configuration
    pool.token = Address.zero();
    pool.allocation = BigInt.zero();
    pool.withdrawFee = 0;

    // State
    pool.lastRewardTimestamp = BigInt.zero();
    pool.accRentPerShare = BigInt.zero();
    pool.balance = BigInt.zero();
    pool.total = BigInt.zero();

    // Users
    pool.userCount = BigInt.zero();

    // Stats
    pool.rentHarvested = BigInt.zero();
    pool.feesCollected = BigInt.zero();
  }

  pool.timestamp = block.timestamp;
  pool.block = block.number;
  pool.save();

  return pool;
}
