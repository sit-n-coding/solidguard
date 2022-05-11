export class EtherscanContractsDto {
  evmVersion?: string;
  libraries?: string;
  contracts: ContractFromAPIDto[];
}

export class EtherscanContractInfoDto {
  addr: string;
  names: string[];
}

export class ContractFromAPIDto {
  name: string;
  content: string;
}

export class ContractDto {
  addr: string;
  pauseable: boolean;
}

export class UpdateContractDto {
  pauseable?: boolean;
}
