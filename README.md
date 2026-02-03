<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
   
</head>
<body>
    <h1>Pulse - Task Management Application</h1>
    <p>Pulse is a modern, minimalist task management application built to streamline personal productivity. It fulfills the full-stack assignment requirements including secure authentication, real-time database persistence, and status tracking.</p>    
    <div class="links-box">
        <strong>🚀 Live Demo</strong>
        <ul>
            <li>Netlify (Primary): <a href="https://6981f927b020430008ff4bc6--adityapatilmadetaskmanageryoowsp.netlify.app/" target="_blank">https://adityapatilmadetaskmanageryoowsp.netlify.app/</a></li>
        </ul>
    </div>
    <h2>🛠️ Tech Stack</h2>
    <ul>
        <li><strong>Frontend:</strong> Vanilla HTML5, CSS3, JavaScript (ES6 Modules).</li>
        <li><strong>Backend:</strong> Firebase (Authentication & Firestore) via CDN.</li>
        <li><strong>Icons:</strong> Lucide Icons.</li>
    </ul>
    <h2>✨ Key Features</h2>
    <ol>
        <li><strong>Authentication:</strong> Secure Login and Signup forms utilizing Firebase Auth.</li>
        <li><strong>Task Management:</strong>
            <ul>
                <li><strong>Create:</strong> Add tasks with specific Priority (Low/Med/High).</li>
                <li><strong>Read:</strong> Real-time synchronization of task lists across devices.</li>
                <li><strong>Update:</strong> Edit task details or change status via dropdown (Pending &rarr; In Progress &rarr; Done).</li>
                <li><strong>Delete:</strong> Permanently remove tasks.</li>
                <li><strong>Quick Check:</strong> Circle tick button to instantly mark tasks as complete.</li>
            </ul>
        </li>
        <li><strong>Dashboard:</strong> Visual progress ring showing completion percentage.</li>
        <li><strong>Responsive Design:</strong> Fully fluid layout optimized for both desktop and mobile.</li>
    </ol>
    <h2>🧠 Product Thinking & Decisions</h2>
    <h3>Why Vanilla JS?</h3>
    <p>For a screening assignment with a tight 48-72 hour deadline, using Vanilla JS removes the complexity of build tools (Webpack/Vite) and dependency management. It demonstrates a strong grasp of fundamental web technologies (DOM manipulation, Event Listeners, ES6 Modules) without relying on framework abstraction.</p>
    <h3>UI/UX Decisions</h3>
    <ul>
        <li><strong>Status Dropdown:</strong> Placed directly on the task card for quick workflow updates without entering a separate "edit mode".</li>
        <li><strong>Visual Feedback:</strong> The progress ring provides immediate gratification as tasks move to "Done".</li>
        <li><strong>Dark Mode:</strong> Defaulted to a dark, clean aesthetic to reduce eye strain and maintain a modern feel.</li>
    </ul>
    <h2>📥 Local Setup Instructions</h2>
    <ol>
        <li><strong>Clone:</strong> Download the repository or <code>git clone</code> the project.</li>
        <li><strong>Configure:</strong>
            <ul>
                <li>Create a project at <a href="https://console.firebase.google.com" target="_blank">console.firebase.google.com</a>.</li>
                <li>Enable <strong>Authentication</strong> (Email/Password) and <strong>Firestore Database</strong>.</li>
                <li>Replace the <code>firebaseConfig</code> object in <code>script.js</code> with your own keys.</li>
            </ul>
        </li>
        <li><strong>Run:</strong> Open <code>index.html</code> in any modern browser.</li>
    </ol>
    <footer>
        <p><strong>Developed by Aditya Patil</strong></p>
        <div class="social-links">
            <a href="https://github.com/Adityapatil0122" target="_blank">GitHub Profile</a> | 
            <a href="https://www.linkedin.com/in/aditya-patil-497b3224b/" target="_blank">LinkedIn Profile</a>
        </div>
    </footer>

</body>
</html>
