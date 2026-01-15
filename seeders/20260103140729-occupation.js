'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Occupations', [
      {
        name: "Student",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Software Developer",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Web Developer",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Mobile Developer",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Backend Developer",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Frontend Developer",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Full Stack Developer",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Data Analyst",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Data Scientist",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "DevOps Engineer",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "System Administrator",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "UI/UX Designer",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Graphic Designer",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Product Manager",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Project Manager",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "QA Engineer",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Game Developer",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Cybersecurity Analyst",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Teacher",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Professor",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Researcher",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Tutor",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Doctor",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Nurse",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Psychologist",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Pharmacist",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Physiotherapist",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Dentist",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Engineer",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Civil Engineer",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Mechanical Engineer",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Electrical Engineer",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Architect",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Lawyer",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Legal Assistant",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Paralegal",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Accountant",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Financial Analyst",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Economist",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Auditor",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Entrepreneur",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Business Owner",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Consultant",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Marketing Specialist",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Digital Marketer",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "SEO Specialist",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Social Media Manager",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Content Creator",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Journalist",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Writer",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Editor",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Translator",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Photographer",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Videographer",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Video Editor",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Animator",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Illustrator",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Sales Representative",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Customer Support",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Customer Success Manager",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "HR Specialist",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Recruiter",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Administrative Assistant",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Office Manager",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Electrician",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Plumber",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Carpenter",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Mechanic",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Technician",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Chef",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Cook",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Baker",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Barista",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Restaurant Manager",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Retail Worker",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Store Manager",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Logistics Coordinator",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Supply Chain Analyst",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Driver",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Delivery Driver",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Farmer",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Agricultural Technician",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Artist",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Musician",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Actor",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Unemployed",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Freelancer",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Self-Employed",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Retired",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Occupations', null, {});
  }
};
