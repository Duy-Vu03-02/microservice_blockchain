module.exports = {
    networks: {
        development: {
            // host: '127.0.0.1', // Localhost (default: none)
            host: 'ganache', // Localhost (default: none)
            // port: 8545, // Standard Ethereum port (default: none)
            port: 8545,
            network_id: '*', // Any network (default: none)
        },

        advanced: {
            //   port: 8777,             // Custom port
            //   network_id: 1342,       // Custom network
              gas: 8500000,           // Gas sent with each transaction (default: ~6700000)
            gasPrice: 20000000000, // 20 gwei (in wei) (default: 100 gwei)
            //   from: <address>,        // Account to send transactions from (default: accounts[0])
            //   websocket: true         // Enable EventEmitter interface for web3 (default: false)
        },
    },

    // Set default mocha options here, use special reporters, etc.
    mocha: {
        // timeout: 100000
    },

    // Configure your compilers
    compilers: {
        solc: {
            version: '0.8.0', // Fetch exact version from solc-bin (default: truffle's version)
        },
    },

    // Truffle DB is currently disabled by default; to enable it, change enabled:
    // false to enabled: true. The default storage location can also be
    // overridden by specifying the adapter settings, as shown in the commented code below.
    //
    // NOTE: It is not possible to migrate your contracts to truffle DB and you should
    // make a backup of your artifacts to a safe location before enabling this feature.
    //
    // After you backed up your artifacts you can utilize db by running migrate as follows:
    // $ truffle migrate --reset --compile-all
    //
    // db: {
    //   enabled: false,
    //   host: "127.0.0.1",
    //   adapter: {
    //     name: "indexeddb",
    //     settings: {
    //       directory: ".db"
    //     }
    //   }
    // }
};
