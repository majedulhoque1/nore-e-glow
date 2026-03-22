import { Helmet } from 'react-helmet-async';
import { SEO_CONFIG } from '@/lib/seo';

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'product';
  price?: number;
  category?: string;
  jsonLd?: object;
}

export const SEOHead = ({
  title,
  description,
  image,
  url,
  type = 'website',
  price,
  category,
  jsonLd,
}: SEOHeadProps) => {
  const fullTitle = title
    ? `${title} | ${SEO_CONFIG.siteName}`
    : SEO_CONFIG.defaultTitle;
  const metaDesc = description || SEO_CONFIG.defaultDescription;
  const metaImage = image || SEO_CONFIG.defaultImage;
  const metaUrl = url
    ? `${SEO_CONFIG.siteUrl}${url}`
    : SEO_CONFIG.siteUrl;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDesc} />
      <link rel="canonical" href={metaUrl} />
      <meta name="robots" content="index, follow" />

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:url" content={metaUrl} />
      <meta property="og:type" content={type === 'product' ? 'product' : 'website'} />
      <meta property="og:site_name" content={SEO_CONFIG.siteName} />
      <meta property="og:locale" content="en_BD" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDesc} />
      <meta name="twitter:image" content={metaImage} />

      {type === 'product' && price && (
        <meta property="product:price:amount" content={String(price)} />
      )}
      {type === 'product' && (
        <meta property="product:price:currency" content="BDT" />
      )}
      {type === 'product' && category && (
        <meta property="product:category" content={category} />
      )}

      {type === 'product' && price && title && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": title,
            "description": metaDesc,
            "image": metaImage,
            "brand": {
              "@type": "Brand",
              "name": "Nore'e Jewellery"
            },
            "offers": {
              "@type": "Offer",
              "priceCurrency": "BDT",
              "price": price,
              "availability": "https://schema.org/InStock",
              "seller": {
                "@type": "Organization",
                "name": "Nore'e Jewellery"
              }
            }
          })}
        </script>
      )}

      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
};
