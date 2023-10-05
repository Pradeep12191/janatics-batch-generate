module.exports = {
    apps: [
        {
            name: "janatics",
            script: "./dist/server.js",
            watch: false,
            env: {
                "PORT": "9006",
                "NODE_ENV": "production",
                "MONGO_URL": "mongodb://127.0.0.1:27017/janatics",
                "COMPANY_NAME": "Janatics",
                "ORACLE_URL": "localhost: 1521/xepdb1",
                "ORACLE_PASSWORD": "dominate007",
                "ORACLE_DATABASE": "xepdb1",
                "ORACLE_USER": "pradeep",
                "ENV": 'prod'
            }
        }
    ]
}