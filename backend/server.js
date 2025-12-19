const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
const uploadsDir = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsDir));

// Serve Static Files
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/admin', express.static(path.join(__dirname, '../admin')));

// Serve Admin Panel
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '../admin/admin.html'));
});

// Create uploads directory if it doesn't exist
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/flipr-db')
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));

// Multer Configuration for Image Upload
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only image files are allowed!'));
    }
});

// ==================== MODELS ====================

// Project Model
const projectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});
const Project = mongoose.model('Project', projectSchema);

// Client Model
const clientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    designation: { type: String, required: true },
    image: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});
const Client = mongoose.model('Client', clientSchema);

// Contact Model
const contactSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    city: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});
const Contact = mongoose.model('Contact', contactSchema);

// Newsletter Model
const newsletterSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now }
});
const Newsletter = mongoose.model('Newsletter', newsletterSchema);

// ==================== IMAGE PROCESSING FUNCTION ====================
async function processAndSaveImage(buffer, filename) {
    const filepath = path.join(uploadsDir, filename);
    
    // Crop image to 450x350 ratio (as per requirement)
    await sharp(buffer)
        .resize(450, 350, {
            fit: 'cover',
            position: 'center'
        })
        .jpeg({ quality: 90 })
        .toFile(filepath);
    
    return `/uploads/${filename}`;
}

// ==================== ROUTES ====================

// === PROJECT ROUTES ===

// Get all projects (for landing page)
app.get('/api/projects', async (req, res) => {
    try {
        const projects = await Project.find().sort({ createdAt: -1 });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching projects', error: error.message });
    }
});

// Add new project (for admin panel)
app.post('/api/projects', upload.single('image'), async (req, res) => {
    try {
        const { name, description } = req.body;
        
        if (!req.file) {
            return res.status(400).json({ message: 'Image is required' });
        }
        
        // Process and save image
        const filename = `project-${Date.now()}.jpg`;
        const imagePath = await processAndSaveImage(req.file.buffer, filename);
        
        const project = new Project({
            name,
            description,
            image: imagePath
        });
        
        await project.save();
        res.status(201).json({ message: 'Project added successfully', project });
    } catch (error) {
        res.status(500).json({ message: 'Error adding project', error: error.message });
    }
});

// Delete project (for admin panel)
app.delete('/api/projects/:id', async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        
        // Delete image file
        const imagePath = path.join(__dirname, project.image);
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }
        
        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting project', error: error.message });
    }
});

// === CLIENT ROUTES ===

// Get all clients (for landing page)
app.get('/api/clients', async (req, res) => {
    try {
        const clients = await Client.find().sort({ createdAt: -1 });
        res.json(clients);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching clients', error: error.message });
    }
});

// Add new client (for admin panel)
app.post('/api/clients', upload.single('image'), async (req, res) => {
    try {
        const { name, description, designation } = req.body;
        
        if (!req.file) {
            return res.status(400).json({ message: 'Image is required' });
        }
        
        // Process and save image
        const filename = `client-${Date.now()}.jpg`;
        const imagePath = await processAndSaveImage(req.file.buffer, filename);
        
        const client = new Client({
            name,
            description,
            designation,
            image: imagePath
        });
        
        await client.save();
        res.status(201).json({ message: 'Client added successfully', client });
    } catch (error) {
        res.status(500).json({ message: 'Error adding client', error: error.message });
    }
});

// Delete client (for admin panel)
app.delete('/api/clients/:id', async (req, res) => {
    try {
        const client = await Client.findByIdAndDelete(req.params.id);
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }
        
        // Delete image file
        const imagePath = path.join(__dirname, client.image);
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }
        
        res.json({ message: 'Client deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting client', error: error.message });
    }
});

// === CONTACT FORM ROUTES ===

// Submit contact form (from landing page)
app.post('/api/contact', async (req, res) => {
    try {
        const { fullName, email, mobile, city } = req.body;
        
        const contact = new Contact({
            fullName,
            email,
            mobile,
            city
        });
        
        await contact.save();
        res.status(201).json({ message: 'Contact form submitted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting contact form', error: error.message });
    }
});

// Get all contact submissions (for admin panel)
app.get('/api/contacts', async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching contacts', error: error.message });
    }
});

// Delete contact (for admin panel)
app.delete('/api/contacts/:id', async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        res.json({ message: 'Contact deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting contact', error: error.message });
    }
});

// === NEWSLETTER ROUTES ===

// Subscribe to newsletter (from landing page)
app.post('/api/newsletter', async (req, res) => {
    try {
        const { email } = req.body;
        
        // Check if email already exists
        const existing = await Newsletter.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: 'Email already subscribed' });
        }
        
        const newsletter = new Newsletter({ email });
        await newsletter.save();
        res.status(201).json({ message: 'Subscribed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error subscribing', error: error.message });
    }
});

// Get all newsletter subscribers (for admin panel)
app.get('/api/newsletters', async (req, res) => {
    try {
        const newsletters = await Newsletter.find().sort({ createdAt: -1 });
        res.json(newsletters);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching newsletters', error: error.message });
    }
});

// Delete newsletter subscriber (for admin panel)
app.delete('/api/newsletters/:id', async (req, res) => {
    try {
        const newsletter = await Newsletter.findByIdAndDelete(req.params.id);
        if (!newsletter) {
            return res.status(404).json({ message: 'Subscriber not found' });
        }
        res.json({ message: 'Subscriber deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting subscriber', error: error.message });
    }
});

// === HEALTH CHECK ===
app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is running', timestamp: new Date() });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 API: http://localhost:${PORT}/api`);
});