import { BigInt } from "@graphprotocol/graph-ts";

// Entities
import { getCafe } from "./entities/cafe";
import { getLP } from "./entities/lp";
import { getPool } from "./entities/pool";
import { getUser } from "./entities/user";

// Generated
import {
  AddPool,
  Deposit,
  EmergencyWithdraw,
  Harvest,
  PatchPool,
  RoleAdminChanged,
  RoleGranted,
  RoleRevoked,
  SetDevAddress,
  SetFeeAddress,
  SetRentPerSecond,
  UpdatePool,
  UpdatePoolTotal,
  UpdateUserTotal,
  Withdraw,
} from "../generated/Cafe/Cafe";

// User
export function handleDeposit(event: Deposit): void {
  const user = getUser(event.params.user, event.params.poolId, event.block);
  user.balance = user.balance.plus(event.params.amount);
  user.save();
}

export function handleEmergencyWithdraw(event: EmergencyWithdraw): void {
  const pool = getPool(event.params.poolId, event.block);

  pool.balance = pool.balance.minus(event.params.amount);
  pool.feesCollected = pool.feesCollected.plus(event.params.fee);
  pool.save();

  const user = getUser(event.params.user, event.params.poolId, event.block);
  user.feesPaid = user.feesPaid.plus(event.params.fee);
  user.balance = BigInt.zero();
  user.save();
}

export function handleHarvest(event: Harvest): void {
  const user = getUser(event.params.user, event.params.poolId, event.block);
  user.rentHarvested = user.rentHarvested.plus(event.params.amount);
  user.save();
}

export function handleWithdraw(event: Withdraw): void {
  const pool = getPool(event.params.poolId, event.block);

  pool.balance = pool.balance.minus(event.params.amount);
  pool.feesCollected = pool.feesCollected.plus(event.params.fee);
  pool.save();

  const user = getUser(event.params.user, event.params.poolId, event.block);
  user.feesPaid = user.feesPaid.plus(event.params.fee);
  user.balance = user.balance.minus(event.params.amount);
  user.save();
}

// Pools
export function handleAddPool(event: AddPool): void {
  const cafe = getCafe(event.block);
  const pool = getPool(event.params.poolId, event.block);
  const lp = getLP(event.params.token, event.params.poolId, event.block);

  pool.token = event.params.token;
  pool.allocation = event.params.allocation;
  pool.withdrawFee = event.params.withdrawFee;
  pool.lp = lp.id;
  pool.save();

  cafe.totalAllocation = cafe.totalAllocation.plus(event.params.allocation);
  cafe.poolCount = cafe.poolCount.plus(BigInt.fromU32(1));
  cafe.save();
}

export function handlePatchPool(event: PatchPool): void {
  const cafe = getCafe(event.block);
  const pool = getPool(event.params.poolId, event.block);

  cafe.totalAllocation = cafe.totalAllocation
    .plus(event.params.allocation)
    .minus(pool.allocation);
  cafe.save();

  pool.allocation = event.params.allocation;
  pool.withdrawFee = event.params.withdrawFee;
  pool.save();
}

// Configuration
export function handleSetDevAddress(event: SetDevAddress): void {
  const cafe = getCafe(event.block);

  cafe.devAddress = event.params.devAddress;
  cafe.save();
}

export function handleSetFeeAddress(event: SetFeeAddress): void {
  const cafe = getCafe(event.block);

  cafe.feeAddress = event.params.feeAddress;
  cafe.save();
}

export function handleSetRentPerSecond(event: SetRentPerSecond): void {
  const cafe = getCafe(event.block);

  cafe.rentPerSecond = event.params.rentPerSecond;
  cafe.save();
}

// Rewarder
export function handleUpdatePool(event: UpdatePool): void {
  const pool = getPool(event.params.poolId, event.block);

  pool.lastRewardTimestamp = event.params.lastRewardTimestamp;
  pool.total = event.params.total;
  pool.balance = event.params.balance;
  pool.accRentPerShare = event.params.accRentPerShare;
  pool.save();
}

export function handleUpdatePoolBalance(event: UpdatePoolTotal): void {
  const pool = getPool(event.params.poolId, event.block);

  pool.total = event.params.total;
  pool.save();
}

export function handleUpdateUserTotal(event: UpdateUserTotal): void {
  const user = getUser(event.params.user, event.params.poolId, event.block);
  user.total = event.params.total;
  user.debt = event.params.debt;
  user.save();
}

// Roles
export function handleRoleAdminChanged(event: RoleAdminChanged): void {}

export function handleRoleGranted(event: RoleGranted): void {}

export function handleRoleRevoked(event: RoleRevoked): void {}
