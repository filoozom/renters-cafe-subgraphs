import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";

// Entities
import { getFactory } from "./factory";

// Generated
import { StealableProperty } from "../../../generated/schema";

export function getProperty(
  propertyId: BigInt,
  block: ethereum.Block,
  factoryAddress: Address | null = null
): StealableProperty {
  let property = StealableProperty.load(propertyId.toString());

  if (property === null) {
    const factory = getFactory(block, factoryAddress);

    property = new StealableProperty(propertyId.toString());
    property.factory = factory.id;

    // Properties
    property.cap = BigInt.zero();
    property.minted = BigInt.zero();
    property.multiplier = BigInt.zero();
    property.bonus = BigInt.zero();
    property.protection = BigInt.zero();
    property.pools = [];

    // Steals
    property.startRatio = BigInt.zero();
    property.endRatio = BigInt.zero();
    property.duration = BigInt.zero();
    property.keepRatio = BigInt.zero();

    // Upstream mints
    property.stealMints = BigInt.zero();
    property.stealMintsDone = BigInt.zero();

    // Stats
    property.timesStolen = BigInt.zero();

    // Owners
    property.owners = [];
  }

  property.timestamp = block.timestamp;
  property.block = block.number;
  property.save();

  return property;
}
