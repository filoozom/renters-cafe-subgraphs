import { ethereum, dataSource } from "@graphprotocol/graph-ts";

// Entities
import { getFactory as getStealablePropertiesFactory } from "../stealable-properties/factory";

// Generated
import { PropertyAuctionFactory } from "../../../generated/schema";
import { PropertyAuction as Contract } from "../../../generated/PropertyAuction/PropertyAuction";

export function getFactory(block: ethereum.Block): PropertyAuctionFactory {
  const address = dataSource.address();
  let factory = PropertyAuctionFactory.load(address.toHex());

  if (factory === null) {
    const contract = Contract.bind(address);
    const sp = getStealablePropertiesFactory(block, contract.sp());

    factory = new PropertyAuctionFactory(address.toHex());
    factory.stealableProperties = sp.id;
  }

  factory.timestamp = block.timestamp;
  factory.block = block.number;
  factory.save();

  return factory;
}
