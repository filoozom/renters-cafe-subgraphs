import { Address, BigInt, store } from "@graphprotocol/graph-ts";

// Entities
import { getAuction } from "./entities/property-auction/auction";
import { getContent } from "./entities/property-auction/content";
import { getFactory } from "./entities/property-auction/factory";
import { getCut } from "./entities/property-auction/cut";
import { getOwner } from "./entities/stealable-properties/owner";
import { getProperty } from "./entities/stealable-properties/property";

// Generated
import {
  AuctionAdded,
  AuctionWon,
  CutsSet,
  RoleAdminChanged,
  RoleGranted,
  RoleRevoked,
} from "../generated/PropertyAuction/PropertyAuction";

export function handleAuctionAdded(event: AuctionAdded): void {
  const auction = getAuction(event.params.id, event.block);
  const factory = getFactory(event.block);

  // Configuration
  auction.startPrice = event.params.startPrice;
  auction.endPrice = event.params.endPrice;
  auction.duration = event.params.duration;
  auction.startTimestamp = event.params.startTimestamp;

  // Content
  for (let i = 0; i < event.params.ids.length; i++) {
    const content = getContent(event.params.id, BigInt.fromU32(i), event.block);
    const property = getProperty(
      event.params.ids[i],
      event.block,
      Address.fromString(factory.stealableProperties)
    );

    content.property = property.id;
    content.count = event.params.counts[i];
    content.save();
  }

  auction.save();
}

export function handleAuctionWon(event: AuctionWon): void {
  const auction = getAuction(event.params.id, event.block);
  const factory = getFactory(event.block);

  for (let i = 0; i < auction.content.length; i++) {
    const content = getContent(event.params.id, BigInt.fromU32(i), event.block);
    const propertyId = BigInt.fromString(content.property);
    const property = getProperty(
      propertyId,
      event.block,
      Address.fromString(factory.stealableProperties)
    );

    // Add owners
    for (let j = 0; j < content.count.toI32(); i++) {
      // Owner
      const owner = getOwner(
        propertyId,
        event.params.to,
        event.block,
        event.transaction,
        BigInt.fromU32(j)
      );

      owner.since = event.block.timestamp;
      owner.price = event.params.price;
      owner.protectedUntil = event.block.timestamp.plus(property.protection);
      owner.save();

      // Property
      property.minted = property.minted.plus(content.count);
      property.owners.push(owner.id);
    }

    property.save();
  }

  auction.done = true;
  auction.priceWon = event.params.price;
  auction.save();
}

export function handleCutsSet(event: CutsSet): void {
  const auction = getFactory(event.block);

  // Delete all previous cuts
  for (let i = 0; i < auction.cuts.length; i++) {
    store.remove("PropertyAuctionCut", auction.cuts[i]);
  }

  for (let i = 0; i < event.params.cuts.length; i++) {
    const cut = getCut(BigInt.fromU32(i), event.block);

    cut.user = event.params.cuts[i].user;
    cut.amount = event.params.cuts[i].amount;
    cut.save();
  }
}

// Roles
export function handleRoleAdminChanged(event: RoleAdminChanged): void {}
export function handleRoleGranted(event: RoleGranted): void {}
export function handleRoleRevoked(event: RoleRevoked): void {}
