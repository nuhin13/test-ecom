/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        // Allow images from a placeholder domain
        domains: ['via.placeholder.com', 'picsum.photos'],
    },
    // This is needed to make Docker hot-reloading work
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.watchOptions = {
                poll: 1000,
                aggregateTimeout: 300,
            };
        }
        return config;
    },
};

module.exports = nextConfig;
