// seed.js - Add dummy data to database
// Run: node seed.js

const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ Error:', err));

const projectSchema = new mongoose.Schema({
    name: String,
    description: String,
    image: String,
    createdAt: { type: Date, default: Date.now }
});
const Project = mongoose.model('Project', projectSchema);

const clientSchema = new mongoose.Schema({
    name: String,
    description: String,
    designation: String,
    image: String,
    createdAt: { type: Date, default: Date.now }
});
const Client = mongoose.model('Client', clientSchema);

const projects = [
    {
        name: "E-Commerce Platform",
        description: "Modern e-commerce platform with React and Node.js, featuring real-time inventory management and secure payments.",
        image: "https://images.unsplash.com/photo-1557821552-17105176677c?w=450&h=350&fit=crop"
    },
    {
        name: "AI Analytics Dashboard",
        description: "Advanced analytics dashboard with machine learning for predictive insights and automated reporting.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=450&h=350&fit=crop"
    },
    {
        name: "Healthcare System",
        description: "Comprehensive healthcare solution with patient portal, appointment scheduling, and telemedicine.",
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=450&h=350&fit=crop"
    },
    {
        name: "Social Media App",
        description: "Feature-rich social platform with real-time messaging, content sharing, and live streaming.",
        image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=450&h=350&fit=crop"
    },
    {
        name: "Food Delivery Platform",
        description: "Complete food ordering solution with GPS tracking, real-time updates, and restaurant management.",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=450&h=350&fit=crop"
    },
    {
        name: "E-Learning Portal",
        description: "Interactive platform with video lectures, live classes, assessments, and gamification features.",
        image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=450&h=350&fit=crop"
    }
];

const clients = [
    {
        name: "Rajesh Kumar",
        description: "Working with this team has been exceptional. They delivered our platform ahead of schedule with outstanding quality and support!",
        designation: "CEO, TechMart India",
        image: "https://i.pravatar.cc/150?img=12"
    },
    {
        name: "Priya Sharma",
        description: "The AI analytics dashboard transformed our business operations. We now have real-time insights for data-driven decisions.",
        designation: "CTO, DataVision Solutions",
        image: "https://i.pravatar.cc/150?img=5"
    },
    {
        name: "Amit Patel",
        description: "Their healthcare technology expertise is unmatched. The system streamlined our operations and improved patient satisfaction.",
        designation: "Director, HealthCare Plus",
        image: "https://i.pravatar.cc/150?img=33"
    },
    {
        name: "Sneha Reddy",
        description: "Exceptional work on our social platform! They understood our vision perfectly and delivered beyond expectations.",
        designation: "Founder, ConnectHub",
        image: "https://i.pravatar.cc/150?img=9"
    },
    {
        name: "Vikram Singh",
        description: "Our food delivery app has been a huge success thanks to their technical expertise and innovative solutions.",
        designation: "Managing Director, FoodExpress",
        image: "https://i.pravatar.cc/150?img=14"
    },
    {
        name: "Ananya Desai",
        description: "The educational portal revolutionized our online education delivery. Students love the interactive features!",
        designation: "Principal, EduTech Academy",
        image: "https://i.pravatar.cc/150?img=23"
    }
];

async function seedData() {
    try {
        console.log('🗑️  Clearing old data...');
        await Project.deleteMany({});
        await Client.deleteMany({});
        
        console.log('📁 Adding projects...');
        await Project.insertMany(projects);
        console.log(`✅ Added ${projects.length} projects`);
        
        console.log('😊 Adding clients...');
        await Client.insertMany(clients);
        console.log(`✅ Added ${clients.length} clients`);
        
        console.log('\n🎉 Database seeded successfully!');
        console.log('👉 Open your landing page to see the data\n');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

seedData();