import { IChainData } from "../types";
import { SUPPORTED_CHAINS } from "./chains";

export function getChainData(chainId: number): IChainData {
    const chainData = SUPPORTED_CHAINS.filter((chain: any) => chain.chain_id === chainId)[0];
  
    if (!chainData) {
      throw new Error("ChainId missing or not supported");
    }
  
    const API_KEY = process.env.REACT_APP_INFURA_PROJECT_ID;
  
    if (
      chainData.rpc_url.includes("infura.io") &&
      chainData.rpc_url.includes("%API_KEY%") &&
      API_KEY
    ) {
      const rpcUrl = chainData.rpc_url.replace("%API_KEY%", API_KEY);
      console.log(`rpc url is: ${rpcUrl}`)
  
      return {
        ...chainData,
        rpc_url: rpcUrl,
      };
    }
  
    return chainData;
  }