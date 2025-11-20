import React from 'react';
import { Container, Typography, Box, Divider, Link as MuiLink } from '@mui/material';
import ClientLayout from '@/components/layout/ClientLayout';

export default function AccessibilityPage() {
  return (
    <ClientLayout>
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
          Accessibility Statement
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Last updated: {new Date().toLocaleDateString()}
        </Typography>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ '& h2': { mt: 4, mb: 2 }, '& p': { mb: 2 } }}>
          <Typography variant="h5" component="h2" fontWeight={600}>
            Our Commitment
          </Typography>
          <Typography variant="body1">
            Nurturing Gardens is committed to ensuring digital accessibility for people with
            disabilities. We are continually improving the user experience for everyone and applying
            the relevant accessibility standards to ensure our website is inclusive and accessible
            to all.
          </Typography>

          <Typography variant="h5" component="h2" fontWeight={600}>
            Standards and Guidelines
          </Typography>
          <Typography variant="body1">
            We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA
            standards. These guidelines explain how to make web content more accessible for people
            with disabilities and more user-friendly for everyone.
          </Typography>

          <Typography variant="h5" component="h2" fontWeight={600}>
            Accessibility Features
          </Typography>
          <Typography variant="body1">
            Our website includes the following accessibility features:
          </Typography>
          <Typography variant="body1" component="ul" sx={{ pl: 4 }}>
            <li>
              <strong>Semantic HTML:</strong> We use proper HTML structure and semantic elements to
              ensure content is organized logically and screen readers can navigate effectively.
            </li>
            <li>
              <strong>Keyboard Navigation:</strong> All interactive elements can be accessed and
              operated using a keyboard alone, without requiring a mouse.
            </li>
            <li>
              <strong>Color Contrast:</strong> We maintain sufficient color contrast ratios between
              text and background colors to meet WCAG AA standards for readability.
            </li>
            <li>
              <strong>Descriptive Alt Text:</strong> Images include descriptive alternative text to
              convey meaning to users who cannot see them.
            </li>
            <li>
              <strong>Focus Indicators:</strong> Visible focus indicators help keyboard users track
              their position on the page.
            </li>
            <li>
              <strong>ARIA Labels:</strong> We use ARIA (Accessible Rich Internet Applications)
              attributes where appropriate to provide additional context for assistive technologies.
            </li>
            <li>
              <strong>Responsive Design:</strong> Our site adapts to different screen sizes and can
              be zoomed without loss of functionality.
            </li>
          </Typography>

          <Typography variant="h5" component="h2" fontWeight={600}>
            Known Limitations
          </Typography>
          <Typography variant="body1">
            Despite our best efforts, some limitations may exist:
          </Typography>
          <Typography variant="body1" component="ul" sx={{ pl: 4 }}>
            <li>
              Third-party content (such as embedded videos or external widgets) may not fully meet
              accessibility standards.
            </li>
            <li>
              Some plant images from external sources may not have detailed alternative descriptions.
            </li>
          </Typography>
          <Typography variant="body1">
            We are actively working to address these limitations and improve accessibility across
            all areas of our site.
          </Typography>

          <Typography variant="h5" component="h2" fontWeight={600}>
            Assistive Technologies
          </Typography>
          <Typography variant="body1">
            Our website is designed to be compatible with common assistive technologies, including:
          </Typography>
          <Typography variant="body1" component="ul" sx={{ pl: 4 }}>
            <li>Screen readers (JAWS, NVDA, VoiceOver, TalkBack)</li>
            <li>Screen magnification software</li>
            <li>Speech recognition software</li>
            <li>Keyboard-only navigation</li>
          </Typography>

          <Typography variant="h5" component="h2" fontWeight={600}>
            Feedback and Contact
          </Typography>
          <Typography variant="body1">
            We welcome your feedback on the accessibility of Nurturing Gardens. If you encounter any
            accessibility barriers or have suggestions for improvement, please contact us:
          </Typography>
          <Typography variant="body1" component="ul" sx={{ pl: 4 }}>
            <li>
              Email:{' '}
              <MuiLink href="mailto:dev@jpbranski.com" underline="hover">
                dev@jpbranski.com
              </MuiLink>
            </li>
            <li>
              Website:{' '}
              <MuiLink
                href="https://jpbranski.com"
                target="_blank"
                rel="noopener noreferrer"
                underline="hover"
              >
                jpbranski.com
              </MuiLink>
            </li>
          </Typography>
          <Typography variant="body1">
            We aim to respond to accessibility feedback within 5 business days and will work to
            resolve any issues as quickly as possible.
          </Typography>

          <Typography variant="h5" component="h2" fontWeight={600}>
            Continuous Improvement
          </Typography>
          <Typography variant="body1">
            Accessibility is an ongoing effort. We regularly review our website, conduct
            accessibility audits, and make improvements to ensure we provide an inclusive experience
            for all users. This accessibility statement will be updated to reflect any changes or
            improvements we make.
          </Typography>

          <Typography variant="h5" component="h2" fontWeight={600}>
            Third-Party Content
          </Typography>
          <Typography variant="body1">
            While we strive to ensure accessibility for all content on our site, some third-party
            content (such as external APIs, embedded media, or advertising) may be outside our
            direct control. We encourage those providers to meet accessibility standards and will
            work with them when issues are identified.
          </Typography>
        </Box>
      </Container>
    </ClientLayout>
  );
}
