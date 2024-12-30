# [QuizzA](https://quizza-zeta.vercel.app/)

QuizzA is an open-source quiz application designed to offer an engaging and interactive experience. Inspired by platforms like Quizizz, QuizzA allows users to create and take quizzes seamlessly. Built with Next.js, Tailwind CSS, and powered by Supabase for authentication and database management, it provides a fast, reliable, and user-friendly platform for both quiz creators and participants. Whether you're looking to test your knowledge or create your own quizzes, QuizzA is the perfect tool to make learning fun and easy.

## Features

- **User Authentication:** Secure login and registration with Supabase.
- **Quiz Builder:** Create quizzes with multiple-choice questions and mark correct answers.
- **Quiz Player:** Take quizzes and view your scores with detailed feedback.
- **Multi-language Support:** Toggle between English and Arabic, including RTL support.
- **Responsive Design:** Enjoy a seamless experience across devices.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org)
- **Styling:** [Tailwind CSS](https://tailwindcss.com)
- **Authentication and Database:** [Supabase](https://supabase.com)
- **Component Library:** [ShadCN](https://ui.shadcn.com)
- **Multi Language Library:** [next-intl](https://next-intl.dev)

## Running Locally

1. Clone the repository:

   ```bash
   git clone https://github.com/arfadmuzali/quizzA.git
   ```

2. Install dependencies using your preferred package manager (e.g., `pnpm`, `npm`, or `yarn`):

   ```bash
   yarn install
   ```

3. Copy the `.env.example` file to `.env` and update the environment variables:

   ```bash
   cp .env.example .env
   ```

4. Start the development server:

   ```bash
   yarn run dev
   ```

5. Ensure Supabase services, such as the database and Row Level Security (RLS), are running as required.

## Deployment

# you can visit QuizzA here: [QuizzA](https://quizza-zeta.vercel.app/)

To deploy QuizzA on Vercel:

Fork or clone the repository to your GitHub account.
Link your GitHub repository to Vercel.
Set up the environment variables in Vercel from the .env file.
Deploy the application directly through the Vercel dashboard.
