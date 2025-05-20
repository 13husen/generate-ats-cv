const express = require("express");
const PDFDocument = require("pdfkit");

const app = express();
const port = 3000;

function generateCVStream(res) {
  const doc = new PDFDocument({ margin: 50 });

  // Set headers supaya langsung download
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="Senior_Fullstack_Developer_CV.pdf"'
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
    `Results-driven Fullstack Developer with over 7 years of experience in designing, developing, and maintaining scalable web applications. Proficient in both frontend and backend technologies, with a passion for clean code and agile methodologies. Strong experience with Java, Springboot, JavaScript, TypeScript, PHP, Laravel, React, Angular, Node.js, and cloud infrastructure (AWS, GCP).`
  );

  addHeader("Technical Skills");
  addBulletList([
    "Languages: Java (Android, Servlet), Springboot, JavaFX, Quarkus , Python, NodeJS, PHP (Laravel, YII, CI), " +
      "React, Next.js, Angular, Vue 3, Flutter",
    "Low codes : Outsystems",
    "UI Frameworks:  Bootstrap, Materialize, Tailwind, Vuetify, Chakra UI, PrimeUI, Material UI",
    "Tools: Docker, Kubernetes, Git, Jenkins, Webpack",
    "Cloud: AWS (EC2, S3, Lambda, Amplify), GCP, GCS",
    "Databases: PostgreSQL, MongoDB, MySQL, Redis",
    "Testing: Jest, JUnit, Mockito",
    "Methodologies: Agile, Scrum, TDD, CI/CD",
    "AI : OpenAI (Completion & Whisper API)",
  ]);

  addHeader("Professional Experience");
  addExperience(
    "Fullstack Developer",
    "PT Bank Digital BCA",
    "Jan 2025 - Present",
    [
      "Successfully completed given tasks as a full-stack developer for PT Bank Digital BCA.",
      "utilizing AngularJS with Typescript for the frontend and Java Spring for the backend",
    ]
  );

  addExperience(
    "Fullstack Developer",
    "PT Prudential Life Assurance",
    "Dec 2022 - Dec 2024",
    [
      "Developed full-stack applications using AngularJS (Typescript) and Java Spring/Quarkus",
      "Collaborated with teams to deliver reliable and high-quality software",
      "Maintained clean, efficient code following best practices",
      "Maintained hundreds of microservices, including bugfix, enhance and create new feature",
      "Performed testing and debugging to ensure smooth user experience",
      "Contributed to code reviews and documentation for better team collaboration",
      "Followed agile methodologies to meet project deadlines consistently",
    ]
  );

  addExperience(
    "Fullstack Developer (Freelance)",
    "PT Diawan Dinamika Digital",
    "Jun 2024 - Nov 2024",
    [
      "Delivered projects like pixlo.id and karir.diawan.id using various tech stacks",
      "Built scalable full-stack applications with diverse frameworks and libraries",
      "Adapted quickly to new tools and trends in full-stack development",
    ]
  );

  addExperience(
    "Fullstack Developer",
    "Kryst Digital Pte. Ltd",
    "Sep 2022 - Sep 2023",
    [
      "Developed dApps using Typescript, Next.js, Node.js, NestJS, and MongoDB",
      "Integrated systems with Telegram Bot, GitHub, and third-party plugins",
      "Built responsive UIs with Tailwind CSS for optimal user experience",
      "Collaborated across teams to ensure smooth frontend-backend integration",
      "Contributed to code reviews and maintained clear documentation",
      "Solved technical issues quickly to support smooth project delivery",
    ]
  );

  addExperience(
    "Fullstack Developer",
    "PT. Tema Data Rekayasa Digital",
    "Jul 2020 - Dec 2021",
    [
      "Developed Android and web apps using TypeScript, Vue, Nuxt, and Flutter/Java",
      "Built clean, efficient APIs and responsive frontends with PHP Laravel / Lumen ",
      "Ensured feature integration through close team collaboration",
      "Contributed to code reviews and maintained project documentation",
      "Kept up with new tech trends to improve development practices",
    ]
  );

  addExperience(
    "Backend Developer",
    " PT. Sandika Cahya Mandiri ( liteBIG )",
    "Jul 2017 - Jun 2020",
    [
      "Transitioned from Web to Android Developer, demonstrating adaptability across platforms",
      "Led backend API integration using CodeIgniter and Java Servlet (Tomcat) with MySQL and Redis",
      "Integrated payment gateways (T-Money, Ipaymu, Billfazz) and messaging APIs (Infobip, RajaSMS, Zenziva)",
      "Developed chat apps with Ejabberd and managed app deployment to Google Play & App Store",
      "Collaborated across teams and contributed ideas to improve workflows and innovation",
    ]
  );

  addHeader("Education");
  addParagraph(
    "Bachelor of Information Technology | Indraprasta PGRI University, South Jakarta | 2018 - 2022"
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

app.get("/download-cv", (req, res) => {
  generateCVStream(res);
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
