import { BigInt, ethereum } from "@graphprotocol/graph-ts";

// Generated
import { PropertyAuctionContent } from "../../../generated/schema";
import { getAuction } from "./auction";

export function getContentId(auctionId: BigInt, contentId: BigInt): string {
  return `${auctionId.toString()}-${contentId.toString()}`;
}

export function getContent(
  auctionId: BigInt,
  contentId: BigInt,
  block: ethereum.Block
): PropertyAuctionContent {
  const id = getContentId(auctionId, contentId);
  let content = PropertyAuctionContent.load(id);

  if (content === null) {
    content = new PropertyAuctionContent(id);
    content.auction = getAuction(auctionId, block).id;

    // Configuration
    content.property = "";
    content.count = BigInt.zero();
    content.weight = BigInt.zero();
  }

  content.timestamp = block.timestamp;
  content.block = block.number;
  content.save();

  return content;
}
