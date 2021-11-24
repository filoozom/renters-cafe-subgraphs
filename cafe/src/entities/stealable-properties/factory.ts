import { BigInt, ethereum, dataSource, Address } from "@graphprotocol/graph-ts";

// Generated
import { StealablePropertiesFactory } from "../../../generated/schema";
import { StealableProperties as Contract } from "../../../generated/StealableProperties/StealableProperties";

export function getFactory(
  block: ethereum.Block,
  address: Address | null = null
): StealablePropertiesFactory {
  const id = address === null ? dataSource.address() : address;
  let factory = StealablePropertiesFactory.load(id.toHex());

  if (factory === null) {
    const contract = Contract.bind(id);
    factory = new StealablePropertiesFactory(id.toHex());

    // Constants
    factory.multiplierPrecision = contract.MULTIPLIER_PRECISION();

    // Configuration
    factory.uri = contract.uri(BigInt.zero());
    factory.paused = false;
  }

  factory.timestamp = block.timestamp;
  factory.block = block.number;
  factory.save();

  return factory;
}
