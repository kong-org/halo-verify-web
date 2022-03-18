export interface IKeys {
  primaryPublicKeyHash: string
  primaryPublicKeyRaw: string
  secondaryPublicKeyHash: string
  secondaryPublicKeyRaw: string
  tertiaryPublicKeyHash: string | null
  tertiaryPublicKeyRaw: string | null
}

export interface IDevice {
  node_id: string
  app_name: string
  app_version: string
  content_type: string
  device_record_type: string
  device_id: string
  device_token_metadata: string
  device_address: string
  device_manufacturer: string
  device_model: string
  device_merkel_root: string
  device_minter: string
  device_registry: string
  ifps_add: string
  chain_id: string
}

export interface IAssetData {
  symbol: string;
  name: string;
  decimals: string;
  contractAddress: string;
  balance?: string;
}

export interface IChainData {
  name: string;
  short_name: string;
  chain: string;
  network: string;
  chain_id: number;
  network_id: number;
  explorer: string;
  rpc_url: string;
  native_currency: IAssetData;
}