
describe('EmailService', () => {
  let emailService: any;
  let mockSendMail: any;
  let mockCreateTransport: any;

  beforeEach(() => {
    jest.resetModules();
    
    mockSendMail = jest.fn().mockResolvedValue({});
    mockCreateTransport = jest.fn(() => ({
      sendMail: mockSendMail,
    }));

    jest.doMock('dotenv', () => ({
      __esModule: true,
      default: { config: jest.fn() },
      config: jest.fn(),
    }));

    jest.doMock('nodemailer', () => ({
      __esModule: true,
      default: {
        createTransport: mockCreateTransport,
      },
      createTransport: mockCreateTransport,
    }));

    // Mock environment variables
    process.env.ADMIN_EMAIL = 'admin@example.com';
    process.env.BREVO_SMTP_HOST = 'smtp-relay.brevo.com';
    process.env.BREVO_SMTP_PORT = '587';
    process.env.BREVO_SMTP_USER = 'test@example.com';
    process.env.BREVO_SMTP_PASS = 'test-password';

    const module = require('../../backend/lib/email');
    emailService = module.emailService;
  });

  describe('sendContactNotification', () => {
    it('should send contact notification email successfully', async () => {
      const contactData = {
        name: 'John Doe',
        email: 'john@example.com',
        company: 'Test Company',
        service: 'Video Production',
        message: 'Hello, I would like to get a quote for video production.',
      };

      const result = await emailService.sendContactNotification(contactData);

      expect(result).toBe(true);
      expect(mockSendMail).toHaveBeenCalled();
    });

    it('should return false if required fields are missing', async () => {
      const contactData = {
        name: '',
        email: 'john@example.com',
        company: 'Test Company',
        service: 'Video Production',
        message: 'Hello, I would like to get a quote for video production.',
      };

      const result = await emailService.sendContactNotification(contactData);

      expect(result).toBe(false);
    });

    it('should return false if email format is invalid', async () => {
      const contactData = {
        name: 'John Doe',
        email: 'invalid-email',
        company: 'Test Company',
        service: 'Video Production',
        message: 'Hello, I would like to get a quote for video production.',
      };

      const result = await emailService.sendContactNotification(contactData);

      expect(result).toBe(false);
    });
  });

  describe('sendAutoReply', () => {
    it('should send auto reply email successfully', async () => {
      const contactData = {
        name: 'John Doe',
        email: 'john@example.com',
        company: 'Test Company',
        service: 'Video Production',
        message: 'Hello, I would like to get a quote for video production.',
      };

      const result = await emailService.sendAutoReply(contactData);

      expect(result).toBe(true);
    });

    it('should return false if required fields are missing', async () => {
      const contactData = {
        name: 'John Doe',
        email: '',
        company: 'Test Company',
        service: 'Video Production',
        message: 'Hello, I would like to get a quote for video production.',
      };

      const result = await emailService.sendAutoReply(contactData);

      expect(result).toBe(false);
    });

    it('should return false if email format is invalid', async () => {
      const contactData = {
        name: 'John Doe',
        email: 'invalid-email',
        company: 'Test Company',
        service: 'Video Production',
        message: 'Hello, I would like to get a quote for video production.',
      };

      const result = await emailService.sendAutoReply(contactData);

      expect(result).toBe(false);
    });
  });

  describe('sendAppointmentNotification', () => {
    it('should send appointment notification emails successfully', async () => {
      const appointmentData = {
        service: 'Consultation',
        date: '2023-12-25',
        time: '10:00',
        clientName: 'John Doe',
        clientEmail: 'john@example.com',
        clientPhone: '+1234567890',
      };

      const result = await emailService.sendAppointmentNotification(appointmentData);

      expect(result).toBe(true);
    });

    it('should return false if required fields are missing', async () => {
      const appointmentData = {
        service: '',
        date: '2023-12-25',
        time: '10:00',
        clientName: 'John Doe',
        clientEmail: 'john@example.com',
        clientPhone: '+1234567890',
      };

      const result = await emailService.sendAppointmentNotification(appointmentData);

      expect(result).toBe(false);
    });

    it('should return false if email format is invalid', async () => {
      const appointmentData = {
        service: 'Consultation',
        date: '2023-12-25',
        time: '10:00',
        clientName: 'John Doe',
        clientEmail: 'invalid-email',
        clientPhone: '+1234567890',
      };

      const result = await emailService.sendAppointmentNotification(appointmentData);

      expect(result).toBe(false);
    });
  });

  describe('sendOrderNotification', () => {
    it('should send order notification emails successfully', async () => {
      const orderData = {
        service: 'Video Production',
        details: 'Full production package',
        clientName: 'John Doe',
        clientEmail: 'john@example.com',
        clientPhone: '+1234567890',
      };

      const result = await emailService.sendOrderNotification(orderData);

      expect(result).toBe(true);
    });

    it('should return false if required fields are missing', async () => {
      const orderData = {
        service: 'Video Production',
        details: '',
        clientName: 'John Doe',
        clientEmail: 'john@example.com',
        clientPhone: '+1234567890',
      };

      const result = await emailService.sendOrderNotification(orderData);

      expect(result).toBe(false);
    });

    it('should return false if email format is invalid', async () => {
      const orderData = {
        service: 'Video Production',
        details: 'Full production package',
        clientName: 'John Doe',
        clientEmail: 'invalid-email',
        clientPhone: '+1234567890',
      };

      const result = await emailService.sendOrderNotification(orderData);

      expect(result).toBe(false);
    });
  });
});