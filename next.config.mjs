import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'prod-files-secure.s3.us-west-2.amazonaws.com' },
      { hostname: '*.notion.so' },
      { hostname: 'www.notion.so' },
    ],
  },
}

export default withNextIntl(nextConfig)
