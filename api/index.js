const express = require("express");
const PDFDocument = require("pdfkit");

const app = express();
const cors = require("cors"); // install dulu: npm install cors

const port = 3000;

function generateCVStream(res) {
  const doc = new PDFDocument({ margin: 50 });

  // Set headers supaya langsung download
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="Malik_Fullstack_Developer_CV_25062026.pdf"',
  );

  doc.pipe(res); // Langsung stream ke response

  const pageWidth =
    doc.page.width - doc.page.margins.left - doc.page.margins.right;
  const sectionHeaderHeight = 22;
  const sectionHeaderColor = "#e6f0ff";

  // === Utility functions ===

  function addHeader(title) {
    const x = doc.page.margins.left;
    const y = doc.y;

    // Estimasi tinggi minimum yang diperlukan: kotak header + satu baris teks
    const requiredHeight = sectionHeaderHeight + 14; // 14 = kira-kira tinggi teks + margin bawah

    // Cek sisa ruang di halaman saat ini
    const remainingHeight = doc.page.height - doc.page.margins.bottom - y;

    if (remainingHeight < requiredHeight) {
      doc.addPage();
    }

    // Setelah yakin ruang cukup, gambar kotak dan teks
    doc.rect(x, doc.y, pageWidth, sectionHeaderHeight).fill(sectionHeaderColor);

    doc
      .fillColor("black")
      .font("Helvetica-Bold")
      .fontSize(12)
      .text(title, x + 5, doc.y + 6);

    doc.moveDown(1);
  }

  function addParagraph(text) {
    doc
      .font("Helvetica")
      .fontSize(10.5)
      .fillColor("black")
      .text(text, {
        lineGap: 3,
      })
      .moveDown(0.7);
  }

  function addContactInfo() {
    const baseX = doc.page.margins.left;
    const indent = 5; // indent sebesar 15px
    let y = doc.y;

    doc.font("Helvetica").fontSize(10.5).fillColor("black");

    doc.text("Email: 123husena@gmail.com", baseX + indent, y);
    y = doc.y + 4;

    doc.text("Phone: +62 813 3697 9372", baseX + indent, y);
    y = doc.y + 4;

    doc.text("LinkedIn: ", baseX + indent, y, { continued: true });
    doc.fillColor("blue").text("linkedin.com/in/husen-malik", {
      link: "https://linkedin.com/in/husen-malik",
      underline: true,
      continued: false,
    });
    y = doc.y + 4;

    doc
      .fillColor("black")
      .text("GitHub: ", baseX + indent, y, { continued: true });

    doc.fillColor("blue").text("github.com/13husen", {
      link: "https://github.com/13husen",
      underline: true,
      continued: false,
    });

    y = doc.y + 4;
    doc
      .fillColor("black")
      .text("Website: ", baseX + indent, y, { continued: true });

    doc.fillColor("blue").text("malik-latest-cv.vercel.app", {
      link: "https://malik-latest-cv.vercel.app/",
      underline: true,
      continued: false,
    });

    y = doc.y + 4;
    
    doc
      .fillColor("black")
      .text("Location: Jakarta, Indonesia", baseX + indent, y);

    doc.moveDown(0.7);
  }

  function addBulletList(items) {
    const bulletSymbol = "• ";
    const bulletWidth = doc.widthOfString(bulletSymbol);
    const textIndent = bulletWidth + 4;

    items.forEach((item) => {
      const text = typeof item === "string" ? item : item.label;
      const link = typeof item === "object" ? item.link : null;

      doc
        .font("Helvetica")
        .fontSize(10.5)
        .fillColor("black")
        .text(bulletSymbol, { continued: true, indent: 0, width: pageWidth });

      doc.text(text, {
        link: link || undefined,
        underline: !!link,
        indent: textIndent,
        width: pageWidth - textIndent,
        paragraphGap: 2,
        lineGap: 2,
      });
    });

    doc.moveDown(0.5);
  }

  function addExperience(title, company, duration, points) {
    doc
      .font("Helvetica-Bold")
      .fontSize(10.8)
      .text(`${title} | ${company} | ${duration}`)
      .moveDown(0.3);

    addBulletList(points);
  }

  // === Header ===
  doc
    .fontSize(18)
    .font("Helvetica-Bold")
    .fillColor("black")
    .text("Muhammad Malik Hussein - Fullstack Developer", {
      align: "center",
    })
    .moveDown(1.2);

  // === Sections ===
  addHeader("Contact Information");
  addContactInfo();

  addHeader("Summary");
  addParagraph(
    `Results-driven Fullstack Developer with over 8 years of experience in designing, developing, and maintaining scalable web applications. Proficient in both frontend and backend technologies, with a passion for clean code and agile methodologies. Strong experience with Java, Springboot, JavaScript, TypeScript, PHP, Laravel, React, Angular, Node.js, and cloud infrastructure (AWS, GCP).`,
  );

  addHeader("Technical Skills");
  addBulletList([
    "Backend: Java (8/11/17/21), Spring Boot, Quarkus, Java Servlet, Apache Ant, Node.js, PHP (Laravel 8-12, Lumen, CodeIgniter 3 & 4, SlimPHP), Python",
    "Frontend: JavaScript (ES6+), TypeScript, React.js, Next.js, Angular, Vue.js, Nuxt.js, Ionic, jQuery, HTML5, CSS3, Sass, Blade",
    "Mobile & Low-Code: Android Studio (Java) and kotlin, Xcode, Flutter, OutSystems, Framer",
    "UI Frameworks: Tailwind CSS, Bootstrap, Materialize, Vuetify, Chakra UI, PrimeReact, PrimeNG, Material UI",
    "Databases: PostgreSQL, MySQL, SQL Server, MongoDB, Redis, SQLite, Couchbase (N1QL), PocketBase",
    "Cloud & Infrastructure: AWS (S3, Amplify, Lambda), Google Cloud Platform (GCP), Google Cloud Storage (GCS), Google Kubernetes Engine (GKE), DigitalOcean, Vercel, Heroku",
    "DevOps, Automations & Tools: Docker, Kubernetes, Jenkins, Git, GitHub, Bitbucket, Gitea, HashiCorp Vault, Postman, DBeaver, MongoDB Atlas, cPanel, n8n",
    "Authentication & Security: OAuth 2.0, JWT, Google OAuth, Discord OAuth, LinkedIn OAuth, Keycloak",
    "Integrations: OpenAI API, Whisper API, Telegram Bot, Firebase Cloud Messaging (FCM), Twilio, Infobip, RajaSMS, Zenziva",
    "Payment Gateway: iPaymu, T-Money, Billfazz, Xenopay, Tranglo",
    "Blockchain & Web3: Web3.js, Web3 Onboard",
    "Testing: Jest, PHPUnit, JUnit, Mockito",
    "Methodologies: Agile, Scrum, CI/CD, Microservices Architecture",
  ]);

  addHeader("Professional Experience");
  addExperience(
    "Fullstack Developer",
    "PT Bank Digital BCA",
    "Jan 2024 - Present",
    [
      "Developed and maintained multiple enterprise applications using Angular 17, TypeScript, Java Spring Boot, and PostgreSQL",
      "Enhanced backend performance by implementing multithreaded processing and bulk operations capable of handling over 1 million records",
      "Integrated external APIs and automated batch processing jobs using Shell Script and Apache Ant",
      "Managed CI/CD pipelines and application deployments using Jenkins",
      "Created and maintained microservices and backend services for scalable enterprise systems",
      "Delivered bug fixes, UI enhancements, and API improvements across multiple projects",
    ],
  );

  addExperience(
    "Fullstack Developer",
    "Prudential Life Assurance (Prudential Indonesia)",
    "Dec 2022 - Dec 2024",
    [
      "Developed enterprise applications using Angular, TypeScript, Spring Boot, Quarkus, and PostgreSQL",
      "Delivered high-quality software solutions in collaboration with cross-functional teams",
      "Maintained clean, efficient, and reliable code following software engineering best practices",
      "Performed testing, debugging, and code reviews to improve system stability and maintainability",
      "Managed project deliverables using Agile methodologies and contributed to technical documentation",
      "Worked with Google Cloud Platform, Google Cloud Storage, and Couchbase databases",
    ],
  );

  addExperience(
    "Freelance Fullstack Developer",
    "PT Diawan Dinamika Digital",
    "Jun 2024 - Jun 2026",
    [
      "Delivered multiple projects including Pixlo.id, Karir.diawan.id, Efoplay, and Asthara CRM",
      "Built scalable web applications using Next.js, React, Laravel, CodeIgniter, TypeScript, and Tailwind CSS",
      "Integrated OpenAI and Whisper APIs for AI-powered interview and automation features",
      "Implemented authentication and identity management using Keycloak",
      "Containerized and deployed applications using Docker",
      "Adapted quickly across different business domains, architectures, and technology stacks",
    ],
  );

  addExperience(
    "Fullstack Developer",
    "Kryst Digital Pte. Ltd (Remote)",
    "Sep 2022 - Sep 2023",
    [
      "Developed Web3 applications and dApps using Next.js, Node.js, NestJS, TypeScript, and MongoDB",
      "Integrated Telegram Bot, GitHub, OAuth providers, and third-party services",
      "Built responsive user interfaces using Tailwind CSS",
      "Collaborated with frontend and backend teams to deliver scalable blockchain-based applications",
      "Maintained documentation, code quality standards, and development best practices",
    ],
  );

  addExperience(
    "Fullstack Developer",
    "PT Tema Data Rekayasa Digital",
    "Jul 2020 - Dec 2021",
    [
      "Developed Android and web applications using Laravel, Lumen, Vue.js, Nuxt.js, Flutter, and Java",
      "Designed and maintained backend APIs and responsive frontend applications",
      "Collaborated with cross-functional teams to ensure successful feature delivery",
      "Performed code reviews and maintained technical documentation",
      "Worked with OAuth2, JWT authentication, automated testing, and Tencent Cloud services",
    ],
  );

  addExperience(
    "Backend Lead",
    "PT Sandika Cahya Mandiri (liteBIG)",
    "Jul 2017 - Jun 2020",
    [
      "Promoted from Web Developer to Android Developer and later Backend Lead",
      "Led API integration and backend architecture initiatives using CodeIgniter and Java Servlet",
      "Integrated payment gateways including T-Money, iPaymu, and Billfazz",
      "Integrated OTP and messaging services using Infobip, RajaSMS, and Zenziva",
      "Developed real-time messaging systems using Ejabberd",
      "Managed Android and iOS application releases to Google Play Store and Apple App Store",
      "Coordinated cross-functional teams and drove technical improvements across projects",
    ],
  );

  addHeader("Education");
  addParagraph(
    "Bachelor of Information Technology | Indraprasta PGRI University, South Jakarta | 2018 - 2022",
  );

  addHeader("Certifications");
  addBulletList([
    {
      label: "Dicoding Back-End Developer Expert with JavaScript",
      link: "https://www.dicoding.com/certificates/98XWE7QL4XM3",
    },
    {
      label: "EF SET English Certificate",
      link: "https://cert.efset.org/n5hbbR",
    },
    {
      label: "Dicoding Kotlin Android Developer Expert",
      link: "https://www.dicoding.com/certificates/KEXLY7Q94ZG2",
    },
    {
      label: "Dicoding Cloud dan Gen AI di AWS",
      link: "https://www.dicoding.com/certificates/81P24460YZOY",
    },
  ]);

  doc.end();
}

app.use(cors());

app.get("/download-cv", (req, res) => {
  generateCVStream(res);
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});

module.exports = app;
