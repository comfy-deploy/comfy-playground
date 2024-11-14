/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		domains: [
			"comfy-deploy-output-dev.s3.amazonaws.com",
			"comfy-deploy-output.s3.us-east-2.amazonaws.com"
		],
	},
	eslint: {
		ignoreDuringBuilds: true,	
	},
};

export default nextConfig;
