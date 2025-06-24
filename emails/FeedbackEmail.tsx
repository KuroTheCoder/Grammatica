// file: emails/FeedbackEmail.tsx

import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Preview,
    Section,
    Text,
    Row,
    Column,
} from '@react-email/components';
import * as React from 'react';

interface FeedbackEmailProps {
    name: string;
    type: 'suggestion' | 'bug';
    rating: number;
    message: string;
}

const baseUrl = process.env.VERCEL_URL
    ? `https://grammatica-ai.vercel.app` // <-- Bro nhớ đổi thành URL project của mình
    : 'http://localhost:3000';

// Helper để render sao cho đẹp
const renderStars = (rating: number) => {
    let stars = '';
    for (let i = 0; i < 5; i++) {
        stars += i < rating ? '★' : '☆';
    }
    return stars;
};

export const FeedbackEmail = ({
                                  name,
                                  type,
                                  rating,
                                  message,
                              }: FeedbackEmailProps) => (
    <Html>
        <Head />
        <Preview>New Feedback for Grammatica AI from {name}</Preview>
        <Body style={main}>
            <Container style={container}>
                <Section style={logoSection}>
                    <Img
                        src={`${baseUrl}/logo.png`} // <-- Path tới logo trong thư mục public
                        width="40"
                        height="40"
                        alt="Grammatica Logo"
                    />
                    <Text style={logoText}>Grammatica AI</Text>
                </Section>
                <Heading style={heading}>
                    New Feedback Received!
                </Heading>
                <Text style={paragraph}>Here are the details from the submission:</Text>

                <Section style={infoSection}>
                    <Row style={infoRow}>
                        <Column style={infoLabel}>From:</Column>
                        <Column style={infoValue}>{name}</Column>
                    </Row>
                    <Row style={infoRow}>
                        <Column style={infoLabel}>Type:</Column>
                        <Column style={infoValue}>
                            <span style={type === 'bug' ? tagBug : tagSuggestion}>
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </span>
                        </Column>
                    </Row>
                    <Row style={infoRow}>
                        <Column style={infoLabel}>Rating:</Column>
                        <Column style={{ ...infoValue, color: '#fde047' }}>
                            {renderStars(rating)} ({rating}/5)
                        </Column>
                    </Row>
                </Section>

                <Hr style={hr} />

                <Section>
                    <Heading as="h2" style={subHeading}>Message</Heading>
                    <Text style={messageBox}>
                        {message}
                    </Text>
                </Section>

                <Hr style={hr} />

                <Text style={footer}>
                    Grammatica AI Project - High School Science Fair
                </Text>
            </Container>
        </Body>
    </Html>
);

export default FeedbackEmail;

// --- STYLES ---

const main = {
    backgroundColor: '#040D0A', // Dark theme background
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
    margin: '0 auto',
    padding: '20px 0 48px',
    width: '580px',
    maxWidth: '100%',
};

const logoSection = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: '20px',
}

const logoText = {
    color: '#A2C5B6',
    fontSize: '24px',
    fontWeight: 'bold',
    marginLeft: '12px',
}

const heading = {
    color: '#ffffff',
    fontSize: '28px',
    fontWeight: 'bold',
    textAlign: 'center' as const,
    margin: '30px 0',
};

const subHeading = {
    color: '#cbd5e1', // slate-300
    fontSize: '18px',
    fontWeight: 'bold',
    margin: '24px 0 16px 0',
}

const paragraph = {
    color: '#94a3b8', // slate-400
    fontSize: '16px',
    lineHeight: '26px',
    textAlign: 'center' as const,
};

const infoSection = {
    backgroundColor: '#0f172a', // slate-900
    borderRadius: '12px',
    padding: '20px',
    border: '1px solid #1e293b' // slate-800
};

const infoRow = {
    margin: '8px 0',
}

const infoLabel = {
    color: '#94a3b8', // slate-400
    width: '100px',
};

const infoValue = {
    color: '#f1f5f9', // slate-100
    fontWeight: '500',
};

const tag = {
    padding: '4px 10px',
    borderRadius: '16px',
    fontSize: '12px',
    fontWeight: 'bold',
    display: 'inline-block',
};

const tagSuggestion = {
    ...tag,
    backgroundColor: 'rgba(16, 185, 129, 0.2)', // bg-emerald-500/20
    color: '#6ee7b7', // text-emerald-300
};

const tagBug = {
    ...tag,
    backgroundColor: 'rgba(239, 68, 68, 0.2)', // bg-red-500/20
    color: '#fca5a5', // text-red-300
};

const messageBox = {
    border: '1px solid #1e293b', // slate-800
    borderRadius: '8px',
    padding: '16px',
    backgroundColor: '#020617', // slate-950
    color: '#cbd5e1', // slate-300
    fontSize: '14px',
    lineHeight: '24px',
    whiteSpace: 'pre-wrap' as const,
}

const hr = {
    borderColor: '#1e293b', // slate-800
    margin: '20px 0',
};

const footer = {
    color: '#64748b', // slate-500
    fontSize: '12px',
    textAlign: 'center' as const,
};