import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";

// Entities
import { getProperty } from "./property";

// Generated
import { StealablePropertyOwner } from "../../../generated/schema";

export function getOwner(
  propertyId: BigInt,
  user: Address,
  block: ethereum.Block,
  transaction: ethereum.Transaction,
  counter: BigInt = BigInt.zero()
): StealablePropertyOwner {
  const id = `${transaction.hash.toHex()}-${counter.toString()}`;
  let owner = StealablePropertyOwner.load(id);

  if (owner === null) {
    owner = new StealablePropertyOwner(id);
    owner.property = getProperty(propertyId, block).id;
    owner.user = user;

    // Data
    owner.since = BigInt.zero();
    owner.price = BigInt.zero();

    // Derived
    owner.protectedUntil = BigInt.zero();
  }

  owner.timestamp = block.timestamp;
  owner.block = block.number;
  owner.save();

  return owner;
}
