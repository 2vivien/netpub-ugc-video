
import './load-env.js';
import { emailService } from './lib/email.js';

async function testEmailService() {
    console.log('--- Testing EmailService ---');

    const contactData = {
        name: 'Test Assistant',
        email: 'test@example.com',
        company: 'Antigravity Test',
        service: 'Video Production',
        message: 'This is a test message from the assistant to verify the email service.'
    };

    try {
        console.log('Sending contact notification...');
        const result = await emailService.sendContactNotification(contactData);
        console.log('Result:', result ? '✅ SUCCESS' : '❌ FAILED');

        if (result) {
            console.log('Sending auto-reply...');
            const autoReplyResult = await emailService.sendAutoReply(contactData);
            console.log('Auto-reply result:', autoReplyResult ? '✅ SUCCESS' : '❌ FAILED');
        }
    } catch (error) {
        console.error('ERROR during testing:', error);
    }
}

testEmailService();
