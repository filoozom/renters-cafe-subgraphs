import { BigInt, ethereum, dataSource, Address } from "@graphprotocol/graph-ts";

// Generated
import { StealablePropertiesFactory } from "../../../generated/schema";
import { StealableProperties as Contract } from "../../../generated/StealableProperties/StealableProperties";

export function getFactory(
  block: ethereum.Block,
  address?: Address
): StealablePropertiesFactory {
  address = address || dataSource.address();
  let factory = StealablePropertiesFactory.load(address.toHex());

  if (factory === null) {
    const contract = Contract.bind(address);
    factory = new StealablePropertiesFactory(address.toHex());

    // Configuration
    factory.uri = contract.uri(BigInt.zero());
    factory.paused = false;
  }

  factory.timestamp = block.timestamp;
  factory.block = block.number;
  factory.save();

  return factory;
}
