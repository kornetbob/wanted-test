module.exports = {
    runtimeCompiler: true,
    devServer:{
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
        },
        port:3000,
        host: "0.0.0.0",
        disableHostCheck: true
    },
    css: {
        sourceMap: true
    }
}
