import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";

// Entities
import { getFactory } from "./factory";

// Generated
import { PropertyAuctionCut } from "../../../generated/schema";

export function getCut(id: BigInt, block: ethereum.Block): PropertyAuctionCut {
  let cut = PropertyAuctionCut.load(id.toString());

  if (cut === null) {
    const factory = getFactory(block);

    cut = new PropertyAuctionCut(id.toString());
    cut.factory = factory.id;

    // Configuration
    cut.user = Address.zero();
    cut.amount = BigInt.zero();
  }

  cut.timestamp = block.timestamp;
  cut.block = block.number;
  cut.save();

  return cut;
}
