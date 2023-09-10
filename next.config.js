/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack : (config) => {
     config.externals.push({
        "utf-8-validate" : "commonjs utf-8-validator",
        bufferutil : "commonjs bufferutil"
     });

     return config;
    },
    images : {
        domains : ["utfs.io", "uploadthing.com"]
    }
}

module.exports = nextConfig
