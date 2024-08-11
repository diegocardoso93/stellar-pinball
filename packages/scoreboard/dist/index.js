import { Buffer } from "buffer";
import { Client as ContractClient, Spec as ContractSpec, } from '@stellar/stellar-sdk/contract';
if (typeof window !== 'undefined') {
    //@ts-ignore Buffer exists
    window.Buffer = window.Buffer || Buffer;
}
export const networks = {
    testnet: {
        networkPassphrase: "Test SDF Network ; September 2015",
        contractId: "CDL7PRHQEDOJAN3A2CHCOYNLVXPIO3GPTZVVJGG7LZURRPCKKLX72TSY",
    }
};
export const Errors = {};
export class Client extends ContractClient {
    options;
    constructor(options) {
        super(new ContractSpec(["AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAAAgAAAAAAAAAAAAAABVBsYXlzAAAAAAAAAAAAAAAAAAAGU2NvcmVzAAA=",
            "AAAAAAAAAAAAAAAKc2F2ZV9zY29yZQAAAAAAAgAAAAAAAAAGcGxheWVyAAAAAAATAAAAAAAAAAVzY29yZQAAAAAAAAQAAAABAAAAAQ==",
            "AAAAAAAAAAAAAAAEc2hvdwAAAAAAAAABAAAD7AAAABMAAAPqAAAABA=="]), options);
        this.options = options;
    }
    fromJSON = {
        save_score: (this.txFromJSON),
        show: (this.txFromJSON)
    };
}
