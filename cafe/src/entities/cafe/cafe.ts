import { BigInt, dataSource, ethereum } from "@graphprotocol/graph-ts";

// Generated
import { Cafe } from "../../../generated/schema";
import { Cafe as Contract } from "../../../generated/Cafe/Cafe";

export function getCafe(block: ethereum.Block): Cafe {
  const address = dataSource.address();
  let cafe = Cafe.load(address.toHex());

  if (cafe === null) {
    const contract = Contract.bind(address);
    cafe = new Cafe(address.toHex());

    // Addresses
    cafe.rent = contract.rent();
    cafe.rewarder = contract.rewarder();
    cafe.devAddress = contract.devAddress();
    cafe.feeAddress = contract.feeAddress();

    // Constants
    cafe.bonusMultiplier = contract.BONUS_MULTIPLIER();
    cafe.accRentPrecision = contract.ACC_RENT_PRECISION();
    cafe.withdrawFeePrecision = contract.WITHDRAW_FEE_PRECISION();
    cafe.maxWithdrawFee = contract.MAX_WITHDRAW_FEE();

    // Emission config
    cafe.startTimestamp = contract.startTimestamp();
    cafe.totalAllocation = contract.totalAllocation();
    cafe.bonusEndTimestamp = contract.bonusEndTimestamp();
    cafe.rentPerSecond = contract.rentPerSecond();

    cafe.totalAllocation = BigInt.zero();
    cafe.poolCount = BigInt.zero();
  }

  cafe.timestamp = block.timestamp;
  cafe.block = block.number;
  cafe.save();

  return cafe;
}
