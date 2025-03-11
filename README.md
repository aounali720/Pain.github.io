# Pain.github.io
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Portfolio</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; }
    </style>
</head>
<body>
    <h1>Welcome to My Portfolio</h1>
    <p>Hi, I'm Aoun! A cybersecurity enthusiast.</p>
    <a href="https://github.com/aounali720">Check out my GitHub</a>
</body>
</html>

import React from "react";

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col items-center">
      {/* Header Section */}
      <header className="w-full bg-gray-900 text-white text-center py-6">
        <h1 className="text-3xl font-bold">Aoun Ali</h1>
        <p className="text-lg">Cybersecurity Enthusiast | Cloud Security | Ethical Hacking</p>
      </header>

      {/* About Section */}
      <section className="py-10 text-center max-w-2xl">
        <h2 className="text-2xl font-semibold">About Me</h2>
        <p className="mt-4">
          I'm a passionate cybersecurity specialist with expertise in cloud security, intrusion detection, and log analysis.
        </p>
      </section>

      {/* Projects Section */}
      <section className="py-10 text-center bg-white w-full">
        <h2 className="text-2xl font-semibold">Projects</h2>
        <div className="mt-6 max-w-xl mx-auto bg-gray-200 p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold">Snort + Splunk Integration</h3>
          <p className="mt-2">Intrusion detection setup using Snort IDS & Splunk Forwarder on AWS EC2.</p>
          <a href="https://github.com/aounali720/snort-project" target="_blank" rel="noopener noreferrer" 
             className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded-lg">
            View Project
          </a>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-10 text-center">
        <h2 className="text-2xl font-semibold">Contact</h2>
        <p className="mt-4">📧 Email: your.email@example.com</p>
        <p>🔗 GitHub: <a href="https://github.com/aounali720" className="text-blue-500">aounali720</a></p>
        <p>🔗 LinkedIn: <a href="https://linkedin.com/in/your-profile" className="text-blue-500">Your LinkedIn</a></p>
      </section>

      {/* Footer */}
      <footer className="w-full bg-gray-900 text-white text-center py-6 mt-10">
        <p>© 2025 Aoun Ali. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
