const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Create a new PDF document
const doc = new PDFDocument({
    size: 'A4',
    margin: 50,
    info: {
        Title: 'Wasif Ullah - Professional Profile',
        Author: 'Wasif Ullah',
        Subject: 'Professional Bio',
        Keywords: 'MERN, Machine Learning, Developer, UET',
    }
});

// Create write stream
const outputPath = path.join(__dirname, '../data/sample.pdf');
const writeStream = fs.createWriteStream(outputPath);

// Pipe the PDF to the write stream
doc.pipe(writeStream);

// Helper function to add section
function addSection(title, content, isList = false) {
    doc.fontSize(14)
       .font('Helvetica-Bold')
       .text(title, { underline: true })
       .moveDown(0.5);

    if (isList) {
        content.forEach(item => {
            doc.fontSize(11)
               .font('Helvetica')
               .text(`• ${item}`, { indent: 20 });
        });
    } else {
        doc.fontSize(11)
           .font('Helvetica')
           .text(content);
    }
    doc.moveDown();
}

// Add header
doc.fontSize(24)
   .font('Helvetica-Bold')
   .text('WASIF ULLAH', { align: 'center' })
   .moveDown();

doc.fontSize(14)
   .font('Helvetica')
   .text('Professional Profile', { align: 'center' })
   .text('Last Updated: March 2024', { align: 'center' })
   .moveDown(2);

// Education Section
addSection('EDUCATION', [
    'University: University of Engineering and Technology (UET)',
    'Degree: Bachelor\'s in Computer Science',
    'Graduation Year: 2023',
    'GPA: 3.7/4.0'
]);

doc.fontSize(12)
   .font('Helvetica-Bold')
   .text('Relevant Coursework:', { indent: 20 })
   .moveDown(0.5);

const coursework = [
    'Advanced Data Structures and Algorithms',
    'Machine Learning and Artificial Intelligence',
    'Database Management Systems',
    'Software Engineering',
    'Computer Networks',
    'Operating Systems',
    'Web Development',
    'Cloud Computing'
];

coursework.forEach(course => {
    doc.fontSize(11)
       .font('Helvetica')
       .text(`• ${course}`, { indent: 40 });
});

doc.moveDown();

// Academic Achievements
doc.fontSize(12)
   .font('Helvetica-Bold')
   .text('Academic Achievements:', { indent: 20 })
   .moveDown(0.5);

const achievements = [
    'Dean\'s List for Academic Excellence (2021-2023)',
    'Best Final Year Project Award',
    'Participated in multiple hackathons',
    'Led the Computer Science Student Society',
    'Organized tech workshops and seminars'
];

achievements.forEach(achievement => {
    doc.fontSize(11)
       .font('Helvetica')
       .text(`• ${achievement}`, { indent: 40 });
});

doc.moveDown(2);

// Professional Experience
addSection('PROFESSIONAL EXPERIENCE', [
    'Role: MERN Stack Developer',
    'Company: TechInnovate Solutions',
    'Duration: March 2023 - Present',
    'Experience: 1 year'
]);

// Technical Skills
const skills = {
    'Frontend Development': [
        'React.js (Advanced)',
        'Redux for state management',
        'Material-UI and Tailwind CSS',
        'TypeScript',
        'Next.js',
        'WebSocket implementation',
        'Progressive Web Apps (PWA)'
    ],
    'Backend Development': [
        'Node.js and Express.js',
        'RESTful API design',
        'GraphQL',
        'Microservices architecture',
        'JWT authentication',
        'WebSocket servers',
        'API documentation (Swagger)'
    ],
    'Database': [
        'MongoDB (Advanced)',
        'Mongoose ODM',
        'Redis for caching',
        'Database optimization',
        'Data modeling',
        'Backup and recovery'
    ],
    'DevOps & Tools': [
        'Git and GitHub',
        'Docker containerization',
        'AWS (EC2, S3, Lambda)',
        'CI/CD with Jenkins',
        'Nginx server configuration',
        'Linux server management',
        'Monitoring tools (Prometheus, Grafana)'
    ]
};

Object.entries(skills).forEach(([category, items]) => {
    doc.fontSize(12)
       .font('Helvetica-Bold')
       .text(category + ':', { indent: 20 })
       .moveDown(0.5);

    items.forEach(skill => {
        doc.fontSize(11)
           .font('Helvetica')
           .text(`• ${skill}`, { indent: 40 });
    });
    doc.moveDown();
});

// Projects
addSection('PROJECTS', '');

const projects = [
    {
        title: 'E-commerce Platform (MERN Stack)',
        features: [
            'User authentication and authorization',
            'Product catalog with search and filters',
            'Shopping cart and wishlist',
            'Payment gateway integration (Stripe)',
            'Order management system',
            'Admin dashboard',
            'Real-time inventory updates',
            'Customer reviews and ratings',
            'Responsive design for all devices'
        ],
        tech: 'Technologies: React, Node.js, MongoDB, Redux, Socket.io'
    },
    {
        title: 'ML-based Image Classification',
        features: [
            'Custom CNN architecture',
            'Data preprocessing pipeline',
            'Model training and validation',
            'API for real-time predictions',
            'Web interface for testing',
            'Performance monitoring'
        ],
        tech: 'Technologies: Python, TensorFlow, Flask, React'
    },
    {
        title: 'Real-time Chat Application',
        features: [
            'Real-time messaging',
            'File sharing',
            'Group chats',
            'Message encryption',
            'Online status tracking',
            'Message history',
            'User presence system'
        ],
        tech: 'Technologies: Socket.io, React, Node.js, MongoDB'
    }
];

projects.forEach(project => {
    doc.fontSize(12)
       .font('Helvetica-Bold')
       .text(project.title, { indent: 20 })
       .moveDown(0.5);

    project.features.forEach(feature => {
        doc.fontSize(11)
           .font('Helvetica')
           .text(`• ${feature}`, { indent: 40 });
    });

    doc.fontSize(11)
       .font('Helvetica-Oblique')
       .text(project.tech, { indent: 40 })
       .moveDown();
});

// Certifications
addSection('CERTIFICATIONS', [
    'AWS Certified Developer Associate',
    'MongoDB Certified Developer',
    'TensorFlow Developer Certificate',
    'React Advanced Concepts',
    'Node.js Best Practices'
]);

// Career Goals
addSection('CAREER GOALS', '');

doc.fontSize(12)
   .font('Helvetica-Bold')
   .text('Short-term (1-2 years):', { indent: 20 })
   .moveDown(0.5);

const shortTermGoals = [
    'Master advanced full-stack development',
    'Lead development teams',
    'Contribute to open-source projects',
    'Build scalable applications'
];

shortTermGoals.forEach(goal => {
    doc.fontSize(11)
       .font('Helvetica')
       .text(`• ${goal}`, { indent: 40 });
});

doc.moveDown();

doc.fontSize(12)
   .font('Helvetica-Bold')
   .text('Long-term (3-5 years):', { indent: 20 })
   .moveDown(0.5);

const longTermGoals = [
    'Become a Technical Architect',
    'Start a tech-focused business',
    'Mentor aspiring developers',
    'Contribute to AI research'
];

longTermGoals.forEach(goal => {
    doc.fontSize(11)
       .font('Helvetica')
       .text(`• ${goal}`, { indent: 40 });
});

// Contact Information
addSection('CONTACT INFORMATION', [
    'Email: [Your Email]',
    'LinkedIn: [Your LinkedIn]',
    'GitHub: [Your GitHub]',
    'Portfolio: [Your Portfolio]',
    'Twitter: [Your Twitter]'
]);

// Footer
doc.fontSize(10)
   .font('Helvetica-Oblique')
   .text('Note: This profile is regularly updated with new skills, experiences, and achievements.', { align: 'center' })
   .text('Last updated: March 2024', { align: 'center' });

// Finalize the PDF
doc.end();

console.log('PDF created successfully at:', outputPath); 