const DEFAULT_SITE_DATA = {
    announcement: {
        enabled: false,
        text: "Admissions open for Academic Year 2026-2027! Limited seats available.",
        link: "#contact",
        linkText: "Apply Now"
    },
    hero: {
        badgeText: "Sainik & Navodaya Oriented",
        titleLine1: "SHAPING",
        titleLine2: "FUTURES",
        subtitle: "The one and only institution giving coaching for SAINIK + RMS + NAVODAYA + Regular School Education for single fee",
        location: "Madanapalle, Andhra Pradesh"
    },
    uspBanner: {
        titleLine1: "Single Fee • Multiple Dreams",
        titleLine2: "Quality Education + Competitive Coaching",
        description: "Save time and money with our integrated approach. Expert faculty, modern infrastructure, and proven results."
    },
    stats: [
        { count: 1500, label: "Students" },
        { count: 98, label: "% Success Rate" },
        { count: 25, label: "Years Excellence" },
        { count: 150, label: "Students Selected" }
    ],
    about: {
        tag: "About Us",
        title: "25 Years of Excellence",
        subtitle: "Abhyudaya E.M. High School has been at the forefront of academic excellence, combining traditional values with modern teaching methodologies.",
        cards: [
            { icon: "ri-award-line", title: "Award Winning", description: "Recognized for excellence in education with multiple national and international awards." },
            { icon: "ri-user-smile-line", title: "Expert Faculty", description: "Highly qualified teachers with M.A., M.Phil., M.Ed. degrees and years of experience." },
            { icon: "ri-building-line", title: "Modern Infrastructure", description: "State-of-the-art building with smart classrooms, laboratories, and sports facilities." }
        ]
    },
    programs: {
        tag: "Our Programs",
        title: "Academic Excellence",
        subtitle: "Comprehensive programs designed to nurture talent and achieve outstanding results in competitive exams.",
        cards: [
            { icon: "ri-shield-star-line", colors: ["#ff6b00", "#ff8533"], title: "Sainik School", description: "Comprehensive coaching for Sainik School entrance with physical training and interview preparation.", features: ["Classes 5th, 6th & 8th", "Physical Training", "Interview Preparation", "Regular Mock Tests"] },
            { icon: "ri-book-open-line", colors: ["#d4af37", "#f59e0b"], title: "RMS & Navodaya", description: "Specialized coaching for Rashtriya Military Schools and Jawahar Navodaya Vidyalaya.", features: ["Expert Faculty", "Study Material Provided", "Regular Assessments", "Doubt Clearing Sessions"] },
            { icon: "ri-graduation-cap-line", colors: ["#1e3a8a", "#3b82f6"], title: "Regular School", description: "Complete K-12 education with CBSE/State board curriculum and modern teaching methodologies.", features: ["Smart Classrooms", "Extracurricular Activities", "Transport Facility", "Holistic Development"] }
        ]
    },
    testimonials: [
        { avatar: "RP", name: "Rajesh Patel", role: "Parent of Sainik School Student", text: '"Abhyudaya transformed my son\'s confidence and academic performance. The integrated coaching approach helped him secure admission to Sainik School. The faculty\'s dedication is remarkable."' },
        { avatar: "SK", name: "Sunita Kumar", role: "Parent of Navodaya Student", text: '"The single fee model is a blessing for middle-class families. My daughter got selected for Navodaya Vidyalaya thanks to the excellent coaching and regular mock tests. Highly recommended!"' },
        { avatar: "AR", name: "Arun Reddy", role: "Class 10 Student", text: '"The teachers here don\'t just teach, they inspire. The smart classrooms and practical learning approach made studying enjoyable. I scored 95% in my board exams!"' },
        { avatar: "LM", name: "Lakshmi Menon", role: "Parent of RMS Student", text: '"From day one, the school focused on holistic development. My son not only cleared RMS entrance but also developed leadership skills. The physical training program is excellent."' },
        { avatar: "VS", name: "Venkatesh Sharma", role: "Alumni - Class of 2020", text: '"Abhyudaya gave me the foundation to excel in competitive exams. The discipline, time management, and study techniques I learned here helped me throughout my engineering journey."' },
        { avatar: "PN", name: "Priya Nair", role: "Parent of Regular School Student", text: '"The balance between academics and extracurricular activities is perfect. My daughter enjoys going to school every day. The transport facility and safety measures give us peace of mind."' }
    ],
    studentLife: [
        { image: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=600&h=450&fit=crop", icon: "ri-trophy-line", title: "Sports & Athletics", description: "Annual sports meets, inter-house competitions, and professional coaching in cricket, football, and athletics." },
        { image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&h=450&fit=crop", icon: "ri-music-2-line", title: "Cultural Events", description: "Annual day celebrations, dance competitions, music concerts, and drama performances that showcase hidden talents." },
        { image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&h=450&fit=crop", icon: "ri-flask-line", title: "Science & Innovation", description: "Science exhibitions, robotics clubs, coding workshops, and innovation labs to foster scientific temper." },
        { image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&h=450&fit=crop", icon: "ri-book-open-line", title: "Library & Reading", description: "Well-stocked library with 5000+ books, reading clubs, and literary activities to promote love for reading." },
        { image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&h=450&fit=crop", icon: "ri-computer-line", title: "Smart Classrooms", description: "Digital learning with smart boards, projectors, and interactive sessions for better understanding." },
        { image: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&h=450&fit=crop", icon: "ri-heart-line", title: "Community Service", description: "Social outreach programs, environmental initiatives, and value education to build responsible citizens." }
    ],
    videos: [
        { thumbnail: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=600&fit=crop", videoId: "dQw4w9WgXcQ", title: "Campus Infrastructure", subtitle: "Explore our world-class facilities", backIcon: "ri-building-4-line", backIconColor: "var(--primary)", backTitle: "Modern Campus", backDesc: "State-of-the-art infrastructure with smart classrooms, modern laboratories, library, and extensive sports facilities." },
        { thumbnail: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop", videoId: "dQw4w9WgXcQ", title: "Annual Sports Day", subtitle: "Track & Field Events 2024", backIcon: "ri-trophy-line", backIconColor: "var(--secondary)", backTitle: "Sports Excellence", backDesc: "Annual sports day featuring athletics, football, cricket, and various indoor games with inter-house competitions." },
        { thumbnail: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=600&fit=crop", videoId: "dQw4w9WgXcQ", title: "Science Exhibition", subtitle: "Innovation & Creativity", backIcon: "ri-flask-line", backIconColor: "#3b82f6", backTitle: "Science & Innovation", backDesc: "Annual science exhibition showcasing student projects, experiments, and innovative ideas in various fields." },
        { thumbnail: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop", videoId: "dQw4w9WgXcQ", title: "Annual Day", subtitle: "Cultural Celebration", backIcon: "ri-music-2-line", backIconColor: "#ec4899", backTitle: "Cultural Fest", backDesc: "Grand annual day celebration with dance, music, drama performances, and prize distribution ceremony." }
    ],
    gallery: [
        { image: "https://images.unsplash.com/photo-1523539693385-e5e891eb4465?w=600&h=450&fit=crop", title: "Annual Day", subtitle: "Cultural Celebration" },
        { image: "https://images.unsplash.com/photo-1544531585-9847b68c8c86?w=600&h=450&fit=crop", title: "Graduation", subtitle: "Class of 2024" },
        { image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&h=450&fit=crop", title: "Classroom", subtitle: "Interactive Learning" },
        { image: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&h=450&fit=crop", title: "Sports Day", subtitle: "Athletics & Games" },
        { image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&h=450&fit=crop", title: "Science Lab", subtitle: "Modern Facilities" },
        { image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&h=450&fit=crop", title: "Library", subtitle: "Knowledge Hub" }
    ],
    contact: {
        phone: "+917013509107",
        phoneDisplay: "+91 7013509107",
        whatsapp: "917013509107",
        email: "info@abhyudayaschool.com",
        address: "Madanapalle, Andhra Pradesh",
        locationDesc: "Have questions about admissions, programs, or facilities? We'd love to hear from you. Reach out and we'll respond as soon as possible."
    }
};

window.SITE_DATA = JSON.parse(localStorage.getItem('abhyudaya_data')) || DEFAULT_SITE_DATA;

function saveSiteData(data) {
    localStorage.setItem('abhyudaya_data', JSON.stringify(data));
    window.SITE_DATA = data;
}

function exportData() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(window.SITE_DATA, null, 4));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", "abhyudaya_data.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}
