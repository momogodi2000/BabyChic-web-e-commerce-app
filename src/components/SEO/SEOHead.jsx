import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

const SEOHead = ({
  title,
  description,
  keywords,
  canonical,
  ogImage,
  ogType = 'website',
  article = null,
  product = null,
  noindex = false
}) => {
  const { i18n } = useTranslation();
  
  const baseUrl = import.meta.env.VITE_APP_URL || 'https://babychic.netlify.app';
  const siteName = 'BabyChic Cameroun';
  const defaultTitle = 'BabyChic Cameroun - Mode & Tendance pour toute la famille';
  const defaultDescription = 'Découvrez notre collection de vêtements pour enfants (0-10 ans) et femmes au Cameroun. Mode, qualité et tendance à prix abordables. Livraison à Yaoundé, Douala et partout au Cameroun.';
  const defaultKeywords = 'babychic, mode enfant, vêtements bébé, mode femme, cameroun, yaoundé, douala, shopping, e-commerce, vêtements enfants, tendance mode';
  const defaultImage = `${baseUrl}/logo-babychic-2.png`;

  const seoTitle = title ? `${title} | ${siteName}` : defaultTitle;
  const seoDescription = description || defaultDescription;
  const seoKeywords = keywords || defaultKeywords;
  const seoImage = ogImage || defaultImage;
  const seoUrl = canonical || window.location.href;

  // Structured Data for Organization
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": siteName,
    "description": seoDescription,
    "url": baseUrl,
    "logo": defaultImage,
    "sameAs": [
      "https://facebook.com/babychic.cameroun",
      "https://instagram.com/babychic_cameroun",
      "https://wa.me/237695922065"
    ],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Quartier Emana",
      "addressLocality": "Yaoundé",
      "addressCountry": "CM"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+237695922065",
      "contactType": "Customer Service",
      "availableLanguage": ["fr", "en"]
    }
  };

  // Structured Data for Website
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": siteName,
    "description": seoDescription,
    "url": baseUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/catalog?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  // Product Schema (if product data provided)
  const productSchema = product ? {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.images || seoImage,
    "sku": product.sku,
    "brand": {
      "@type": "Brand",
      "name": product.brand || siteName
    },
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "XAF",
      "availability": product.stock_quantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": siteName
      }
    },
    "aggregateRating": product.rating ? {
      "@type": "AggregateRating",
      "ratingValue": product.rating,
      "reviewCount": product.reviewCount || 1
    } : null
  } : null;

  // Article Schema (if article data provided)
  const articleSchema = article ? {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.description,
    "image": article.image || seoImage,
    "author": {
      "@type": "Person",
      "name": article.author || siteName
    },
    "publisher": {
      "@type": "Organization",
      "name": siteName,
      "logo": {
        "@type": "ImageObject",
        "url": defaultImage
      }
    },
    "datePublished": article.publishedDate,
    "dateModified": article.modifiedDate || article.publishedDate
  } : null;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={seoKeywords} />
      <meta name="author" content={siteName} />
      <link rel="canonical" href={seoUrl} />
      
      {/* Language and Locale */}
      <html lang={i18n.language} />
      <meta name="language" content={i18n.language} />
      
      {/* Robots */}
      <meta name="robots" content={noindex ? "noindex,nofollow" : "index,follow"} />
      <meta name="googlebot" content={noindex ? "noindex,nofollow" : "index,follow"} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={seoUrl} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={i18n.language === 'fr' ? 'fr_CM' : 'en_US'} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={seoUrl} />
      <meta property="twitter:title" content={seoTitle} />
      <meta property="twitter:description" content={seoDescription} />
      <meta property="twitter:image" content={seoImage} />
      <meta property="twitter:site" content="@babychic_cm" />
      
      {/* Mobile Optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#ec5858" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="BabyChic" />
      
      {/* Favicons */}
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#ec5858" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
      {productSchema && (
        <script type="application/ld+json">
          {JSON.stringify(productSchema)}
        </script>
      )}
      {articleSchema && (
        <script type="application/ld+json">
          {JSON.stringify(articleSchema)}
        </script>
      )}
      
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://api.babychic.cm" />
      <link rel="preconnect" href="https://babychic-backend.onrender.com" />
      
      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="https://api.babychic.cm" />
      <link rel="dns-prefetch" href="https://babychic-backend.onrender.com" />
      
      {/* Additional Performance Hints */}
      <meta httpEquiv="x-dns-prefetch-control" content="on" />
      <meta name="format-detection" content="telephone=no" />
      
      {/* Cache Control */}
      <meta httpEquiv="Cache-Control" content="public, max-age=31536000" />
      
      {/* Security Headers */}
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-Frame-Options" content="DENY" />
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      
      {/* Geographic targeting */}
      <meta name="geo.region" content="CM" />
      <meta name="geo.placename" content="Yaoundé" />
      <meta name="geo.position" content="3.8480;11.5021" />
      <meta name="ICBM" content="3.8480, 11.5021" />
    </Helmet>
  );
};

export default SEOHead;