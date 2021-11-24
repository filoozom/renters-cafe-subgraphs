import { store, BigInt } from "@graphprotocol/graph-ts";

// Entities
import { getProperty } from "./entities/stealable-properties/property";
import { getOwner } from "./entities/stealable-properties/owner";
import { getFactory } from "./entities/stealable-properties/factory";

// Lib
import { addToArray } from "./lib/tools";

// Generated
import {
  ApprovalForAll,
  Paused,
  PropertyCreated,
  PropertyStolen,
  RoleAdminChanged,
  RoleGranted,
  RoleRevoked,
  TransferBatch,
  TransferSingle,
  URI,
  Unpaused,
} from "../generated/StealableProperties/StealableProperties";

export function handlePropertyCreated(event: PropertyCreated): void {
  const property = getProperty(event.params.id, event.block);

  // Properties
  property.cap = event.params.cap;
  property.multiplier = event.params.multiplier;
  property.bonus = event.params.bonus;
  property.protection = event.params.protection;
  property.pools = event.params.poolIds.map<string>((id) => id.toString());

  // Steals
  property.startRatio = event.params.startRatio;
  property.endRatio = event.params.endRatio;
  property.duration = event.params.duration;
  property.keepRatio = event.params.keepRatio;

  // Upstream mints
  property.stealMints = event.params.stealMints;
  property.save();
}

export function handlePropertyStolen(event: PropertyStolen): void {
  // Property
  const property = getProperty(event.params.id, event.block);

  // New owner
  const owner = getOwner(
    event.params.id,
    event.params.by,
    event.block,
    event.transaction
  );

  // Data
  owner.since = event.block.timestamp;
  owner.price = event.params.price;

  // Derived
  owner.protectedUntil = event.block.timestamp.plus(property.protection);
  owner.save();

  // Update property
  if (event.params.stealMint) {
    property.stealMintsDone = property.stealMintsDone.plus(BigInt.fromU32(1));
  }

  property.timesStolen = property.timesStolen.plus(BigInt.fromU32(1));

  // Owners
  const previousOwner = property.owners.shift();
  property.owners = addToArray<string>(property.owners, owner.id);
  property.save();

  // Remove the previous owner
  store.remove("StealablePropertyOwner", previousOwner);
}

// Pause
export function handlePaused(event: Paused): void {
  const factory = getFactory(event.block);

  factory.paused = true;
  factory.save();
}

export function handleUnpaused(event: Unpaused): void {
  const factory = getFactory(event.block);

  factory.paused = false;
  factory.save();
}

// URI
export function handleURI(_event: URI): void {
  // NOTE: This is never used
}

// Transfers
export function handleTransferBatch(event: TransferBatch): void {}
export function handleTransferSingle(event: TransferSingle): void {}

// Approvals
export function handleApprovalForAll(event: ApprovalForAll): void {}

// Roles
export function handleRoleAdminChanged(event: RoleAdminChanged): void {}
export function handleRoleGranted(event: RoleGranted): void {}
export function handleRoleRevoked(event: RoleRevoked): void {}
