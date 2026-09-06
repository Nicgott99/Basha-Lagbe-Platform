import { Helmet } from "react-helmet-async";

const SITE_NAME = "Basha Lagbe";
const SITE_URL = "https://bashalagbe.com";
const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`;
const DEFAULT_DESCRIPTION =
  "Basha Lagbe is Bangladesh's most trusted property rental platform. Find verified apartments, houses, studios, and rooms across Dhaka and beyond.";

/**
 * SEO — drop this inside any page to set all critical head tags.
 *
 * @param {string} title        – Page-specific title (appended with site name)
 * @param {string} description  – Meta description (max ~160 chars)
 * @param {string} image        – Absolute URL to OG image
 * @param {string} url          – Canonical page URL (relative path like "/search")
 * @param {string} type         – OG type: "website" | "article"
 * @param {object} schema       – Optional JSON-LD schema object
 * @param {boolean} noIndex     – Set true for private/admin pages
 */
const SEO = ({
  title,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
  url = "",
  type = "website",
  schema = null,
  noIndex = false,
}) => {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Find Your Perfect Home in Bangladesh`;
  const canonicalUrl = `${SITE_URL}${url}`;
  const absoluteImage = image.startsWith("http") ? image : `${SITE_URL}${image}`;

  return (
    <Helmet>
      {/* Core */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={absoluteImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_BD" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteImage} />

      {/* JSON-LD Schema */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
