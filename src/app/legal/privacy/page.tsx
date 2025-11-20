import React from 'react';
import { Container, Typography, Box, Divider } from '@mui/material';
import ClientLayout from '@/components/layout/ClientLayout';

export default function PrivacyPage() {
  return (
    <ClientLayout>
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
          Privacy Policy
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Last updated: {new Date().toLocaleDateString()}
        </Typography>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ '& h2': { mt: 4, mb: 2 }, '& p': { mb: 2 } }}>
          <Typography variant="h5" component="h2" fontWeight={600}>
            Introduction
          </Typography>
          <Typography variant="body1">
            Welcome to Nurturing Gardens. We are committed to protecting your privacy and being
            transparent about the data we collect and how we use it. This Privacy Policy explains
            how we collect, use, and protect your information when you visit our website.
          </Typography>

          <Typography variant="h5" component="h2" fontWeight={600}>
            Information We Collect
          </Typography>
          <Typography variant="body1">
            <strong>Analytics Data:</strong> We use Google Analytics to collect aggregated,
            anonymous data about how visitors use our site. This includes information like pages
            visited, time spent on the site, and general geographic location. This data helps us
            understand how our site is being used and how we can improve it.
          </Typography>
          <Typography variant="body1">
            <strong>Cookies:</strong> Our website and third-party services (Google Analytics,
            Google AdSense) use cookies to collect information. Cookies are small data files
            stored on your device that help us and our partners provide relevant content and ads.
          </Typography>
          <Typography variant="body1">
            <strong>Shopping List:</strong> Your shopping list is stored locally in your browser's
            storage. We do not transmit or store this data on our servers.
          </Typography>

          <Typography variant="h5" component="h2" fontWeight={600}>
            Google Analytics
          </Typography>
          <Typography variant="body1">
            We use Google Analytics to analyze website traffic and improve user experience. Google
            Analytics collects information anonymously and reports website trends without
            identifying individual visitors. You can opt out of Google Analytics by installing the
            Google Analytics opt-out browser add-on.
          </Typography>

          <Typography variant="h5" component="h2" fontWeight={600}>
            Advertising
          </Typography>
          <Typography variant="body1">
            We use Google AdSense to display advertisements on our site. Google and its partners
            may use cookies to serve ads based on your prior visits to our website or other
            websites. You can opt out of personalized advertising by visiting{' '}
            <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">
              Ads Settings
            </a>
            .
          </Typography>

          <Typography variant="h5" component="h2" fontWeight={600}>
            Affiliate Links
          </Typography>
          <Typography variant="body1">
            Our site may contain affiliate links to products and services. If you click on an
            affiliate link and make a purchase, we may earn a commission at no additional cost to
            you. We only recommend products and services we believe will be valuable to our users.
          </Typography>

          <Typography variant="h5" component="h2" fontWeight={600}>
            Data We Do NOT Collect
          </Typography>
          <Typography variant="body1">
            We do not collect or store personally identifiable information such as names, email
            addresses, or phone numbers unless you explicitly provide them (e.g., through a contact
            form). We do not sell your personal data to third parties.
          </Typography>

          <Typography variant="h5" component="h2" fontWeight={600}>
            Your Rights
          </Typography>
          <Typography variant="body1">
            You have the right to access, correct, or request deletion of any personal data we may
            have collected. You can also choose to disable cookies in your browser settings,
            although this may affect your experience on our site.
          </Typography>

          <Typography variant="h5" component="h2" fontWeight={600}>
            Children's Privacy
          </Typography>
          <Typography variant="body1">
            Our website is not intended for children under the age of 13, and we do not knowingly
            collect personal information from children.
          </Typography>

          <Typography variant="h5" component="h2" fontWeight={600}>
            Changes to This Policy
          </Typography>
          <Typography variant="body1">
            We may update this Privacy Policy from time to time. Any changes will be posted on this
            page with an updated revision date.
          </Typography>

          <Typography variant="h5" component="h2" fontWeight={600}>
            Contact Us
          </Typography>
          <Typography variant="body1">
            If you have questions about this Privacy Policy, please contact us at{' '}
            <a href="mailto:dev@jpbranski.com">dev@jpbranski.com</a>.
          </Typography>
        </Box>
      </Container>
    </ClientLayout>
  );
}
