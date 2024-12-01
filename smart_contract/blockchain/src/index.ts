import crypto from "crypto";

export class Block {
  money: number;
  prevHash: string;
  validator: string;
  stake: number;
  hash: string;

  constructor(money: number, stake: number) {
    this.money = money;
    this.stake = stake;
    this.hash = this.calculateHash();
  }

  calculateHash(): string {
    return crypto
      .createHash("sha256")
      .update(this.money + this.prevHash + this.validator + this.stake)
      .digest("hex");
  }
}

class BlockChain {
  chain: Block[];
  validators: { [validator: string]: number };

  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.validators = {};
  }

  createGenesisBlock(): Block {
    return new Block(0, 0);
  }

  public addValidator(validator: string, stake: number): void {
    this.validators[validator] = stake;
  }

  private chooseValidator(): string {
    const totalStake = Object.values(this.validators).reduce(
      (sum, stake) => sum + stake,
      0
    );
    let randomStake = Math.floor(Math.random() * totalStake);

    for (const [validator, stake] of Object.entries(this.validators)) {
      randomStake -= stake;
      if (randomStake <= 0) {
        return validator;
      }
    }

    return "";
  }

  public addBlock(newBlock: Block): void {
    newBlock.prevHash = this.chain[this.chain.length - 1].hash;

    const selectedValidator = this.chooseValidator();
    newBlock.validator = selectedValidator;

    console.log("Block create by: ", selectedValidator);
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
