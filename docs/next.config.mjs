import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createMDX } from 'fumadocs-mdx/next'

const projectRoot = path.dirname(fileURLToPath(import.meta.url))

const withMDX = createMDX({
  configPath: path.join(projectRoot, 'source.config.ts'),
  outDir: path.join(projectRoot, '.source')
})

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  output: 'standalone',
  turbopack: {
    root: projectRoot
  },
  outputFileTracingRoot: projectRoot,
  async rewrites() {
    return [
      {
        source: '/docs/:path*.mdx',
        destination: '/llms.mdx/docs/:path*'
      }
    ]
  }
}

export default withMDX(config)
