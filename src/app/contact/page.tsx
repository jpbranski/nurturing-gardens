import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Link as MuiLink,
  Grid,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import WebIcon from '@mui/icons-material/Web';
import BugReportIcon from '@mui/icons-material/BugReport';
import ClientLayout from '@/components/layout/ClientLayout';

export default function ContactPage() {
  const repoUrl = process.env.NEXT_PUBLIC_GITHUB_REPO_URL || 'https://github.com';

  return (
    <ClientLayout>
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
          Contact Us
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          We'd love to hear from you! Whether you have questions, suggestions, found a bug, or want
          to collaborate, feel free to reach out.
        </Typography>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          {/* Email */}
          <Grid item xs={12} sm={6} md={4}>
            <Paper
              sx={{
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <EmailIcon color="primary" sx={{ mr: 1, fontSize: 32 }} />
                <Typography variant="h6" fontWeight={600}>
                  Email
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" paragraph sx={{ flexGrow: 1 }}>
                For general inquiries, suggestions, or questions about plants and gardening:
              </Typography>
              <MuiLink
                href="mailto:dev@jpbranski.com"
                variant="body1"
                underline="hover"
                fontWeight={500}
              >
                dev@jpbranski.com
              </MuiLink>
            </Paper>
          </Grid>

          {/* Website */}
          <Grid item xs={12} sm={6} md={4}>
            <Paper
              sx={{
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <WebIcon color="primary" sx={{ mr: 1, fontSize: 32 }} />
                <Typography variant="h6" fontWeight={600}>
                  Developer Website
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" paragraph sx={{ flexGrow: 1 }}>
                Learn more about the developer and other projects:
              </Typography>
              <MuiLink
                href="https://jpbranski.com"
                target="_blank"
                rel="noopener noreferrer"
                variant="body1"
                underline="hover"
                fontWeight={500}
              >
                jpbranski.com
              </MuiLink>
            </Paper>
          </Grid>

          {/* GitHub Issues */}
          <Grid item xs={12} sm={6} md={4}>
            <Paper
              sx={{
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <BugReportIcon color="primary" sx={{ mr: 1, fontSize: 32 }} />
                <Typography variant="h6" fontWeight={600}>
                  Bug Reports & Features
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" paragraph sx={{ flexGrow: 1 }}>
                Found a bug or have an idea for a new feature? Please submit an issue on our
                GitHub repository:
              </Typography>
              <MuiLink
                href={`${repoUrl}/issues`}
                target="_blank"
                rel="noopener noreferrer"
                variant="body1"
                underline="hover"
                fontWeight={500}
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                GitHub Issues
              </MuiLink>
            </Paper>
          </Grid>
        </Grid>

        <Box sx={{ mt: 6, p: 3, bgcolor: 'background.default', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom fontWeight={600}>
            What We'd Love to Hear About
          </Typography>
          <Typography variant="body2" component="ul" sx={{ pl: 3 }}>
            <li>Plant information corrections or updates</li>
            <li>Suggestions for new features or improvements</li>
            <li>Bug reports or technical issues</li>
            <li>Content ideas for the blog</li>
            <li>Collaboration opportunities</li>
            <li>General feedback and questions</li>
          </Typography>
        </Box>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            We typically respond to inquiries within 2-3 business days.
            <br />
            Thank you for being part of the Nurturing Gardens community!
          </Typography>
        </Box>
      </Container>
    </ClientLayout>
  );
}
