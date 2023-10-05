const config_all = {
    prod: {
        reportUrl: '/',
        port: 9006
    },
    dev: {
        reportUrl: 'http://192.168.43.32:4200/#/',
        port: 3000
    }
}
console.log('[config]', process.env.ENV)
export const config = config_all[process.env.ENV]