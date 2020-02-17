import * as CryptoJS from 'crypto-js'

class Block {
    static calculateBlockHash = (index: number, previousHash: string, timestamp: number, data: string): string => {
        return CryptoJS.SHA256(index + previousHash + timestamp + data).toString();
    }

    static validateStructure = (aBlock: Block): boolean => {
        return typeof aBlock.index === "number"
            && typeof aBlock.hash === "string"
            && typeof aBlock.previousHash === "string"
            && typeof aBlock.data === "string"
            && typeof aBlock.timestamp === "number";
    }

    constructor(
        public index: number,
        public hash: string,
        public previousHash: string,
        public data: string,
        public timestamp: number
    ) {
    }

}

const genesisBlock: Block = new Block(0, "202020202", "", "Hello", 123456);

let blockchain: Block[] = [genesisBlock];

console.log(blockchain)

const getBlockchain = (): Block[] => blockchain;
const getLatestBlock = (): Block => blockchain[blockchain.length - 1];
const getNewTimeStamp = (): number => Math.round(new Date().getTime() / 1000);
const createNewBlock = (data: string): Block => {
    const previousBlock: Block = getLatestBlock();
    const newIndex: number = previousBlock.index + 1;
    const nextTimestamp: number = getNewTimeStamp();
    const nextHash: string = Block.calculateBlockHash(newIndex, previousBlock.hash, nextTimestamp, data);
    const newBlock: Block = new Block(newIndex, nextHash, previousBlock.hash, data, nextTimestamp);
    addBlock(newBlock)
    return newBlock
}
const getHashForBlock = (aBlock: Block): string => Block.calculateBlockHash(aBlock.index, aBlock.previousHash, aBlock.timestamp, aBlock.data)

const isBlockValid = (candidateBlock: Block, previousBlock: Block): boolean => {
    if (!Block.validateStructure(candidateBlock)) {
        return false;
    } else if (previousBlock.index + 1 !== candidateBlock.index) {
        return false;
    } else if (previousBlock.hash !== candidateBlock.previousHash) {
        return false;
    } else if (getHashForBlock(candidateBlock) !== candidateBlock.hash) {
        return false;
    } else {
        return true;
    }
};

const addBlock = (candidateBlock: Block): void => {
    if (isBlockValid(candidateBlock, getLatestBlock())) {
        getBlockchain().push(candidateBlock)
    }
}

createNewBlock("second block")
createNewBlock("three block")
createNewBlock("four block")

console.log(getBlockchain());

export { };