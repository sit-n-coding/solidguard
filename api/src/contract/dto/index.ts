export class EtherscanContractsDto {
  evmVersion?: string;
  libraries?: string;
  contracts: ContractFromAPIDto[];
}

export class GithubContractInfoDto {
  author: string;
  repo: string;
  path: string;
  ref: string;
}

export class ContractFromAPIDto {
  name: string;
  content: string;
}

export class ContractDto {
  addr: string;
  pause: boolean;
}

export class UpdateContractDto {
  pause?: boolean;
}
