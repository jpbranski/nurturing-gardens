import React from 'react';
import { Container, Typography, Box, Divider } from '@mui/material';
import ClientLayout from '@/components/layout/ClientLayout';

export default function TermsPage() {
  return (
    <ClientLayout>
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
          Terms of Service
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Last updated: {new Date().toLocaleDateString()}
        </Typography>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ '& h2': { mt: 4, mb: 2 }, '& p': { mb: 2 } }}>
          <Typography variant="h5" component="h2" fontWeight={600}>
            Acceptance of Terms
          </Typography>
          <Typography variant="body1">
            By accessing and using Nurturing Gardens, you accept and agree to be bound by these
            Terms of Service. If you do not agree to these terms, please do not use our website.
          </Typography>

          <Typography variant="h5" component="h2" fontWeight={600}>
            Use of the Website
          </Typography>
          <Typography variant="body1">
            Nurturing Gardens provides gardening information, plant recommendations, and educational
            content for general informational purposes only. You may use our site for personal,
            non-commercial purposes.
          </Typography>
          <Typography variant="body1">
            <strong>Prohibited activities include:</strong>
          </Typography>
          <Typography variant="body1" component="ul" sx={{ pl: 4 }}>
            <li>Scraping or automated data collection from our website</li>
            <li>Attempting to interfere with the proper functioning of the website</li>
            <li>Using the website for any unlawful purpose</li>
            <li>Impersonating any person or entity</li>
            <li>Transmitting any viruses, malware, or harmful code</li>
          </Typography>

          <Typography variant="h5" component="h2" fontWeight={600}>
            No Guarantees on Plant Performance
          </Typography>
          <Typography variant="body1">
            While we strive to provide accurate and helpful information, gardening results depend
            on many factors outside our control, including local climate variations, soil
            conditions, care practices, and microclimates. We make no guarantees regarding plant
            performance, survival, or growth.
          </Typography>
          <Typography variant="body1">
            Plant hardiness zone information is approximate and should be used as a general guide
            only. Always verify plant suitability with local nurseries, extension services, or
            horticultural experts.
          </Typography>

          <Typography variant="h5" component="h2" fontWeight={600}>
            Pet Safety and Toxicity Information
          </Typography>
          <Typography variant="body1">
            We provide toxicity information to help you make informed decisions, but this
            information is for general reference only. For questions about pet safety, always
            consult with a licensed veterinarian and refer to authoritative sources like the ASPCA
            Poison Control Center. We are not responsible for any harm to pets resulting from plant
            exposure.
          </Typography>

          <Typography variant="h5" component="h2" fontWeight={600}>
            Informational Purpose Only
          </Typography>
          <Typography variant="body1">
            The content on Nurturing Gardens is for general informational and educational purposes
            only. It is not a substitute for professional horticultural advice, local extension
            service guidance, or expert consultation. You should always verify plant information and
            care requirements for your specific location and conditions.
          </Typography>

          <Typography variant="h5" component="h2" fontWeight={600}>
            External Links and Affiliate Relationships
          </Typography>
          <Typography variant="body1">
            Our website may contain links to third-party websites and affiliate links. We are not
            responsible for the content or practices of external sites. Affiliate links may result
            in us earning a commission on purchases at no additional cost to you.
          </Typography>

          <Typography variant="h5" component="h2" fontWeight={600}>
            Intellectual Property
          </Typography>
          <Typography variant="body1">
            The content, design, and features of Nurturing Gardens are protected by copyright and
            other intellectual property laws. You may not reproduce, distribute, or create
            derivative works from our content without permission.
          </Typography>

          <Typography variant="h5" component="h2" fontWeight={600}>
            Limitation of Liability
          </Typography>
          <Typography variant="body1">
            To the fullest extent permitted by law, Nurturing Gardens and its operators shall not be
            liable for any indirect, incidental, special, consequential, or punitive damages
            resulting from your use of or inability to use the website, including but not limited to
            plant failures, pest damage, or any other gardening-related issues.
          </Typography>

          <Typography variant="h5" component="h2" fontWeight={600}>
            Disclaimer of Warranties
          </Typography>
          <Typography variant="body1">
            The website is provided "as is" without warranties of any kind, either express or
            implied. We do not warrant that the site will be uninterrupted, error-free, or free of
            viruses or other harmful components.
          </Typography>

          <Typography variant="h5" component="h2" fontWeight={600}>
            Governing Law
          </Typography>
          <Typography variant="body1">
            These Terms of Service are governed by and construed in accordance with the laws of the
            United States. Any disputes arising from these terms or your use of the website shall be
            subject to the jurisdiction of the courts in the United States.
          </Typography>

          <Typography variant="h5" component="h2" fontWeight={600}>
            Changes to Terms
          </Typography>
          <Typography variant="body1">
            We reserve the right to modify these Terms of Service at any time. Changes will be
            effective immediately upon posting. Your continued use of the website after changes are
            posted constitutes acceptance of the revised terms.
          </Typography>

          <Typography variant="h5" component="h2" fontWeight={600}>
            Contact Information
          </Typography>
          <Typography variant="body1">
            For questions about these Terms of Service, please contact us at{' '}
            <a href="mailto:dev@jpbranski.com">dev@jpbranski.com</a>.
          </Typography>
        </Box>
      </Container>
    </ClientLayout>
  );
}
