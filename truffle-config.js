module.exports = {
    networks: {
        development: {
            host: "127.0.0.1",
            port: 7545,  // Make sure this is the correct port for your Ganache instance
            network_id: "*",  // Match any network id
            // gas: 6721975,  // You can adjust this number
            // gasPrice: 20000000000,  // Adjust gas price if needed
        },
    },
    migrations_directory: "./src/migrations/",
    contracts_directory: "./src/contracts/",
    contracts_build_directory: "./src/build/",
    compilers: {
        solc: {
            version: "0.8.13",
            // optimizer: {
            //     enabled: true,
            //     runs: 200,
            // },
        },
    },
};
