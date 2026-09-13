import {useEffect} from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

function getTargetPath(baseUrl, currentLocale, defaultLocale) {
  const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const localePrefix = currentLocale === defaultLocale ? '' : `${currentLocale}/`;
  return `${normalizedBaseUrl}${localePrefix}docs/introduction-to-simphant`;
}

export default function Home() {
  const {
    i18n: {currentLocale, defaultLocale},
    siteConfig: {baseUrl},
  } = useDocusaurusContext();
  const targetPath = getTargetPath(baseUrl, currentLocale, defaultLocale);

  useEffect(() => {
    window.location.replace(targetPath);
  }, [targetPath]);

  return (
    <Layout title="SimPhant Documentation">
      <main className="container margin-vert--xl">
        <p>
          Open the <a href={targetPath}>SimPhant documentation</a>.
        </p>
      </main>
    </Layout>
  );
}