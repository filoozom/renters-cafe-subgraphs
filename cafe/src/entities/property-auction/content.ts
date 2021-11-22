import { BigInt, ethereum } from "@graphprotocol/graph-ts";

// Generated
import { PropertyAuctionContent } from "../../../generated/schema";
import { getAuction } from "./auction";

export function getContent(
  auctionId: BigInt,
  contentId: BigInt,
  block: ethereum.Block
): PropertyAuctionContent {
  const id = `${auctionId.toString()}-${contentId.toString()}`;
  let content = PropertyAuctionContent.load(id);

  if (content === null) {
    content = new PropertyAuctionContent(id);
    content.auction = getAuction(auctionId, block).id;

    // Configuration
    content.property = "";
    content.count = BigInt.zero();
  }

  content.timestamp = block.timestamp;
  content.block = block.number;
  content.save();

  return content;
}
