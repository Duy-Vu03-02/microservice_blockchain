import crypto from "crypto";

export class Block {
  hospitalId: string;
  money: number;
  timestamp: Date;
  public prevHash: string;
  nonce: number;
  hash: string;

  constructor(hospitalId: string, money: number) {
    this.hospitalId = hospitalId;
    this.money = money;
    this.nonce = 0;
    this.timestamp = new Date();
    this.hash = this.calculateHash();
  }

  calculateHash(): string {
    return crypto
      .createHash("sha256")
      .update(
        this.hospitalId +
          this.money +
          this.prevHash +
          this.timestamp +
          this.nonce
      )
      .digest("hex");
  }

  public mineBlock(difficulty: number) {
    const target = Array.from({ length: difficulty }, () => "0").join("");

    while (this.hash.substring(0, difficulty) !== target) {
      this.nonce++;
      this.hash = this.calculateHash();
    }

    console.log("Block mined: ", this.hash);
    console.log("Block nonce: ", this.nonce);
  }
}

class BlockChain {
  chain: Block[];
  difficulty: number;

  constructor(difficulty: number = 1) {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = difficulty;
  }

  createGenesisBlock(): Block {
    // const genesisBlock = new Block("Benh Vien A", 0, "1000");
    // genesisBlock.mineBlock(this.difficulty);
    // return genesisBlock;
    return new Block("", 0);
  }

  public addBlock(newBlock: Block): void {
    newBlock.prevHash = this.chain[this.chain.length - 1].hash;
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
  }

  public isVaid(): boolean {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const prevBlock = this.chain[i - 1];

      if (currentBlock.prevHash !== prevBlock.hash) {
        return false;
      }

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }
    }
  }

  public getBlockChain() {
    this.chain.map((chain) => {
      console.log(chain);
    });
  }
}

const blockChain = new BlockChain();
blockChain.getBlockChain();
