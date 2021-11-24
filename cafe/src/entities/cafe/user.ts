import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";

// Entities
import { getPool } from "./pool";

// Generated
import { User } from "../../../generated/schema";

export function getUser(
  address: Address,
  poolId: BigInt,
  block: ethereum.Block
): User {
  const id = `${poolId.toString()}-${address.toHex()}`;
  let user = User.load(id);

  if (user === null) {
    user = new User(id);

    // User
    user.address = address;
    user.pool = getPool(poolId, block).id;

    // State
    user.balance = BigInt.zero();
    user.total = BigInt.zero();
    user.debt = BigInt.zero();
    user.rentHarvested = BigInt.zero();

    // Stats
    user.feesPaid = BigInt.zero();
  }

  user.timestamp = block.timestamp;
  user.block = block.number;
  user.save();

  return user;
}
