import { BigInt, ethereum } from "@graphprotocol/graph-ts";

// Entities
import { getFactory } from "./factory";

// Generated
import { PropertyAuction } from "../../../generated/schema";

export function getAuction(id: BigInt, block: ethereum.Block): PropertyAuction {
  let auction = PropertyAuction.load(id.toString());

  if (auction === null) {
    const factory = getFactory(block);

    auction = new PropertyAuction(id.toString());
    auction.factory = factory.id;

    // Configuration
    auction.startPrice = BigInt.zero();
    auction.endPrice = BigInt.zero();
    auction.duration = BigInt.zero();
    auction.startTimestamp = BigInt.zero();

    // State
    auction.done = false;
    auction.priceWon = BigInt.zero();
  }

  auction.timestamp = block.timestamp;
  auction.block = block.number;
  auction.save();

  return auction;
}
