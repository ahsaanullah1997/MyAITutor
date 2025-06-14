# Edu Genius Project

An innovative AI-driven tutoring platform designed to transform education in Pakistan by providing affordable, personalized learning for students in Grades 5-12 and university level. The platform summarizes textbooks into concise notes, offers conversational AI tutoring, and generates adaptive tests, all aligned with local curricula (e.g., Punjab Board, Aga Khan Board) and supporting Urdu/English bilingual interfaces.

Features

Note Generation: Upload textbooks or PDFs to get concise, 1-page summaries from lengthy chapters.

AI Tutor: Chat-based tutor using Socratic questioning to explain concepts and deepen understanding.

Personalized Tests: Adaptive quizzes with instant feedback and progress tracking.

Localization: Tailored for Pakistan’s Matric, FSc, and O/A Level curricula with bilingual support.

Offline Mode: Cached content for low-connectivity areas, ensuring accessibility in semi-urban regions.

Accessibility: Speech-to-text for Urdu/English voice input and gamification (badges, rewards) for engagement.

Tech Stack

Frontend: Node.js for a responsive, lightweight interface optimized for low-cost smartphones (e.g., Xiaomi, Infinix).

Backend: Node.js with Express for scalable, real-time interactions.

AI/ML: Fine-tuned open-source LLMs (e.g., LLaMA) or Azure OpenAI Service for conversational tutoring and summarization. NLP for Urdu/English processing.

Content Processing: TensorFlow/PyTorch for extracting key concepts from PDFs/videos.

Cloud: AWS/Google Cloud for hosting, Firebase for real-time chat.

Database: MongoDB for flexible storage of user profiles and learning data.

Installation

Clone the repository:

git clone https://github.com/yourusername/ai-tutor-pakistan.git

Navigate to the project directory:

cd ai-tutor-pakistan

Install dependencies:

npm install

Set up environment variables:

Create a .env file in the root directory.

Add required keys (e.g., OPENAI_API_KEY, AWS_CREDENTIALS, MONGODB_URI).

Start the development server:

npm start

Usage

Students: Upload textbooks or notes to generate summaries, chat with the AI tutor, or take adaptive quizzes.

Teachers: Use analytics to track student progress or integrate with lesson planning.

Developers: Contribute by adding new subjects, improving NLP for Urdu, or enhancing offline capabilities.

Development Plan

Phase 1 (MVP, 3-6 months): Note generation and AI tutor for Math, Science, and English.

Phase 2 (6-12 months): Add personalized tests, speech-to-text, and offline mode.

Phase 3 (12-18 months): Scale to all major curricula and introduce teacher tools.

Contributing

We welcome contributions! Please follow these steps:

Fork the repository.

Create a new branch (git checkout -b feature/your-feature).

Commit your changes (git commit -m "Add your feature").

Push to the branch (git push origin feature/your-feature).

Open a Pull Request.

License

This project is licensed under the MIT License. See the LICENSE file for details.

